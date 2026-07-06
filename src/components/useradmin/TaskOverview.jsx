import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, StatusBadge } from '../shared/Primitives.jsx';

const PRIORITY_TONE = { Critical: 'text-nz-red', High: 'text-nz-red', Medium: 'text-nz-amber', Low: 'text-slate-500' };
const STATUS_MAP = { Pending: 'pending-approval', 'In Progress': 'issued', Completed: 'closed', Overdue: 'blocked' };

export default function TaskOverview() {
  const { tasks } = useApp();
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const departments = ['All', ...new Set(tasks.map((t) => t.department))];
  const statuses = ['All', 'Pending', 'In Progress', 'Completed', 'Overdue'];

  const filtered = tasks.filter((t) => {
    if (deptFilter !== 'All' && t.department !== deptFilter) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    return true;
  });

  const overdue = tasks.filter((t) => t.status === 'Overdue').length;
  const assigned = tasks.filter((t) => t.assignedTo).length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;

  return (
    <div>
      <div className="mb-4 grid grid-cols-4 gap-4">
        <Stat label="Total Tasks" value={tasks.length} />
        <Stat label="Assigned" value={assigned} tone="green" />
        <Stat label="Pending" value={pending} tone="amber" />
        <Stat label="Overdue" value={overdue} tone="red" />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Task ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Priority</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} onClick={() => setSelected(t)} className="cursor-pointer border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                <td className="px-4 py-2.5 font-semibold text-nz-navy">{t.id}</td>
                <td className="px-4 py-2.5 text-slate-600">{t.type}</td>
                <td className="px-4 py-2.5 text-slate-600">{t.assignedTo || <span className="italic text-slate-400">Unassigned</span>}</td>
                <td className="px-4 py-2.5 text-slate-600">{t.department}</td>
                <td className="px-4 py-2.5"><StatusBadge status={STATUS_MAP[t.status] || 'draft'} /></td>
                <td className="px-4 py-2.5 text-slate-500">{t.dueDate}</td>
                <td className={`px-4 py-2.5 font-semibold ${PRIORITY_TONE[t.priority]}`}>{t.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-bold text-nz-navy">{selected.id}</div>
              <button onClick={() => setSelected(null)} className="rounded-full p-1 hover:bg-nz-surface"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-semibold text-slate-400">Description:</span> {selected.description}</div>
              <div><span className="font-semibold text-slate-400">Equipment:</span> {selected.equipment}</div>
              <div><span className="font-semibold text-slate-400">Linked Permit:</span> {selected.permitId || '—'}</div>
              <div><span className="font-semibold text-slate-400">LOTO Required:</span> {selected.lotoRequired ? 'Yes' : 'No'}</div>
              <div className="rounded-lg bg-nz-surface p-3">
                <div className="mb-1 text-xs font-bold uppercase text-slate-400">Assignment History</div>
                <div className="text-xs text-slate-500">Created · System</div>
                {selected.assignedTo && <div className="text-xs text-slate-500">Assigned to {selected.assignedTo}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }) {
  const tones = { green: 'text-nz-green', amber: 'text-nz-amber', red: 'text-nz-red' };
  return (
    <Card className="p-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone] || 'text-nz-navy'}`}>{value}</div>
    </Card>
  );
}
