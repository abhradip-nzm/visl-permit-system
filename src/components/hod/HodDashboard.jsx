import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge, RiskBadge, Card } from '../shared/Primitives.jsx';
import WorkflowStrip from '../shared/WorkflowStrip.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

export default function HodDashboard({ navigate }) {
  const { permits } = useApp();
  const pendingClearance = permits.filter((p) => p.status === 'pending-clearance');
  const pendingApproval = permits.filter((p) => p.status === 'pending-approval');
  const pendingClosureVerification = permits.filter((p) => p.status === 'pending-closure');
  const live = permits.filter((p) => p.status === 'live');
  const returned = permits.filter((p) => p.status === 'returned');
  const compliance = permits.filter((p) => p.warnings?.length > 0).length;

  return (
    <div>
      <div className="mb-4">
        <WorkflowStrip activeRole="hod" />
      </div>

      <div className="mb-4 grid grid-cols-4 gap-4">
        <StatCard label="Pending Clearance" value={pendingClearance.length} tone="amber" />
        <StatCard label="Pending My Approval" value={pendingApproval.length} tone="blue" />
        <StatCard label="Pending Closure Verification" value={pendingClosureVerification.length} tone="orange" />
        <StatCard label="Compliance Alerts" value={compliance} tone="red" />
      </div>

      <div className="mb-2 text-sm font-bold text-nz-navy">Pending My Approval (Step 6 — On-Ground Verification)</div>
      <PermitQueue permits={pendingApproval} navigate={navigate} target="review" action="Review" />

      <div className="mb-2 mt-6 text-sm font-bold text-nz-navy">Pending Departmental Clearance (Step 2)</div>
      <PermitQueue permits={pendingClearance} navigate={navigate} target="clearance" action="Clear" />

      <div className="mb-2 mt-6 text-sm font-bold text-nz-navy">Pending Closure Verification (Step 9)</div>
      <PermitQueue permits={pendingClosureVerification} navigate={navigate} target="verify" action="Verify" />

      {returned.length > 0 && (
        <>
          <div className="mb-2 mt-6 text-sm font-bold text-nz-navy">Returned to Requester</div>
          <Card>
            <div className="divide-y divide-nz-border/60">
              {returned.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="font-semibold text-nz-navy">{p.id}</div>
                    <div className="text-xs text-slate-400">{p.approval?.rejectionReason}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <div className="mb-2 mt-6 text-sm font-bold text-nz-navy">Live Permits</div>
      <Card>
        <div className="divide-y divide-nz-border/60">
          {live.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-semibold text-nz-navy">{p.id} — {p.equipment}</div>
                <div className="mt-1"><PTWStepper permit={p} compact /></div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
          {live.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">Nothing live right now.</div>}
        </div>
      </Card>
    </div>
  );
}

function PermitQueue({ permits, navigate, target, action }) {
  return (
    <Card>
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
          {permits.map((p) => (
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
                <button onClick={() => navigate(target, { id: p.id })} className="flex items-center gap-1 text-sm font-semibold text-nz-blue hover:underline">
                  {action} <ChevronRight size={14} />
                </button>
              </td>
            </tr>
          ))}
          {permits.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-6 text-center text-xs text-slate-400">Nothing here right now.</td></tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

function StatCard({ label, value, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', blue: 'text-nz-blue', green: 'text-nz-green', orange: 'text-nz-orange' };
  return (
    <Card className="p-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone] || 'text-nz-navy'}`}>{value}</div>
    </Card>
  );
}
