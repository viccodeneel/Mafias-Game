import GameStatus from '../components/GameStatus';
import type { GameRoom } from '../types';
import { Role } from '../types';

interface MultiplayerGameOverProps {
  room: GameRoom;
  onNewGame: () => void;
}

function getParticipatingPlayers(room: GameRoom) {
  return room.players.filter(p => p.id !== room.hostId);
}

export default function MultiplayerGameOver({ room, onNewGame }: MultiplayerGameOverProps) {
  const players = getParticipatingPlayers(room).map(p => ({
    ...p,
    role: p.role || Role.CIVILIAN,
  }));

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 py-8">
      <GameStatus mode="winner" winner={room.winner} players={players} onNewGame={onNewGame} />
    </div>
  );
}
