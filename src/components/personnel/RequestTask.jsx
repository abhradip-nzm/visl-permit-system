import React, { useState } from 'react';
import { FileText, Hash, ArrowLeft, ClipboardList, Wrench } from 'lucide-react';
import { Button, Card } from '../shared/Primitives.jsx';
import { useApp } from '../../context/AppContext.jsx';
import TaskRequestForm from './TaskRequestForm.jsx';

// Phase 2: the certified PTW form (FRMT/MR/26 Rev 4) has exactly one entry
// path — the fixed checkbox/dropdown wizard. NLP text parsing, voice input,
// and OCR scanning were "smart form" shortcuts inconsistent with a legally
// certified document and have been removed. SAP PM Order lookup stays: it
// pulls from a real system of record by ID, not free-text/AI interpretation.
const MODES = [
  { key: 'manual', label: 'New Permit Request', sub: 'Fill the certified PTW form', icon: FileText },
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

      {step === 'sap' && (
        <SAPInputStep onParsed={(data) => { setPrefillSource('sap'); setPrefillData(data); setStep('form'); }} />
      )}
    </div>
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
  return (
    <div className="px-4 py-4">
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <Card className="p-4">
        <div className="mb-3 text-sm font-bold text-nz-navy">Personal Task Request</div>
        <div className="space-y-3 text-sm">
          <SelectField label="Type" options={['Maintenance', 'Inspection', 'Emergency Repair']} />
          <Field label="Description" placeholder="Describe the task" />
          <Field label="Equipment needed" placeholder="e.g. Torque Wrench TW-9" />
          <SelectField label="Priority" options={['Low', 'Medium', 'High', 'Critical']} />
          <Field label="Preferred Date / Shift" placeholder="e.g. 2026-07-08, Morning" />
        </div>
        <Button variant="orange" className="mt-4 w-full" onClick={() => { pushToast('Personal task request submitted'); navigate('mytasks'); }}>
          Submit Request
        </Button>
      </Card>
    </div>
  );
}

function PersonalInstrumentForm({ onBack, navigate }) {
  const { pushToast } = useApp();
  return (
    <div className="px-4 py-4">
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <Card className="p-4">
        <div className="mb-3 text-sm font-bold text-nz-navy">Personal Instrument Request</div>
        <div className="space-y-3 text-sm">
          <SelectField label="Instrument Type" options={['Atmosphere Monitor', 'Mechanical Tool', 'Electrical Test Equipment', 'Mechanical Diagnostic', 'Fall Protection', 'Inspection Equipment']} />
          <Field label="Reason" placeholder="Why do you need it?" />
          <Field label="Duration needed" placeholder="e.g. 3 days" />
        </div>
        <Button variant="orange" className="mt-4 w-full" onClick={() => { pushToast('Instrument request sent to Shift Supervisor'); navigate('inventory'); }}>
          Submit Request
        </Button>
      </Card>
    </div>
  );
}

function Field({ label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input placeholder={placeholder} className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
    </label>
  );
}

function SelectField({ label, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <select className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
