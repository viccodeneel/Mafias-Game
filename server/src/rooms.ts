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
    alive: true,
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

  // If host left, make first remaining player host
  if (room.hostId === playerId && room.players.length > 0) {
    room.hostId = room.players[0].id;
  }

  return room;
}

export function assignRoles(room: GameRoom): void {
  const mafiaCount = DEFAULT_MAFIA_COUNT;
  
  // Reset roles and alive status
  room.players.forEach(p => {
    p.role = null;
    p.alive = true;
  });

  // Randomly select Mafia players
  const shuffledPlayers = [...room.players].sort(() => Math.random() - 0.5);
  const mafiaPlayers = shuffledPlayers.slice(0, mafiaCount);
  
  mafiaPlayers.forEach(p => {
    p.role = Role.MAFIA;
  });

  shuffledPlayers.slice(mafiaCount).forEach(p => {
    p.role = Role.CIVILIAN;
  });
}

export function checkWinner(room: GameRoom): 'MAFIA' | 'CIVILIANS' | null {
  const alivePlayers = room.players.filter(p => p.alive);
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
