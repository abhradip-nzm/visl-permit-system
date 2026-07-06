import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Paperclip, FileText, CheckCircle2, Wrench } from 'lucide-react';
import { NLP_SAMPLE_PARSE, OCR_SAMPLE_EXTRACTION, HAZARD_CONTROL_LIBRARY } from '../../data/mockData.js';
import { INSTRUMENTS } from '../../data/instrumentsData.js';
import { Button, Card, WarningBanner, SignaturePad, SectionLabel } from '../shared/Primitives.jsx';
import { useApp } from '../../context/AppContext.jsx';

const SOURCE_LABEL = { nlp: 'Parsed from natural language input', voice: 'Transcribed from voice input', ocr: 'Extracted via OCR from scanned permit', sap: 'Auto-populated from SAP PM order' };

const WARNINGS = [
  { id: 'incident', text: 'Crushing Plant has 2 near-misses recorded in the last 90 days.' },
  { id: 'equipment', text: 'Equipment Conveyor Belt #7 has an overdue calibration (expired 12 Jun).' },
  { id: 'competency', text: 'Your Hot Work certification renews in 4 days — plan accordingly.' }
];

export default function TaskRequestForm({ source, navigate, onBack }) {
  const { pushToast, setPermits } = useApp();
  const base = source === 'ocr' ? {
    permitType: OCR_SAMPLE_EXTRACTION.permitType, equipment: OCR_SAMPLE_EXTRACTION.equipment,
    location: OCR_SAMPLE_EXTRACTION.location, date: OCR_SAMPLE_EXTRACTION.date, shift: OCR_SAMPLE_EXTRACTION.shift
  } : {
    permitType: NLP_SAMPLE_PARSE.permitType, equipment: NLP_SAMPLE_PARSE.equipment,
    location: NLP_SAMPLE_PARSE.location, date: NLP_SAMPLE_PARSE.date, shift: NLP_SAMPLE_PARSE.shift
  };

  const [fields, setFields] = useState(base);
  const [acked, setAcked] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [signed, setSigned] = useState(null);
  const [wantsInstrument, setWantsInstrument] = useState(false);
  const [instrument, setInstrument] = useState(INSTRUMENTS[0].name);

  const hazardSet = HAZARD_CONTROL_LIBRARY[fields.permitType] || HAZARD_CONTROL_LIBRARY.Mechanical;
  const allAcked = WARNINGS.every((w) => acked[w.id]);

  function updateField(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function commitField(key) {
    if (fields[key] !== base[key]) {
      pushToast('Correction logged for feedback review', 'default');
    }
  }

  function submit() {
    setSigned({ name: 'S. Iyer', timestamp: 'Just now' });
    setPermits((prev) => [
      {
        id: `WP-${1045 + Math.floor(Math.random() * 90)}`,
        type: fields.permitType, equipment: fields.equipment, location: fields.location,
        shift: fields.shift, requester: 'S. Iyer', status: 'pending-approval', createdAt: fields.date,
        hazards: hazardSet.hazards, ppe: hazardSet.ppe, controls: hazardSet.controls,
        warnings: [], ageHours: 0, risk: 'medium',
        checklist: [{ id: 1, label: 'Pre-job briefing', done: false }],
        timeline: [{ stage: 'Created', at: 'Just now', by: 'S. Iyer' }, { stage: 'Awaiting Approval', at: 'Just now', by: 'System' }]
      },
      ...prev
    ]);
    pushToast(wantsInstrument ? `Request submitted with ${instrument} attached` : 'Request submitted for approval');
    setTimeout(() => navigate('mytasks'), 900);
  }

  return (
    <div className="px-4 py-4">
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-nz-blue-light px-3 py-2 text-xs font-medium text-nz-blue-dark">
        <Sparkles size={14} /> {SOURCE_LABEL[source] || 'Manually entered'}
      </div>

      <Card className="mb-4 p-4">
        <SectionLabel>Permit Details</SectionLabel>
        <div className="space-y-3">
          <Field label="Permit Type" value={fields.permitType} onChange={(v) => updateField('permitType', v)} onBlur={() => commitField('permitType')} />
          <Field label="Equipment" value={fields.equipment} onChange={(v) => updateField('equipment', v)} onBlur={() => commitField('equipment')} />
          <Field label="Location" value={fields.location} onChange={(v) => updateField('location', v)} onBlur={() => commitField('location')} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" value={fields.date} onChange={(v) => updateField('date', v)} onBlur={() => commitField('date')} />
            <Field label="Shift" value={fields.shift} onChange={(v) => updateField('shift', v)} onBlur={() => commitField('shift')} />
          </div>
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Auto-populated Hazards, PPE & Controls</SectionLabel>
        <TagGroup title="Hazards" items={hazardSet.hazards} tone="red" />
        <TagGroup title="Required PPE" items={hazardSet.ppe} tone="blue" />
        <TagGroup title="Controls" items={hazardSet.controls} tone="green" />
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel><span className="flex items-center gap-1.5"><Wrench size={13} /> Request Instrument</span></SectionLabel>
        <label className="mb-2 flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={wantsInstrument} onChange={(e) => setWantsInstrument(e.target.checked)} />
          Attach an instrument to this request
        </label>
        {wantsInstrument && (
          <select value={instrument} onChange={(e) => setInstrument(e.target.value)} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
            {INSTRUMENTS.map((i) => <option key={i.id}>{i.name}</option>)}
          </select>
        )}
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Contextual Warnings — review before proceeding</SectionLabel>
        <div className="space-y-2">
          {WARNINGS.map((w) => (
            <WarningBanner
              key={w.id}
              text={w.text}
              onAcknowledge={() => setAcked((a) => ({ ...a, [w.id]: true }))}
              acknowledged={!!acked[w.id]}
            />
          ))}
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Attachments</SectionLabel>
        <button
          onClick={() => {
            setAttachments((a) => [...a, `method-statement-${a.length + 1}.pdf`]);
            pushToast('Document attached');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-nz-border py-4 text-sm font-semibold text-slate-500"
        >
          <Paperclip size={16} /> Attach method statement / SDS / drawing
        </button>
        {attachments.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {attachments.map((a, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md bg-nz-surface px-3 py-2 text-xs text-slate-600">
                <FileText size={13} /> {a}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="mb-4 p-4">
        <SignaturePad signed={signed} onSign={() => {}} label="Tap to add signature" />
      </Card>

      <Button variant="orange" size="lg" className="w-full" disabled={!allAcked || !!signed} onClick={submit}>
        {signed ? <><CheckCircle2 size={16} /> Submitted</> : 'Submit Request'}
      </Button>
      {!allAcked && <div className="mt-2 text-center text-xs text-slate-400">Acknowledge all warnings to submit.</div>}
    </div>
  );
}

function Field({ label, value, onChange, onBlur }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm font-medium text-nz-navy focus-ring focus:bg-white"
      />
    </label>
  );
}

function TagGroup({ title, items, tone }) {
  const tones = {
    red: 'bg-nz-red-light text-nz-red border-nz-red/20',
    blue: 'bg-nz-blue-light text-nz-blue border-nz-blue/20',
    green: 'bg-nz-green-light text-nz-green border-nz-green/20'
  };
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-xs font-semibold text-slate-400">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span key={it} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
