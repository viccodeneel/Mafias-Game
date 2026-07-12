import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';

interface CreateGameProps {
  onBack: () => void;
  onDealRoles: (dealerName: string, playerNames: string[], mafiaCount: number) => void;
}

const MIN_PLAYERS_FOR_MAFIA = (mafiaCount: number) => mafiaCount * 2 + 1;

export default function CreateGame({ onBack, onDealRoles }: CreateGameProps) {
  const [dealerName, setDealerName] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [mafiaCount, setMafiaCount] = useState(2);

  const filledNames = playerNames.map((n) => n.trim()).filter(Boolean);
  const minPlayers = MIN_PLAYERS_FOR_MAFIA(mafiaCount);
  const canDeal = dealerName.trim().length > 0 && filledNames.length >= minPlayers;

  const updateName = (index: number, value: string) => {
    setPlayerNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  };

  const addPlayerField = () => setPlayerNames((prev) => [...prev, '']);

  const removePlayerField = (index: number) => {
    setPlayerNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeal = () => {
    if (!canDeal) return;
    onDealRoles(dealerName.trim(), filledNames, mafiaCount);
  };

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8 pb-28">
      <button onClick={onBack} className="font-mono text-xs uppercase tracking-widest text-ash self-start mb-6">
        ← Back
      </button>

      <h1 className="font-display text-2xl text-parchment mb-1">Create Game</h1>
      <p className="font-body text-sm text-ash mb-6">Set up the table. You'll be the dealer.</p>

      <div className="flex flex-col gap-6">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-brass" htmlFor="dealer-name">
            Dealer name
          </label>
          <input
            id="dealer-name"
            value={dealerName}
            onChange={(e) => setDealerName(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3.5 text-parchment font-body placeholder:text-ash-dim focus:border-brass outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-brass">Players</label>
            <span className="font-mono text-xs text-ash">{filledNames.length} added</span>
          </div>

          <div className="mt-2 flex flex-col gap-2.5">
            {playerNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => updateName(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="flex-1 bg-ink-800 border border-ink-600 rounded-xl px-4 py-3.5 text-parchment font-body placeholder:text-ash-dim focus:border-brass outline-none"
                />
                {playerNames.length > 1 && (
                  <button
                    onClick={() => removePlayerField(index)}
                    aria-label={`Remove player ${index + 1}`}
                    className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-ink-800 border border-ink-600 text-ash hover:text-blood-bright"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addPlayerField}
            className="mt-3 font-mono text-sm text-brass tracking-wide hover:text-brass-bright"
          >
            + Add player
          </button>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-brass">Mafia players</p>
              <p className="font-body text-sm text-ash mt-1">Default is 2.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMafiaCount((c) => Math.max(1, c - 1))}
                aria-label="Decrease mafia count"
                className="w-10 h-10 rounded-lg bg-ink-800 border border-ink-600 text-parchment text-lg"
              >
                −
              </button>
              <span className="font-mono text-xl text-parchment w-6 text-center">{mafiaCount}</span>
              <button
                onClick={() => setMafiaCount((c) => c + 1)}
                aria-label="Increase mafia count"
                className="w-10 h-10 rounded-lg bg-ink-800 border border-ink-600 text-parchment text-lg"
              >
                +
              </button>
            </div>
          </div>
        </Card>

        {!canDeal && filledNames.length > 0 && (
          <p className="font-body text-sm text-blood-bright">
            Need at least {minPlayers} players for {mafiaCount} Mafia.
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-ink-950 via-ink-950 to-transparent">
        <Button variant="primary" disabled={!canDeal} onClick={handleDeal} className="max-w-sm mx-auto">
          Deal Roles
        </Button>
      </div>
    </div>
  );
}
