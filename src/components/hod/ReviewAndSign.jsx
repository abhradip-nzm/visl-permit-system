import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, WarningBanner, SignaturePad, StatusBadge } from '../shared/Primitives.jsx';
import PermitSummary from '../shared/PermitSummary.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

export default function ReviewAndSign({ navigate, params }) {
  const { currentUser, permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [verified, setVerified] = useState(false);
  const [signed, setSigned] = useState(null);
  const [returnOpen, setReturnOpen] = useState(false);
  const [reason, setReason] = useState('');

  function approve() {
    const now = { name: currentUser.name, timestamp: 'Just now' };
    setSigned(now);
    updatePermit(permit.id, { status: 'live', approval: { approverName: currentUser.name, date: 'Today', time: 'Just now', onGroundVerified: true, signed: now, rejectionReason: '' } });
    addTimelineEvent(permit.id, 'Approved — Permit is LIVE', `${currentUser.name} (Approver)`);
    addTimelineEvent(permit.id, 'Job Execution started', 'System');
    pushToast(`${permit.id} approved — Permit is now LIVE`);
    setTimeout(() => navigate('dashboard'), 900);
  }

  function returnToRequester() {
    if (!reason.trim()) return;
    updatePermit(permit.id, { status: 'returned', approval: { ...permit.approval, rejectionReason: reason, approverName: currentUser.name, date: 'Today', time: 'Just now' } });
    addTimelineEvent(permit.id, `Returned to Requester — ${reason}`, `${currentUser.name} (Approver)`);
    pushToast(`${permit.id} returned to requester`, 'error');
    setTimeout(() => navigate('dashboard'), 900);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back to dashboard
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-nz-navy">{permit.id}</div>
          <div className="text-sm text-slate-500">{(permit.types || [permit.type]).join(', ')} · {permit.equipment} · {permit.location}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      <div className="mb-4"><PTWStepper permit={permit} /></div>

      {permit.warnings?.length > 0 && (
        <Card className="mb-4 p-4">
          <SectionLabel>Contextual Warnings</SectionLabel>
          <div className="space-y-2">
            {permit.warnings.map((w, i) => <WarningBanner key={i} text={w.text} />)}
          </div>
        </Card>
      )}

      <PermitSummary permit={permit} defaultOpen />

      <Card className="mb-4 p-4">
        <SectionLabel>G. Departmental Clearance</SectionLabel>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {Object.entries(permit.deptClearances || {}).filter(([k]) => ['Mechanical', 'E&I', 'Production'].includes(k)).map(([dept, c]) => (
            <div key={dept} className="rounded-lg border border-nz-border px-2.5 py-2">
              <div className="font-semibold text-nz-navy">{dept}</div>
              <div className={c.status === 'cleared' ? 'text-nz-green' : c.status === 'not-applicable' ? 'text-slate-400' : 'text-nz-amber'}>
                {c.status === 'cleared' ? `Cleared — ${c.name}` : c.status === 'not-applicable' ? 'N/A' : 'Pending'}
              </div>
            </div>
          ))}
        </div>
        {permit.isolationRequired && (
          <div className="mt-2 text-xs text-slate-500">
            H. Isolation: {permit.isolationDetails?.[0]?.lotoIdNo ? `Verified — LOTO ${permit.isolationDetails[0].lotoIdNo}, Lock ${permit.isolationDetails[0].deptLockNo}` : 'Not yet verified'}
          </div>
        )}
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>K. Permit Approval — On-Ground Verification</SectionLabel>
        <div className="mb-3 rounded-lg bg-nz-surface p-3 text-sm italic text-slate-600">
          "I have personally inspected and checked all requirements and approve the permit, same has been communicated to respective area in charge / workers / supervisors."
        </div>
        <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
          I have personally inspected the site and verified the above
        </label>
        <div className="mb-3 text-xs text-slate-400">Approver: <span className="font-semibold text-nz-navy">{currentUser.name}</span> · Date/Time: auto-filled on sign</div>
        <SignaturePad signed={signed} onSign={() => {}} label="Sign to approve" />
      </Card>

      {returnOpen && (
        <Card className="mb-4 p-4">
          <SectionLabel>Rejection Reason (required)</SectionLabel>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain what must change before this can be re-submitted…"
            className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
          />
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="success" className="flex-1" disabled={!verified || !!signed} onClick={approve}>
          <CheckCircle2 size={16} /> Approve — Permit is Now LIVE
        </Button>
        {!returnOpen ? (
          <Button variant="danger" className="flex-1" onClick={() => setReturnOpen(true)}>
            <RotateCcw size={16} /> Return to Requester
          </Button>
        ) : (
          <Button variant="danger" className="flex-1" disabled={!reason.trim()} onClick={returnToRequester}>
            <RotateCcw size={16} /> Confirm Return
          </Button>
        )}
      </div>
    </div>
  );
}
