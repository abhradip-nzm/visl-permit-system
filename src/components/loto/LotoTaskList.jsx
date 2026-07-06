import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge } from '../shared/Primitives.jsx';

const ENERGY_SOURCES = {
  'WP-1044': 'Electrical + Hydraulic'
};

export default function LotoTaskList({ navigate }) {
  const { permits } = useApp();
  const tasks = permits.filter((p) => p.lotoRequired);

  return (
    <div className="px-4 py-4">
      <h2 className="mb-4 text-lg font-bold text-nz-navy">LOTO Tasks</h2>
      <div className="space-y-3">
        {tasks.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate('lock', { id: p.id })}
            className="flex w-full items-center justify-between rounded-xl2 border border-nz-border bg-white p-4 text-left shadow-card"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-nz-navy">{p.id}</span>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <Zap size={13} /> {p.equipment} — isolation required
              </div>
              <div className="mt-1 text-xs text-slate-400">{p.location} · {p.shift} shift</div>
              <div className="mt-1 text-xs font-semibold text-nz-amber">
                Energy source: {ENERGY_SOURCES[p.id] || 'Mechanical'}
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
        {tasks.length === 0 && (
          <div className="rounded-xl2 border border-dashed border-nz-border bg-white py-10 text-center text-sm text-slate-400">
            No LOTO tasks assigned right now.
          </div>
        )}
      </div>
    </div>
  );
}
