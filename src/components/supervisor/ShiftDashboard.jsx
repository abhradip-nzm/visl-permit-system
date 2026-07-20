import React from 'react';
import { ChevronRight, Wrench, ShieldCheck, ArrowLeftRight, ScrollText } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ACTIVE_PERSONNEL } from '../../data/shiftsData.js';
import { MAINTENANCE_REQUESTS } from '../../data/tasksData.js';
import { Card, StatusBadge, Button } from '../shared/Primitives.jsx';
import WorkflowStrip from '../shared/WorkflowStrip.jsx';

export default function ShiftDashboard({ navigate }) {
  const { permits, tasks } = useApp();
  const pendingIsolation = permits.filter((p) => p.isolationRequired && p.status === 'pending-isolation');
  const pendingDeIsolation = permits.filter((p) => p.isolationRequired && p.status === 'pending-closure' && !p.deIsolation);
  const transferred = permits.filter((p) => p.transfers?.length > 0 && p.status === 'live');
  const shiftTasks = tasks.filter((t) => t.status !== 'Completed');
  const alerts = permits.filter((p) => p.status === 'returned').length + pendingIsolation.length;

  // Phase 10: every logged isolation event, flattened from each permit's
  // own isolationDetails record (the same data the Isolation Officer fills
  // in on LotoApprovals.jsx) — most recently isolated first. appliedAt /
  // removedAt come straight from that same record and from permit.deIsolation
  // (both stamped at the moment of the actual isolate/de-isolate action).
  const isolationLogs = permits
    .flatMap((p) => (p.isolationDetails || []).map((d) => ({
      ...d,
      permitId: p.id,
      deisolated: !!p.deIsolation,
      removedAt: p.deIsolation?.at || null
    })))
    .filter((l) => l.isolationPermitNo || l.lotoIdNo);

  return (
    <div>
      <div className="mb-4">
        <WorkflowStrip activeRole="supervisor" />
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <Stat label="Active Personnel" value={ACTIVE_PERSONNEL.length} />
        <Stat label="Pending Requests" value={MAINTENANCE_REQUESTS.length} tone="amber" />
        <Stat label="Pending Isolation" value={pendingIsolation.length} tone="blue" />
        <Stat label="Pending De-isolation" value={pendingDeIsolation.length} tone="amber" />
        <Stat label="Isolations Logged" value={isolationLogs.length} tone="navy" />
        <Stat label="Shift Alerts" value={alerts} tone="red" />
      </div>

      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3">
        <div className="space-y-4 @lg:col-span-2">
          <Card className="overflow-x-auto">
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
                <div key={t.id} className="flex items-center justify-between gap-2 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-nz-navy">{t.id} — {t.type}</div>
                    <div className="truncate text-xs text-slate-400">{t.assignedTo || 'Unassigned'} · {t.equipment}</div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {t.lotoRequired && <span className="text-xs font-semibold text-nz-amber">Isolation</span>}
                    <StatusBadge status={t.status === 'Overdue' ? 'blocked' : t.status === 'Completed' ? 'closed' : 'issued'} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="border-b border-nz-border px-4 py-3 text-sm font-bold text-nz-navy"><ArrowLeftRight size={13} className="mr-1.5 inline" /> Active Permit Transfers</div>
            <div className="divide-y divide-nz-border/60">
              {transferred.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-nz-navy">{p.id} — {p.equipment}</div>
                    <div className="truncate text-xs text-slate-400">
                      {p.transfers.map((t) => t.transferredTo).join(' → ')}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
              {transferred.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">No active transfers this shift.</div>}
            </div>
          </Card>

          <Card className="overflow-x-auto">
            <div className="border-b border-nz-border px-4 py-3 text-sm font-bold text-nz-navy"><ScrollText size={13} className="mr-1.5 inline" /> Isolation Logs</div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-nz-border uppercase text-slate-400">
                  <th className="px-4 py-2.5">Permit #</th>
                  <th className="px-4 py-2.5">Equipment</th>
                  <th className="px-4 py-2.5">Iso. Permit No.</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">LOTO ID</th>
                  <th className="px-4 py-2.5">Dept Lock</th>
                  <th className="px-4 py-2.5">Isolation Officer</th>
                  <th className="px-4 py-2.5">Applied At</th>
                  <th className="px-4 py-2.5">Removed At</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {isolationLogs.map((l, i) => (
                  <tr key={`${l.permitId}-${i}`} className="border-b border-nz-border/60 last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-nz-navy">{l.permitId}</td>
                    <td className="px-4 py-2.5 text-slate-600">{l.equipment}</td>
                    <td className="px-4 py-2.5 text-slate-600">{l.isolationPermitNo || '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{l.typeOfIsolation || '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{l.lotoIdNo || '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{l.deptLockNo || '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{l.isolationOfficerName || '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{l.appliedAt || '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{l.removedAt || '—'}</td>
                    <td className="px-4 py-2.5">
                      <span className={l.deisolated ? 'font-semibold text-slate-400' : 'font-semibold text-nz-amber'}>
                        {l.deisolated ? 'De-isolated' : 'Isolated'}
                      </span>
                    </td>
                  </tr>
                ))}
                {isolationLogs.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-6 text-center text-xs text-slate-400">No isolation events logged yet.</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>

        <Card className="p-4">
          <div className="mb-3 text-sm font-bold text-nz-navy">Quick Actions</div>
          <div className="space-y-2">
            <Button variant="orange" className="w-full" onClick={() => navigate('maintenance')}>
              <Wrench size={15} /> Request Maintenance
            </Button>
            <Button variant="primary" className="w-full" onClick={() => navigate('lotoapprovals')}>
              <ShieldCheck size={15} /> Verify Isolation
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {pendingIsolation.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate('lotoapprovals', { id: p.id })}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-nz-border px-3 py-2 text-left text-xs"
              >
                <span className="min-w-0 truncate font-semibold text-nz-navy">{p.id} needs isolation verification</span>
                <ChevronRight size={12} className="flex-shrink-0 text-slate-300" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', blue: 'text-nz-blue', navy: 'text-nz-navy' };
  return (
    <Card className="min-w-[140px] flex-1 p-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone] || 'text-nz-navy'}`}>{value}</div>
    </Card>
  );
}
