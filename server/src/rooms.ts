import { GameRoom, Player, Role, DEFAULT_MAFIA_COUNT, DEFAULT_DISCUSSION_SECONDS } from './types.js';

export const rooms = new Map<string, GameRoom>();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createRoom(hostId: string, hostName: string, hostSocketId: string): GameRoom {
  let code: string;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));

  const host: Player = {
    id: hostId,
    name: hostName,
    role: null,
    alive: false,
    socketId: hostSocketId,
  };

  const room: GameRoom = {
    code,
    hostId,
    players: [host],
    gameStarted: false,
    round: 1,
    phase: 'SETUP',
    discussionSeconds: DEFAULT_DISCUSSION_SECONDS,
    timerInterval: null,
    isTimerPaused: false,
    lastEliminatedId: null,
    winner: null,
  };

  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): GameRoom | undefined {
  return rooms.get(code);
}

export function deleteRoom(code: string): void {
  const room = rooms.get(code);
  if (room?.timerInterval) {
    clearInterval(room.timerInterval);
  }
  rooms.delete(code);
}

export function getParticipatingPlayers(room: GameRoom): Player[] {
  return room.players.filter(p => p.id !== room.hostId);
}

export function addPlayerToRoom(
  code: string,
  playerId: string,
  playerName: string,
  socketId: string
): { room: GameRoom; player: Player } | { error: string } {
  const room = rooms.get(code);
  if (!room) {
    return { error: 'Invalid room code' };
  }
  if (room.gameStarted) {
    return { error: 'Game already started' };
  }
  if (room.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
    return { error: 'Player name taken' };
  }

  const player: Player = {
    id: playerId,
    name: playerName,
    role: null,
    alive: true,
    socketId,
  };

  room.players.push(player);
  return { room, player };
}

export function removePlayerFromRoom(code: string, playerId: string): GameRoom | undefined {
  const room = rooms.get(code);
  if (!room) return undefined;

  room.players = room.players.filter(p => p.id !== playerId);

  if (room.players.length === 0) {
    deleteRoom(code);
    return undefined;
  }

  // If host left, make first remaining player host and mark them as not alive
  if (room.hostId === playerId && room.players.length > 0) {
    room.hostId = room.players[0].id;
    room.players[0].alive = false;
    room.players[0].role = null;
  }

  return room;
}

export function assignRoles(room: GameRoom): void {
  const mafiaCount = DEFAULT_MAFIA_COUNT;
  const participatingPlayers = getParticipatingPlayers(room);
  
  if (participatingPlayers.length < 5) {
    return;
  }
  
  // Reset roles and alive status for all participating players
  room.players.forEach(p => {
    if (p.id !== room.hostId) {
      p.role = null;
      p.alive = true;
    }
  });

  // Randomly select Mafia players from participating players only
  const shuffledPlayers = [...participatingPlayers].sort(() => Math.random() - 0.5);
  const mafiaPlayers = shuffledPlayers.slice(0, mafiaCount);
  
  mafiaPlayers.forEach(p => {
    p.role = Role.MAFIA;
  });

  shuffledPlayers.slice(mafiaCount).forEach(p => {
    p.role = Role.CIVILIAN;
  });

  // Ensure host has no role and is not alive
  const host = room.players.find(p => p.id === room.hostId);
  if (host) {
    host.role = null;
    host.alive = false;
  }
}

export function checkWinner(room: GameRoom): 'MAFIA' | 'CIVILIANS' | null {
  const participatingPlayers = getParticipatingPlayers(room);
  const alivePlayers = participatingPlayers.filter(p => p.alive);
  const aliveMafia = alivePlayers.filter(p => p.role === Role.MAFIA);
  const aliveCivilians = alivePlayers.filter(p => p.role === Role.CIVILIAN);

  if (aliveMafia.length === 0) {
    return 'CIVILIANS';
  }
  if (aliveMafia.length >= aliveCivilians.length) {
    return 'MAFIA';
  }
  return null;
}
