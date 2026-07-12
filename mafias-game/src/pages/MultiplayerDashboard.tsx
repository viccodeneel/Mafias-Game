import PlayerCard from '../components/PlayerCard';
import Button from '../components/Button';
import type { GameRoom } from '../types';
import { Role } from '../types';

interface MultiplayerDashboardProps {
  room: GameRoom;
  isHost: boolean;
  onStartTimer: () => void;
}

function getParticipatingPlayers(room: GameRoom) {
  return room.players.filter(p => p.id !== room.hostId);
}

export default function MultiplayerDashboard({ room, isHost, onStartTimer }: MultiplayerDashboardProps) {
  const participatingPlayers = getParticipatingPlayers(room);
  const alivePlayers = participatingPlayers.filter(p => p.alive);
  const eliminatedPlayers = participatingPlayers.filter(p => !p.alive);
  const host = room.players.find(p => p.id === room.hostId);

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 pb-28">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">Round {room.round}</p>
        {host && <h1 className="font-display text-2xl text-parchment mt-1">Host: {host.name}</h1>}
        <p className="font-body text-sm text-ash mt-1">
          Roles are hidden from you. Reveal only happens after an elimination.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="font-mono text-xs uppercase tracking-wider text-ash">
          Players — {alivePlayers.length} alive
        </p>
        {alivePlayers.map((player) => (
          <PlayerCard key={player.id} player={{ ...player, role: Role.CIVILIAN }} />
        ))}
      </div>

      {eliminatedPlayers.length > 0 && (
        <div className="flex flex-col gap-2.5 mt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-ash">Eliminated</p>
          {eliminatedPlayers.map((player) => (
            <PlayerCard key={player.id} player={{ ...player, role: player.role || Role.CIVILIAN }} showRole />
          ))}
        </div>
      )}

      {isHost && (
        <div className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-ink-950 via-ink-950 to-transparent">
          <Button variant="primary" onClick={onStartTimer} className="max-w-sm mx-auto">
            Start Discussion
          </Button>
        </div>
      )}
    </div>
  );
}
