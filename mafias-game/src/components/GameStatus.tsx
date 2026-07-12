import type { Player, Winner } from '../types';
import { Role } from '../types';
import Button from './Button';

interface EliminationStatusProps {
  mode: 'elimination';
  player: Player;
  remainingMafia: number;
  onContinue: () => void;
}

interface WinnerStatusProps {
  mode: 'winner';
  winner: Winner;
  players: Player[];
  onNewGame: () => void;
}

type GameStatusProps = EliminationStatusProps | WinnerStatusProps;

export default function GameStatus(props: GameStatusProps) {
  if (props.mode === 'elimination') {
    const { player, remainingMafia, onContinue } = props;
    const isMafia = player.role === Role.MAFIA;
    return (
      <div className="flex flex-col items-center text-center gap-6 py-8">
        <span className="text-7xl">{isMafia ? '🃏' : '🙂'}</span>
        <div>
          <p className="font-display text-2xl text-parchment">
            {player.name} was {isMafia ? 'Mafia' : 'Civilian'}
          </p>
          <p className="font-body text-ash mt-2">
            {isMafia
              ? remainingMafia > 0
                ? `${remainingMafia} Mafia remain${remainingMafia === 1 ? 's' : ''}.`
                : 'That was the last Mafia.'
              : 'The Mafia is still hiding.'}
          </p>
        </div>
        <Button variant="primary" onClick={onContinue} className="max-w-xs">
          Continue
        </Button>
      </div>
    );
  }

  const { winner, players, onNewGame } = props;
  const isMafiaWin = winner === 'MAFIA';
  const mafiaNames = players.filter((p) => p.role === Role.MAFIA).map((p) => p.name);

  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <span className="text-7xl">{isMafiaWin ? '🃏' : '🏆'}</span>
      <div>
        <p className="font-display text-3xl text-parchment">
          {isMafiaWin ? 'Mafia Win!' : 'Civilians Win!'}
        </p>
        <p className="font-body text-ash mt-2">
          {isMafiaWin ? 'The Mafia blended in until the end.' : 'Every Mafia player was found.'}
        </p>
      </div>
      <div className="bg-ink-800 border border-ink-600 rounded-xl px-5 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ash">The Mafia were</p>
        <p className="font-display text-lg text-blood-bright mt-1">{mafiaNames.join(' & ')}</p>
      </div>
      <Button variant="primary" onClick={onNewGame} className="max-w-xs">
        New Game
      </Button>
    </div>
  );
}
