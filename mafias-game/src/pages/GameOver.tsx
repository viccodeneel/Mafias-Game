import type { Player, Winner } from '../types';
import GameStatus from '../components/GameStatus';

interface GameOverProps {
  winner: Winner;
  players: Player[];
  onNewGame: () => void;
}

export default function GameOver({ winner, players, onNewGame }: GameOverProps) {
  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 py-8">
      <GameStatus mode="winner" winner={winner} players={players} onNewGame={onNewGame} />
    </div>
  );
}
