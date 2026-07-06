import React from 'react';
import { Users, FileWarning, AlertTriangle, CircleCheck, CircleAlert } from 'lucide-react';
import { SYSTEM_HEALTH, PERSONNEL, EQUIPMENT } from '../../data/mockData.js';
import { Card, SectionLabel } from '../shared/Primitives.jsx';

const INTEGRATIONS = [
  { name: 'SAP PM', status: SYSTEM_HEALTH.sapPm },
  { name: 'Enablon', status: SYSTEM_HEALTH.enablon },
  { name: 'OCR Engine', status: SYSTEM_HEALTH.ocr }
];

export default function AdminDashboard() {
  const expired = PERSONNEL.filter((p) => p.certifications.some((c) => c.status === 'expired'));

  return (
    <div>
      <div className="mb-4 grid grid-cols-4 gap-4">
        <Stat label="Active Users" value={SYSTEM_HEALTH.activeUsers} icon={Users} />
        <Stat label="Open Permits" value={SYSTEM_HEALTH.openPermits} icon={FileWarning} />
        <Stat label="Blocked Permits" value={2} icon={AlertTriangle} tone="red" />
        <Stat label="Expired Certifications" value={expired.length} icon={AlertTriangle} tone="red" />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        {INTEGRATIONS.map((i) => {
          const tone = i.status === 'ok' ? 'text-nz-green' : i.status === 'warning' ? 'text-nz-amber' : 'text-nz-red';
          const label = i.status === 'ok' ? 'Operating normally' : i.status === 'warning' ? 'Elevated latency' : 'Connection error';
          return (
            <Card key={i.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-nz-navy">{i.name}</div>
                {i.status === 'ok' ? <CircleCheck size={18} className={tone} /> : <CircleAlert size={18} className={tone} />}
              </div>
              <div className={`mt-1 text-xs font-semibold ${tone}`}>{label}</div>
            </Card>
          );
        })}
      </div>

      <Card className="mb-4 p-4">
        <SectionLabel>Validity & Expiry Summary</SectionLabel>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg bg-nz-red-light px-3 py-2.5">
            <div className="font-bold text-nz-red">{expired.length} certifications expired</div>
            <div className="text-xs text-slate-500">{expired.map((p) => p.name).join(', ')}</div>
          </div>
          <div className="rounded-lg bg-nz-amber-light px-3 py-2.5">
            <div className="font-bold text-nz-amber">1 certification expiring soon</div>
            <div className="text-xs text-slate-500">S. Iyer — Hot Work, 4 days</div>
          </div>
          <div className="rounded-lg bg-nz-red-light px-3 py-2.5">
            <div className="font-bold text-nz-red">
              {EQUIPMENT.filter((e) => e.calibrationStatus === 'overdue').length} equipment overdue calibration
            </div>
            <div className="text-xs text-slate-500">
              {EQUIPMENT.filter((e) => e.calibrationStatus === 'overdue').map((e) => e.name).join(', ') || 'None'}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <SectionLabel>Permit Status Breakdown</SectionLabel>
        <div className="flex items-end gap-4">
          {Object.entries(SYSTEM_HEALTH.breakdown).map(([k, v]) => (
            <div key={k} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end rounded-lg bg-nz-surface">
                <div
                  className="w-full rounded-lg bg-nz-blue"
                  style={{ height: `${(v / SYSTEM_HEALTH.openPermits) * 100}%` }}
                />
              </div>
              <div className="text-xs font-semibold text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
              <div className="text-sm font-bold text-nz-navy">{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
        <Icon size={15} className={tone === 'red' ? 'text-nz-red' : 'text-nz-blue'} />
      </div>
      <div className={`mt-1 text-3xl font-extrabold ${tone === 'red' ? 'text-nz-red' : 'text-nz-navy'}`}>{value}</div>
    </Card>
  );
}
