import type { Player } from '../types';
import { getMafiaPartners } from '../utils/roleAssignment';
import RoleReveal from '../components/RoleReveal';

interface RoleAssignmentProps {
  players: Player[];
  currentIndex: number;
  onAdvance: () => void;
}

export default function RoleAssignment({ players, currentIndex, onAdvance }: RoleAssignmentProps) {
  const currentPlayer = players[currentIndex];
  if (!currentPlayer) return null;

  const partners = getMafiaPartners(players, currentPlayer.id);

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8">
      <div className="text-center mb-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ash">
          Player {currentIndex + 1} of {players.length}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <RoleReveal player={currentPlayer} partners={partners} onConfirm={onAdvance} />
      </div>
    </div>
  );
}
