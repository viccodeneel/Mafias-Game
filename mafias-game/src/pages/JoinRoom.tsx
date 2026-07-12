import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

interface JoinRoomProps {
  onJoinRoom: (roomCode: string, playerName: string) => void;
  error: string | null;
}

export default function JoinRoom({ onJoinRoom, error }: JoinRoomProps) {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim() && playerName.trim()) {
      onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <Card className="max-w-sm w-full">
      <h2 className="font-display text-xl text-parchment mb-4">Join a Room</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-brass block mb-2">Room Code</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
            maxLength={5}
            className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment font-body placeholder:text-ash-dim focus:border-brass outline-none uppercase"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-brass block mb-2">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment font-body placeholder:text-ash-dim focus:border-brass outline-none"
          />
        </div>
        {error && <p className="text-blood-bright font-body text-sm">{error}</p>}
        <Button variant="primary" type="submit" disabled={!roomCode.trim() || !playerName.trim()}>
          Join Room
        </Button>
      </form>
    </Card>
  );
}
