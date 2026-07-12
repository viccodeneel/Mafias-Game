import GameStatus from '../components/GameStatus';
import Button from '../components/Button';
import type { GameRoom, Role } from '../types';

interface MultiplayerEliminationRevealProps {
  room: GameRoom;
  isHost: boolean;
  onContinue: () => void;
}

export default function MultiplayerEliminationReveal({ room, isHost, onContinue }: MultiplayerEliminationRevealProps) {
  const eliminatedPlayer = room.lastEliminatedId ? room.players.find(p => p.id === room.lastEliminatedId) : null;
  const remainingMafia = room.players.filter(p => p.role === 'MAFIA' && p.alive).length;

  if (!eliminatedPlayer) return null;

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 py-8">
      <GameStatus
        mode="elimination"
        player={{ ...eliminatedPlayer, role: eliminatedPlayer.role || 'CIVILIAN' }}
        remainingMafia={remainingMafia}
        onContinue={() => {}}
      />
      {isHost && (
        <Button variant="primary" onClick={onContinue} className="max-w-sm mx-auto mt-8">
          Continue
        </Button>
      )}
    </div>
  );
}
