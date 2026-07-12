import { useState } from 'react';
import type { Player } from '../types';
import { Role } from '../types';
import Button from './Button';

interface RoleRevealProps {
  player: Player;
  partners: Player[];
  onConfirm: () => void;
  hideConfirm?: boolean;
}

export default function RoleReveal({ player, partners, onConfirm, hideConfirm = false }: RoleRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const isMafia = player.role === Role.MAFIA;

  if (confirmed && !hideConfirm) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-6 py-16">
        <div>
          <p className="font-display text-2xl text-parchment">Role confirmed.</p>
          <p className="font-body text-ash mt-1">Put your phone away and pass it to the dealer.</p>
        </div>
        <Button variant="primary" onClick={onConfirm} className="max-w-xs">
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ash">Private dossier for</p>
        <p className="font-display text-2xl text-parchment mt-1">{player.name}</p>
      </div>

      <div className="w-full max-w-xs [perspective:1200px]">
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={revealed}
          className="relative w-full aspect-[3/4] [transform-style:preserve-3d] transition-transform duration-700"
          style={{ transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          aria-label={revealed ? 'Role card revealed' : 'Tap to reveal your role'}
        >
          {/* Card back */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-ink-800 border-2 border-brass-dim flex flex-col items-center justify-center gap-4 stamp-shadow">
            <span className="text-6xl">🂠</span>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-brass">Tap to reveal</span>
          </div>

          {/* Card front */}
          <div
            className={[
              'absolute inset-0 [backface-visibility:hidden] rounded-2xl border-2 flex flex-col items-center justify-center gap-4 p-6 text-center stamp-shadow',
              isMafia ? 'bg-gradient-to-b from-ink-850 to-[#2a1116] border-blood' : 'bg-gradient-to-b from-ink-850 to-[#122622] border-sage',
            ].join(' ')}
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="text-6xl">{isMafia ? '🃏' : '🙂'}</span>
            <span className={['font-display text-3xl', isMafia ? 'text-blood-bright' : 'text-sage-bright'].join(' ')}>
              You are {isMafia ? 'Mafia' : 'Civilian'}
            </span>

            {isMafia ? (
              <div className="mt-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ash">
                  {partners.length > 1 ? 'Your partners are' : 'Your partner is'}
                </p>
                <p className="font-display text-xl text-parchment mt-1">
                  {partners.map((p) => p.name).join(', ')}
                </p>
                <p className="font-body text-sm text-ash mt-3">Keep this secret.</p>
              </div>
            ) : (
              <p className="font-body text-sm text-ash mt-1">
                Find the Mafia and protect your team.
              </p>
            )}
          </div>
        </button>
      </div>

      {revealed && !hideConfirm && (
        <Button variant="primary" onClick={() => setConfirmed(true)}>
          Got it — hide this card
        </Button>
      )}

      {revealed && hideConfirm && (
        <p className="font-body text-ash">Keep this secret — put your phone away</p>
      )}
    </div>
  );
}
