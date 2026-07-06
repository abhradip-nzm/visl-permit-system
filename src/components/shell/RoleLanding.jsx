import React from 'react';
import * as Icons from 'lucide-react';
import { ROLES } from '../../data/mockData.js';
import { useApp } from '../../context/AppContext.jsx';
import { DemoBadge } from '../shared/Primitives.jsx';

export default function RoleLanding() {
  const { setCurrentRole, pushToast } = useApp();

  function handleSelect(role) {
    setCurrentRole(role.key);
    pushToast(`Signed in as ${role.label}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-nz-navy to-[#0a1d42]">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nz-orange">
            <Icons.HardHat size={22} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">VISL Work Permit System</div>
            <div className="text-xs text-white/50">Vedanta Sesa · Digital Work Permit Management System</div>
          </div>
        </div>
        <DemoBadge />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="mb-10 max-w-xl text-center">
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Choose a persona to sign in</h1>
          <p className="mt-2 text-sm text-white/60">
            This is a sales demonstration prototype built by NextZen Minds. Select any role below to explore its
            workflows — you can switch personas anytime from the top bar.
          </p>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = Icons[role.icon] || Icons.User;
            return (
              <button
                key={role.key}
                onClick={() => handleSelect(role)}
                className="group flex flex-col items-start gap-3 rounded-xl2 border border-white/10 bg-white/5 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-nz-orange/50 hover:bg-white/10 focus-ring"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-nz-blue/20 text-nz-orange group-hover:bg-nz-orange/20">
                    <Icon size={22} />
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/50">
                    {role.platform}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-white">{role.label}</div>
                  <div className="mt-0.5 text-xs text-white/50">{role.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="px-8 py-4 text-center text-[11px] text-white/30">
        NextZen Minds · Prototype build — all data is mock / demo data. No live systems are connected.
      </footer>
    </div>
  );
}
