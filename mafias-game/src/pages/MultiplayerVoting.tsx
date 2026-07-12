import VotingPanel from '../components/VotingPanel';
import type { GameRoom } from '../types';
import { Role } from '../types';

interface MultiplayerVotingProps {
  room: GameRoom;
  isHost: boolean;
  onEliminatePlayer: (playerId: string) => void;
}

export default function MultiplayerVoting({ room, isHost, onEliminatePlayer }: MultiplayerVotingProps) {
  const alivePlayers = room.players.filter(p => p.alive).map(p => ({
    ...p,
    role: Role.CIVILIAN,
  }));

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8">
      <div className="flex-1 flex flex-col justify-center">
        {isHost ? (
          <VotingPanel players={alivePlayers} onFinishVoting={onEliminatePlayer} />
        ) : (
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-ash mb-2">Voting Phase</p>
            <p className="font-body text-parchment">Waiting for the host to select the eliminated player...</p>
          </div>
        )}
      </div>
    </div>
  );
}
