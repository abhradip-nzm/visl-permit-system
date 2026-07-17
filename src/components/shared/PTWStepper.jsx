import React from 'react';
import { Check } from 'lucide-react';
import { PTW_STEPS } from '../../data/ptwFormData.js';
import { needsClearance } from '../../data/departmentsData.js';

const STATUS_ORDER = [
  'draft', 'pending-declaration', 'pending-clearance',
  'pending-approval', 'pending-isolation', 'live', 'pending-closure', 'closed'
];

// Steps 6 (Job Execution) and 7 (Shift Transfer) both live under the "live"
// status, so within that status we can't tell them apart from status alone —
// callers may pass `currentStepKey` explicitly (e.g. on the Transfer screen)
// to disambiguate; otherwise Job Execution is assumed.
export default function PTWStepper({ permit, currentStepKey = null, compact = false }) {
  if (!permit) return null;
  const isReturned = permit.status === 'returned';
  const skipIsolation = !permit.isolationRequired;
  const skipClearance = !needsClearance(permit.types || [permit.type]);
  const steps = PTW_STEPS.filter((s) => !(s.key === 'isolation' && skipIsolation) && !(s.key === 'clearance' && skipClearance));

  const statusIdx = isReturned ? 0 : STATUS_ORDER.indexOf(permit.status);
  const activeIdx = currentStepKey
    ? steps.findIndex((s) => s.key === currentStepKey)
    : steps.findIndex((s) => STATUS_ORDER.indexOf(s.status) === statusIdx);

  return (
    <div className={`flex items-center ${compact ? 'gap-1 overflow-x-auto' : 'flex-wrap gap-1.5'}`}>
      {isReturned && (
        <span className="mr-2 flex-shrink-0 rounded-full border border-nz-red/30 bg-nz-red-light px-2.5 py-1 text-xs font-bold text-nz-red">
          Returned to Requester
        </span>
      )}
      {steps.map((step, i) => {
        const done = i < activeIdx || permit.status === 'closed';
        const active = i === activeIdx && permit.status !== 'closed';
        return (
          <React.Fragment key={step.key}>
            <div
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                active
                  ? 'border-nz-orange/40 bg-nz-orange-light text-nz-orange'
                  : done
                  ? 'border-nz-green/30 bg-nz-green-light text-nz-green'
                  : 'border-nz-border bg-white text-slate-400'
              }`}
              title={step.label}
            >
              {done ? <Check size={11} /> : <span>{step.num}</span>}
              {!compact && <span>{step.label}</span>}
            </div>
            {i < steps.length - 1 && <span className="h-px w-3 flex-shrink-0 bg-nz-border" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
