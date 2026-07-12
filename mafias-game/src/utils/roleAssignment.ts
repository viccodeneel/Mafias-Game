import { Role } from '../types';
import type { Player } from '../types';

/** Fisher-Yates shuffle. Returns a new array; does not mutate the input. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Assigns roles to a list of player names.
 * Exactly `mafiaCount` players become MAFIA, the rest become CIVILIAN.
 * Mafia players can look each other up via `getMafiaPartners`.
 */
export function assignRoles(names: string[], mafiaCount: number): Player[] {
  const ids = names.map((name, index) => ({
    id: `player-${index}-${name.trim().toLowerCase().replace(/\s+/g, '-')}`,
    name: name.trim(),
  }));

  const shuffled = shuffle(ids);

  return shuffled.map((entry, index) => ({
    id: entry.id,
    name: entry.name,
    role: index < mafiaCount ? Role.MAFIA : Role.CIVILIAN,
    alive: true,
  }));
}

/** Returns the other Mafia player(s) for a given player, excluding themselves. */
export function getMafiaPartners(players: Player[], playerId: string): Player[] {
  return players.filter((p) => p.role === Role.MAFIA && p.id !== playerId);
}
