import Timer from '../components/Timer';
import Button from '../components/Button';
import { useTimer } from '../hooks/useTimer';
import { DEFAULT_DISCUSSION_SECONDS } from '../hooks/useGameState';

interface DiscussionProps {
  onProceedToVoting: () => void;
}

export default function Discussion({ onProceedToVoting }: DiscussionProps) {
  const timer = useTimer(DEFAULT_DISCUSSION_SECONDS);

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8">
      <div className="text-center mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">Discussion</p>
        <h1 className="font-display text-2xl text-parchment mt-1">Talk it out</h1>
        <p className="font-body text-sm text-ash mt-1 max-w-xs mx-auto">
          Players discuss and point at who they suspect. The dealer keeps the timer.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Timer
          secondsLeft={timer.secondsLeft}
          totalSeconds={DEFAULT_DISCUSSION_SECONDS}
          isRunning={timer.isRunning}
          isFinished={timer.isFinished}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
        />
      </div>

      <Button
        variant={timer.isFinished ? 'danger' : 'secondary'}
        onClick={onProceedToVoting}
        className="max-w-sm mx-auto w-full"
      >
        {timer.isFinished ? 'Go to Voting' : 'Skip to Voting'}
      </Button>
    </div>
  );
}
