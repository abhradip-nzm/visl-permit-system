import React from 'react';
import { Laptop, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';

// IT Professional: a permit flagged "IT Approval required" by the
// Requester at request time routes here for sign-off — independent of
// departmental clearance (HOD's Departmental Clearance screen shows this
// as a read-only status, not an action it can grant).
export default function ITDashboard() {
  const { currentUser, permits, updatePermit, addTimelineEvent, pushToast } = useApp();

  const pending = permits.filter(
    (p) => p.status !== 'draft' && p.deptClearances?.itApproval?.required && !p.deptClearances?.itApproval?.granted
  );
  const granted = permits.filter((p) => p.deptClearances?.itApproval?.required && p.deptClearances?.itApproval?.granted);

  function grant(permit) {
    const updated = { ...permit.deptClearances, itApproval: { ...permit.deptClearances.itApproval, granted: true, name: currentUser.name } };
    updatePermit(permit.id, { deptClearances: updated });
    addTimelineEvent(permit.id, 'IT Approval granted', `${currentUser.name} (IT Professional)`);
    pushToast(`IT Approval recorded for ${permit.id}`);
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-nz-blue-light px-3 py-2 text-xs font-semibold text-nz-blue-dark">
        <Laptop size={13} /> Permits flagged "IT Approval required" by the Requester land here for sign-off.
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <Card className="min-w-[150px] flex-1 p-4">
          <div className="text-xs font-semibold uppercase text-slate-400">Pending IT Approval</div>
          <div className="mt-1 text-3xl font-extrabold text-nz-amber">{pending.length}</div>
        </Card>
        <Card className="min-w-[150px] flex-1 p-4">
          <div className="text-xs font-semibold uppercase text-slate-400">Total Granted</div>
          <div className="mt-1 text-3xl font-extrabold text-nz-green">{granted.length}</div>
        </Card>
      </div>

      <SectionLabel>Pending IT Approval</SectionLabel>
      <Card className="mb-6">
        <div className="divide-y divide-nz-border/60">
          {pending.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-semibold text-nz-navy">{p.id} — {p.equipment}</div>
                <div className="text-xs text-slate-400">{(p.types || [p.type]).join(', ')} · {p.location} · {p.requester}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={p.status} />
                <Button variant="success" size="sm" onClick={() => grant(p)}><CheckCircle2 size={13} /> Grant</Button>
              </div>
            </div>
          ))}
          {pending.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">Nothing awaiting IT approval right now.</div>}
        </div>
      </Card>

      <SectionLabel>Previously Granted</SectionLabel>
      <Card>
        <div className="divide-y divide-nz-border/60">
          {granted.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <div className="font-semibold text-nz-navy">{p.id} — {p.equipment}</div>
                <div className="text-xs text-slate-400">Granted by {p.deptClearances.itApproval.name}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
          {granted.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">None yet.</div>}
        </div>
      </Card>
    </div>
  );
}
