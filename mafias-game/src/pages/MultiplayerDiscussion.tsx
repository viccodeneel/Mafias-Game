import Timer from '../components/Timer';
import type { GameRoom } from '../types';
import { DEFAULT_DISCUSSION_SECONDS } from '../hooks/useGameState';

interface MultiplayerDiscussionProps {
  room: GameRoom;
  isHost: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
}

export default function MultiplayerDiscussion({ room, isHost, pauseTimer, resumeTimer, resetTimer }: MultiplayerDiscussionProps) {
  const isRunning = room.discussionSeconds > 0 && room.discussionSeconds <= DEFAULT_DISCUSSION_SECONDS && !room.isTimerPaused;
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
          secondsLeft={room.discussionSeconds}
          totalSeconds={DEFAULT_DISCUSSION_SECONDS}
          isRunning={isRunning}
          isFinished={room.discussionSeconds <= 0}
          onStart={resumeTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          hideControls={!isHost}
        />
      </div>
    </div>
  );
}
