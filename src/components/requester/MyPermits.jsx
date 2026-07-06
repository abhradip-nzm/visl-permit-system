import React, { useState } from 'react';
import { Plus, ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge } from '../shared/Primitives.jsx';

const TABS = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected', 'Active'];

const STATUS_TAB_MAP = {
  draft: 'Draft',
  'pending-approval': 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
  issued: 'Active',
  active: 'Active',
  blocked: 'Submitted',
  'closure-due': 'Active'
};

export default function MyPermits({ navigate }) {
  const { permits } = useApp();
  const [tab, setTab] = useState('All');

  const mine = permits.filter((p) => ['S. Iyer', 'A. Chatterjee'].includes(p.requester));
  const filtered = tab === 'All' ? mine : mine.filter((p) => STATUS_TAB_MAP[p.status] === tab);

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
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
        <Plus size={18} /> Create Permit
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
              <div className="mt-1 text-sm text-slate-500">{p.type} · {p.equipment}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                <Clock size={11} /> {p.location} · {p.shift} shift
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl2 border border-dashed border-nz-border bg-white py-10 text-center text-sm text-slate-400">
            No permits in this category.
          </div>
        )}
      </div>
    </div>
  );
}
