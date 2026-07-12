import type { Player } from '../types';
import PlayerCard from '../components/PlayerCard';
import Button from '../components/Button';

interface DashboardProps {
  dealerName: string;
  round: number;
  alivePlayers: Player[];
  eliminatedPlayers: Player[];
  onStartDiscussion: () => void;
}

export default function Dashboard({
  dealerName,
  round,
  alivePlayers,
  eliminatedPlayers,
  onStartDiscussion,
}: DashboardProps) {
  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 pb-28">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">Round {round}</p>
        <h1 className="font-display text-2xl text-parchment mt-1">Dealer: {dealerName}</h1>
        <p className="font-body text-sm text-ash mt-1">
          Roles are hidden from you. Reveal only happens after an elimination.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="font-mono text-xs uppercase tracking-wider text-ash">
          Players — {alivePlayers.length} alive
        </p>
        {alivePlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {eliminatedPlayers.length > 0 && (
        <div className="flex flex-col gap-2.5 mt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-ash">Eliminated</p>
          {eliminatedPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} showRole />
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-ink-950 via-ink-950 to-transparent">
        <Button variant="primary" onClick={onStartDiscussion} className="max-w-sm mx-auto">
          Start Discussion
        </Button>
      </div>
    </div>
  );
}
