import { useState, useEffect, useCallback } from 'react';
import { getSocket, disconnectSocket } from '../services/socket';
import type { GameRoom, Role, MultiplayerGameState } from '../types';

export const useMultiplayer = (): MultiplayerGameState & {
  createRoom: (hostName: string) => void;
  joinRoom: (roomCode: string, playerName: string) => void;
  startGame: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  eliminatePlayer: (playerId: string) => void;
  continueAfterElimination: () => void;
  reset: () => void;
} => {
  const [state, setState] = useState<MultiplayerGameState>({
    room: null,
    myRole: null,
    myPartnerName: null,
    isHost: false,
    error: null,
  });

  const socket = getSocket();

  useEffect(() => {
    const handleRoomCreated = (room: GameRoom) => {
      setState(prev => ({
        ...prev,
        room,
        isHost: true,
        error: null,
      }));
    };

    const handlePlayerJoined = (data: { room: GameRoom; player: any }) => {
      setState(prev => ({
        ...prev,
        room: data.room,
        isHost: data.room.hostId === socket.id,
        error: null,
      }));
    };

    const handleLobbyUpdated = (room: GameRoom) => {
      setState(prev => ({
        ...prev,
        room,
        isHost: room.hostId === socket.id,
      }));
    };

    const handleJoinError = (error: string) => {
      setState(prev => ({ ...prev, error }));
    };

    const handleGameStarted = (room: GameRoom) => {
      setState(prev => ({ ...prev, room }));
    };

    const handleReceiveRole = (data: { role: Role; partner?: string }) => {
      setState(prev => ({
        ...prev,
        myRole: data.role,
        myPartnerName: data.partner || null,
      }));
    };

    const handleTimerStarted = (seconds: number) => {
      setState(prev => ({
        ...prev,
        room: prev.room ? { ...prev.room, discussionSeconds: seconds } : null,
      }));
    };

    const handleTimerTick = (seconds: number) => {
      setState(prev => ({
        ...prev,
        room: prev.room ? { ...prev.room, discussionSeconds: seconds } : null,
      }));
    };

    const handleVotingPhase = (room: GameRoom) => {
      setState(prev => ({ ...prev, room }));
    };

    const handlePlayerEliminated = (data: { eliminatedPlayer: any; room: GameRoom }) => {
      setState(prev => ({ ...prev, room: data.room }));
    };

    const handleGameOver = (room: GameRoom) => {
      setState(prev => ({ ...prev, room }));
    };

    socket.on('room_created', handleRoomCreated);
    socket.on('player_joined', handlePlayerJoined);
    socket.on('lobby_updated', handleLobbyUpdated);
    socket.on('join_error', handleJoinError);
    socket.on('game_started', handleGameStarted);
    socket.on('receive_role', handleReceiveRole);
    socket.on('timer_started', handleTimerStarted);
    socket.on('timer_tick', handleTimerTick);
    socket.on('voting_phase', handleVotingPhase);
    socket.on('player_eliminated', handlePlayerEliminated);
    socket.on('game_over', handleGameOver);

    return () => {
      socket.off('room_created', handleRoomCreated);
      socket.off('player_joined', handlePlayerJoined);
      socket.off('lobby_updated', handleLobbyUpdated);
      socket.off('join_error', handleJoinError);
      socket.off('game_started', handleGameStarted);
      socket.off('receive_role', handleReceiveRole);
      socket.off('timer_started', handleTimerStarted);
      socket.off('timer_tick', handleTimerTick);
      socket.off('voting_phase', handleVotingPhase);
      socket.off('player_eliminated', handlePlayerEliminated);
      socket.off('game_over', handleGameOver);
    };
  }, [socket]);

  const createRoom = useCallback((hostName: string) => {
    socket.emit('create_room', hostName);
  }, [socket]);

  const joinRoom = useCallback((roomCode: string, playerName: string) => {
    socket.emit('join_room', roomCode, playerName);
  }, [socket]);

  const startGame = useCallback(() => {
    if (state.room) {
      socket.emit('start_game', state.room.code);
    }
  }, [state.room, socket]);

  const startTimer = useCallback(() => {
    if (state.room) {
      socket.emit('start_timer', state.room.code);
    }
  }, [state.room, socket]);

  const pauseTimer = useCallback(() => {
    if (state.room) {
      socket.emit('pause_timer', state.room.code);
    }
  }, [state.room, socket]);

  const resumeTimer = useCallback(() => {
    if (state.room) {
      socket.emit('resume_timer', state.room.code);
    }
  }, [state.room, socket]);

  const resetTimer = useCallback(() => {
    if (state.room) {
      socket.emit('reset_timer', state.room.code);
    }
  }, [state.room, socket]);

  const eliminatePlayer = useCallback((playerId: string) => {
    if (state.room) {
      socket.emit('eliminate_player', state.room.code, playerId);
    }
  }, [state.room, socket]);

  const continueAfterElimination = useCallback(() => {
    if (state.room) {
      socket.emit('continue_after_elimination', state.room.code);
    }
  }, [state.room, socket]);

  const reset = useCallback(() => {
    if (state.room) {
      socket.emit('leave_room', state.room.code);
    }
    setState({
      room: null,
      myRole: null,
      myPartnerName: null,
      isHost: false,
      error: null,
    });
    disconnectSocket();
  }, [socket, state.room]);

  return {
    ...state,
    createRoom,
    joinRoom,
    startGame,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    eliminatePlayer,
    continueAfterElimination,
    reset,
  };
};
