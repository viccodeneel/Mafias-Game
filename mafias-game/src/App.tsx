import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import Home from './pages/Home';
import JoinGame from './pages/JoinGame';
import CreateGame from './pages/CreateGame';
import RoleAssignment from './pages/RoleAssignment';
import Dashboard from './pages/Dashboard';
import Discussion from './pages/Discussion';
import Voting from './pages/Voting';
import EliminationReveal from './pages/EliminationReveal';
import GameOver from './pages/GameOver';

type Route = 'HOME' | 'JOIN' | 'GAME';

export default function App() {
  const [route, setRoute] = useState<Route>('HOME');
  const game = useGameState();

  const handleNewGame = () => {
    game.resetGame();
    setRoute('HOME');
  };

  return (
    <>
      <div className="grain-overlay" />
      <div className="min-h-dvh bg-ink-950 text-parchment font-body">
        {route === 'HOME' && (
          <Home onCreateGame={() => setRoute('GAME')} onJoinGame={() => setRoute('JOIN')} />
        )}

        {route === 'JOIN' && (
          <JoinGame onBack={() => setRoute('HOME')} onCreateGame={() => setRoute('GAME')} />
        )}

        {route === 'GAME' && game.state.phase === 'SETUP' && (
          <CreateGame onBack={() => setRoute('HOME')} onDealRoles={game.dealRoles} />
        )}

        {route === 'GAME' && game.state.phase === 'ROLE_ASSIGNMENT' && (
          <RoleAssignment
            players={game.state.players}
            currentIndex={game.state.roleRevealIndex}
            onAdvance={game.advanceRoleReveal}
          />
        )}

        {route === 'GAME' && game.state.phase === 'DASHBOARD' && (
          <Dashboard
            dealerName={game.state.dealerName}
            round={game.state.round}
            alivePlayers={game.alivePlayers}
            eliminatedPlayers={game.eliminatedPlayers}
            onStartDiscussion={game.startDiscussion}
          />
        )}

        {route === 'GAME' && game.state.phase === 'DISCUSSION' && (
          <Discussion onProceedToVoting={game.goToVoting} />
        )}

        {route === 'GAME' && game.state.phase === 'VOTING' && (
          <Voting alivePlayers={game.alivePlayers} onFinishVoting={game.finishVoting} />
        )}

        {route === 'GAME' && game.state.phase === 'ELIMINATION_REVEAL' && game.lastEliminatedPlayer && (
          <EliminationReveal
            eliminatedPlayer={game.lastEliminatedPlayer}
            players={game.state.players}
            onContinue={game.continueAfterElimination}
          />
        )}

        {route === 'GAME' && game.state.phase === 'GAME_OVER' && (
          <GameOver winner={game.state.winner} players={game.state.players} onNewGame={handleNewGame} />
        )}
      </div>
    </>
  );
}
