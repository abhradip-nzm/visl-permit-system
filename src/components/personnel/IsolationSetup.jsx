import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';

const ISOLATION_TYPES = ['Electrical', 'Mechanical', 'Production', 'Other'];

export default function IsolationSetup({ navigate, params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [rows, setRows] = useState(permit.isolationDetails?.length ? permit.isolationDetails : [{ equipment: permit.equipment, typeOfIsolation: '', isolationPermitNo: '', isolationOfficerName: '', lotoIdNo: '', deptLockNo: '' }]);
  const [toolbox, setToolbox] = useState(permit.toolboxRecord?.length ? permit.toolboxRecord : [{ name: '', company: 'Vedanta', personalLockId: '', signed: false }]);
  const [topics, setTopics] = useState(permit.isolationTopicsCovered || '');
  const alreadySubmitted = permit.status !== 'pending-isolation';

  function updateRow(i, key, value) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }
  function updateToolbox(i, key, value) {
    setToolbox((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }

  function submit() {
    updatePermit(permit.id, { isolationDetails: rows, toolboxRecord: toolbox, isolationTopicsCovered: topics });
    addTimelineEvent(permit.id, 'Isolation details submitted — awaiting Isolation Officer verification', 'S. Iyer');
    pushToast('Isolation details submitted for verification');
    setTimeout(() => navigate('detail', { id: permit.id }), 900);
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('detail', { id: permit.id })} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-bold text-nz-navy">Isolation / LOTO Setup — {permit.id}</div>
        <StatusBadge status={permit.status} />
      </div>

      {alreadySubmitted && permit.isolationDetails?.[0]?.lotoIdNo && (
        <Card className="mb-4 border-nz-green/30 bg-nz-green-light p-3 text-sm font-semibold text-nz-green">
          <CheckCircle2 size={16} className="mb-1 inline" /> Verified by Isolation Officer — LOTO ID {permit.isolationDetails[0].lotoIdNo}, Lock {permit.isolationDetails[0].deptLockNo}
        </Card>
      )}

      <Card className="mb-4 p-4">
        <SectionLabel>H. Isolation Details</SectionLabel>
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="rounded-lg border border-nz-border p-3">
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-400">S.No {i + 1}
                {rows.length > 1 && <button onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))} disabled={alreadySubmitted}><Trash2 size={13} className="text-nz-red" /></button>}
              </div>
              <div className="space-y-2">
                <Field label="Equipment" value={r.equipment} onChange={(v) => updateRow(i, 'equipment', v)} disabled={alreadySubmitted} />
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Type of Isolation</span>
                  <select value={r.typeOfIsolation} onChange={(e) => updateRow(i, 'typeOfIsolation', e.target.value)} disabled={alreadySubmitted} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                    <option value="">Select…</option>
                    {ISOLATION_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                {alreadySubmitted && (
                  <>
                    <Field label="Isolation Permit No" value={r.isolationPermitNo} disabled />
                    <Field label="Isolation Officer Name" value={r.isolationOfficerName} disabled />
                    <Field label="Isolation Officer LOTO ID No" value={r.lotoIdNo} disabled />
                    <Field label="Dept. Lock No" value={r.deptLockNo} disabled />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {!alreadySubmitted && rows.length < 4 && (
          <button onClick={() => setRows((prev) => [...prev, { equipment: '', typeOfIsolation: '', isolationPermitNo: '', isolationOfficerName: '', lotoIdNo: '', deptLockNo: '' }])} className="mt-2 flex items-center gap-1 text-xs font-semibold text-nz-blue">
            <Plus size={13} /> Add equipment
          </button>
        )}
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Toolbox Record for Isolated Equipment</SectionLabel>
        <div className="space-y-2">
          {toolbox.map((t, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 rounded-lg border border-nz-border p-2.5">
              <Field label="Name" value={t.name} onChange={(v) => updateToolbox(i, 'name', v)} disabled={alreadySubmitted} />
              <Field label="Personal Lock ID" value={t.personalLockId} onChange={(v) => updateToolbox(i, 'personalLockId', v)} disabled={alreadySubmitted} />
              <label className="col-span-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input type="checkbox" checked={t.signed} disabled={alreadySubmitted} onChange={(e) => updateToolbox(i, 'signed', e.target.checked)} /> Signature confirmed
              </label>
            </div>
          ))}
        </div>
        {!alreadySubmitted && (
          <button onClick={() => setToolbox((prev) => [...prev, { name: '', company: 'Vedanta', personalLockId: '', signed: false }])} className="mt-2 flex items-center gap-1 text-xs font-semibold text-nz-blue">
            <Plus size={13} /> Add crew member
          </button>
        )}
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Topics Covered</SectionLabel>
        <textarea rows={3} value={topics} onChange={(e) => setTopics(e.target.value)} disabled={alreadySubmitted} placeholder="What was discussed during the isolation toolbox talk…" className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white disabled:opacity-60" />
      </Card>

      {!alreadySubmitted && (
        <Button variant="orange" size="lg" className="w-full" onClick={submit}>
          Confirm Isolation Setup Complete →
        </Button>
      )}
    </div>
  );
}

function Field({ label, value, onChange, disabled }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input value={value} onChange={(e) => onChange && onChange(e.target.value)} disabled={disabled} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring disabled:opacity-60" />
    </label>
  );
}
