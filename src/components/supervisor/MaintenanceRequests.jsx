import React, { useState } from 'react';
import { EQUIPMENT } from '../../data/mockData.js';
import { USERS } from '../../data/usersData.js';
import { INSTRUMENTS } from '../../data/instrumentsData.js';
import { MAINTENANCE_REQUESTS } from '../../data/tasksData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, Button, SectionLabel } from '../shared/Primitives.jsx';

// H-3: assignable personnel are derived live from USERS' role grants
// (Super Admin manages that list) instead of the old static, disconnected
// SHIFT_ROSTER array.
const ASSIGNABLE = USERS.filter((u) => u.status === 'active' && u.roles.some((r) => r.role === 'personnel'));

export default function MaintenanceRequests() {
  const { currentUser, pushToast } = useApp();
  const [requests, setRequests] = useState(MAINTENANCE_REQUESTS);
  const [form, setForm] = useState({ type: 'Maintenance', description: '', equipment: EQUIPMENT[0].name, priority: 'Medium', instrument: '', loto: false, assignTo: ASSIGNABLE[0]?.name || '' });

  function submit() {
    const next = {
      id: `MR-${300 + requests.length + 10}`,
      taskType: form.type,
      description: form.description || 'New maintenance request',
      equipment: form.equipment,
      location: EQUIPMENT.find((e) => e.name === form.equipment)?.location || '—',
      priority: form.priority,
      status: 'Submitted — awaiting Approver approval',
      submittedBy: currentUser.name,
      submittedAt: 'just now',
      lotoRequired: form.loto,
      assignedTo: form.assignTo
    };
    setRequests((prev) => [next, ...prev]);
    pushToast('Request routed to Approver for review');
    setForm((f) => ({ ...f, description: '' }));
  }

  return (
    <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3">
      <div className="@lg:col-span-2">
        <SectionLabel>My Requests</SectionLabel>
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-nz-border/60 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-nz-navy">{r.id}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.equipment}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.priority}</td>
                  <td className="px-4 py-2.5 text-xs font-semibold text-nz-amber">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="p-4">
        <SectionLabel>Create Request</SectionLabel>
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Task Type</span>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
              <option>Maintenance</option><option>Inspection</option><option>Emergency Repair</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Description</span>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Equipment / Instrument</span>
            <select value={form.equipment} onChange={(e) => setForm((f) => ({ ...f, equipment: e.target.value }))} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
              {EQUIPMENT.map((e) => <option key={e.id}>{e.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Priority</span>
            <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
              <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Attach Instrument</span>
            <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
              <option value="">None</option>
              {INSTRUMENTS.map((i) => <option key={i.id}>{i.name}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <input type="checkbox" checked={form.loto} onChange={(e) => setForm((f) => ({ ...f, loto: e.target.checked }))} /> LOTO Required
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Assign To</span>
            <select value={form.assignTo} onChange={(e) => setForm((f) => ({ ...f, assignTo: e.target.value }))} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
              {ASSIGNABLE.map((u) => <option key={u.id}>{u.name}</option>)}
            </select>
          </label>
          <Button variant="primary" className="w-full" onClick={submit}>Submit Request</Button>
        </div>
      </Card>
    </div>
  );
}
