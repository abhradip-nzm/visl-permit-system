import React, { useState } from 'react';
import { Plus, X, CheckCircle2, XCircle } from 'lucide-react';
import { EQUIPMENT, PERSONNEL } from '../../data/mockData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, Button, StatusBadge } from '../shared/Primitives.jsx';

const TABS = ['Pending Approval', 'My Created Tasks', 'All Department Tasks'];

export default function TaskManagement() {
  const { tasks, updateTask, pushToast } = useApp();
  const [tab, setTab] = useState(TABS[0]);
  const [showCreate, setShowCreate] = useState(false);

  const pending = tasks.filter((t) => t.status === 'Pending');
  const created = tasks.slice(0, 3);
  const all = tasks;

  const list = tab === 'Pending Approval' ? pending : tab === 'My Created Tasks' ? created : all;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between border-b border-nz-border">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold ${tab === t ? 'border-b-2 border-nz-blue text-nz-blue' : 'text-slate-500'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <Button variant="orange" className="mb-2" onClick={() => setShowCreate(true)}><Plus size={15} /> Create Task</Button>
      </div>

      <div className="space-y-3">
        {list.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="font-bold text-nz-navy">{t.id} — {t.description}</div>
              <StatusBadge status={t.status === 'Completed' ? 'closed' : t.status === 'Overdue' ? 'blocked' : t.status === 'In Progress' ? 'issued' : 'pending-approval'} />
            </div>
            <div className="mb-2 text-xs text-slate-500">{t.type} · {t.department} · Due {t.dueDate} · Priority {t.priority}</div>
            {tab === 'Pending Approval' && (
              <div className="flex gap-2">
                <Button variant="success" size="sm" onClick={() => { updateTask(t.id, { status: 'In Progress' }); pushToast(`${t.id} approved`); }}>
                  <CheckCircle2 size={14} /> Approve
                </Button>
                <Button variant="danger" size="sm" onClick={() => pushToast(`${t.id} rejected`, 'error')}>
                  <XCircle size={14} /> Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
        {list.length === 0 && (
          <div className="rounded-xl2 border border-dashed border-nz-border bg-white py-10 text-center text-sm text-slate-400">Nothing in this view.</div>
        )}
      </div>

      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

function CreateTaskModal({ onClose }) {
  const { pushToast } = useApp();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl2 bg-white p-5 shadow-panel">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-bold text-nz-navy">Create Task</div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-nz-surface"><X size={18} /></button>
        </div>
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Task Type</span>
            <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
              <option>Maintenance</option>
              <option>Inspection</option>
              <option>Other</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Description</span>
            <textarea rows={2} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Equipment</span>
              <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                {EQUIPMENT.map((e) => <option key={e.id}>{e.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Priority</span>
              <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Assign To</span>
              <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                {PERSONNEL.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 pt-6 text-xs font-semibold text-slate-500">
              <input type="checkbox" /> LOTO Required
            </label>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { pushToast('Task created'); onClose(); }}>Create Task</Button>
        </div>
      </div>
    </div>
  );
}
