import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ANNOUNCEMENTS } from '../../data/announcementsData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, Button, StatusBadge } from '../shared/Primitives.jsx';

export default function Announcements() {
  const { pushToast } = useApp();
  const [items, setItems] = useState(ANNOUNCEMENTS);
  const [showCreate, setShowCreate] = useState(false);

  function create() {
    const next = {
      id: `AN-0${items.length + 1}`,
      title: 'New announcement',
      body: 'Draft content — edit before sending.',
      author: 'K. Verma',
      recipientScope: 'All',
      priority: 'Normal',
      status: 'Draft',
      date: '2026-07-06'
    };
    setItems((prev) => [next, ...prev]);
    pushToast('Announcement drafted');
    setShowCreate(false);
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="orange" onClick={() => setShowCreate(true)}><Plus size={15} /> Create Announcement</Button>
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="font-bold text-nz-navy">{a.title}</div>
              <StatusBadge status={a.status === 'Sent' ? 'active' : 'draft'} />
            </div>
            <div className="mb-2 text-sm text-slate-600">{a.body}</div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>{a.date}</span>
              <span>By {a.author}</span>
              <span>To: {a.recipientScope}</span>
              <span className={a.priority === 'Urgent' ? 'font-semibold text-nz-red' : ''}>{a.priority}</span>
            </div>
          </Card>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={() => setShowCreate(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl2 bg-white p-5 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-bold text-nz-navy">Create Announcement</div>
              <button onClick={() => setShowCreate(false)} className="rounded-full p-1 hover:bg-nz-surface"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Title</span>
                <input className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Body</span>
                <textarea rows={3} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Recipient</span>
                  <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                    <option>All</option>
                    <option>Role group</option>
                    <option>Team</option>
                    <option>Individual</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Priority</span>
                  <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                    <option>Normal</option>
                    <option>Urgent</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Schedule</span>
                <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                  <option>Now</option>
                  <option>Later</option>
                </select>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button variant="primary" onClick={create}>Publish</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
