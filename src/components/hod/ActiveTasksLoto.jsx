import React from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ACTIVE_LOCK_SESSIONS } from '../../data/lotoData.js';
import { Card, StatusBadge, SectionLabel } from '../shared/Primitives.jsx';

export default function ActiveTasksLoto() {
  const { tasks, permits } = useApp();
  const active = tasks.filter((t) => t.status === 'In Progress' || t.status === 'Overdue');
  const lotoPermits = permits.filter((p) => p.lotoRequired);

  return (
    <div>
      <div className="mb-2 text-sm font-bold text-nz-navy">Active Tasks</div>
      <Card className="mb-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Task ID</th>
              <th className="px-4 py-3">Permit #</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Personnel</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">LOTO Status</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {active.map((t) => {
              const permit = permits.find((p) => p.id === t.permitId);
              return (
                <tr key={t.id} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                  <td className="px-4 py-2.5 font-semibold text-nz-navy">{t.id}</td>
                  <td className="px-4 py-2.5 text-slate-600">{t.permitId || '—'}</td>
                  <td className="px-4 py-2.5 text-slate-600">{t.type}</td>
                  <td className="px-4 py-2.5 text-slate-600">{t.assignedTo || 'Unassigned'}</td>
                  <td className="px-4 py-2.5 text-slate-600">{t.equipment}</td>
                  <td className="px-4 py-2.5 text-xs font-semibold">
                    {t.lotoRequired ? (permit?.lotoStatus === 'complete' ? <span className="text-nz-green">Locked</span> : <span className="text-nz-amber">Pending</span>) : 'N/A'}
                  </td>
                  <td className="px-4 py-2.5"><StatusBadge status={t.status === 'Overdue' ? 'blocked' : 'issued'} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <SectionLabel><span className="flex items-center gap-1.5"><Lock size={13} /> LOTO Sub-section — Tasks Requiring Isolation</span></SectionLabel>
      <div className="grid grid-cols-2 gap-4">
        {lotoPermits.map((p) => {
          const session = ACTIVE_LOCK_SESSIONS.find((s) => s.permitId === p.id);
          return (
            <Card key={p.id} className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <div className="font-bold text-nz-navy">{p.id}</div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mb-2 text-xs text-slate-500">{p.equipment} · {p.location}</div>
              {session ? (
                <div className="text-xs text-slate-600">
                  Lock <span className="font-semibold">{session.lockId}</span> ({session.deviceType}) — reserved by {session.appliedBy}, {session.appliedAt}
                </div>
              ) : (
                <div className="text-xs font-semibold text-nz-amber">Lock not yet reserved</div>
              )}
              <div className="mt-1 text-xs text-slate-500">Assigned LOTO person: {p.lotoAssignee || 'Not yet assigned'}</div>
            </Card>
          );
        })}
        {lotoPermits.length === 0 && <div className="text-sm text-slate-400">No permits currently require LOTO.</div>}
      </div>
    </div>
  );
}
