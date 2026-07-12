import GameStatus from '../components/GameStatus';
import type { GameRoom, Role } from '../types';

interface MultiplayerGameOverProps {
  room: GameRoom;
  onNewGame: () => void;
}

export default function MultiplayerGameOver({ room, onNewGame }: MultiplayerGameOverProps) {
  const players = room.players.map(p => ({
    ...p,
    role: p.role || 'CIVILIAN',
  }));

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 py-8">
      <GameStatus mode="winner" winner={room.winner} players={players} onNewGame={onNewGame} />
    </div>
  );
}
