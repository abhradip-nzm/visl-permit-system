import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PERSONNEL } from '../../data/mockData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, StatusBadge } from '../shared/Primitives.jsx';

export default function MyTeam() {
  const { tasks } = useApp();
  const [selected, setSelected] = useState(null);

  function certStatus(person) {
    if (person.certifications.some((c) => c.status === 'expired')) return 'expired';
    if (person.certifications.some((c) => c.status === 'expiring')) return 'expiring';
    return 'valid';
  }

  return (
    <div>
      <Card>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Active Tasks</th>
              <th className="px-4 py-3">Certification Status</th>
            </tr>
          </thead>
          <tbody>
            {PERSONNEL.map((p) => {
              const status = certStatus(p);
              const activeTasks = tasks.filter((t) => t.assignedTo === p.name).length;
              return (
                <tr key={p.id} onClick={() => setSelected(p)} className="cursor-pointer border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                  <td className="px-4 py-2.5 font-semibold text-nz-navy">{p.name}</td>
                  <td className="px-4 py-2.5 text-slate-600">{p.role}</td>
                  <td className="px-4 py-2.5 text-slate-600">{p.department}</td>
                  <td className="px-4 py-2.5 text-slate-600">{activeTasks}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={status === 'valid' ? 'approved' : status === 'expiring' ? 'closure-due' : 'rejected'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-bold text-nz-navy">{selected.name}</div>
              <button onClick={() => setSelected(null)} className="rounded-full p-1 hover:bg-nz-surface"><X size={18} /></button>
            </div>
            <div className="mb-4 text-sm text-slate-500">{selected.role} · {selected.department}</div>
            <div className="mb-2 text-xs font-bold uppercase text-slate-400">Certifications</div>
            <div className="mb-4 space-y-1.5">
              {selected.certifications.map((c) => (
                <div key={c.type} className="flex items-center justify-between rounded-lg border border-nz-border px-3 py-2 text-sm">
                  <span className="text-slate-700">{c.type}</span>
                  <span className={`text-xs font-semibold ${c.status === 'expired' ? 'text-nz-red' : c.status === 'expiring' ? 'text-nz-amber' : 'text-nz-green'}`}>
                    {c.status === 'expired' ? `Expired ${Math.abs(c.expiresInDays)}d ago` : `${c.expiresInDays}d remaining`}
                  </span>
                </div>
              ))}
            </div>
            <div className="mb-2 text-xs font-bold uppercase text-slate-400">Task History</div>
            <div className="space-y-1.5">
              {tasks.filter((t) => t.assignedTo === selected.name).map((t) => (
                <div key={t.id} className="rounded-lg bg-nz-surface px-3 py-2 text-xs text-slate-600">{t.id} — {t.description}</div>
              ))}
              {tasks.filter((t) => t.assignedTo === selected.name).length === 0 && (
                <div className="text-xs text-slate-400">No tasks on record.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
