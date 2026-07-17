import React from 'react';
import { LifeBuoy, Cross } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, StatusBadge } from './Primitives.jsx';
import PTWStepper from './PTWStepper.jsx';

const ICONS = { rescuers: LifeBuoy, firstAiders: Cross };

// Shared by Rescuer and First Aider — both are new fixed, standby roles that
// only need to see which permits list them as the named rescue/first-aid
// contact (Section rescue provision, filled by the Requester), not a full
// action queue.
export default function StandbyDashboard({ field, roleLabel }) {
  const { permits, currentUser } = useApp();
  const Icon = ICONS[field] || LifeBuoy;
  const mine = permits.filter((p) => p.status !== 'closed' && p.status !== 'draft' && p.rescue?.[field]?.includes(currentUser.name));

  return (
    <div>
      <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-nz-blue-light px-3 py-2 text-xs font-semibold text-nz-blue-dark">
        <Icon size={13} /> Permits where you're named as the {roleLabel} standby contact.
      </div>

      <Card>
        <div className="divide-y divide-nz-border/60">
          {mine.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-semibold text-nz-navy">{p.id} — {p.equipment}</div>
                <div className="text-xs text-slate-400">{p.location} · {p.requester} · {p.shift} shift</div>
                <div className="mt-1"><PTWStepper permit={p} compact /></div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
          {mine.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-slate-400">No current assignments.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
