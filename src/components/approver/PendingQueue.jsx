import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge, RiskBadge, Card } from '../shared/Primitives.jsx';

export default function PendingQueue({ navigate }) {
  const { permits } = useApp();
  const queue = permits.filter((p) => ['pending-approval', 'blocked'].includes(p.status));

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <StatCard label="Awaiting Approval" value={queue.filter((p) => p.status === 'pending-approval').length} tone="amber" />
        <StatCard label="Blocked" value={queue.filter((p) => p.status === 'blocked').length} tone="red" />
        <StatCard label="High Risk" value={queue.filter((p) => p.risk === 'high').length} tone="navy" />
      </div>

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
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', navy: 'text-nz-navy' };
  return (
    <Card className="p-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone]}`}>{value}</div>
    </Card>
  );
}
