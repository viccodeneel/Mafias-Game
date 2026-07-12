import { Role } from '../types';
import type { Player, Winner } from '../types';

/** Checks the current alive players and returns the winning team, if any. */
export function detectWinner(players: Player[]): Winner {
  const alive = players.filter((p) => p.alive);
  const aliveMafia = alive.filter((p) => p.role === Role.MAFIA).length;
  const aliveCivilians = alive.filter((p) => p.role === Role.CIVILIAN).length;

  if (aliveMafia === 0) return 'CIVILIANS';
  if (aliveMafia >= aliveCivilians) return 'MAFIA';
  return null;
}

/** Returns a new players array with the given player marked as eliminated. */
export function eliminatePlayer(players: Player[], playerId: string): Player[] {
  return players.map((p) => (p.id === playerId ? { ...p, alive: false } : p));
}

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
