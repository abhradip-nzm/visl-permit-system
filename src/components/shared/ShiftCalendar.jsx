import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { SHIFT_CALENDAR } from '../../data/shiftsData.js';
import { PERSONNEL } from '../../data/mockData.js';
import { Card, SectionLabel } from './Primitives.jsx';

const certLookup = (name) => {
  const person = PERSONNEL.find((p) => p.name === name);
  if (!person) return 'valid';
  return person.certifications.some((c) => c.status === 'expired') ? 'expired' : 'valid';
};

// Reused by User Admin (site-wide) and HOD (department-scoped) — pass a
// `scopeLabel` to reflect which slice of the roster is being viewed.
export default function ShiftCalendar({ scopeLabel = 'All Departments' }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState(null);
  const days = SHIFT_CALENDAR.slice(weekOffset * 7, weekOffset * 7 + 7);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 space-y-4">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>
              <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Shift Calendar — {scopeLabel}</span>
            </SectionLabel>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset((w) => Math.max(0, w - 1))} className="rounded-md border border-nz-border p-1 hover:bg-nz-surface">
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs font-semibold text-slate-500">Week {weekOffset + 1} of 2</span>
              <button onClick={() => setWeekOffset((w) => Math.min(1, w + 1))} className="rounded-md border border-nz-border p-1 hover:bg-nz-surface">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div key={day.date} className="rounded-lg border border-nz-border p-2">
                <div className="mb-1.5 text-[11px] font-bold text-nz-navy">{day.date.slice(5)}</div>
                <div className="space-y-1">
                  {day.slots.map((s) => (
                    <button
                      key={s.slot}
                      onClick={() => setSelected({ date: day.date, ...s })}
                      className={`flex w-full items-center justify-between rounded-md px-1.5 py-1 text-[10px] font-semibold ${
                        selected?.date === day.date && selected?.slot === s.slot ? 'bg-nz-blue text-white' : 'bg-nz-surface text-slate-600'
                      }`}
                    >
                      {s.slot.slice(0, 3)} <span>{s.assignedCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {selected && (
          <Card className="p-4">
            <SectionLabel>{selected.date} · {selected.slot} shift — assigned personnel</SectionLabel>
            <div className="space-y-1.5">
              {selected.personnel.map((name) => {
                const cert = certLookup(name);
                return (
                  <div key={name} className="flex items-center justify-between rounded-lg border border-nz-border px-3 py-2 text-sm">
                    <span className="text-slate-700">{name}</span>
                    <span className={`h-2 w-2 rounded-full ${cert === 'expired' ? 'bg-nz-red' : 'bg-nz-green'}`} />
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      <Card className="p-4">
        <SectionLabel>Plan Shift</SectionLabel>
        <div className="space-y-2 text-sm">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Date</span>
            <input type="date" defaultValue="2026-07-08" className="w-full rounded-lg border border-nz-border px-3 py-2 text-sm focus-ring" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Shift</span>
            <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Night</option>
            </select>
          </label>
          <div className="rounded-lg border border-dashed border-nz-border p-3 text-xs text-slate-400">
            Drag personnel from the available pool here to plan the shift (demo only).
          </div>
        </div>
      </Card>
    </div>
  );
}
