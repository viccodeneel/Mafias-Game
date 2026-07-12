import Card from '../components/Card';
import Button from '../components/Button';

interface JoinGameProps {
  onBack: () => void;
  onCreateGame: () => void;
}

export default function JoinGame({ onBack, onCreateGame }: JoinGameProps) {
  return (
    <div className="min-h-dvh flex flex-col px-6 py-8">
      <button onClick={onBack} className="font-mono text-xs uppercase tracking-widest text-ash self-start mb-8">
        ← Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <span className="text-5xl">📡</span>
        <div>
          <h1 className="font-display text-2xl text-parchment">One phone runs the table</h1>
          <p className="font-body text-ash mt-3 max-w-xs">
            This version passes a single phone around the group — no accounts, no network needed.
            The dealer creates the game, then hands the phone to each player to view their role in
            private.
          </p>
        </div>
        <Card className="max-w-sm">
          <p className="font-mono text-xs uppercase tracking-wider text-brass mb-1">Coming later</p>
          <p className="font-body text-sm text-ash">
            Multiplayer joining from separate phones, powered by Socket.IO, so everyone can view
            their own role without passing a device.
          </p>
        </Card>
      </div>

      <Button variant="primary" onClick={onCreateGame} className="max-w-sm mx-auto w-full">
        Start as Dealer Instead
      </Button>
    </div>
  );
}
