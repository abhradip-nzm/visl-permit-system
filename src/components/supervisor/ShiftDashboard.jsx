import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { SHIFT_ROSTER } from '../../data/mockData.js';
import { Card, StatusBadge } from '../shared/Primitives.jsx';

export default function ShiftDashboard({ navigate }) {
  const { permits } = useApp();
  const shiftPermits = permits.filter((p) => p.shift === 'Morning');
  const blocked = permits.filter((p) => p.status === 'blocked' || p.lotoRequired);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 space-y-4">
        <Card>
          <div className="border-b border-nz-border px-4 py-3 text-sm font-bold text-nz-navy">Shift Permits (Morning)</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
                <th className="px-4 py-2.5">Permit #</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {shiftPermits.map((p) => (
                <tr key={p.id} className="border-b border-nz-border/60 last:border-0">
                  <td className="px-4 py-2.5 font-bold text-nz-navy">{p.id}</td>
                  <td className="px-4 py-2.5 text-slate-600">{p.type}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-2.5">
                    {p.lotoRequired && (
                      <button onClick={() => navigate('loto-assign', { id: p.id })} className="flex items-center gap-1 text-xs font-semibold text-nz-blue">
                        Assign LOTO <ChevronRight size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <div className="mb-2 text-sm font-bold text-nz-navy">Blocked / Needs Action</div>
          <div className="space-y-2">
            {blocked.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-nz-red-light px-3 py-2 text-sm">
                <span className="font-semibold text-nz-red">{p.id}</span>
                <span className="text-xs text-slate-600">{p.warnings?.[0]?.text || 'Needs LOTO assignment'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-3 text-sm font-bold text-nz-navy">Shift Roster — LOTO Availability</div>
        <div className="space-y-2">
          {SHIFT_ROSTER.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border border-nz-border px-3 py-2 text-sm">
              <span className={r.certified ? 'text-slate-700' : 'text-slate-400 line-through'}>{r.name}</span>
              <span className={`text-xs font-semibold ${r.certified ? 'text-nz-green' : 'text-nz-red'}`}>
                {r.certified ? 'Certified' : r.reason}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
