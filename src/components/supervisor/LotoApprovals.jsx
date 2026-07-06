import React, { useState } from 'react';
import { UserCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { SHIFT_ROSTER } from '../../data/mockData.js';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';

export default function LotoApprovals({ params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const lotoPermits = permits.filter((p) => p.lotoRequired);
  const [permitId, setPermitId] = useState(params?.id || lotoPermits[0]?.id);
  const permit = permits.find((p) => p.id === permitId) || permits[0];
  const [selected, setSelected] = useState(null);
  const [assigned, setAssigned] = useState(false);
  const [approvedIds, setApprovedIds] = useState([]);

  function approveRequest(p) {
    setApprovedIds((prev) => [...prev, p.id]);
    setPermitId(p.id);
    pushToast(`${p.id} LOTO request approved — proceed to assignment`);
  }

  function assign() {
    updatePermit(permit.id, { lotoAssignee: selected.name });
    addTimelineEvent(permit.id, `LOTO assigned to ${selected.name}`, 'Shift Supervisor');
    setAssigned(true);
    pushToast(`${selected.name} notified for LOTO on ${permit.id}`);
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <SectionLabel>LOTO Request Approval</SectionLabel>
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
                <th className="px-4 py-3">Permit #</th>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Requested By</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {lotoPermits.map((p) => (
                <tr key={p.id} className="border-b border-nz-border/60 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-nz-navy">{p.id}</td>
                  <td className="px-4 py-2.5 text-slate-600">{p.equipment}</td>
                  <td className="px-4 py-2.5 text-slate-600">{p.requester}</td>
                  <td className="px-4 py-2.5">
                    {approvedIds.includes(p.id) ? (
                      <span className="text-xs font-semibold text-nz-green">Approved</span>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="success" size="sm" onClick={() => approveRequest(p)}><CheckCircle2 size={13} /></Button>
                        <Button variant="danger" size="sm" onClick={() => pushToast(`${p.id} LOTO request rejected`, 'error')}><XCircle size={13} /></Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div>
        <SectionLabel>LOTO Assignment</SectionLabel>
        <Card className="mb-4 p-4">
          <div className="mb-2 text-xs font-semibold text-slate-500">Permit</div>
          <select
            value={permitId}
            onChange={(e) => { setPermitId(e.target.value); setSelected(null); setAssigned(false); }}
            className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm font-semibold text-nz-navy focus-ring"
          >
            {lotoPermits.map((p) => (
              <option key={p.id} value={p.id}>{p.id} — {p.equipment} ({p.location})</option>
            ))}
          </select>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-slate-500">{permit?.equipment} · {permit?.location}</div>
            <StatusBadge status={permit?.status} />
          </div>
        </Card>

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
    </div>
  );
}
