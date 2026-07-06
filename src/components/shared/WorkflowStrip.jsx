import React from 'react';
import { ChevronRight } from 'lucide-react';
import { WORKFLOW_STAGES } from '../../data/mockData.js';
import { ROLE_LABELS } from '../../data/navConfig.js';

// Shared lifecycle breadcrumb: Request -> Review -> Approve -> Execute -> Monitor.
// `activeRole` highlights every stage owned by the current role; pass null
// (landing page) to show the whole chain unhighlighted as a flow legend.
export default function WorkflowStrip({ activeRole = null, dark = false }) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${dark ? 'text-white/70' : 'text-slate-500'}`}>
      {WORKFLOW_STAGES.map((stage, i) => {
        const isActive = activeRole && stage.role === activeRole;
        return (
          <React.Fragment key={stage.key}>
            <div
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                isActive
                  ? 'border-nz-orange/40 bg-nz-orange-light text-nz-orange'
                  : dark
                  ? 'border-white/15 bg-white/5'
                  : 'border-nz-border bg-white'
              }`}
            >
              <span>{stage.label}</span>
              <span className={isActive ? 'text-nz-orange/70' : 'text-slate-400'}>({ROLE_LABELS[stage.role]})</span>
            </div>
            {i < WORKFLOW_STAGES.length - 1 && (
              <ChevronRight size={14} className={dark ? 'text-white/30' : 'text-slate-300'} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
