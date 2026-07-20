import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button } from '../shared/Primitives.jsx';

const CRITICAL_CRITERIA = [
  'Multiple Crane Lift', 'Lift more than 75% rated SWL', 'Lift Over Operating facility',
  'Lift near OH Power line', 'Lifting of hazardous material', 'Lifting submerged load',
  'Lifting of Personal', 'Blind Lift (No clear view)', 'Lift Height More than 30m', 'Lift load more than 15 tons'
];

export default function CriticalLiftChecklist({ navigate, params }) {
  const { permits, updatePermit, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [basics, setBasics] = useState({ date: permit.dateFrom, plant: permit.location, time: permit.fromTime, location: permit.equipment, boomClearance: false, groundStability: false });
  const [criteria, setCriteria] = useState([]);
  const [plan, setPlan] = useState({});

  const isCritical = criteria.length > 0;

  function toggleCriterion(c) {
    setCriteria((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function save() {
    updatePermit(permit.id, { criticalLift: { ...basics, criteria, classification: isCritical ? 'Critical' : 'Routine', plan } });
    pushToast(`Lift checklist saved — classified as ${isCritical ? 'Critical' : 'Routine'}`);
    navigate('detail', { id: permit.id });
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('detail', { id: permit.id })} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <div className="mb-4 text-lg font-bold text-nz-navy">Critical Lift Checklist — {permit.id}</div>

      <Card className="mb-4 p-4">
        <SectionLabel>Basic Details</SectionLabel>
        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Field label="Date" value={basics.date} onChange={(v) => setBasics((b) => ({ ...b, date: v }))} />
          <Field label="Plant" value={basics.plant} onChange={(v) => setBasics((b) => ({ ...b, plant: v }))} />
          <Field label="Time" value={basics.time} onChange={(v) => setBasics((b) => ({ ...b, time: v }))} />
          <Field label="Location" value={basics.location} onChange={(v) => setBasics((b) => ({ ...b, location: v }))} />
        </div>
        <label className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
          <input type="checkbox" checked={basics.boomClearance} onChange={(e) => setBasics((b) => ({ ...b, boomClearance: e.target.checked }))} /> Boom Clearance Checked
        </label>
        <label className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-600">
          <input type="checkbox" checked={basics.groundStability} onChange={(e) => setBasics((b) => ({ ...b, groundStability: e.target.checked }))} /> Ground Stability Checked
        </label>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Critical Lift Criteria — if any apply, detailed plan is mandatory</SectionLabel>
        <div className="space-y-1.5">
          {CRITICAL_CRITERIA.map((c) => (
            <label key={c} className="flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" checked={criteria.includes(c)} onChange={() => toggleCriterion(c)} /> {c}
            </label>
          ))}
        </div>
        <div className={`mt-3 rounded-lg px-3 py-2 text-sm font-bold ${isCritical ? 'bg-nz-red-light text-nz-red' : 'bg-nz-green-light text-nz-green'}`}>
          Classification: {isCritical ? 'Critical' : 'Routine'}
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>{isCritical ? 'Critical' : 'Routine'} Lift Plan</SectionLabel>
        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {[
            ['diameterLength', 'Diameter & length of sling (L)'], ['slingSwl', 'SWL of slings as per marking & TPI'],
            ['noSlings', 'Nos. of slings used (N)'], ['craneCapacity', 'Capacity of crane at position'],
            ['operatingRadius', 'Maximum operating radius'], ['totalWeight', 'Total weight of the load'],
            ['liftHeight', 'Required lifting height'], ['boomAngle', 'Desired boom angle'], ['boomLength', 'Boom length required']
          ].map(([key, label]) => (
            <Field key={key} label={label} value={plan[key] || ''} onChange={(v) => setPlan((p) => ({ ...p, [key]: v }))} />
          ))}
        </div>
      </Card>

      <Button variant="orange" size="lg" className="w-full" onClick={save}>
        <CheckCircle2 size={16} /> Save Lift Checklist
      </Button>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-slate-500">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-nz-border bg-nz-surface px-2.5 py-1.5 text-xs focus-ring focus:bg-white" />
    </label>
  );
}
