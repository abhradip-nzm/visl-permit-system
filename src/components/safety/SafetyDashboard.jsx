import React from 'react';
import { ChevronRight, ShieldAlert, AlertTriangle, MapPin, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { PERSONNEL } from '../../data/mockData.js';
import { TASKS } from '../../data/tasksData.js';
import { Card, StatusBadge, RiskBadge } from '../shared/Primitives.jsx';
import WorkflowStrip from '../shared/WorkflowStrip.jsx';

const PIN_TONE = { 'on track': 'bg-nz-green', attention: 'bg-nz-amber', overdue: 'bg-nz-red' };

export default function SafetyDashboard({ navigate }) {
  const { permits } = useApp();
  const expiredPersonnel = PERSONNEL.filter((p) => p.certifications.some((c) => c.status === 'expired'));
  const flags = permits.filter((p) => p.warnings?.length > 0);
  const geoTasks = TASKS.filter((t) => t.status !== 'Completed').map((t) => ({
    ...t,
    pin: t.status === 'Overdue' ? 'overdue' : t.status === 'Pending' ? 'attention' : 'on track'
  }));

  return (
    <div className="px-4 py-4">
      <div className="mb-4 overflow-x-auto">
        <WorkflowStrip activeRole="safety" />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label="Open Flags" value={flags.length} icon={AlertTriangle} tone="amber" />
        <Stat label="High-Risk" value={permits.filter((p) => p.risk === 'high').length} icon={ShieldAlert} tone="red" />
        <Stat label="Expired Certs" value={expiredPersonnel.length} icon={AlertTriangle} tone="red" />
        <Stat label="Monitored" value={permits.length} icon={ShieldAlert} tone="navy" />
      </div>

      <button
        onClick={() => navigate('reporting')}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl2 bg-nz-orange py-3 text-sm font-bold text-white shadow-card"
      >
        <Send size={15} /> Reporting, Alerts & Complaints
      </button>

      <Card className="mb-4 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400"><MapPin size={12} /> Active Tasks with Geo</div>
        <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-nz-surface text-xs text-slate-400">Map placeholder</div>
        <div className="space-y-1.5">
          {geoTasks.slice(0, 4).map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-nz-border px-3 py-2 text-xs">
              <div>
                <div className="font-semibold text-nz-navy">{t.id} — {t.equipment}</div>
                <div className="text-slate-400">{t.department}</div>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${PIN_TONE[t.pin]}`} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4 p-3">
        <div className="mb-2 text-xs font-bold uppercase text-slate-400">Open Flags</div>
        <div className="space-y-2">
          {flags.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate('monitor', { id: p.id })}
              className="flex w-full items-start justify-between gap-2 rounded-lg border border-nz-border px-3 py-2.5 text-left"
            >
              <div>
                <span className="font-bold text-nz-navy">{p.id}</span>
                <div className="text-xs text-slate-500">{p.warnings[0].text}</div>
              </div>
              <RiskBadge risk={p.risk} />
            </button>
          ))}
          {flags.length === 0 && <div className="py-4 text-center text-xs text-slate-400">No open flags right now.</div>}
        </div>
      </Card>

      <Card className="mb-4 p-3">
        <div className="mb-2 text-xs font-bold uppercase text-slate-400">All Permits — Portfolio View</div>
        <div className="space-y-2">
          {permits.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate('monitor', { id: p.id })}
              className="flex w-full items-center justify-between rounded-lg border border-nz-border px-3 py-2.5 text-left"
            >
              <div>
                <div className="font-bold text-nz-navy">{p.id}</div>
                <div className="text-xs text-slate-400">{p.type} · {p.location}</div>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge risk={p.risk} />
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-3">
        <div className="mb-2 text-xs font-bold uppercase text-slate-400">Certification Expiry Heat-strip</div>
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
      </Card>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', navy: 'text-nz-navy' };
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase text-slate-400">{label}</div>
        <Icon size={13} className={tones[tone]} />
      </div>
      <div className={`mt-1 text-2xl font-extrabold ${tones[tone]}`}>{value}</div>
    </Card>
  );
}
