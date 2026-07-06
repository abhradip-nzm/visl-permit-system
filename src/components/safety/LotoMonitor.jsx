import React from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { ACTIVE_LOCK_SESSIONS, LOTO_ANOMALIES } from '../../data/lotoData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel } from '../shared/Primitives.jsx';

export default function LotoMonitor() {
  const { permits } = useApp();
  const lotoPermits = permits.filter((p) => p.lotoRequired);

  return (
    <div className="px-4 py-4">
      <h2 className="mb-4 text-lg font-bold text-nz-navy">LOTO Monitor</h2>

      <SectionLabel>Active Lock Keys</SectionLabel>
      <div className="mb-4 space-y-2">
        {ACTIVE_LOCK_SESSIONS.map((s) => (
          <Card key={s.lockId} className="p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-nz-navy"><Lock size={13} className="text-nz-blue" /> {s.lockId}</div>
              <span className="text-xs font-semibold text-nz-green">{s.status}</span>
            </div>
            <div className="text-xs text-slate-500">{s.deviceType} · {s.equipment}</div>
            <div className="text-xs text-slate-400">Applied by {s.appliedBy} · {s.permitId} · {s.appliedAt}</div>
          </Card>
        ))}
      </div>

      <SectionLabel>LOTO Task Status</SectionLabel>
      <div className="mb-4 space-y-2">
        {lotoPermits.map((p) => (
          <Card key={p.id} className="p-3">
            <div className="mb-1 font-bold text-nz-navy">{p.id}</div>
            <div className="text-xs text-slate-500">{p.equipment} · Isolation: {p.lotoStatus === 'complete' ? 'Complete' : 'Pending'}</div>
            <div className="text-xs text-slate-400">Energy source: Electrical + Hydraulic</div>
          </Card>
        ))}
      </div>

      <SectionLabel>Safety Key Monitoring</SectionLabel>
      <div className="space-y-2">
        {LOTO_ANOMALIES.map((a) => (
          <div key={a.id} className="flex items-start gap-2 rounded-lg border border-nz-amber/30 bg-nz-amber-light px-3 py-2.5 text-sm">
            <AlertTriangle size={15} className="mt-0.5 flex-shrink-0 text-nz-amber" />
            <span className="text-slate-700">{a.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
