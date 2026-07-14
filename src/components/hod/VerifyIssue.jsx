import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, FileCheck2, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { isOwnPermit } from '../../utils/segregationOfDuties.js';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

const REQUESTER_ITEMS = [
  ['controlsBack', 'All controls back in place'], ['interlocksRestored', 'All interlocks restored'],
  ['guardsInPlace', 'All guards in position'], ['permitsSurrendered', 'All permits/agreements surrendered by crew']
];
const APPROVER_ITEMS = [
  ['controlsRestored', 'All control measures restored'], ['siteNormalized', 'Site has been normalized'],
  ['materialsRemoved', 'All men and materials removed']
];

export default function VerifyIssue({ navigate, params }) {
  const { currentUser, permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [checklist, setChecklist] = useState(permit.closure?.approverChecklist || { controlsRestored: false, siteNormalized: false, materialsRemoved: false });
  const [deviation, setDeviation] = useState('');
  const [signed, setSigned] = useState(null);

  const allOk = Object.values(checklist).every(Boolean);
  const awaitingDeIsolation = permit.isolationRequired && !permit.deIsolation;
  const blocked = isOwnPermit(permit, currentUser);

  function confirmClosure() {
    const now = { name: currentUser.name, timestamp: 'Just now' };
    setSigned(now);
    updatePermit(permit.id, {
      status: 'closed',
      closure: { ...permit.closure, approverChecklist: checklist, deviationDetails: deviation, approverSigned: now, approverDate: 'Today', approverTime: 'Just now' }
    });
    addTimelineEvent(permit.id, `Closure verified — Permit Closed${deviation.trim() ? ` — "${deviation.trim()}"` : ''}`, `${currentUser.name} (Approver)`);
    pushToast(`${permit.id} closed`);
    setTimeout(() => navigate('dashboard'), 900);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('dashboard')} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-nz-navy">Closure Verification — {permit.id}</div>
          <div className="text-sm text-slate-500">{(permit.types || [permit.type]).join(', ')} · {permit.equipment}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      <div className="mb-4"><PTWStepper permit={permit} /></div>

      <Card className="mb-4 p-4">
        <SectionLabel>M. Requester Closure Checklist (as submitted)</SectionLabel>
        <div className="space-y-1.5">
          {REQUESTER_ITEMS.map(([key, label]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {permit.closure?.requesterChecklist?.[key] ? <CheckCircle2 size={16} className="text-nz-green" /> : <XCircle size={16} className="text-nz-red" />}
              <span className="text-slate-600">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-400">
          Toolbox Talk Ref: {permit.closure?.toolboxTalkRefNo || '—'} · Signed by {permit.closure?.requesterSigned?.name} on {permit.closure?.requesterSigned?.timestamp}
        </div>
      </Card>

      {blocked && (
        <Card className="mb-4 border-nz-red/30 bg-nz-red-light p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-nz-red">
            <ShieldAlert size={16} /> You raised this permit — you cannot verify its own closure.
          </div>
          <p className="mt-1 text-xs text-nz-red/80">Another Approver must complete final site verification.</p>
        </Card>
      )}

      {awaitingDeIsolation && (
        <Card className="mb-4 border-nz-amber/30 bg-nz-amber-light p-4 text-sm font-semibold text-nz-amber">
          Awaiting Isolation Officer de-isolation — the equipment lock must be confirmed released before this permit can be closed.
        </Card>
      )}

      <Card className="mb-4 p-4">
        <SectionLabel>Approver Final Site Verification</SectionLabel>
        <div className="space-y-2">
          {APPROVER_ITEMS.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-lg border border-nz-border px-3 py-2.5 text-sm text-slate-700">
              <input type="checkbox" checked={checklist[key]} onChange={(e) => setChecklist((c) => ({ ...c, [key]: e.target.checked }))} />
              {label}
            </label>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-semibold text-slate-500">Deviation details (if any)</span>
          <textarea rows={2} value={deviation} onChange={(e) => setDeviation(e.target.value)} className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring" />
        </label>
      </Card>

      <Button variant="primary" size="lg" className="w-full" disabled={blocked || !allOk || !!signed || awaitingDeIsolation} onClick={confirmClosure}>
        <FileCheck2 size={16} /> Confirm Closure — Permit Closed
      </Button>
      {!blocked && !allOk && !awaitingDeIsolation && <div className="mt-2 text-center text-xs text-slate-400">Resolve the flagged item(s) above before closing.</div>}
    </div>
  );
}
