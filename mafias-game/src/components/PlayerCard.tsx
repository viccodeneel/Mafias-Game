import type { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  /** Reveal the role badge (used only after elimination, or in dev/testing contexts). */
  showRole?: boolean;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function PlayerCard({ player, showRole = false, selected = false, onClick, disabled = false }: PlayerCardProps) {
  const isInteractive = typeof onClick === 'function';
  const Wrapper = isInteractive ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      disabled={isInteractive ? disabled : undefined}
      className={[
        'w-full flex items-center gap-3 rounded-xl px-4 py-3.5 border text-left transition-colors',
        player.alive ? 'bg-ink-800 border-ink-600' : 'bg-ink-900 border-ink-700 opacity-60',
        selected ? 'border-brass ring-2 ring-brass/40 bg-ink-700' : '',
        isInteractive && !disabled ? 'hover:border-brass-dim active:scale-[0.99]' : '',
        disabled ? 'pointer-events-none' : '',
      ].join(' ')}
    >
      <span
        className={[
          'w-2.5 h-2.5 rounded-full shrink-0',
          player.alive ? 'bg-sage-bright' : 'bg-blood',
        ].join(' ')}
        aria-hidden="true"
      />
      <span className={['font-body flex-1 truncate', player.alive ? 'text-parchment' : 'text-ash line-through'].join(' ')}>
        {player.name}
      </span>
      {!player.alive && (
        <span className="text-xs font-mono uppercase tracking-wider text-ash">Out</span>
      )}
      {showRole && (
        <span
          className={[
            'text-xs font-mono uppercase tracking-wider px-2 py-1 rounded-md',
            player.role === 'MAFIA' ? 'bg-blood/20 text-blood-bright' : 'bg-sage/20 text-sage-bright',
          ].join(' ')}
        >
          {player.role === 'MAFIA' ? 'Mafia' : 'Civilian'}
        </span>
      )}
    </Wrapper>
  );
}
