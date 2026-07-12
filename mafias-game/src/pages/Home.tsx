import Button from '../components/Button';

interface HomeProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
}

export default function Home({ onCreateGame, onJoinGame }: HomeProps) {
  return (
    <div className="min-h-dvh flex flex-col justify-between px-6 py-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div className="flex items-center gap-3 text-5xl">
          <span>🃏</span>
          <span className="text-ash">/</span>
          <span>🙂</span>
        </div>
        <div>
          <h1 className="font-display text-4xl leading-tight text-parchment">
            Mafia <span className="text-ash">&amp;</span> Civilians
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass mt-3">
            A case file, dealt in secret
          </p>
        </div>
        <p className="font-body text-ash max-w-xs">
          Gather around the table. The app deals the roles — everything else happens face to face.
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-sm w-full mx-auto">
        <Button variant="primary" onClick={onCreateGame}>
          Create Game
        </Button>
        <Button variant="secondary" onClick={onJoinGame}>
          Join Game
        </Button>
      </div>
    </div>
  );
}
