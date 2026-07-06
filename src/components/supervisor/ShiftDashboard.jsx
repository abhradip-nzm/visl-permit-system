import React from 'react';
import { ChevronRight, Wrench, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ACTIVE_PERSONNEL } from '../../data/shiftsData.js';
import { MAINTENANCE_REQUESTS } from '../../data/tasksData.js';
import { Card, StatusBadge, Button } from '../shared/Primitives.jsx';
import WorkflowStrip from '../shared/WorkflowStrip.jsx';

export default function ShiftDashboard({ navigate }) {
  const { permits, tasks } = useApp();
  const lotoPermits = permits.filter((p) => p.lotoRequired);
  const shiftTasks = tasks.filter((t) => t.status !== 'Completed');
  const alerts = permits.filter((p) => p.status === 'blocked').length + lotoPermits.filter((p) => p.lotoStatus !== 'complete').length;

  return (
    <div>
      <div className="mb-4">
        <WorkflowStrip activeRole="supervisor" />
      </div>

      <div className="mb-4 grid grid-cols-4 gap-4">
        <Stat label="Active Personnel" value={ACTIVE_PERSONNEL.length} />
        <Stat label="Pending Requests" value={MAINTENANCE_REQUESTS.length} tone="amber" />
        <Stat label="Active LOTO" value={lotoPermits.length} tone="blue" />
        <Stat label="Shift Alerts" value={alerts} tone="red" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card>
            <div className="border-b border-nz-border px-4 py-3 text-sm font-bold text-nz-navy">Active Personnel</div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Current Task</th>
                  <th className="px-4 py-2.5">Location</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Cert</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVE_PERSONNEL.map((p) => (
                  <tr key={p.id} className="border-b border-nz-border/60 last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-nz-navy">{p.name}</td>
                    <td className="px-4 py-2.5 text-slate-600">{p.task}</td>
                    <td className="px-4 py-2.5 text-slate-600">{p.location}</td>
                    <td className="px-4 py-2.5 text-slate-600">{p.status}</td>
                    <td className="px-4 py-2.5">
                      <span className={`h-2 w-2 rounded-full inline-block ${p.certStatus === 'expired' ? 'bg-nz-red' : p.certStatus === 'expiring' ? 'bg-nz-amber' : 'bg-nz-green'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <div className="border-b border-nz-border px-4 py-3 text-sm font-bold text-nz-navy">Current Shift Tasks</div>
            <div className="divide-y divide-nz-border/60">
              {shiftTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="font-semibold text-nz-navy">{t.id} — {t.type}</div>
                    <div className="text-xs text-slate-400">{t.assignedTo || 'Unassigned'} · {t.equipment}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.lotoRequired && <span className="text-xs font-semibold text-nz-amber">LOTO</span>}
                    <StatusBadge status={t.status === 'Overdue' ? 'blocked' : t.status === 'Completed' ? 'closed' : 'issued'} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="mb-3 text-sm font-bold text-nz-navy">Quick Actions</div>
          <div className="space-y-2">
            <Button variant="orange" className="w-full" onClick={() => navigate('maintenance')}>
              <Wrench size={15} /> Request Maintenance
            </Button>
            <Button variant="primary" className="w-full" onClick={() => navigate('lotoapprovals')}>
              <ShieldCheck size={15} /> Approve LOTO
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {lotoPermits.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate('lotoapprovals', { id: p.id })}
                className="flex w-full items-center justify-between rounded-lg border border-nz-border px-3 py-2 text-left text-xs"
              >
                <span className="font-semibold text-nz-navy">{p.id} needs LOTO</span>
                <ChevronRight size={12} className="text-slate-300" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', blue: 'text-nz-blue' };
  return (
    <Card className="p-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone] || 'text-nz-navy'}`}>{value}</div>
    </Card>
  );
}
