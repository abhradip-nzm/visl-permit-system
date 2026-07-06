import React from 'react';
import * as Icons from 'lucide-react';
import { NAV_CONFIG, ROLE_LABELS } from '../../data/navConfig.js';
import { LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { DemoBadge } from '../shared/Primitives.jsx';

export default function Sidebar({ activeScreen, onNavigate }) {
  const { currentRole, setCurrentRole, pushToast } = useApp();
  const items = NAV_CONFIG[currentRole] || [];

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-nz-border bg-nz-navy text-white">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <img src="/logo.png" alt="Vedanta" className="h-9 w-9 object-contain" />
        <div>
          <div className="text-sm font-bold leading-tight">Vedanta Permits</div>
          <div className="text-[10px] text-white/40">NextZen Minds</div>
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
                active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={17} className={active ? 'text-nz-orange' : ''} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-nz-orange" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <div className="mb-2 rounded-lg bg-white/5 px-3 py-2 text-[11px] text-white/50">
          Signed in as<br />
          <span className="font-semibold text-white">{ROLE_LABELS[currentRole]}</span>
        </div>
        <div className="mb-2">
          <DemoBadge />
        </div>
        <button
          onClick={() => {
            pushToast('Signed out', 'default');
            setCurrentRole(null);
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white focus-ring"
        >
          <LogOut size={16} /> Switch Persona
        </button>
      </div>
    </aside>
  );
}
