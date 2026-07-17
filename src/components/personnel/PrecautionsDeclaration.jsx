import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { needsClearance } from '../../data/departmentsData.js';
import { USERS } from '../../data/usersData.js';
import { Card, SectionLabel, Button, SignaturePad } from '../shared/Primitives.jsx';

function emptyAttendee(w) {
  return { name: w?.name || '', company: 'Vedanta', gatePassId: '', isolationKeyId: w?.personalLockId || '', signed: false };
}

// Phase 9: Precautions & Declaration is where the Requester assigns the
// crew AND completes the certified Toolbox Talk Attendance Record in one
// pass — not a separate later step. The attendance table's Isolation Key
// ID column is auto-filled from the personal lock registry (each Worker
// has exactly one, permanently associated with their account — see
// personalLockRegisterData.js) and always visible for consistency, whether
// or not this permit needs isolation. Signing this screen is both the
// declaration and the Requestor/Trainer acknowledgement for the TBT
// record. The generated reference number is written into Section M
// (Closure) so ClosePermit.jsx doesn't need a second, disconnected one.
export default function PrecautionsDeclaration({ navigate, params }) {
  const { currentUser, permits, updatePermit, addTimelineEvent, pushToast, personalLockRegister } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const existing = permit.tbtRecord;

  const [precautions, setPrecautions] = useState(permit.additionalPrecautions || '');
  const [refNo] = useState(existing?.refNo || permit.closure?.toolboxTalkRefNo || `TBT-${1000 + Math.floor(Math.random() * 9000)}`);
  const [jobDescription, setJobDescription] = useState(existing?.jobDescription || permit.jobDescription || '');
  const [attendees, setAttendees] = useState(
    existing?.attendees?.length ? existing.attendees : (permit.workers?.length ? permit.workers.map(emptyAttendee) : [emptyAttendee()])
  );
  const [topicsA, setTopicsA] = useState(existing?.topicsCoveredA || '');
  const [topicsB, setTopicsB] = useState(existing?.topicsCoveredB || '');
  const [confirmed, setConfirmed] = useState(false);
  const [signed, setSigned] = useState(null);

  // Phase 9: the Safety Officer is a pure observer now — no gate here.
  // Clearance is conditional: Excavation-type or Production-department
  // permits go to the HOD, everything else skips straight to Approval.
  const goesToClearance = needsClearance(permit.types || [permit.type]);

  const workerRoster = USERS.filter((u) => u.status === 'active' && u.roles.some((r) => r.role === 'worker'));

  function selectAttendeeName(i, name) {
    const lock = personalLockRegister.find((l) => l.ownerName === name);
    setAttendees((prev) => prev.map((a, idx) => (idx === i ? { ...a, name, isolationKeyId: lock?.id || '' } : a)));
  }

  function updateAttendee(i, key, value) {
    setAttendees((prev) => prev.map((a, idx) => (idx === i ? { ...a, [key]: value } : a)));
  }

  const canSubmit = confirmed && attendees.some((a) => a.name) && !!jobDescription.trim();

  function submit() {
    const now = { name: currentUser.name, timestamp: 'Just now' };
    setSigned(now);
    const namedAttendees = attendees.filter((a) => a.name);
    updatePermit(permit.id, {
      additionalPrecautions: precautions,
      jobDescription,
      declaration: { requestorName: currentUser.name, date: 'Today', time: 'Just now', toolboxTalkConfirmed: true, signed: now },
      workers: namedAttendees.map((a) => ({ name: a.name, personalLockId: a.isolationKeyId, applied: false, appliedAt: null })),
      tbtRecord: {
        refNo,
        attendees: namedAttendees,
        topicsCoveredA: topicsA,
        topicsCoveredB: topicsB,
        jobDescription,
        requestor: { name: currentUser.name, date: 'Today', time: 'Just now', signed: now }
      },
      closure: { ...permit.closure, toolboxTalkRefNo: refNo },
      status: goesToClearance ? 'pending-clearance' : 'pending-approval'
    });
    addTimelineEvent(permit.id, `Precautions & Declaration signed — Toolbox Talk ${refNo}`, currentUser.name);
    addTimelineEvent(permit.id, goesToClearance ? 'Awaiting Departmental Clearance' : 'Awaiting Approval', 'System');
    pushToast(`${permit.id} submitted for ${goesToClearance ? 'Departmental Clearance' : 'Approval'}`);
    setTimeout(() => navigate('mytasks'), 900);
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('detail', { id: permit.id })} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <Card className="mb-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-nz-navy">Precautions & Declaration — {permit.id}</div>
            <div className="text-xs text-slate-500">Includes the Toolbox Talk Attendance Record</div>
          </div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Vedanta Sesa Goa" className="h-9 w-9 object-contain" />
            <div className="text-right text-xs">
              <div className="font-semibold text-slate-500">TBT Reference No.</div>
              <div className="font-bold text-nz-orange">{refNo}</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>I. Additional Precautions to be Taken</SectionLabel>
        <p className="mb-2 text-xs text-slate-400">Note any site-specific or job-specific precautions not covered in Section E — unusual site conditions, weather, concurrent work hazards.</p>
        <textarea rows={4} value={precautions} onChange={(e) => setPrecautions(e.target.value)} className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring" />
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Job Description</SectionLabel>
        <textarea
          rows={2}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white"
        />
      </Card>

      <Card className="mb-4 overflow-x-auto p-4">
        <SectionLabel>Toolbox Talk Attendance — Assign Workers</SectionLabel>
        <p className="mb-2 text-xs text-slate-400">
          Each worker's Isolation Key ID is fixed to their account and applies only after the Isolation Officer's master lock is on.
        </p>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-nz-border uppercase text-slate-400">
              <th className="py-2 pr-2">Sl.No</th>
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2">Company Name</th>
              <th className="py-2 pr-2">Gate Pass No / Employee ID</th>
              <th className="py-2 pr-2">Isolation Key ID</th>
              <th className="py-2 pr-2">Signature</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {attendees.map((a, i) => (
              <tr key={i} className="border-b border-nz-border/60 last:border-0">
                <td className="py-2 pr-2 font-semibold text-slate-500">{i + 1}</td>
                <td className="py-2 pr-2">
                  <select value={a.name} onChange={(e) => selectAttendeeName(i, e.target.value)} className="w-32 rounded-md border border-nz-border bg-white px-2 py-1.5 text-xs focus-ring">
                    <option value="">Select…</option>
                    {workerRoster.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <input value={a.company} onChange={(e) => updateAttendee(i, 'company', e.target.value)} className="w-24 rounded-md border border-nz-border px-2 py-1.5 text-xs focus-ring" />
                </td>
                <td className="py-2 pr-2">
                  <input value={a.gatePassId} onChange={(e) => updateAttendee(i, 'gatePassId', e.target.value)} placeholder="—" className="w-28 rounded-md border border-nz-border px-2 py-1.5 text-xs focus-ring" />
                </td>
                <td className="py-2 pr-2">
                  <div className="w-24 rounded-md border border-nz-border bg-nz-surface px-2 py-1.5 text-center text-slate-500">{a.isolationKeyId || '—'}</div>
                </td>
                <td className="py-2 pr-2">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={a.signed} onChange={(e) => updateAttendee(i, 'signed', e.target.checked)} />
                    <span className="text-slate-500">{a.signed ? 'Signed' : '—'}</span>
                  </label>
                </td>
                <td className="py-2">
                  {attendees.length > 1 && (
                    <button onClick={() => setAttendees((prev) => prev.filter((_, idx) => idx !== i))}>
                      <Trash2 size={13} className="text-nz-red" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setAttendees((prev) => [...prev, emptyAttendee()])} className="mt-2 flex items-center gap-1 text-xs font-semibold text-nz-blue">
          <Plus size={13} /> Add worker
        </button>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <Card className="p-4">
          <SectionLabel>Topics Covered — I</SectionLabel>
          <textarea rows={3} value={topicsA} onChange={(e) => setTopicsA(e.target.value)} className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
        </Card>
        <Card className="p-4">
          <SectionLabel>Topics Covered — II</SectionLabel>
          <textarea rows={3} value={topicsB} onChange={(e) => setTopicsB(e.target.value)} className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
        </Card>
      </div>

      <Card className="mb-4 p-4">
        <SectionLabel>J. Permit Requestor & Declaration</SectionLabel>
        <div className="mb-3 rounded-lg bg-nz-surface p-3 text-sm italic text-slate-600">
          "I certify that all hazards and risk have identified / assessed and controlled adequately. All hazard and risk control measures mentioned herein are communicated to all persons working / impacted through tool box talk."
        </div>
        <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          I have conducted the toolbox talk with all crew members
        </label>
        <div className="mb-3 text-xs text-slate-400">Requestor / Trainer: <span className="font-semibold text-nz-navy">{currentUser.name}</span> · Date/Time: auto-filled on sign</div>
        <SignaturePad signed={signed} onSign={() => {}} label="Tap to sign declaration" />
      </Card>

      <Button variant="orange" size="lg" className="w-full" disabled={!canSubmit || !!signed} onClick={submit}>
        {signed ? <><CheckCircle2 size={16} /> Submitted</> : `Sign & Submit for ${goesToClearance ? 'Departmental Clearance' : 'Approval'} →`}
      </Button>
    </div>
  );
}
