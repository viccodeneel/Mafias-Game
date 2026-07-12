export const Role = {
  MAFIA: 'MAFIA',
  CIVILIAN: 'CIVILIAN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface Player {
  id: string;
  name: string;
  role: Role | null;
  alive: boolean;
  socketId: string;
}

export interface GameRoom {
  code: string;
  hostId: string;
  players: Player[];
  gameStarted: boolean;
  round: number;
  phase: 'SETUP' | 'ROLE_ASSIGNMENT' | 'DASHBOARD' | 'DISCUSSION' | 'VOTING' | 'ELIMINATION_REVEAL' | 'GAME_OVER';
  discussionSeconds: number;
  isTimerPaused: boolean;
  lastEliminatedId: string | null;
  winner: 'MAFIA' | 'CIVILIANS' | null;
}

export const DEFAULT_DISCUSSION_SECONDS = 90;
export const MIN_PLAYERS = 5;
export const DEFAULT_MAFIA_COUNT = 2;
