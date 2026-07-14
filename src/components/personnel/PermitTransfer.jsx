import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { USERS } from '../../data/usersData.js';
import { Card, SectionLabel, Button } from '../shared/Primitives.jsx';

// H-3 consistency: transfer recipients are derived live from USERS' role
// grants instead of a static roster, same fix applied to MaintenanceRequests.
const TRANSFER_CANDIDATES = USERS.filter((u) => u.status === 'active' && u.roles.some((r) => r.role === 'personnel'));

export default function PermitTransfer({ navigate, params }) {
  const { currentUser, permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [transferTo, setTransferTo] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const canTransfer = (permit.transfers?.length || 0) < 3;

  function transfer() {
    if (!transferTo) return;
    const record = { transferredTo: transferTo, signed: true, fromDateTime: 'Just now' };
    updatePermit(permit.id, { transfers: [...(permit.transfers || []), record] });
    addTimelineEvent(permit.id, `Permit transferred to ${transferTo}`, currentUser.name);
    pushToast(`${permit.id} transferred to ${transferTo} — they've been notified`);
    setTimeout(() => navigate('detail', { id: permit.id }), 900);
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('detail', { id: permit.id })} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <div className="mb-4 text-lg font-bold text-nz-navy">Transfer Permit — {permit.id}</div>

      <Card className="mb-4 p-4">
        <div className="mb-3 rounded-lg bg-nz-surface p-3 text-sm italic text-slate-600">
          "I certify that all hazards and risks have identified / assessed and controlled adequately."
        </div>
        <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /> I confirm the above declaration
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-500">Transferring to</span>
          <select value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
            <option value="">Select…</option>
            {TRANSFER_CANDIDATES.filter((u) => u.name !== currentUser.name).map((u) => <option key={u.id}>{u.name}</option>)}
          </select>
        </label>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Transfer History ({permit.transfers?.length || 0} of 3)</SectionLabel>
        <div className="space-y-1.5">
          {(permit.transfers || []).map((t, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-nz-border px-3 py-2 text-xs">
              <span className="font-semibold text-nz-navy">{t.transferredTo}</span>
              <span className="text-slate-400">{t.fromDateTime}</span>
            </div>
          ))}
          {(!permit.transfers || permit.transfers.length === 0) && <div className="text-xs text-slate-400">No transfers recorded yet.</div>}
        </div>
      </Card>

      <Button variant="orange" size="lg" className="w-full" disabled={!confirmed || !transferTo || !canTransfer} onClick={transfer}>
        <CheckCircle2 size={16} /> Transfer Permit →
      </Button>
      {!canTransfer && <div className="mt-2 text-center text-xs text-nz-red">Maximum of 3 transfers reached for this permit.</div>}
    </div>
  );
}
