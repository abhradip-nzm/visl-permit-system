import React, { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { NLP_SAMPLE_PARSE, OCR_SAMPLE_EXTRACTION, emptyDeptClearances, emptyClosure } from '../../data/mockData.js';
import { PERMIT_TYPES, TOOLS_EQUIPMENT, HAZARDS_IDENTIFIED, RISK_CONTROL_GROUPS, PPE_FIRE_PROTECTION } from '../../data/ptwFormData.js';
import { Button, Card, SectionLabel } from '../shared/Primitives.jsx';
import { CheckboxGrid, Accordion } from '../shared/ChecklistGrid.jsx';
import { useApp } from '../../context/AppContext.jsx';

const SOURCE_LABEL = { nlp: 'Parsed from natural language input', voice: 'Transcribed from voice input', ocr: 'Extracted via OCR from scanned permit', sap: 'Auto-populated from SAP PM order' };

const SHIFT_TIMES = { Morning: ['06:00', '14:00'], Afternoon: ['14:00', '22:00'], Night: ['22:00', '06:00'] };

const HIGH_RISK_TYPES = ['Height Work', 'Confined Space', 'Crane & Lifting', 'Excavation'];

function toggleItem(list, item) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export default function TaskRequestForm({ source, navigate, onBack }) {
  const { currentUser, pushToast, setPermits } = useApp();
  const base = source === 'ocr' ? {
    permitType: OCR_SAMPLE_EXTRACTION.permitType, equipment: OCR_SAMPLE_EXTRACTION.equipment,
    location: OCR_SAMPLE_EXTRACTION.location, date: OCR_SAMPLE_EXTRACTION.date, shift: OCR_SAMPLE_EXTRACTION.shift
  } : {
    permitType: NLP_SAMPLE_PARSE.permitType, equipment: NLP_SAMPLE_PARSE.equipment,
    location: NLP_SAMPLE_PARSE.location, date: NLP_SAMPLE_PARSE.date, shift: NLP_SAMPLE_PARSE.shift
  };
  const [fromTime, toTime] = SHIFT_TIMES[base.shift] || SHIFT_TIMES.Morning;

  const [step, setStep] = useState('form'); // form | review
  const [types, setTypes] = useState([base.permitType]);
  const [jobDetails, setJobDetails] = useState({
    area: base.location, location: base.equipment, dateFrom: base.date, dateTill: base.date,
    fromTime, toTime, jobDescription: `${base.permitType} work — ${base.equipment}`,
    wiNo: '', ownerDepartment: 'Mechanical', contractor: ''
  });
  const [toolsEquipment, setToolsEquipment] = useState([]);
  const [otherTool, setOtherTool] = useState('');
  const [hazardsIdentified, setHazardsIdentified] = useState([]);
  const [riskControlMeasures, setRiskControlMeasures] = useState([]);
  const [rescue, setRescue] = useState({ nameOfRescuer: '', nameOfFirstAider: '', procedureAvailable: false, intimationProvided: false });
  const [ppeFireProtection, setPpeFireProtection] = useState([]);

  const isHighRisk = types.some((t) => HIGH_RISK_TYPES.includes(t));
  const isolationRequired = types.includes('Isolation & Electrical');

  function updateJobDetail(key, value) {
    setJobDetails((f) => ({ ...f, [key]: value }));
  }

  const sectionsComplete = types.length > 0 && jobDetails.area && jobDetails.jobDescription && ppeFireProtection.length > 0;

  function submit() {
    const newId = `WP-${1045 + Math.floor(Math.random() * 900)}`;
    setPermits((prev) => [
      {
        id: newId, types, type: types[0], equipment: jobDetails.location, location: jobDetails.area,
        area: jobDetails.area, shift: base.shift, requester: currentUser.name, requestor: currentUser.name,
        status: 'pending-clearance', createdAt: jobDetails.dateFrom,
        dateFrom: jobDetails.dateFrom, dateTill: jobDetails.dateTill, fromTime: jobDetails.fromTime, toTime: jobDetails.toTime,
        jobDescription: jobDetails.jobDescription, wiNo: jobDetails.wiNo, ownerDepartment: jobDetails.ownerDepartment, contractor: jobDetails.contractor,
        hazards: hazardsIdentified, ppe: ppeFireProtection, controls: riskControlMeasures,
        warnings: [], ageHours: 0, risk: isHighRisk ? 'high' : 'medium',
        toolsEquipment: otherTool ? [...toolsEquipment, otherTool] : toolsEquipment,
        hazardsIdentified, riskControlMeasures, rescue, ppeFireProtection,
        deptClearances: emptyDeptClearances(), isolationRequired, isolationDetails: isolationRequired ? [{ equipment: jobDetails.location, typeOfIsolation: '', isolationPermitNo: '', isolationOfficerName: '', lotoIdNo: '', deptLockNo: '' }] : [],
        toolboxRecord: [], isolationTopicsCovered: '',
        additionalPrecautions: '', declaration: { requestorName: '', date: '', time: '', toolboxTalkConfirmed: false, signed: null },
        approval: { approverName: '', date: '', time: '', onGroundVerified: false, signed: null, rejectionReason: '' },
        criticalLift: types.includes('Crane & Lifting') ? {} : null,
        confinedSpaceMonitoring: types.includes('Confined Space') ? { gasMonitorSlNo: '', calibrationValid: false, confinedSpaceId: '', standbyPerson: rescue.nameOfRescuer, rescuers: rescue.nameOfRescuer, gasTests: [], personalEntryRegister: [], equipmentEntryRegister: [], specialInstructions: '' } : null,
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
          <div>Owner Dept: {jobDetails.ownerDepartment}{jobDetails.contractor && ` · Contractor: ${jobDetails.contractor}`}</div>
          <div className="mt-1">{jobDetails.jobDescription}</div>
        </Card>
        <SummaryCard title="C. Tools & Equipment" items={toolsEquipment.concat(otherTool ? [otherTool] : [])} />
        <SummaryCard title="D. Hazards Identified" items={hazardsIdentified} tone="red" />
        <SummaryCard title="E. Risk Control Measures" items={riskControlMeasures} tone="green" />
        {(rescue.nameOfRescuer || rescue.nameOfFirstAider) && (
          <Card className="mb-3 p-3 text-xs text-slate-600">
            <div className="mb-1 font-bold text-nz-navy">Rescue Provisions</div>
            <div>Rescuer: {rescue.nameOfRescuer || '—'} · First Aider: {rescue.nameOfFirstAider || '—'}</div>
            <div>Rescue procedure available: {rescue.procedureAvailable ? 'Yes' : 'No'} · Rescuer intimated: {rescue.intimationProvided ? 'Yes' : 'No'}</div>
          </Card>
        )}
        <SummaryCard title="F. PPE & Fire Protection" items={ppeFireProtection} tone="blue" />

        {isolationRequired && (
          <div className="mb-3 rounded-lg bg-nz-blue-light px-3 py-2.5 text-xs font-medium text-nz-blue-dark">
            This permit includes Isolation & Electrical work — Isolation Setup (Step 3) will be required before Declaration.
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

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-nz-blue-light px-3 py-2 text-xs font-medium text-nz-blue-dark">
        <Sparkles size={14} /> {SOURCE_LABEL[source] || 'Manually entered'}
      </div>

      {/* Section A */}
      <Card className="mb-3 p-4">
        <SectionLabel>A. Type of Permit</SectionLabel>
        <p className="mb-2 text-xs text-slate-400">Select all that apply — a job can involve multiple permit types simultaneously.</p>
        <CheckboxGrid items={PERMIT_TYPES} selected={types} onToggle={(t) => setTypes((prev) => toggleItem(prev, t))} />
      </Card>

      {/* Section B */}
      <Card className="mb-3 p-4">
        <SectionLabel>B. Job Details</SectionLabel>
        <div className="space-y-3">
          <Field label="Area" value={jobDetails.area} onChange={(v) => updateJobDetail('area', v)} />
          <Field label="Location" value={jobDetails.location} onChange={(v) => updateJobDetail('location', v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date From" type="date" value={jobDetails.dateFrom} onChange={(v) => updateJobDetail('dateFrom', v)} />
            <Field label="Date Till" type="date" value={jobDetails.dateTill} onChange={(v) => updateJobDetail('dateTill', v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From Time" type="time" value={jobDetails.fromTime} onChange={(v) => updateJobDetail('fromTime', v)} />
            <Field label="To Time" type="time" value={jobDetails.toTime} onChange={(v) => updateJobDetail('toTime', v)} />
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Job Description</span>
            <textarea rows={2} value={jobDetails.jobDescription} onChange={(e) => updateJobDetail('jobDescription', e.target.value)} className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">WI No (Work Instruction)</span>
            <input value={jobDetails.wiNo} onChange={(e) => updateJobDetail('wiNo', e.target.value)} placeholder="e.g. WI-4108" className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
            {!jobDetails.wiNo && <span className="mt-1 block text-[11px] text-nz-amber">If not available, prepare JSA and get HOD/Plant Head & Safety approval.</span>}
          </label>
          <Field label="Owner Department" value={jobDetails.ownerDepartment} onChange={(v) => updateJobDetail('ownerDepartment', v)} />
          <Field label="Contractor (if external)" value={jobDetails.contractor} onChange={(v) => updateJobDetail('contractor', v)} />
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
          <div className="space-y-2">
            <Field label="Name of Rescuer" value={rescue.nameOfRescuer} onChange={(v) => setRescue((r) => ({ ...r, nameOfRescuer: v }))} />
            <Field label="Name of First Aider" value={rescue.nameOfFirstAider} onChange={(v) => setRescue((r) => ({ ...r, nameOfFirstAider: v }))} />
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
      <Card className="mb-4 p-4">
        <SectionLabel>F. PPE & Fire Protection</SectionLabel>
        <CheckboxGrid items={PPE_FIRE_PROTECTION} selected={ppeFireProtection} onToggle={(p) => setPpeFireProtection((prev) => toggleItem(prev, p))} columns={3} />
      </Card>

      <Button variant="orange" size="lg" className="w-full" disabled={!sectionsComplete} onClick={() => setStep('review')}>
        Review & Continue →
      </Button>
      {!sectionsComplete && <div className="mt-2 text-center text-xs text-slate-400">Select at least one permit type, fill job details, and choose PPE to continue.</div>}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm font-medium text-nz-navy focus-ring focus:bg-white"
      />
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
