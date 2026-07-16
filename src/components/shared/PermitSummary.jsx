import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, SectionLabel } from './Primitives.jsx';

function Tags({ items, tone = 'blue' }) {
  const tones = {
    red: 'bg-nz-red-light text-nz-red border-nz-red/20',
    blue: 'bg-nz-blue-light text-nz-blue border-nz-blue/20',
    green: 'bg-nz-green-light text-nz-green border-nz-green/20'
  };
  if (!items || items.length === 0) return <div className="text-xs italic text-slate-400">None recorded</div>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span key={it} className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>{it}</span>
      ))}
    </div>
  );
}

// Full read-only Sections A-F summary, collapsible so it doesn't dominate
// screens where the approver/clearance-giver mainly needs the action area.
export default function PermitSummary({ permit, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="mb-4 overflow-hidden p-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <SectionLabel>Full Permit Summary (Sections A–F)</SectionLabel>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-3 border-t border-nz-border p-4">
          <div>
            <div className="mb-1 text-xs font-bold text-nz-navy">A. Type of Permit</div>
            <Tags items={permit.types || [permit.type]} />
          </div>
          <div className="text-xs text-slate-600">
            <div className="mb-1 text-xs font-bold text-nz-navy">B. Job Details</div>
            <div>Area: {permit.area || permit.location} · Location: {permit.equipment}</div>
            <div>{permit.dateFrom} {permit.fromTime} → {permit.dateTill} {permit.toTime}</div>
            <div>WI No: {permit.wiNo || '— (JSA required)'} · Owner Dept: {permit.ownerDepartment}</div>
            {permit.contractor && <div>Contractor: {permit.contractor}</div>}
            {permit.preferredApprover && <div>Preferred Approver: {permit.preferredApprover}</div>}
            <div className="mt-1">{permit.jobDescription}</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-bold text-nz-navy">C. Tools & Equipment</div>
            <Tags items={permit.toolsEquipment} />
          </div>
          <div>
            <div className="mb-1 text-xs font-bold text-nz-navy">D. Hazards Identified</div>
            <Tags items={permit.hazardsIdentified || permit.hazards} tone="red" />
            {permit.hazardJustification && <div className="mt-1 text-xs text-slate-500">Justification: {permit.hazardJustification}</div>}
          </div>
          <div>
            <div className="mb-1 text-xs font-bold text-nz-navy">E. Risk Control Measures</div>
            <Tags items={permit.riskControlMeasures || permit.controls} tone="green" />
            {permit.rescue && (permit.rescue.rescuers?.length > 0 || permit.rescue.firstAiders?.length > 0) && (
              <div className="mt-1.5 text-xs text-slate-500">
                Rescuer(s): {permit.rescue.rescuers?.length ? permit.rescue.rescuers.join(', ') : '—'} · First Aider(s): {permit.rescue.firstAiders?.length ? permit.rescue.firstAiders.join(', ') : '—'} ·
                Procedure available: {permit.rescue.procedureAvailable ? 'Yes' : 'No'}
              </div>
            )}
          </div>
          <div>
            <div className="mb-1 text-xs font-bold text-nz-navy">F. PPE & Fire Protection</div>
            <Tags items={permit.ppeFireProtection || permit.ppe} />
          </div>
          {permit.additionalPrecautions && (
            <div>
              <div className="mb-1 text-xs font-bold text-nz-navy">I. Additional Precautions</div>
              <div className="text-xs text-slate-600">{permit.additionalPrecautions}</div>
            </div>
          )}
          {permit.declaration?.signed && (
            <div>
              <div className="mb-1 text-xs font-bold text-nz-navy">J. Declaration & Toolbox Talk</div>
              <div className="text-xs text-slate-600">Signed by {permit.declaration.signed.name} on {permit.declaration.signed.timestamp}</div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
