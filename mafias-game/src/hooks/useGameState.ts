import { useCallback, useMemo, useState } from 'react';
import type { GameState, Player } from '../types';
import { assignRoles } from '../utils/roleAssignment';
import { detectWinner, eliminatePlayer } from '../utils/gameLogic';
import { DEFAULT_MAFIA_COUNT, DEFAULT_DISCUSSION_SECONDS } from '../data/defaults';

export { DEFAULT_DISCUSSION_SECONDS };

const initialState: GameState = {
  phase: 'SETUP',
  dealerName: '',
  players: [],
  settings: { mafiaCount: DEFAULT_MAFIA_COUNT },
  roleRevealIndex: 0,
  discussionSeconds: DEFAULT_DISCUSSION_SECONDS,
  lastEliminatedId: null,
  winner: null,
  round: 1,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);

  /** Deals roles from setup and moves into the role-reveal pass-the-phone flow. */
  const dealRoles = useCallback((dealerName: string, playerNames: string[], mafiaCount: number) => {
    const players = assignRoles(playerNames, mafiaCount);
    setState((prev) => ({
      ...prev,
      dealerName,
      players,
      settings: { mafiaCount },
      phase: 'ROLE_ASSIGNMENT',
      roleRevealIndex: 0,
      winner: null,
      lastEliminatedId: null,
      round: 1,
    }));
  }, []);

  /** Advances to the next player's private role screen, or to the dashboard once done. */
  const advanceRoleReveal = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.roleRevealIndex + 1;
      if (nextIndex >= prev.players.length) {
        return { ...prev, phase: 'DASHBOARD' };
      }
      return { ...prev, roleRevealIndex: nextIndex };
    });
  }, []);

  const startDiscussion = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'DISCUSSION' }));
  }, []);

  const goToVoting = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'VOTING' }));
  }, []);

  const backToDashboard = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'DASHBOARD' }));
  }, []);

  /** Eliminates the chosen player, checks for a winner, and reveals the result. */
  const finishVoting = useCallback((playerId: string) => {
    setState((prev) => {
      const updatedPlayers = eliminatePlayer(prev.players, playerId);
      const winner = detectWinner(updatedPlayers);
      return {
        ...prev,
        players: updatedPlayers,
        lastEliminatedId: playerId,
        winner,
        phase: winner ? 'GAME_OVER' : 'ELIMINATION_REVEAL',
      };
    });
  }, []);

  /** After viewing the elimination reveal, continue to the next round. */
  const continueAfterElimination = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'DASHBOARD',
      round: prev.round + 1,
      lastEliminatedId: null,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const alivePlayers = useMemo(() => state.players.filter((p: Player) => p.alive), [state.players]);
  const eliminatedPlayers = useMemo(() => state.players.filter((p: Player) => !p.alive), [state.players]);

  const lastEliminatedPlayer = useMemo(
    () => state.players.find((p) => p.id === state.lastEliminatedId) ?? null,
    [state.players, state.lastEliminatedId],
  );

  return {
    state,
    alivePlayers,
    eliminatedPlayers,
    lastEliminatedPlayer,
    dealRoles,
    advanceRoleReveal,
    startDiscussion,
    goToVoting,
    backToDashboard,
    finishVoting,
    continueAfterElimination,
    resetGame,
  };
}

export type UseGameStateReturn = ReturnType<typeof useGameState>;
