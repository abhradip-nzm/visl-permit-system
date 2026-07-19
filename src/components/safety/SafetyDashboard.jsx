import React from 'react';
import { ChevronRight, ShieldAlert, AlertTriangle, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { PERSONNEL } from '../../data/mockData.js';
import { Card, StatusBadge, RiskBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

// Phase 9: the Safety Officer is a pure observer — this dashboard is a
// read-only portfolio view of every permit in the system and its current
// lifecycle stage, plus any open flags/warnings. No gates, no queues to
// action, nothing to approve. Clicking through opens the same lifecycle
// detail a Requester sees on their own permit (see MonitorPermitDetail.jsx).
export default function SafetyDashboard({ navigate }) {
  const { permits } = useApp();
  const expiredPersonnel = PERSONNEL.filter((p) => p.certifications.some((c) => c.status === 'expired'));
  const flags = permits.filter((p) => p.warnings?.length > 0);
  const live = permits.filter((p) => p.status === 'live').length;
  const closed = permits.filter((p) => p.status === 'closed').length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-nz-blue-light px-3 py-2 text-xs font-semibold text-nz-blue-dark">
        <Eye size={13} /> Read-only observer — you can view every permit's live status and history, but cannot action any of them.
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <Stat label="Total Permits" value={permits.length} icon={Eye} tone="navy" />
        <Stat label="Live" value={live} icon={Eye} tone="green" />
        <Stat label="Closed" value={closed} icon={Eye} tone="navy" />
        <Stat label="Open Flags" value={flags.length} icon={AlertTriangle} tone="amber" />
        <Stat label="High-Risk" value={permits.filter((p) => p.risk === 'high').length} icon={ShieldAlert} tone="red" />
      </div>

      {flags.length > 0 && (
        <>
          <div className="mb-2 text-sm font-bold text-nz-navy">Open Flags</div>
          <Card className="mb-6">
            <div className="divide-y divide-nz-border/60">
              {flags.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate('monitor', { id: p.id })}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-nz-surface"
                >
                  <div>
                    <span className="font-bold text-nz-navy">{p.id}</span>
                    <div className="text-xs text-slate-500">{p.warnings[0].text}</div>
                  </div>
                  <RiskBadge risk={p.risk} />
                </button>
              ))}
            </div>
          </Card>
        </>
      )}

      <div className="mb-2 text-sm font-bold text-nz-navy">All Permits — Portfolio View</div>
      <Card className="mb-6">
        <div className="divide-y divide-nz-border/60">
          {permits.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate('monitor', { id: p.id })}
              className="flex w-full flex-col gap-1.5 px-4 py-3 text-left hover:bg-nz-surface"
            >
              <div className="flex w-full items-center justify-between">
                <div>
                  <div className="font-bold text-nz-navy">{p.id} — {p.equipment}</div>
                  <div className="text-xs text-slate-400">{(p.types || [p.type]).join(', ')} · {p.location} · {p.requester}</div>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge risk={p.risk} />
                  <StatusBadge status={p.status} />
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
              <div className="overflow-x-auto"><PTWStepper permit={p} compact /></div>
            </button>
          ))}
        </div>
      </Card>

      <div className="mb-2 text-sm font-bold text-nz-navy">Certification Expiry Heat-strip</div>
      <Card className="p-3">
        <div className="flex flex-wrap gap-1.5">
          {PERSONNEL.map((p) =>
            p.certifications.map((c) => (
              <span
                key={p.id + c.type}
                className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
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
        {expiredPersonnel.length > 0 && (
          <div className="mt-2 text-xs text-slate-400">{expiredPersonnel.length} personnel with expired certifications.</div>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', navy: 'text-nz-navy', green: 'text-nz-green' };
  return (
    <Card className="min-w-[130px] flex-1 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
        <Icon size={14} className={tones[tone]} />
      </div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone]}`}>{value}</div>
    </Card>
  );
}
