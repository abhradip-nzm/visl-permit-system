import React from 'react';
import { LogOut, Mail, Building2, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ROLE_LABELS } from '../../data/navConfig.js';
import { USERS } from '../../data/usersData.js';
import { Card, DemoBadge } from './Primitives.jsx';

// Shared "Profile" tab for mobile roles (Safety Officer, Personnel).
export default function Profile() {
  const { currentRole, setCurrentRole, pushToast } = useApp();
  const roleLabel = ROLE_LABELS[currentRole];
  const user = USERS.find((u) => u.role === roleLabel) || USERS[0];

  return (
    <div className="px-4 py-4">
      <Card className="mb-4 p-4 text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-nz-blue-light text-2xl font-bold text-nz-blue">
          {user.name.split(' ').map((p) => p[0]).join('')}
        </div>
        <div className="font-bold text-nz-navy">{user.name}</div>
        <div className="text-sm text-slate-500">{roleLabel}</div>
        <div className="mt-2"><DemoBadge /></div>
      </Card>

      <Card className="mb-4 divide-y divide-nz-border/60 p-0">
        <InfoRow icon={Mail} label="Email" value={user.email} />
        <InfoRow icon={Building2} label="Department" value={user.department} />
        <InfoRow icon={MapPin} label="Plant" value={user.plant} />
      </Card>

      <button
        onClick={() => { pushToast('Signed out', 'default'); setCurrentRole(null); }}
        className="flex w-full items-center justify-center gap-2 rounded-xl2 border border-nz-border bg-white py-3 text-sm font-semibold text-slate-600 shadow-card"
      >
        <LogOut size={16} /> Switch Persona
      </button>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm">
      <Icon size={15} className="text-slate-400" />
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-slate-700">{value}</div>
      </div>
    </div>
  );
}
