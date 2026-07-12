import { useState } from 'react';
import { useMultiplayer } from './hooks/useMultiplayer';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Lobby from './pages/Lobby';
import MultiplayerRoleReveal from './pages/MultiplayerRoleReveal';
import MultiplayerDashboard from './pages/MultiplayerDashboard';
import MultiplayerDiscussion from './pages/MultiplayerDiscussion';
import MultiplayerVoting from './pages/MultiplayerVoting';
import MultiplayerEliminationReveal from './pages/MultiplayerEliminationReveal';
import MultiplayerGameOver from './pages/MultiplayerGameOver';

type Screen = 'HOME' | 'CREATE_OR_JOIN';

export default function App() {
  const [screen, setScreen] = useState<Screen>('HOME');
  const multiplayer = useMultiplayer();

  const handleReset = () => {
    multiplayer.reset();
    setScreen('HOME');
  };

  return (
    <>
      <div className="grain-overlay" />
      <div className="min-h-dvh bg-ink-950 text-parchment font-body">
        {screen === 'HOME' && !multiplayer.room && (
          <Home 
            onCreateGame={() => setScreen('CREATE_OR_JOIN')} 
            onJoinGame={() => setScreen('CREATE_OR_JOIN')} 
          />
        )}

        {screen === 'CREATE_OR_JOIN' && !multiplayer.room && (
          <div className="min-h-dvh flex flex-col px-6 py-8">
            <button onClick={() => setScreen('HOME')} className="font-mono text-xs uppercase tracking-widest text-ash self-start mb-8">
              ← Back
            </button>
            <div className="flex-1 flex flex-col gap-4 items-center justify-center">
              <CreateRoom onCreateRoom={multiplayer.createRoom} onBack={() => setScreen('HOME')} />
              <div className="text-ash font-mono text-xs">OR</div>
              <JoinRoom onJoinRoom={multiplayer.joinRoom} error={multiplayer.error} />
            </div>
          </div>
        )}

        {multiplayer.room && multiplayer.room.phase === 'SETUP' && (
          <Lobby 
            room={multiplayer.room}
            isHost={multiplayer.isHost}
            onStartGame={multiplayer.startGame}
            onBack={handleReset}
          />
        )}

        {multiplayer.room && multiplayer.room.phase === 'ROLE_ASSIGNMENT' && (
          multiplayer.isHost ? (
            <MultiplayerDashboard 
              room={multiplayer.room}
              isHost={multiplayer.isHost}
              onStartTimer={multiplayer.startTimer}
            />
          ) : (
            <MultiplayerRoleReveal 
              myRole={multiplayer.myRole}
              myPartnerName={multiplayer.myPartnerName}
            />
          )
        )}

        {multiplayer.room && multiplayer.room.phase === 'DASHBOARD' && (
          <MultiplayerDashboard 
            room={multiplayer.room}
            isHost={multiplayer.isHost}
            onStartTimer={multiplayer.startTimer}
          />
        )}

        {multiplayer.room && multiplayer.room.phase === 'DISCUSSION' && (
          <MultiplayerDiscussion 
            room={multiplayer.room}
            isHost={multiplayer.isHost}
            pauseTimer={multiplayer.pauseTimer}
            resumeTimer={multiplayer.resumeTimer}
            resetTimer={multiplayer.resetTimer}
          />
        )}

        {multiplayer.room && multiplayer.room.phase === 'VOTING' && (
          <MultiplayerVoting 
            room={multiplayer.room}
            isHost={multiplayer.isHost}
            onEliminatePlayer={multiplayer.eliminatePlayer}
          />
        )}

        {multiplayer.room && multiplayer.room.phase === 'ELIMINATION_REVEAL' && (
          <MultiplayerEliminationReveal 
            room={multiplayer.room}
            isHost={multiplayer.isHost}
            onContinue={multiplayer.continueAfterElimination}
          />
        )}

        {multiplayer.room && multiplayer.room.phase === 'GAME_OVER' && (
          <MultiplayerGameOver 
            room={multiplayer.room}
            onNewGame={handleReset}
          />
        )}
      </div>
    </>
  );
}
