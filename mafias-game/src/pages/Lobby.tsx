import Button from '../components/Button';
import Card from '../components/Card';
import type { GameRoom } from '../types';

interface LobbyProps {
  room: GameRoom;
  isHost: boolean;
  onStartGame: () => void;
  onBack: () => void;
}

export default function Lobby({ room, isHost, onStartGame, onBack }: LobbyProps) {
  const canStart = room.players.length >= 5;

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 pb-28">
      <button onClick={onBack} className="font-mono text-xs uppercase tracking-widest text-ash self-start mb-6">
        ← Back
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl text-parchment">Lobby</h1>
        <p className="font-mono text-lg text-brass mt-2">Room Code: {room.code}</p>
        {isHost && <p className="font-body text-sm text-ash mt-2">You are the host</p>}
      </div>

      <Card className="mb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-ash mb-3">
          Players — {room.players.length} connected
        </p>
        <div className="flex flex-col gap-2">
          {room.players.map((player) => (
            <div key={player.id} className="flex items-center gap-3">
              <span className="text-green-400">●</span>
              <span className="text-parchment font-body">{player.name}</span>
              {player.id === room.hostId && (
                <span className="text-brass font-mono text-xs uppercase">(Host)</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {!canStart && (
        <p className="text-blood-bright font-body text-sm mb-4">
          Need at least 5 players to start
        </p>
      )}

      {isHost && (
        <div className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-ink-950 via-ink-950 to-transparent">
          <Button variant="primary" onClick={onStartGame} disabled={!canStart} className="max-w-sm mx-auto">
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
}
