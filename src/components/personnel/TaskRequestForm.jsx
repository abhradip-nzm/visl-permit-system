import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, Plus, Trash2, X } from 'lucide-react';
import { EQUIPMENT, SHIFT_ROSTER, emptyDeptClearances, emptyClosure } from '../../data/mockData.js';
import { PERMIT_TYPES, TOOLS_EQUIPMENT, HAZARDS_IDENTIFIED, RISK_CONTROL_GROUPS, PPE_FIRE_PROTECTION, PLANT_AREAS, WI_NUMBERS, CONTRACTORS } from '../../data/ptwFormData.js';
import { DEPARTMENTS, departmentsForTypes } from '../../data/departmentsData.js';
import { USERS } from '../../data/usersData.js';
import { Button, Card, SectionLabel } from '../shared/Primitives.jsx';
import { CheckboxGrid, Accordion } from '../shared/ChecklistGrid.jsx';
import { useApp } from '../../context/AppContext.jsx';

// Phase 2: the certified form (FRMT/MR/26 Rev 4) has one entry path — this
// fixed checkbox/dropdown wizard. "source" only ever distinguishes a blank
// form from one seeded by a real system-of-record lookup (SAP PM order);
// there is no free-text/AI-parsed prefill path anymore.
const SOURCE_LABEL = { sap: 'Auto-populated from SAP PM order' };

const SHIFT_TIMES = { Morning: ['06:00', '14:00'], Afternoon: ['14:00', '22:00'], Night: ['22:00', '06:00'] };

const HIGH_RISK_TYPES = ['Height Work', 'Confined Space', 'Crane & Lifting', 'Excavation'];

function toggleItem(list, item) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export default function TaskRequestForm({ source, prefillData, navigate, onBack }) {
  const { currentUser, pushToast, setPermits } = useApp();
  const base = prefillData || {};

  const [step, setStep] = useState('form'); // form | review
  const [types, setTypes] = useState(base.permitType ? [base.permitType] : []);
  const [jobDetails, setJobDetails] = useState({
    area: base.area || '', location: base.equipment || '', dateFrom: base.date || '', dateTill: base.date || '',
    fromTime: (SHIFT_TIMES[base.shift] || SHIFT_TIMES.Morning)[0], toTime: (SHIFT_TIMES[base.shift] || SHIFT_TIMES.Morning)[1],
    jobDescription: '', wiNo: '', ownerDepartment: base.ownerDepartment || '', contractor: '', approver: '', isolationOfficer: ''
  });
  const [toolsEquipment, setToolsEquipment] = useState([]);
  const [otherTool, setOtherTool] = useState('');
  const [hazardsIdentified, setHazardsIdentified] = useState([]);
  // M-5: a checked hazard box alone doesn't explain how it's controlled —
  // the requester must justify the specific mitigation whenever any hazard
  // is identified, on top of the general Section E control-measure grid.
  const [hazardJustification, setHazardJustification] = useState('');
  const [riskControlMeasures, setRiskControlMeasures] = useState([]);
  const [rescue, setRescue] = useState({ rescuers: [''], firstAiders: [''], procedureAvailable: false, intimationProvided: false });
  const [ppeFireProtection, setPpeFireProtection] = useState([]);
  // M-4: IT Approval-required and OHC-informed are facts about the job that
  // only the Requester can know at request time — they now declare both
  // here instead of an Approver filling them in during clearance. Whether
  // IT Approval was actually *granted* remains an Approver-owned action on
  // the Departmental Clearance screen.
  const [itApprovalRequired, setItApprovalRequired] = useState(false);
  const [ohcInformed, setOhcInformed] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [showMissingPopup, setShowMissingPopup] = useState(false);

  const isHighRisk = types.some((t) => HIGH_RISK_TYPES.includes(t));
  const isolationRequired = types.includes('Isolation & Electrical');
  const certifiedRoster = SHIFT_ROSTER.filter((p) => p.certified);

  // H-3: dynamic assignee selection — the Approver list is derived live from
  // USERS' role-capability grants (Super Admin manages that list in User
  // Management), not a hardcoded roster, and always excludes the requester
  // themselves (ties into the C-5 self-approval guard). Naming an Approver
  // is now mandatory (a required point of contact) but is not an exclusive
  // assignment — routing still lands in the department's shared clearance
  // queue for any qualified Approver, matching how Approver dashboards
  // already work (C-4).
  const availableApprovers = USERS.filter(
    (u) => u.status === 'active' && u.name !== currentUser.name && u.roles.some((r) => r.role === 'hod' && r.department === jobDetails.ownerDepartment)
  );
  const availableIsolationOfficers = USERS.filter(
    (u) => u.status === 'active' && u.name !== currentUser.name && u.roles.some((r) => r.role === 'supervisor' && r.department === jobDetails.ownerDepartment)
  );

  function updateJobDetail(key, value) {
    setJobDetails((f) => ({ ...f, [key]: value }));
  }

  // 6a-5: per-field validation so failing fields can be highlighted
  // individually, instead of one silent boolean gating the button.
  const missingFields = {
    types: types.length === 0,
    area: !jobDetails.area,
    ownerDepartment: !jobDetails.ownerDepartment,
    approver: !jobDetails.approver,
    isolationOfficer: isolationRequired && !jobDetails.isolationOfficer,
    jobDescription: !jobDetails.jobDescription.trim(),
    ppeFireProtection: ppeFireProtection.length === 0,
    hazardJustification: hazardsIdentified.length > 0 && !hazardJustification.trim()
  };
  const sectionsComplete = !Object.values(missingFields).some(Boolean);

  function tryContinue() {
    setAttemptedSubmit(true);
    if (sectionsComplete) {
      setStep('review');
    } else {
      setShowMissingPopup(true);
    }
  }

  function submit() {
    const newId = `WP-${1045 + Math.floor(Math.random() * 900)}`;
    setPermits((prev) => [
      {
        id: newId, types, type: types[0], equipment: jobDetails.location, location: jobDetails.area,
        area: jobDetails.area, shift: base.shift, requester: currentUser.name, requestor: currentUser.name,
        status: 'pending-clearance', createdAt: jobDetails.dateFrom,
        dateFrom: jobDetails.dateFrom, dateTill: jobDetails.dateTill, fromTime: jobDetails.fromTime, toTime: jobDetails.toTime,
        jobDescription: jobDetails.jobDescription, wiNo: jobDetails.wiNo, ownerDepartment: jobDetails.ownerDepartment, contractor: jobDetails.contractor,
        approver: jobDetails.approver, isolationOfficer: jobDetails.isolationOfficer,
        hazards: hazardsIdentified, ppe: ppeFireProtection, controls: riskControlMeasures,
        warnings: [], ageHours: 0, risk: isHighRisk ? 'high' : 'medium',
        toolsEquipment: otherTool ? [...toolsEquipment, otherTool] : toolsEquipment,
        hazardsIdentified, hazardJustification, riskControlMeasures, rescue, ppeFireProtection,
        deptClearances: emptyDeptClearances(
          { itApproval: { required: itApprovalRequired, granted: false, name: '' }, ohcInformed },
          departmentsForTypes(types)
        ),
        isolationRequired, isolationDetails: isolationRequired ? [{ equipment: jobDetails.location, typeOfIsolation: '', isolationPermitNo: '', isolationOfficerName: '', lotoIdNo: '', deptLockNo: '' }] : [],
        toolboxRecord: [], isolationTopicsCovered: '',
        additionalPrecautions: '', declaration: { requestorName: '', date: '', time: '', toolboxTalkConfirmed: false, signed: null },
        approval: { approverName: '', date: '', time: '', onGroundVerified: false, signed: null, rejectionReason: '' },
        criticalLift: types.includes('Crane & Lifting') ? {} : null,
        confinedSpaceMonitoring: types.includes('Confined Space') ? { gasMonitorSlNo: '', calibrationValid: false, confinedSpaceId: '', standbyPerson: rescue.rescuers.filter(Boolean).join(', '), rescuers: rescue.rescuers.filter(Boolean).join(', '), gasTests: [], personalEntryRegister: [], equipmentEntryRegister: [], specialInstructions: '' } : null,
        transfers: [], closure: emptyClosure(),
        checklist: [{ id: 1, label: 'Pre-job briefing', done: false }],
        timeline: [
          { stage: 'Created — Request & Risk Assessment', at: 'Just now', by: currentUser.name },
          { stage: 'Submitted for Departmental Clearance', at: 'Just now', by: 'System' }
        ]
      },
      ...prev
    ]);
    pushToast(`${newId} submitted for Departmental Clearance`);
    setTimeout(() => navigate('mytasks'), 900);
  }

  if (step === 'review') {
    return (
      <div className="px-4 py-4">
        <button onClick={() => setStep('form')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
          <ArrowLeft size={15} /> Back to form
        </button>
        <h2 className="mb-1 text-lg font-bold text-nz-navy">Review Before Submitting</h2>
        <p className="mb-4 text-sm text-slate-500">Confirm every section is correct — this goes to Departmental Clearance next.</p>

        <SummaryCard title="A. Type of Permit" items={types} />
        <Card className="mb-3 p-3 text-xs text-slate-600">
          <div className="mb-1 font-bold text-nz-navy">B. Job Details</div>
          <div>Area: {jobDetails.area} · Location: {jobDetails.location}</div>
          <div>{jobDetails.dateFrom} {jobDetails.fromTime} → {jobDetails.dateTill} {jobDetails.toTime}</div>
          <div>WI No: {jobDetails.wiNo || '— (JSA required, see HOD/Plant Head)'}</div>
          <div>Owner Dept: {jobDetails.ownerDepartment}{jobDetails.contractor && jobDetails.contractor !== 'N/A' && ` · Contractor: ${jobDetails.contractor}`}</div>
          <div>Approver: {jobDetails.approver}</div>
          {jobDetails.isolationOfficer && <div>Isolation Officer: {jobDetails.isolationOfficer}</div>}
          <div>IT Approval required: {itApprovalRequired ? 'Yes' : 'No'} · OHC informed: {ohcInformed ? 'Yes' : 'No'}</div>
          <div className="mt-1">{jobDetails.jobDescription}</div>
        </Card>
        <SummaryCard title="C. Tools & Equipment" items={toolsEquipment.concat(otherTool ? [otherTool] : [])} />
        <SummaryCard title="D. Hazards Identified" items={hazardsIdentified} tone="red" />
        {hazardJustification.trim() && (
          <Card className="mb-3 p-3 text-xs text-slate-600">
            <div className="mb-1 font-bold text-nz-navy">Hazard Justification</div>
            <div>{hazardJustification}</div>
          </Card>
        )}
        <SummaryCard title="E. Risk Control Measures" items={riskControlMeasures} tone="green" />
        {(rescue.rescuers.some(Boolean) || rescue.firstAiders.some(Boolean)) && (
          <Card className="mb-3 p-3 text-xs text-slate-600">
            <div className="mb-1 font-bold text-nz-navy">Rescue Provisions</div>
            <div>Rescuer(s): {rescue.rescuers.filter(Boolean).join(', ') || '—'} · First Aider(s): {rescue.firstAiders.filter(Boolean).join(', ') || '—'}</div>
            <div>Rescue procedure available: {rescue.procedureAvailable ? 'Yes' : 'No'} · Rescuer intimated: {rescue.intimationProvided ? 'Yes' : 'No'}</div>
          </Card>
        )}
        <SummaryCard title="F. PPE & Fire Protection" items={ppeFireProtection} tone="blue" />

        <div className="mb-3 rounded-lg bg-nz-surface px-3 py-2.5 text-xs text-slate-600">
          <span className="font-bold text-nz-navy">Departments required to clear this permit: </span>
          {departmentsForTypes(types).length ? departmentsForTypes(types).join(', ') : 'None — select a permit type to determine this'}
        </div>

        {isolationRequired && (
          <div className="mb-3 rounded-lg bg-nz-blue-light px-3 py-2.5 text-xs font-medium text-nz-blue-dark">
            This permit includes Isolation & Electrical work — Isolation Setup will be required before Declaration.
          </div>
        )}

        <Button variant="orange" size="lg" className="w-full" onClick={submit}>
          <CheckCircle2 size={16} /> Submit for Departmental Clearance →
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      {SOURCE_LABEL[source] && (
        <div className="mb-4 rounded-lg bg-nz-blue-light px-3 py-2 text-xs font-medium text-nz-blue-dark">
          {SOURCE_LABEL[source]} — verify every section before submitting.
        </div>
      )}

      {/* Section A */}
      <Card className={`mb-3 p-4 ${attemptedSubmit && missingFields.types ? 'border border-nz-red' : ''}`}>
        <SectionLabel>A. Type of Permit {attemptedSubmit && missingFields.types && <span className="text-nz-red">*</span>}</SectionLabel>
        <p className="mb-2 text-xs text-slate-400">Select all that apply — a job can involve multiple permit types simultaneously.</p>
        <CheckboxGrid items={PERMIT_TYPES} selected={types} onToggle={(t) => setTypes((prev) => toggleItem(prev, t))} />
      </Card>

      {/* Section B */}
      <Card className="mb-3 p-4">
        <SectionLabel>B. Job Details</SectionLabel>
        <div className="space-y-3">
          <SelectField label="Area" value={jobDetails.area} onChange={(v) => updateJobDetail('area', v)} options={PLANT_AREAS} error={attemptedSubmit && missingFields.area} required />
          <SelectField label="Equipment / Location" value={jobDetails.location} onChange={(v) => updateJobDetail('location', v)} options={EQUIPMENT.map((e) => e.name)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date From" type="date" value={jobDetails.dateFrom} onChange={(v) => updateJobDetail('dateFrom', v)} />
            <Field label="Date Till" type="date" value={jobDetails.dateTill} onChange={(v) => updateJobDetail('dateTill', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From Time" type="time" value={jobDetails.fromTime} onChange={(v) => updateJobDetail('fromTime', v)} />
            <Field label="To Time" type="time" value={jobDetails.toTime} onChange={(v) => updateJobDetail('toTime', v)} />
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Job Description<span className="text-nz-red"> *</span></span>
            <textarea
              rows={2}
              value={jobDetails.jobDescription}
              onChange={(e) => updateJobDetail('jobDescription', e.target.value)}
              placeholder="Describe the job scope…"
              className={`w-full rounded-lg border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white ${attemptedSubmit && missingFields.jobDescription ? 'border-nz-red' : 'border-nz-border'}`}
            />
          </label>
          <SelectField label="WI No (Work Instruction)" value={jobDetails.wiNo} onChange={(v) => updateJobDetail('wiNo', v)} options={WI_NUMBERS} />
          {jobDetails.wiNo === 'Not available (JSA required)' && <span className="block text-[11px] text-nz-amber">Prepare JSA and get HOD/Plant Head & Safety approval.</span>}
          <SelectField
            label="Owner Department"
            value={jobDetails.ownerDepartment}
            onChange={(v) => setJobDetails((f) => ({ ...f, ownerDepartment: v, approver: '', isolationOfficer: '' }))}
            options={DEPARTMENTS.map((d) => d.key)}
            error={attemptedSubmit && missingFields.ownerDepartment}
            required
          />
          <SelectField
            label="Approver"
            value={jobDetails.approver}
            onChange={(v) => updateJobDetail('approver', v)}
            options={availableApprovers.map((u) => u.name)}
            placeholder={jobDetails.ownerDepartment ? 'Select an Approver…' : 'Select Owner Department first'}
            error={attemptedSubmit && missingFields.approver}
            required
          />
          {isolationRequired && (
            <SelectField
              label="Isolation Officer"
              value={jobDetails.isolationOfficer}
              onChange={(v) => updateJobDetail('isolationOfficer', v)}
              options={availableIsolationOfficers.map((u) => u.name)}
              placeholder={jobDetails.ownerDepartment ? 'Select an Isolation Officer…' : 'Select Owner Department first'}
              error={attemptedSubmit && missingFields.isolationOfficer}
              required
            />
          )}
          <SelectField label="Contractor (if external)" value={jobDetails.contractor} onChange={(v) => updateJobDetail('contractor', v)} options={CONTRACTORS} />
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input type="checkbox" checked={itApprovalRequired} onChange={(e) => setItApprovalRequired(e.target.checked)} />
            IT Approval required for this job?
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input type="checkbox" checked={ohcInformed} onChange={(e) => setOhcInformed(e.target.checked)} />
            OHC informed (road blockage)?
          </label>
          <div className="rounded-lg bg-nz-surface px-3 py-2 text-xs text-slate-500">Permit Requestor: <span className="font-semibold text-nz-navy">{currentUser.name}</span> (auto-filled from login)</div>
        </div>
      </Card>

      {/* Section C */}
      <Card className="mb-3 p-4">
        <SectionLabel>C. Tools & Equipment to be Used</SectionLabel>
        <CheckboxGrid items={TOOLS_EQUIPMENT} selected={toolsEquipment} onToggle={(t) => setToolsEquipment((prev) => toggleItem(prev, t))} />
        <label className="mt-2 block">
          <span className="mb-1 block text-xs font-semibold text-slate-500">Other (specify)</span>
          <input value={otherTool} onChange={(e) => setOtherTool(e.target.value)} className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
        </label>
      </Card>

      {/* Section D */}
      <Card className="mb-3 p-4">
        <SectionLabel>D. Hazards Identified</SectionLabel>
        <CheckboxGrid items={HAZARDS_IDENTIFIED} selected={hazardsIdentified} onToggle={(h) => setHazardsIdentified((prev) => toggleItem(prev, h))} />
        {hazardsIdentified.length > 0 && (
          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">
              Hazard Justification — how will {hazardsIdentified.join(', ')} be controlled beyond Section E?
            </span>
            <textarea
              rows={2}
              value={hazardJustification}
              onChange={(e) => setHazardJustification(e.target.value)}
              placeholder="Explain the specific mitigation for the hazards identified above…"
              className={`w-full rounded-lg border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white ${attemptedSubmit && missingFields.hazardJustification ? 'border-nz-red' : 'border-nz-border'}`}
            />
          </label>
        )}
      </Card>

      {/* Section E */}
      <Card className="mb-3 p-4">
        <SectionLabel>E. Risk Control Measures</SectionLabel>
        <div className="space-y-2">
          {RISK_CONTROL_GROUPS.map((g) => {
            const count = g.items.filter((i) => riskControlMeasures.includes(i)).length;
            return (
              <Accordion key={g.group} title={g.group} badge={count}>
                <CheckboxGrid items={g.items} selected={riskControlMeasures} onToggle={(c) => setRiskControlMeasures((prev) => toggleItem(prev, c))} />
              </Accordion>
            );
          })}
        </div>

        <div className="mt-3 rounded-lg border border-nz-border bg-nz-surface p-3">
          <div className="mb-2 text-xs font-bold uppercase text-slate-400">Rescue Provisions (mandatory for high-risk jobs)</div>
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 text-xs font-semibold text-slate-500">Name of Rescuer</div>
              <div className="space-y-2">
                {rescue.rescuers.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={name}
                      onChange={(e) => setRescue((r) => ({ ...r, rescuers: r.rescuers.map((n, idx) => (idx === i ? e.target.value : n)) }))}
                      className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring"
                    >
                      <option value="">Select a certified rescuer…</option>
                      {certifiedRoster.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                    {rescue.rescuers.length > 1 && (
                      <button onClick={() => setRescue((r) => ({ ...r, rescuers: r.rescuers.filter((_, idx) => idx !== i) }))}>
                        <Trash2 size={14} className="text-nz-red" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setRescue((r) => ({ ...r, rescuers: [...r.rescuers, ''] }))} className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-nz-blue">
                <Plus size={13} /> Add More
              </button>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-semibold text-slate-500">Name of First Aider</div>
              <div className="space-y-2">
                {rescue.firstAiders.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={name}
                      onChange={(e) => setRescue((r) => ({ ...r, firstAiders: r.firstAiders.map((n, idx) => (idx === i ? e.target.value : n)) }))}
                      className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring"
                    >
                      <option value="">Select a certified first aider…</option>
                      {certifiedRoster.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                    {rescue.firstAiders.length > 1 && (
                      <button onClick={() => setRescue((r) => ({ ...r, firstAiders: r.firstAiders.filter((_, idx) => idx !== i) }))}>
                        <Trash2 size={14} className="text-nz-red" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setRescue((r) => ({ ...r, firstAiders: [...r.firstAiders, ''] }))} className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-nz-blue">
                <Plus size={13} /> Add More
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" checked={rescue.procedureAvailable} onChange={(e) => setRescue((r) => ({ ...r, procedureAvailable: e.target.checked }))} />
              Rescue Procedure Available for this job?
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" checked={rescue.intimationProvided} onChange={(e) => setRescue((r) => ({ ...r, intimationProvided: e.target.checked }))} />
              Intimation provided to Rescuer?
            </label>
          </div>
        </div>

        {isHighRisk && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-nz-red/30 bg-nz-red-light px-3 py-2.5 text-xs font-medium text-nz-red">
            <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
            For High Risk Jobs (Height, Confined, Critical Lift, Excavation &gt;1.5m) at dark hour / extreme weather — take written email approval from Plant Head with CC Safety Dept.
          </div>
        )}
      </Card>

      {/* Section F */}
      <Card className={`mb-4 p-4 ${attemptedSubmit && missingFields.ppeFireProtection ? 'border border-nz-red' : ''}`}>
        <SectionLabel>F. PPE & Fire Protection {attemptedSubmit && missingFields.ppeFireProtection && <span className="text-nz-red">*</span>}</SectionLabel>
        <CheckboxGrid items={PPE_FIRE_PROTECTION} selected={ppeFireProtection} onToggle={(p) => setPpeFireProtection((prev) => toggleItem(prev, p))} columns={3} />
      </Card>

      <Button variant="orange" size="lg" className="w-full" onClick={tryContinue}>
        Review & Continue →
      </Button>

      {showMissingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowMissingPopup(false)}>
          <div className="w-full max-w-sm rounded-xl2 bg-white p-5 shadow-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-nz-red">
                <AlertTriangle size={17} /> Missing Required Values
              </div>
              <button onClick={() => setShowMissingPopup(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-500">Fill in every field marked in red before continuing. Scroll up to review each section.</p>
            <Button variant="primary" className="mt-4 w-full" onClick={() => setShowMissingPopup(false)}>OK</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', error = false, required = false }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}{required && <span className="text-nz-red"> *</span>}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-nz-surface px-3 py-2 text-sm font-medium text-nz-navy focus-ring focus:bg-white ${error ? 'border-nz-red' : 'border-nz-border'}`}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder = 'Select…', error = false, required = false }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}{required && <span className="text-nz-red"> *</span>}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-nz-surface px-3 py-2 text-sm font-medium text-nz-navy focus-ring focus:bg-white ${error ? 'border-nz-red' : 'border-nz-border'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function SummaryCard({ title, items, tone = 'blue' }) {
  const tones = {
    red: 'bg-nz-red-light text-nz-red border-nz-red/20',
    blue: 'bg-nz-blue-light text-nz-blue border-nz-blue/20',
    green: 'bg-nz-green-light text-nz-green border-nz-green/20'
  };
  return (
    <Card className="mb-3 p-3">
      <div className="mb-1.5 text-xs font-bold text-nz-navy">{title}</div>
      {items.length === 0 ? (
        <div className="text-xs italic text-slate-400">None selected</div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((it) => (
            <span key={it} className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>{it}</span>
          ))}
        </div>
      )}
    </Card>
  );
}
