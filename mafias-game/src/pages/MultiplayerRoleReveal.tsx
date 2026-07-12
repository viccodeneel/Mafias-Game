import RoleReveal from '../components/RoleReveal';
import { Role } from '../types';

interface MultiplayerRoleRevealProps {
  myRole: Role | null;
  myPartnerName: string | null;
}

export default function MultiplayerRoleReveal({ myRole, myPartnerName }: MultiplayerRoleRevealProps) {
  if (!myRole) return null;

  // Create a dummy player for the RoleReveal component
  const dummyPlayer = {
    id: 'me',
    name: 'You',
    role: myRole,
    alive: true,
  };

  const partners = myPartnerName ? [{ id: 'partner', name: myPartnerName }] : [];

  return (
    <div className="min-h-dvh flex flex-col px-6 py-8">
      <div className="text-center mb-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ash">
          Your Role
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <RoleReveal player={dummyPlayer} partners={partners.map(p => ({ ...p, role: myRole!, alive: true }))} onConfirm={() => {}} hideConfirm />
      </div>
    </div>
  );
}
