import type { Player } from '../types';
import { Role } from '../types';
import GameStatus from '../components/GameStatus';

interface EliminationRevealProps {
  eliminatedPlayer: Player;
  players: Player[];
  onContinue: () => void;
}

export default function EliminationReveal({ eliminatedPlayer, players, onContinue }: EliminationRevealProps) {
  const remainingMafia = players.filter((p) => p.role === Role.MAFIA && p.alive).length;

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 py-8">
      <GameStatus
        mode="elimination"
        player={eliminatedPlayer}
        remainingMafia={remainingMafia}
        onContinue={onContinue}
      />
    </div>
  );
}
