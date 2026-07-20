import React from 'react';
import { Users, FileWarning, AlertTriangle, CircleCheck, CircleAlert, Megaphone, CalendarDays, ListChecks } from 'lucide-react';
import { SYSTEM_HEALTH, PERSONNEL, EQUIPMENT } from '../../data/mockData.js';
import { ANNOUNCEMENTS } from '../../data/announcementsData.js';
import { SHIFT_CALENDAR } from '../../data/shiftsData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel } from '../shared/Primitives.jsx';
import WorkflowStrip from '../shared/WorkflowStrip.jsx';

const INTEGRATIONS = [
  { name: 'SAP PM', status: SYSTEM_HEALTH.sapPm },
  { name: 'Enablon', status: SYSTEM_HEALTH.enablon },
  { name: 'OCR Engine', status: SYSTEM_HEALTH.ocr }
];

export default function AdminDashboard() {
  const { tasks } = useApp();
  const expired = PERSONNEL.filter((p) => p.certifications.some((c) => c.status === 'expired'));
  const today = SHIFT_CALENDAR[0];
  const morning = today.slots.find((s) => s.slot === 'Morning');
  const pending = tasks.filter((t) => t.status === 'Pending' || !t.assignedTo);
  const assigned = tasks.filter((t) => t.assignedTo);

  return (
    <div>
      <div className="mb-4">
        <WorkflowStrip activeRole="useradmin" />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Active Users" value={SYSTEM_HEALTH.activeUsers} icon={Users} />
        <Stat label="Open Permits" value={SYSTEM_HEALTH.openPermits} icon={FileWarning} />
        <Stat label="Blocked Permits" value={2} icon={AlertTriangle} tone="red" />
        <Stat label="Expired Certifications" value={expired.length} icon={AlertTriangle} tone="red" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
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

      <Card className="mb-4 p-4">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <SectionLabel><span className="flex items-center gap-1.5"><Megaphone size={13} /> Recent Announcements</span></SectionLabel>
          <div className="space-y-2">
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <div key={a.id} className="rounded-lg border border-nz-border px-3 py-2 text-xs">
                <div className="font-semibold text-nz-navy">{a.title}</div>
                <div className="mt-0.5 text-slate-400">{a.date} · {a.recipientScope}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <SectionLabel><span className="flex items-center gap-1.5"><CalendarDays size={13} /> Shift Calendar Quick View</span></SectionLabel>
          <div className="text-sm">
            <div className="font-bold text-nz-navy">Today · Morning Shift</div>
            <div className="mt-1 text-2xl font-extrabold text-nz-blue">{morning.assignedCount}</div>
            <div className="text-xs text-slate-400">active personnel scheduled</div>
          </div>
        </Card>
        <Card className="p-4">
          <SectionLabel><span className="flex items-center gap-1.5"><ListChecks size={13} /> Pending Tasks</span></SectionLabel>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-extrabold text-nz-navy">{tasks.length}</div>
              <div className="text-[10px] text-slate-400">Total</div>
            </div>
            <div>
              <div className="text-lg font-extrabold text-nz-green">{assigned.length}</div>
              <div className="text-[10px] text-slate-400">Assigned</div>
            </div>
            <div>
              <div className="text-lg font-extrabold text-nz-amber">{pending.length}</div>
              <div className="text-[10px] text-slate-400">Unassigned</div>
            </div>
          </div>
        </Card>
      </div>
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
