import React from 'react';
import { History, ArrowRightCircle, BellRing } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { getLastActor, getNextActor } from '../../utils/workflowActors.js';

// Shown on every permit detail/action screen so whoever's looking always
// sees who just acted and who's up next — a Requester waiting on Approval
// sees the Approver's name, an Approver reviewing sees who created the
// permit and who picks it up after they sign, a Worker closing out sees
// whether it's the Isolation Officer or the Approver next.
//
// The "next up" panel names a specific person, which reads as ambiguous
// when that exact person is the one looking at the screen — showing them
// their own name back doesn't tell them anything actionable. So when the
// signed-in user IS the named next actor, this swaps to a direct "Your
// Action is Pending" call-out instead; everyone else (and that same user,
// once they've completed their step and the next actor has moved on)
// keeps seeing the normal "Next up" panel.
export default function WorkflowActorsBanner({ permit }) {
  const { currentUser } = useApp();
  const last = getLastActor(permit);
  const next = getNextActor(permit);
  if (!last && !next) return null;

  const nextNames = next?.name ? next.name.split(',').map((n) => n.trim()) : [];
  const isMyTurn = !!currentUser && nextNames.includes(currentUser.name);

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 @lg:grid-cols-2">
      {last && (
        <div className="flex items-start gap-2 rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-xs">
          <History size={13} className="mt-0.5 flex-shrink-0 text-slate-400" />
          <div className="min-w-0">
            <div className="font-semibold text-slate-500">Last action</div>
            <div className="truncate text-slate-600">
              {last.stage} — <span className="font-semibold text-nz-navy">{last.by}</span>
            </div>
            <div className="text-[10px] text-slate-400">{last.at}</div>
          </div>
        </div>
      )}
      {next && isMyTurn && (
        <div className="flex items-start gap-2 rounded-lg border border-nz-amber/40 bg-nz-amber-light px-3 py-2 text-xs">
          <BellRing size={13} className="mt-0.5 flex-shrink-0 text-nz-amber" />
          <div className="min-w-0">
            <div className="font-bold text-nz-amber">Your Action is Pending</div>
            <div className="truncate text-nz-amber">{next.label}</div>
          </div>
        </div>
      )}
      {next && !isMyTurn && (
        <div className="flex items-start gap-2 rounded-lg border border-nz-blue/30 bg-nz-blue-light px-3 py-2 text-xs">
          <ArrowRightCircle size={13} className="mt-0.5 flex-shrink-0 text-nz-blue" />
          <div className="min-w-0">
            <div className="font-semibold text-nz-blue-dark">Next up — {next.label}</div>
            <div className="truncate font-bold text-nz-blue-dark">{next.name || 'Unassigned'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
