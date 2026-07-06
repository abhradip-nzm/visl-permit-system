import React from 'react';
import { ChevronRight, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { PERSONNEL } from '../../data/mockData.js';
import { Card, StatusBadge, RiskBadge } from '../shared/Primitives.jsx';

export default function SafetyDashboard({ navigate }) {
  const { permits } = useApp();
  const expiredPersonnel = PERSONNEL.filter((p) => p.certifications.some((c) => c.status === 'expired'));
  const flags = permits.filter((p) => p.warnings?.length > 0);

  return (
    <div>
      <div className="mb-4 grid grid-cols-4 gap-4">
        <Stat label="Open Flags" value={flags.length} icon={AlertTriangle} tone="amber" />
        <Stat label="High-Risk Permits" value={permits.filter((p) => p.risk === 'high').length} icon={ShieldAlert} tone="red" />
        <Stat label="Expired Certifications" value={expiredPersonnel.length} icon={AlertTriangle} tone="red" />
        <Stat label="Total Monitored" value={permits.length} icon={ShieldAlert} tone="navy" />
      </div>

      <Card className="mb-4 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-bold text-nz-navy">Open Flags</div>
          <span className="text-xs text-slate-400">Incident data via Enablon integration</span>
        </div>
        <div className="space-y-2">
          {flags.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate('monitor', { id: p.id })}
              className="flex w-full items-start justify-between gap-3 rounded-lg border border-nz-border px-3 py-2.5 text-left hover:bg-nz-surface"
            >
              <div>
                <span className="font-bold text-nz-navy">{p.id}</span>
                <span className="ml-2 text-sm text-slate-500">{p.warnings[0].text}</span>
              </div>
              <RiskBadge risk={p.risk} />
            </button>
          ))}
          {flags.length === 0 && <div className="py-4 text-center text-xs text-slate-400">No open flags right now.</div>}
        </div>
      </Card>

      <Card className="mb-4">
        <div className="border-b border-nz-border px-4 py-3 text-sm font-bold text-nz-navy">All Permits — Portfolio View</div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-2.5">Permit #</th>
              <th className="px-4 py-2.5">Type</th>
              <th className="px-4 py-2.5">Location</th>
              <th className="px-4 py-2.5">Risk</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {permits.map((p) => (
              <tr key={p.id} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                <td className="px-4 py-2.5 font-bold text-nz-navy">{p.id}</td>
                <td className="px-4 py-2.5 text-slate-600">{p.type}</td>
                <td className="px-4 py-2.5 text-slate-600">{p.location}</td>
                <td className="px-4 py-2.5"><RiskBadge risk={p.risk} /></td>
                <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-2.5">
                  <button onClick={() => navigate('monitor', { id: p.id })} className="flex items-center gap-1 text-sm font-semibold text-nz-blue">
                    View <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-4">
        <div className="mb-3 text-sm font-bold text-nz-navy">Certification Expiry Heat-strip</div>
        <div className="flex flex-wrap gap-2">
          {PERSONNEL.map((p) =>
            p.certifications.map((c) => (
              <span
                key={p.id + c.type}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                  c.status === 'expired' ? 'border-nz-red/30 bg-nz-red-light text-nz-red' :
                  c.status === 'expiring' ? 'border-nz-amber/30 bg-nz-amber-light text-nz-amber' :
                  'border-nz-green/30 bg-nz-green-light text-nz-green'
                }`}
              >
                {p.name} · {c.type}
              </span>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', navy: 'text-nz-navy' };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
        <Icon size={15} className={tones[tone]} />
      </div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone]}`}>{value}</div>
    </Card>
  );
}
