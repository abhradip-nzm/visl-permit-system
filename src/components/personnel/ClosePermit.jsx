import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, SignaturePad } from '../shared/Primitives.jsx';

const CHECKLIST_ITEMS = [
  ['controlsBack', 'All controls back in place'],
  ['interlocksRestored', 'All interlocks restored'],
  ['guardsInPlace', 'All guards in position'],
  ['permitsSurrendered', 'All permits/agreements surrendered by crew']
];

export default function ClosePermit({ navigate, params }) {
  const { currentUser, permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [checklist, setChecklist] = useState(permit.closure?.requesterChecklist || { controlsBack: false, interlocksRestored: false, guardsInPlace: false, permitsSurrendered: false });
  // 6b-3: auto-generated instead of free text, still editable if a specific
  // reference number was assigned elsewhere.
  const [tbtRef, setTbtRef] = useState(() => permit.closure?.toolboxTalkRefNo || `TBT-${1000 + Math.floor(Math.random() * 9000)}`);
  const [signed, setSigned] = useState(null);

  const allChecked = Object.values(checklist).every(Boolean);

  function submit() {
    const now = { name: currentUser.name, timestamp: 'Just now' };
    setSigned(now);
    updatePermit(permit.id, {
      status: 'pending-closure',
      closure: { ...permit.closure, requesterChecklist: checklist, toolboxTalkRefNo: tbtRef, requesterSigned: now, requesterDate: 'Today', requesterTime: 'Just now' }
    });
    addTimelineEvent(permit.id, 'Job Execution completed', currentUser.name);
    addTimelineEvent(permit.id, 'Closure submitted — awaiting Approver verification', currentUser.name);
    pushToast(`${permit.id} closure submitted for Approver verification`);
    setTimeout(() => navigate('mytasks'), 900);
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('detail', { id: permit.id })} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <div className="mb-4 text-lg font-bold text-nz-navy">Close Permit — {permit.id}</div>

      <Card className="mb-4 p-4">
        <SectionLabel>M. Area Clearance — Closure Checklist</SectionLabel>
        <div className="space-y-2">
          {CHECKLIST_ITEMS.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-lg border border-nz-border px-3 py-2.5 text-sm text-slate-700">
              <input type="checkbox" checked={checklist[key]} onChange={(e) => setChecklist((c) => ({ ...c, [key]: e.target.checked }))} />
              {label}
            </label>
          ))}
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Toolbox Talk Reference No</SectionLabel>
        {permit.closure?.toolboxTalkRefNo && (
          <p className="mb-2 text-xs text-slate-400">Carried over from the Toolbox Talk Attendance Record — edit if a different reference applies.</p>
        )}
        <input value={tbtRef} onChange={(e) => setTbtRef(e.target.value)} placeholder="e.g. TBT-0562" className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
      </Card>

      <Card className="mb-4 p-4">
        <div className="mb-3 rounded-lg bg-nz-surface p-3 text-sm italic text-slate-600">
          "We certify that job has been completed; all men and materials have been removed and the plant / Equipment guards has been normalised."
        </div>
        <SignaturePad signed={signed} onSign={() => {}} label="Tap to sign closure" />
      </Card>

      <Button variant="orange" size="lg" className="w-full" disabled={!allChecked || !tbtRef.trim() || !!signed} onClick={submit}>
        {signed ? <><CheckCircle2 size={16} /> Submitted</> : 'Submit Closure for Approver Verification →'}
      </Button>
      {!allChecked && <div className="mt-2 text-center text-xs text-slate-400">Complete the checklist above to submit.</div>}
    </div>
  );
}
