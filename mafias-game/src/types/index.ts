export const Role = {
  MAFIA: 'MAFIA',
  CIVILIAN: 'CIVILIAN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface Player {
  id: string;
  name: string;
  role: Role;
  alive: boolean;
}

export type GamePhase =
  | 'SETUP' // dealer is entering names / settings
  | 'ROLE_ASSIGNMENT' // players are passing the phone around to view roles
  | 'DASHBOARD' // dealer's control screen between rounds
  | 'DISCUSSION' // timer running
  | 'VOTING' // dealer selecting who was voted out
  | 'ELIMINATION_REVEAL' // showing the eliminated player's role
  | 'GAME_OVER'; // a team has won

export type Winner = 'MAFIA' | 'CIVILIANS' | null;

export interface GameSettings {
  mafiaCount: number;
}

export interface GameState {
  phase: GamePhase;
  dealerName: string;
  players: Player[];
  settings: GameSettings;
  roleRevealIndex: number; // which player is currently viewing their role during ROLE_ASSIGNMENT
  discussionSeconds: number; // remaining seconds on the timer
  lastEliminatedId: string | null;
  winner: Winner;
  round: number;
}

export interface EliminationResult {
  player: Player;
  winnerAfter: Winner;
}
