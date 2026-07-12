import { formatClock } from '../utils/gameLogic';
import Button from './Button';

interface TimerProps {
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function Timer({
  secondsLeft,
  totalSeconds,
  isRunning,
  isFinished,
  onStart,
  onPause,
  onReset,
}: TimerProps) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const circumference = 2 * Math.PI * 88;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r="88" fill="none" stroke="var(--color-ink-700)" strokeWidth="8" />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke={isFinished ? 'var(--color-blood)' : 'var(--color-brass)'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl tabular-nums text-parchment tracking-tight">
            {formatClock(secondsLeft)}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ash mt-2">
            {isFinished ? 'Voting Time' : 'Discussion Time'}
          </span>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        {!isRunning ? (
          <Button variant="primary" onClick={onStart} disabled={isFinished}>
            Start
          </Button>
        ) : (
          <Button variant="secondary" onClick={onPause}>
            Pause
          </Button>
        )}
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
