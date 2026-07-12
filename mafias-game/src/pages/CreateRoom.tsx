import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

interface CreateRoomProps {
  onCreateRoom: (hostName: string) => void;
  onBack: () => void;
}

export default function CreateRoom({ onCreateRoom,  }: CreateRoomProps) {
  const [hostName, setHostName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hostName.trim()) {
      onCreateRoom(hostName.trim());
    }
  };

  return (
    <Card className="max-w-sm w-full">
      <h2 className="font-display text-xl text-parchment mb-4">Create a Room</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-brass block mb-2">Your Name</label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-parchment font-body placeholder:text-ash-dim focus:border-brass outline-none"
          />
        </div>
        <Button variant="primary" type="submit" disabled={!hostName.trim()}>
          Create Room
        </Button>
      </form>
    </Card>
  );
}
