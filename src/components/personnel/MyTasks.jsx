import React, { useState } from 'react';
import { Plus, ChevronRight, Clock, ArrowLeftRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge } from '../shared/Primitives.jsx';
import WorkflowStrip from '../shared/WorkflowStrip.jsx';

const STATUS_TABS = [
  'All', 'Draft', 'Pending Declaration', 'Pending Clearance', 'Pending Approval',
  'Pending Isolation', 'Live', 'Pending Closure', 'Closed', 'Returned'
];
const STATUS_TAB_MAP = {
  draft: 'Draft', 'pending-declaration': 'Pending Declaration',
  'pending-clearance': 'Pending Clearance', 'pending-approval': 'Pending Approval', 'pending-isolation': 'Pending Isolation',
  live: 'Live', 'pending-closure': 'Pending Closure',
  closed: 'Closed', returned: 'Returned'
};
const ACTION_STATUSES = ['draft', 'pending-declaration', 'live', 'returned'];

export default function MyTasks({ navigate }) {
  const { currentUser, permits } = useApp();
  const [tab, setTab] = useState('All');

  const mine = permits.filter((p) => p.requester === currentUser.name);
  const filtered = tab === 'All' ? mine : mine.filter((p) => STATUS_TAB_MAP[p.status] === tab);
  const myActionCount = mine.filter((p) => ACTION_STATUSES.includes(p.status)).length;
  const closureCount = mine.filter((p) => p.status === 'pending-closure').length;
  const transferredToMe = permits.filter((p) => p.transfers?.some((t) => t.transferredTo === currentUser.name) && p.status === 'live');

  return (
    <div className="px-4 py-4">
      <div className="mb-3 overflow-x-auto">
        <WorkflowStrip activeRole="personnel" />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl2 border border-nz-border bg-white p-3">
          <div className="text-[10px] font-semibold uppercase text-slate-400">Pending My Action</div>
          <div className="mt-1 text-2xl font-extrabold text-nz-amber">{myActionCount}</div>
        </div>
        <div className="rounded-xl2 border border-nz-border bg-white p-3">
          <div className="text-[10px] font-semibold uppercase text-slate-400">Requiring My Closure</div>
          <div className="mt-1 text-2xl font-extrabold text-nz-orange">{closureCount}</div>
        </div>
      </div>

      {transferredToMe.length > 0 && (
        <div className="mb-4 rounded-xl2 border border-nz-blue/30 bg-nz-blue-light p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase text-nz-blue-dark"><ArrowLeftRight size={12} /> Transferred to Me</div>
          <div className="space-y-1.5">
            {transferredToMe.map((p) => (
              <button key={p.id} onClick={() => navigate('detail', { id: p.id })} className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-xs">
                <span className="font-semibold text-nz-navy">{p.id} — {p.equipment}</span>
                <ChevronRight size={13} className="text-slate-300" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              tab === t ? 'bg-nz-blue text-white' : 'bg-white text-slate-500 border border-nz-border'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate('create')}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl2 bg-nz-orange py-3.5 font-bold text-white shadow-card active:scale-[0.99]"
      >
        <Plus size={18} /> Request Task
      </button>

      <div className="space-y-3">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate('detail', { id: p.id })}
            className="flex w-full items-center justify-between rounded-xl2 border border-nz-border bg-white p-4 text-left shadow-card"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-nz-navy">{p.id}</span>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-1 text-sm text-slate-500">{(p.types || [p.type]).join(', ')} · {p.equipment}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                <Clock size={11} /> {p.location} · {p.shift} shift
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl2 border border-dashed border-nz-border bg-white py-10 text-center text-sm text-slate-400">
            No tasks in this category.
          </div>
        )}
      </div>
    </div>
  );
}
