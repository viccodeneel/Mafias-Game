
import Card from './Card';

interface RulesProps {
  onClose: () => void;
}

export default function Rules({ onClose }: RulesProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl text-parchment">How to Play</h2>
          <button
            onClick={onClose}
            className="text-ash hover:text-parchment text-xl"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-brass mb-1">Setup</h3>
            <p className="text-ash">
              One player creates a room and acts as the host/dealer. All other players join using the room code. You need at least 5 players to start the game.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-brass mb-1">Roles</h3>
            <p className="text-ash">
              <strong>Mafia (2 players):</strong> Work together secretly to eliminate civilians.
            </p>
            <p className="text-ash mt-1">
              <strong>Civilians (all other players):</strong> Work together to identify and eliminate the mafia.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-brass mb-1">Gameplay</h3>
            <p className="text-ash">
              1. The host starts the game, and each player privately sees their role.
            </p>
            <p className="text-ash">
              2. The host starts a 90-second discussion timer. Players discuss who they think the mafia are.
            </p>
            <p className="text-ash">
              3. After discussion, the host selects which player to eliminate based on the group's vote.
            </p>
            <p className="text-ash">
              4. The eliminated player's role is revealed to everyone.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-brass mb-1">Winning</h3>
            <p className="text-ash">
              <strong>Civilians win:</strong> When all mafia are eliminated.
            </p>
            <p className="text-ash">
              <strong>Mafia win:</strong> When the number of mafia is equal to or greater than the number of remaining civilians.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full text-center text-brass hover:text-brass-bright font-mono text-xs uppercase tracking-wider"
        >
          Close
        </button>
      </Card>
    </div>
  );
}
