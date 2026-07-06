import React, { useState } from 'react';
import { ArrowLeft, UserCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { SHIFT_ROSTER } from '../../data/mockData.js';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';

export default function LotoAssignment({ navigate, params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const lotoPermits = permits.filter((p) => p.lotoRequired);
  const [permitId, setPermitId] = useState(params?.id || lotoPermits[0]?.id);
  const permit = permits.find((p) => p.id === permitId) || permits[0];
  const [selected, setSelected] = useState(null);
  const [assigned, setAssigned] = useState(false);

  function assign() {
    updatePermit(permit.id, { lotoAssignee: selected.name });
    addTimelineEvent(permit.id, `LOTO assigned to ${selected.name}`, 'Shift Supervisor');
    setAssigned(true);
    pushToast(`${selected.name} notified for LOTO on ${permit.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('dashboard')} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <Card className="mb-4 p-4">
        <SectionLabel>Permit Requiring LOTO</SectionLabel>
        <select
          value={permitId}
          onChange={(e) => {
            setPermitId(e.target.value);
            setSelected(null);
            setAssigned(false);
          }}
          className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm font-semibold text-nz-navy focus-ring"
        >
          {lotoPermits.map((p) => (
            <option key={p.id} value={p.id}>{p.id} — {p.equipment} ({p.location})</option>
          ))}
        </select>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-nz-navy">{permit.id}</div>
          <div className="text-sm text-slate-500">{permit.equipment} · {permit.location} — requires LOTO</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      <Card className="mb-4 p-4">
        <SectionLabel>Select Responsible Person (current shift roster)</SectionLabel>
        <div className="space-y-2">
          {SHIFT_ROSTER.map((r) => (
            <button
              key={r.id}
              disabled={!r.certified}
              onClick={() => setSelected(r)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm ${
                selected?.id === r.id ? 'border-nz-blue bg-nz-blue-light' : 'border-nz-border'
              } ${!r.certified ? 'opacity-40' : ''}`}
            >
              <span className="flex items-center gap-2"><UserCheck size={14} /> {r.name}</span>
              <span className="text-xs font-semibold text-slate-400">{r.certified ? 'Available' : r.reason}</span>
            </button>
          ))}
        </div>
      </Card>

      {assigned ? (
        <div className="flex items-center gap-2 rounded-lg bg-nz-green-light px-4 py-3 text-sm font-semibold text-nz-green">
          <CheckCircle2 size={18} /> Assignment confirmed — {selected.name} has been notified.
        </div>
      ) : (
        <Button variant="primary" size="lg" className="w-full" disabled={!selected} onClick={assign}>
          Assign & Notify
        </Button>
      )}
    </div>
  );
}
