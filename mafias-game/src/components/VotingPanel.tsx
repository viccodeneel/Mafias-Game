import { useState } from 'react';
import type { Player } from '../types';
import PlayerCard from './PlayerCard';
import Button from './Button';

interface VotingPanelProps {
  players: Player[];
  onFinishVoting: (playerId: string) => void;
}

export default function VotingPanel({ players, onFinishVoting }: VotingPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">Voting</p>
        <p className="font-display text-2xl text-parchment mt-1">Who was voted out?</p>
        <p className="font-body text-sm text-ash mt-1">Tap the player the group pointed at.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            selected={selectedId === player.id}
            onClick={() => setSelectedId(player.id)}
          />
        ))}
      </div>

      <Button
        variant="danger"
        disabled={!selectedId}
        onClick={() => selectedId && onFinishVoting(selectedId)}
      >
        Finish Voting
      </Button>
    </div>
  );
}
