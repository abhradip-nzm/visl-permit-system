import React from 'react';
import { Card, SectionLabel } from './Primitives.jsx';

// Shared read-only "G. Departmental Clearance Status" card — used anywhere
// a permit's clearance progress needs to be shown outside the HOD's own
// action screen (Requester's Task Detail, Safety Officer's read-only
// Monitor view). Names the specific HOD a pending row is waiting on
// instead of a bare "Pending", and who actually granted a cleared one.
export default function DepartmentalClearanceSummary({ permit }) {
  const rows = [
    ['Mechanical', permit.deptClearances?.Mechanical],
    ['E&I', permit.deptClearances?.['E&I']],
    ['Production', permit.deptClearances?.Production]
  ];
  return (
    <Card className="mb-4 p-4">
      <SectionLabel>G. Departmental Clearance Status</SectionLabel>
      <div className="space-y-1.5">
        {rows.map(([dept, c]) => (
          <div key={dept} className="flex items-center justify-between rounded-lg border border-nz-border px-3 py-2 text-xs">
            <span className="font-semibold text-nz-navy">{dept}</span>
            <span className={c?.status === 'cleared' ? 'text-nz-green font-semibold' : c?.status === 'not-applicable' ? 'text-slate-400' : 'text-nz-amber font-semibold'}>
              {c?.status === 'cleared'
                ? `Clearance granted by ${c.name}`
                : c?.status === 'not-applicable'
                ? 'Not Applicable'
                : c?.assignedHod
                ? `Awaiting clearance from ${c.assignedHod}`
                : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
