import React, { useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function NotificationsPanel() {
  const { currentRole, notifications, markNotificationsRead } = useApp();
  const list = notifications[currentRole] || [];

  useEffect(() => {
    const t = setTimeout(() => markNotificationsRead(currentRole), 1200);
    return () => clearTimeout(t);
  }, [currentRole, markNotificationsRead]);

  return (
    <div className="absolute right-0 z-30 mt-2 w-80 rounded-lg border border-nz-border bg-white shadow-panel animate-fadeIn">
      <div className="flex items-center justify-between border-b border-nz-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold text-nz-navy">
          <Bell size={15} /> Notifications
        </div>
        <span className="flex items-center gap-1 text-xs text-nz-green"><CheckCheck size={13} /> Live</span>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {list.length === 0 && <div className="px-4 py-6 text-center text-sm text-slate-400">No notifications yet.</div>}
        {list.map((n) => (
          <div key={n.id} className={`border-b border-nz-border/60 px-4 py-3 text-sm ${n.unread ? 'bg-nz-blue-light/40' : ''}`}>
            <div className="flex items-start gap-2">
              {n.unread && <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-nz-blue" />}
              <div className={n.unread ? 'font-medium text-slate-800' : 'text-slate-500'}>{n.text}</div>
            </div>
            <div className="mt-1 pl-3.5 text-xs text-slate-400">{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
