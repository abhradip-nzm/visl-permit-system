import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, StatusBadge } from '../shared/Primitives.jsx';

export default function IssuerDashboard({ navigate }) {
  const { permits } = useApp();
  const ready = permits.filter((p) => p.status === 'approved');
  const active = permits.filter((p) => p.status === 'issued');
  const closureDue = permits.filter((p) => p.status === 'closure-due');

  return (
    <div className="grid grid-cols-3 gap-4">
      <ListCard title="Ready to Issue" items={ready} navigate={navigate} action="Verify" />
      <ListCard title="Active Permits" items={active} navigate={navigate} action="Manage" />
      <ListCard title="Closure Due" items={closureDue} navigate={navigate} action="Close" />
    </div>
  );
}

function ListCard({ title, items, navigate, action }) {
  return (
    <Card>
      <div className="border-b border-nz-border px-4 py-3 text-sm font-bold text-nz-navy">
        {title} <span className="text-slate-400">({items.length})</span>
      </div>
      <div className="divide-y divide-nz-border/60">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate('verify', { id: p.id })}
            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-nz-surface"
          >
            <div>
              <div className="font-semibold text-nz-navy">{p.id}</div>
              <div className="text-xs text-slate-400">{p.equipment}</div>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-nz-blue">
              {action} <ChevronRight size={13} />
            </span>
          </button>
        ))}
        {items.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">Nothing here right now.</div>}
      </div>
    </Card>
  );
}
