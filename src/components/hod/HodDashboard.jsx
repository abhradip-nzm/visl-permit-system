import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { needsClearance } from '../../data/departmentsData.js';
import { CLEARANCE_DEPARTMENTS } from '../../data/ptwFormData.js';
import { StatusBadge, RiskBadge, Card } from '../shared/Primitives.jsx';
import WorkflowStrip from '../shared/WorkflowStrip.jsx';

// Phase 9: HOD is clearance-only now — this dashboard shows exactly one
// queue: permits awaiting this department's clearance, and only for permit
// types that actually need clearance (Excavation, or anything touching
// Production — see needsClearance() in departmentsData.js).
//
// A permit stays listed for this HOD either while their own department's
// row is still pending (their turn to act), OR once every department row
// is already resolved but the permit hasn't been formally advanced yet —
// otherwise, once the last row gets resolved, it would vanish from every
// HOD's queue with nobody able to reach the final "Confirm & Continue"
// button (a permit stuck with no way to move it forward).
export default function HodDashboard({ navigate }) {
  const { permits, currentDepartment, currentUser } = useApp();

  const pendingClearance = permits.filter((p) => {
    if (p.status !== 'pending-clearance' || !needsClearance(p.types || [p.type])) return false;
    if (!currentDepartment) return true;
    const myRowPending = p.deptClearances?.[currentDepartment]?.status === 'pending';
    const allResolved = CLEARANCE_DEPARTMENTS.every((d) => p.deptClearances?.[d]?.status !== 'pending');
    return myRowPending || allResolved;
  });

  // "Cleared by me" — permits where my own department's row shows a
  // 'cleared' status attributed to this HOD's account.
  const totalCleared = currentDepartment
    ? permits.filter((p) => p.deptClearances?.[currentDepartment]?.status === 'cleared' && p.deptClearances[currentDepartment]?.name === currentUser?.name).length
    : permits.filter((p) => needsClearance(p.types || [p.type]) && CLEARANCE_DEPARTMENTS.some((d) => p.deptClearances?.[d]?.status === 'cleared')).length;

  return (
    <div>
      <div className="mb-4">
        <WorkflowStrip activeRole="hod" />
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <Card className="min-w-[150px] flex-1 p-4">
          <div className="text-xs font-semibold uppercase text-slate-400">Pending Clearance</div>
          <div className="mt-1 text-3xl font-extrabold text-nz-amber">{pendingClearance.length}</div>
        </Card>
        <Card className="min-w-[150px] flex-1 p-4">
          <div className="text-xs font-semibold uppercase text-slate-400">Total Cleared</div>
          <div className="mt-1 text-3xl font-extrabold text-nz-green">{totalCleared}</div>
        </Card>
      </div>

      <div className="mb-2 text-sm font-bold text-nz-navy">Pending Departmental Clearance</div>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Permit #</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pendingClearance.map((p) => (
              <tr key={p.id} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                <td className="px-4 py-3 font-bold text-nz-navy">{p.id}</td>
                <td className="px-4 py-3 text-slate-600">{(p.types || [p.type]).join(', ')}</td>
                <td className="px-4 py-3 text-slate-600">{p.requester}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    p.ageHours > 24 ? 'border-nz-red/30 bg-nz-red-light text-nz-red' : 'border-nz-border bg-nz-surface text-slate-500'
                  }`}>
                    <Clock size={11} /> {p.ageHours}h{p.ageHours > 24 ? ' · SLA risk' : ''}
                  </span>
                </td>
                <td className="px-4 py-3"><RiskBadge risk={p.risk} /></td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => navigate('clearance', { id: p.id })} className="flex items-center gap-1 text-sm font-semibold text-nz-blue hover:underline">
                    Clear <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {pendingClearance.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-xs text-slate-400">Nothing awaiting clearance right now.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
