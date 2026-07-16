import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { USERS } from '../../data/usersData.js';
import { Card, SectionLabel, Button, SignaturePad } from '../shared/Primitives.jsx';

export default function PrecautionsDeclaration({ navigate, params }) {
  const { currentUser, permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [precautions, setPrecautions] = useState(permit.additionalPrecautions || '');
  const [safetyOfficer, setSafetyOfficer] = useState(permit.safetyOfficer || '');
  const [confirmed, setConfirmed] = useState(false);
  const [signed, setSigned] = useState(null);

  // Phase 7: the Safety Officer becomes a formal gate right after
  // Declaration — the Requester names who will review it, a required
  // point of contact (non-exclusive, matching the Approver/Isolation
  // Officer pattern), dynamically sourced from active Safety Officer
  // accounts.
  const availableSafetyOfficers = USERS.filter(
    (u) => u.status === 'active' && u.name !== currentUser.name && u.roles.some((r) => r.role === 'safety')
  );

  function submit() {
    const now = { name: currentUser.name, timestamp: 'Just now' };
    setSigned(now);
    updatePermit(permit.id, {
      additionalPrecautions: precautions,
      declaration: { requestorName: currentUser.name, date: 'Today', time: 'Just now', toolboxTalkConfirmed: true, signed: now },
      safetyOfficer,
      status: 'pending-safety-review'
    });
    addTimelineEvent(permit.id, 'Precautions & Declaration signed', currentUser.name);
    addTimelineEvent(permit.id, 'Awaiting Safety Officer Review', 'System');
    pushToast(`${permit.id} submitted for Safety Officer review`);
    setTimeout(() => navigate('mytasks'), 900);
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('detail', { id: permit.id })} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <div className="mb-4 text-lg font-bold text-nz-navy">Precautions & Declaration — {permit.id}</div>

      <Card className="mb-4 p-4">
        <SectionLabel>I. Additional Precautions to be Taken</SectionLabel>
        <p className="mb-2 text-xs text-slate-400">Note any site-specific or job-specific precautions not covered in Section E — unusual site conditions, weather, concurrent work hazards.</p>
        <textarea rows={4} value={precautions} onChange={(e) => setPrecautions(e.target.value)} className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring" />
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>J. Permit Requestor & Declaration</SectionLabel>
        <div className="mb-3 rounded-lg bg-nz-surface p-3 text-sm italic text-slate-600">
          "I certify that all hazards and risk have identified / assessed and controlled adequately. All hazard and risk control measures mentioned herein are communicated to all persons working / impacted through tool box talk."
        </div>
        <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          I have conducted the toolbox talk with all crew members
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-semibold text-slate-500">Safety Officer<span className="text-nz-red"> *</span></span>
          <select
            value={safetyOfficer}
            onChange={(e) => setSafetyOfficer(e.target.value)}
            className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white"
          >
            <option value="">Select an available Safety Officer…</option>
            {availableSafetyOfficers.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
          </select>
        </label>
        <SignaturePad signed={signed} onSign={() => {}} label="Tap to sign declaration" />
      </Card>

      <Button variant="orange" size="lg" className="w-full" disabled={!confirmed || !safetyOfficer || !!signed} onClick={submit}>
        {signed ? <><CheckCircle2 size={16} /> Submitted</> : 'Sign & Submit for Safety Officer Review →'}
      </Button>
    </div>
  );
}
