import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { NAV_CONFIG, ROLE_LABELS } from '../../data/navConfig.js';
import { LogOut, Repeat } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { DemoBadge } from '../shared/Primitives.jsx';

export default function Sidebar({ activeScreen, onNavigate }) {
  const { currentRole, currentDepartment, currentUser, selectRole, logout, pushToast } = useApp();
  const items = NAV_CONFIG[currentRole] || [];
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const hasMultipleRoles = (currentUser?.roles?.length || 0) > 1;

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-nz-border bg-nz-charcoal text-nz-navy">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-black/10">
        <img src="/logo.png" alt="Vedanta" className="h-9 w-9 object-contain" />
        <div>
          <div className="text-sm font-bold leading-tight">Vedanta Permits</div>
          <div className="text-[10px] text-slate-500">NextZen Minds</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = Icons[item.icon] || Icons.Circle;
          const active = activeScreen === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-ring ${
                active ? 'bg-black/10 text-nz-navy' : 'text-slate-500 hover:bg-black/5 hover:text-nz-navy'
              }`}
            >
              <Icon size={17} className={active ? 'text-nz-orange' : ''} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-nz-orange" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-black/10 px-3 py-4">
        <div className="mb-2 rounded-lg bg-black/5 px-3 py-2 text-[11px] text-slate-500">
          Signed in as<br />
          <span className="font-semibold text-nz-navy">{currentUser?.name}</span>
          <div>{ROLE_LABELS[currentRole]}{currentDepartment ? ` · ${currentDepartment}` : ''}</div>
        </div>
        <div className="mb-2">
          <DemoBadge />
        </div>

        {hasMultipleRoles && (
          <div className="relative mb-1">
            <button
              onClick={() => setShowRoleMenu((s) => !s)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-black/5 hover:text-nz-navy focus-ring"
            >
              <Repeat size={16} /> Switch Role
            </button>
            {showRoleMenu && (
              <div className="absolute bottom-full left-0 z-30 mb-1 w-full rounded-lg border border-nz-border bg-white p-1 shadow-panel">
                {currentUser.roles.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      selectRole(r.role, r.department);
                      setShowRoleMenu(false);
                      pushToast(`Acting as ${ROLE_LABELS[r.role]}${r.department ? ` · ${r.department}` : ''}`);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                      r.role === currentRole && r.department === currentDepartment ? 'font-semibold text-nz-blue' : 'text-slate-600 hover:bg-nz-surface'
                    }`}
                  >
                    {ROLE_LABELS[r.role]}{r.department ? ` · ${r.department}` : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => {
            pushToast('Signed out', 'default');
            logout();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-black/5 hover:text-nz-navy focus-ring"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
}
