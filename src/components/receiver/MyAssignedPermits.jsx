import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge } from '../shared/Primitives.jsx';

export default function MyAssignedPermits({ navigate }) {
  const { permits } = useApp();
  const assigned = permits.filter((p) => p.status === 'issued' || p.receiver);

  return (
    <div className="px-4 py-4">
      <h2 className="mb-4 text-lg font-bold text-nz-navy">Issued to You</h2>
      <div className="space-y-3">
        {assigned.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate('execute', { id: p.id })}
            className="flex w-full items-center justify-between rounded-xl2 border border-nz-border bg-white p-4 text-left shadow-card"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-nz-navy">{p.id}</span>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-1 text-sm text-slate-500">{p.type} · {p.equipment}</div>
              <div className="mt-1 text-xs text-slate-400">{p.location} · {p.shift} shift</div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
        {assigned.length === 0 && (
          <div className="rounded-xl2 border border-dashed border-nz-border bg-white py-10 text-center text-sm text-slate-400">
            No permits issued to you right now.
          </div>
        )}
      </div>
    </div>
  );
}
