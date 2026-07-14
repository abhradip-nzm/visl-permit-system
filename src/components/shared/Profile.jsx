import React from 'react';
import { LogOut, Mail, Building2, MapPin, Repeat } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ROLE_LABELS } from '../../data/navConfig.js';
import { Card, DemoBadge } from './Primitives.jsx';

// Shared "Profile" tab for mobile roles (Safety Officer, Requester).
export default function Profile() {
  const { currentUser, currentRole, currentDepartment, selectRole, logout, pushToast } = useApp();
  const hasMultipleRoles = (currentUser?.roles?.length || 0) > 1;

  return (
    <div className="px-4 py-4">
      <Card className="mb-4 p-4 text-center">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-nz-blue-light text-2xl font-bold text-nz-blue">
          {currentUser.name.split(' ').map((p) => p[0]).join('')}
        </div>
        <div className="font-bold text-nz-navy">{currentUser.name}</div>
        <div className="text-sm text-slate-500">{ROLE_LABELS[currentRole]}{currentDepartment ? ` · ${currentDepartment}` : ''}</div>
        <div className="mt-2"><DemoBadge /></div>
      </Card>

      <Card className="mb-4 divide-y divide-nz-border/60 p-0">
        <InfoRow icon={Mail} label="Email" value={currentUser.email} />
        <InfoRow icon={Building2} label="Employee ID" value={currentUser.employeeId} />
        <InfoRow icon={MapPin} label="Plant" value={currentUser.plant} />
      </Card>

      {hasMultipleRoles && (
        <Card className="mb-4 p-3">
          <div className="mb-2 text-xs font-bold uppercase text-slate-400">Your role-capabilities</div>
          <div className="space-y-1.5">
            {currentUser.roles.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  selectRole(r.role, r.department);
                  pushToast(`Acting as ${ROLE_LABELS[r.role]}${r.department ? ` · ${r.department}` : ''}`);
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${
                  r.role === currentRole && r.department === currentDepartment ? 'border-nz-blue bg-nz-blue-light text-nz-blue' : 'border-nz-border text-slate-600'
                }`}
              >
                <span className="flex items-center gap-2"><Repeat size={13} /> {ROLE_LABELS[r.role]}{r.department ? ` · ${r.department}` : ''}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      <button
        onClick={() => { pushToast('Signed out', 'default'); logout(); }}
        className="flex w-full items-center justify-center gap-2 rounded-xl2 border border-nz-border bg-white py-3 text-sm font-semibold text-slate-600 shadow-card"
      >
        <LogOut size={16} /> Log Out
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
