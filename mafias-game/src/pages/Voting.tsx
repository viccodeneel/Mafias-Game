import type { Player } from '../types';
import VotingPanel from '../components/VotingPanel';

interface VotingProps {
  alivePlayers: Player[];
  onFinishVoting: (playerId: string) => void;
}

export default function Voting({ alivePlayers, onFinishVoting }: VotingProps) {
  return (
    <div className="min-h-dvh flex flex-col px-6 py-8">
      <div className="flex-1 flex flex-col justify-center">
        <VotingPanel players={alivePlayers} onFinishVoting={onFinishVoting} />
      </div>
    </div>
  );
}
