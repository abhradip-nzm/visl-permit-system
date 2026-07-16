import React, { useState } from 'react';
import { FileText, Hash, Type, ScanLine, Sparkles, ArrowLeft, ClipboardList, Wrench } from 'lucide-react';
import { NLP_SAMPLE_PARSE, OCR_SAMPLE_EXTRACTION } from '../../data/mockData.js';
import { Button, Card } from '../shared/Primitives.jsx';
import { useApp } from '../../context/AppContext.jsx';
import TaskRequestForm from './TaskRequestForm.jsx';

// Phase 8: Type (NLP) and Scan (OCR) are back as entry conveniences, but not
// as the free-text/AI-driven submission paths they used to be — like SAP
// lookup, they only ever *prefill* the same fixed checkbox/dropdown form
// (see SOURCE_LABEL in TaskRequestForm.jsx, "verify every section before
// submitting"). The certified form itself still has exactly one shape; nothing
// gets submitted without passing through it for review.
const MODES = [
  { key: 'manual', label: 'New Permit Request', sub: 'Fill the certified PTW form', icon: FileText },
  { key: 'nlp', label: 'Type', sub: 'Describe the job, then confirm on the form', icon: Type },
  { key: 'ocr', label: 'Scan', sub: 'Digitize a legacy paper permit', icon: ScanLine },
  { key: 'sap', label: 'From SAP PM Order #', sub: 'Auto-populate from a work order', icon: Hash },
  { key: 'personal-task', label: 'Personal Task', sub: 'Simple task request — no permit form', icon: ClipboardList },
  { key: 'personal-instrument', label: 'Instrument Request', sub: 'Request an instrument from your supervisor', icon: Wrench }
];

export default function RequestTask({ navigate }) {
  const [step, setStep] = useState('select'); // select | sap | form | personal-task | personal-instrument
  const [prefillSource, setPrefillSource] = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  if (step === 'form') {
    return <TaskRequestForm source={prefillSource} prefillData={prefillData} navigate={navigate} onBack={() => setStep('select')} />;
  }
  if (step === 'personal-task') {
    return <PersonalTaskForm onBack={() => setStep('select')} navigate={navigate} />;
  }
  if (step === 'personal-instrument') {
    return <PersonalInstrumentForm onBack={() => setStep('select')} navigate={navigate} />;
  }

  return (
    <div className="px-4 py-4">
      <button
        onClick={() => (step === 'select' ? navigate('mytasks') : setStep('select'))}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={15} /> {step === 'select' ? 'Back to My Tasks' : 'Back to input options'}
      </button>

      {step === 'select' && (
        <>
          <h2 className="mb-1 text-lg font-bold text-nz-navy">Request Task</h2>
          <p className="mb-5 text-sm text-slate-500">Choose how you'd like to start this request.</p>
          <div className="grid grid-cols-2 gap-3">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => {
                  if (m.key === 'manual') {
                    setPrefillSource(null);
                    setPrefillData(null);
                    setStep('form');
                  } else {
                    setStep(m.key);
                  }
                }}
                className="flex flex-col items-start gap-2 rounded-xl2 border border-nz-border bg-white p-4 text-left shadow-card active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nz-blue-light text-nz-blue">
                  <m.icon size={19} />
                </div>
                <div className="font-bold text-nz-navy">{m.label}</div>
                <div className="text-xs leading-snug text-slate-400">{m.sub}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'nlp' && (
        <NLPInputStep onParsed={(data) => { setPrefillSource('nlp'); setPrefillData(data); setStep('form'); }} />
      )}
      {step === 'ocr' && (
        <OCRInputStep onParsed={(data) => { setPrefillSource('ocr'); setPrefillData(data); setStep('form'); }} />
      )}
      {step === 'sap' && (
        <SAPInputStep onParsed={(data) => { setPrefillSource('sap'); setPrefillData(data); setStep('form'); }} />
      )}
    </div>
  );
}

function NLPInputStep({ onParsed }) {
  const [text, setText] = useState('');
  const [parsing, setParsing] = useState(false);

  function parse() {
    setParsing(true);
    setTimeout(() => {
      onParsed({
        permitType: NLP_SAMPLE_PARSE.permitType,
        equipment: NLP_SAMPLE_PARSE.equipment,
        area: NLP_SAMPLE_PARSE.location,
        date: NLP_SAMPLE_PARSE.date,
        shift: NLP_SAMPLE_PARSE.shift
      });
    }, 1100);
  }

  return (
    <Card className="p-4">
      <div className="mb-2 text-sm font-bold text-nz-navy">Describe the job</div>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. welding work on conveyor belt 7 in crushing plant tomorrow morning shift"
        className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
      />
      <button
        onClick={() => setText(NLP_SAMPLE_PARSE.inputText)}
        className="mt-2 text-xs font-semibold text-nz-blue underline"
      >
        Use sample sentence
      </button>
      <Button variant="primary" className="mt-4 w-full" disabled={!text.trim() || parsing} onClick={parse}>
        <Sparkles size={15} /> {parsing ? 'Parsing…' : 'Parse & Pre-fill Form'}
      </Button>
    </Card>
  );
}

function OCRInputStep({ onParsed }) {
  const [scanning, setScanning] = useState(false);
  const [extracted, setExtracted] = useState(false);

  function scan() {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setExtracted(true);
    }, 1400);
  }

  function useExtracted() {
    onParsed({
      permitType: OCR_SAMPLE_EXTRACTION.permitType,
      equipment: OCR_SAMPLE_EXTRACTION.equipment,
      area: OCR_SAMPLE_EXTRACTION.location,
      date: OCR_SAMPLE_EXTRACTION.date,
      shift: OCR_SAMPLE_EXTRACTION.shift
    });
  }

  return (
    <Card className="p-4">
      <div className="mb-3 text-sm font-bold text-nz-navy">Scan Legacy Permit</div>
      <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-nz-border bg-nz-surface">
        {!extracted ? (
          <button onClick={scan} disabled={scanning} className="flex flex-col items-center gap-2 text-slate-400">
            <ScanLine size={28} className={scanning ? 'animate-pulseSoft text-nz-blue' : ''} />
            <span className="text-xs font-semibold">{scanning ? 'Extracting fields…' : 'Tap to capture / upload photo'}</span>
          </button>
        ) : (
          <div className="w-full px-4 text-xs text-slate-500">
            <div className="mb-1 font-bold text-nz-navy">Extraction preview — {OCR_SAMPLE_EXTRACTION.sourceFile}</div>
            <div>Confidence: <span className="font-semibold text-nz-green">{Math.round(OCR_SAMPLE_EXTRACTION.confidence * 100)}%</span></div>
            <div>Equipment: {OCR_SAMPLE_EXTRACTION.equipment}</div>
            <div>Location: {OCR_SAMPLE_EXTRACTION.location}</div>
          </div>
        )}
      </div>
      <Button variant="primary" className="mt-4 w-full" disabled={!extracted} onClick={useExtracted}>
        <Sparkles size={15} /> Use Extracted Data — Pre-fill Form
      </Button>
    </Card>
  );
}

function SAPInputStep({ onParsed }) {
  const [order, setOrder] = useState('');
  const [fetched, setFetched] = useState(false);
  const { pushToast } = useApp();

  // Mock system-of-record lookup by order number — not free-text/AI
  // interpretation, so it stays even though NLP/voice/OCR were removed.
  const orderData = { equipment: 'MCC-3 Drive Panel', area: 'Crushing Plant', ownerDepartment: 'Mechanical' };

  function fetchOrder() {
    setFetched(true);
    pushToast('SAP PM order fetched (mock)');
  }

  return (
    <Card className="p-4">
      <div className="mb-2 text-sm font-bold text-nz-navy">SAP PM Order Lookup</div>
      <input
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        placeholder="Enter order number e.g. 4500-9987"
        className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
      />
      <Button variant="outline" className="mt-3 w-full" disabled={!order.trim()} onClick={fetchOrder}>
        Fetch Order Details
      </Button>
      {fetched && (
        <div className="mt-3 rounded-lg bg-nz-surface p-3 text-xs text-slate-500">
          <div className="font-bold text-nz-navy">Order {order}</div>
          <div>Equipment: {orderData.equipment} · Owner Dept: {orderData.ownerDepartment}</div>
          <div>Checklist: 6 SAP-linked items attached</div>
        </div>
      )}
      <Button variant="primary" className="mt-4 w-full" disabled={!fetched} onClick={() => onParsed(orderData)}>
        Pre-fill Request
      </Button>
    </Card>
  );
}

function PersonalTaskForm({ onBack, navigate }) {
  const { pushToast } = useApp();
  const [form, setForm] = useState({ type: 'Maintenance', description: '', equipment: '', priority: 'Medium', preferredDate: '' });
  const canSubmit = form.description.trim();

  function submit() {
    pushToast(`Personal task submitted: ${form.type} — "${form.description}"${form.equipment ? ` · ${form.equipment}` : ''} · ${form.priority} priority`);
    navigate('mytasks');
  }

  return (
    <div className="px-4 py-4">
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <Card className="p-4">
        <div className="mb-3 text-sm font-bold text-nz-navy">Personal Task Request</div>
        <div className="space-y-3 text-sm">
          <SelectField label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} options={['Maintenance', 'Inspection', 'Emergency Repair']} />
          <Field label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} placeholder="Describe the task" />
          <Field label="Equipment needed" value={form.equipment} onChange={(v) => setForm((f) => ({ ...f, equipment: v }))} placeholder="e.g. Torque Wrench TW-9" />
          <SelectField label="Priority" value={form.priority} onChange={(v) => setForm((f) => ({ ...f, priority: v }))} options={['Low', 'Medium', 'High', 'Critical']} />
          <Field label="Preferred Date / Shift" value={form.preferredDate} onChange={(v) => setForm((f) => ({ ...f, preferredDate: v }))} placeholder="e.g. 2026-07-08, Morning" />
        </div>
        <Button variant="orange" className="mt-4 w-full" disabled={!canSubmit} onClick={submit}>
          Submit Request
        </Button>
      </Card>
    </div>
  );
}

function PersonalInstrumentForm({ onBack, navigate }) {
  const { pushToast } = useApp();
  const [form, setForm] = useState({ type: 'Atmosphere Monitor', reason: '', duration: '' });
  const canSubmit = form.reason.trim();

  function submit() {
    pushToast(`Instrument request sent to Isolation Officer: ${form.type} — "${form.reason}"${form.duration ? ` · ${form.duration}` : ''}`);
    navigate('inventory');
  }

  return (
    <div className="px-4 py-4">
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <Card className="p-4">
        <div className="mb-3 text-sm font-bold text-nz-navy">Personal Instrument Request</div>
        <div className="space-y-3 text-sm">
          <SelectField label="Instrument Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} options={['Atmosphere Monitor', 'Mechanical Tool', 'Electrical Test Equipment', 'Mechanical Diagnostic', 'Fall Protection', 'Inspection Equipment']} />
          <Field label="Reason" value={form.reason} onChange={(v) => setForm((f) => ({ ...f, reason: v }))} placeholder="Why do you need it?" />
          <Field label="Duration needed" value={form.duration} onChange={(v) => setForm((f) => ({ ...f, duration: v }))} placeholder="e.g. 3 days" />
        </div>
        <Button variant="orange" className="mt-4 w-full" disabled={!canSubmit} onClick={submit}>
          Submit Request
        </Button>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
