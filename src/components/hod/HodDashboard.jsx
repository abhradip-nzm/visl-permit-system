import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge, RiskBadge, Card } from '../shared/Primitives.jsx';
import WorkflowStrip from '../shared/WorkflowStrip.jsx';

export default function HodDashboard({ navigate }) {
  const { permits } = useApp();
  const queue = permits.filter((p) => ['pending-approval', 'blocked'].includes(p.status));
  const ready = permits.filter((p) => p.status === 'approved');
  const active = permits.filter((p) => p.status === 'issued');
  const closureDue = permits.filter((p) => p.status === 'closure-due');
  const compliance = permits.filter((p) => p.warnings?.length > 0).length;

  return (
    <div>
      <div className="mb-4">
        <WorkflowStrip activeRole="hod" />
      </div>

      <div className="mb-4 grid grid-cols-4 gap-4">
        <StatCard label="Awaiting Approval" value={queue.filter((p) => p.status === 'pending-approval').length} tone="amber" />
        <StatCard label="Active Tasks" value={active.length} tone="blue" />
        <StatCard label="Ready to Issue" value={ready.length} tone="green" />
        <StatCard label="Compliance Alerts" value={compliance} tone="red" />
      </div>

      <div className="mb-2 text-sm font-bold text-nz-navy">Approval Queue</div>
      <Card className="mb-6">
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
            {queue.map((p) => (
              <tr key={p.id} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                <td className="px-4 py-3 font-bold text-nz-navy">{p.id}</td>
                <td className="px-4 py-3 text-slate-600">{p.type}</td>
                <td className="px-4 py-3 text-slate-600">{p.requester}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      p.ageHours > 24
                        ? 'border-nz-red/30 bg-nz-red-light text-nz-red'
                        : 'border-nz-border bg-nz-surface text-slate-500'
                    }`}
                  >
                    <Clock size={11} /> {p.ageHours}h{p.ageHours > 24 ? ' · SLA risk' : ''}
                  </span>
                </td>
                <td className="px-4 py-3"><RiskBadge risk={p.risk} /></td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate('review', { id: p.id })}
                    className="flex items-center gap-1 text-sm font-semibold text-nz-blue hover:underline"
                  >
                    Review <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {queue.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-xs text-slate-400">Nothing awaiting approval.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="mb-2 text-sm font-bold text-nz-navy">Issuance & Closure</div>
      <div className="grid grid-cols-3 gap-4">
        <ListCard title="Ready to Issue" items={ready} navigate={navigate} action="Verify" />
        <ListCard title="Active Permits" items={active} navigate={navigate} action="Manage" />
        <ListCard title="Closure Due" items={closureDue} navigate={navigate} action="Close" />
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', blue: 'text-nz-blue', green: 'text-nz-green' };
  return (
    <Card className="p-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone] || 'text-nz-navy'}`}>{value}</div>
    </Card>
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
