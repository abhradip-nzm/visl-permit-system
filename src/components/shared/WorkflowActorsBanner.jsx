import React from 'react';
import { History, ArrowRightCircle } from 'lucide-react';
import { getLastActor, getNextActor } from '../../utils/workflowActors.js';

// Shown on every permit detail/action screen so whoever's looking always
// sees who just acted and who's up next — a Requester waiting on Approval
// sees the Approver's name, an Approver reviewing sees who created the
// permit and who picks it up after they sign, a Worker closing out sees
// whether it's the Isolation Officer or the Approver next.
export default function WorkflowActorsBanner({ permit }) {
  const last = getLastActor(permit);
  const next = getNextActor(permit);
  if (!last && !next) return null;

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
      {next && (
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
