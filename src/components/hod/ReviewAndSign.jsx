import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, MessageSquareWarning, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { EQUIPMENT } from '../../data/mockData.js';
import { Card, SectionLabel, Button, WarningBanner, SignaturePad, StatusBadge } from '../shared/Primitives.jsx';

export default function ReviewAndSign({ navigate, params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [signed, setSigned] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [comment, setComment] = useState('');

  const equipment = EQUIPMENT.find((e) => e.name === permit.equipment);
  const isBlocked = permit.status === 'blocked';
  const canDirectIssue = !permit.lotoRequired || permit.lotoStatus === 'complete';

  function approve() {
    setSigned({ name: 'D. Fernandes', timestamp: 'Just now' });
    updatePermit(permit.id, { status: 'approved' });
    addTimelineEvent(permit.id, 'Approved', 'D. Fernandes (HOD)');
    pushToast(`${permit.id} approved`);
    setTimeout(() => navigate('dashboard'), 900);
  }

  function approveAndIssue() {
    setSigned({ name: 'D. Fernandes', timestamp: 'Just now' });
    updatePermit(permit.id, { status: 'issued' });
    addTimelineEvent(permit.id, 'Approved', 'D. Fernandes (HOD)');
    addTimelineEvent(permit.id, 'Issued', 'D. Fernandes (HOD)');
    pushToast(`${permit.id} approved and issued`);
    setTimeout(() => navigate('dashboard'), 900);
  }

  function reject() {
    if (!comment.trim()) return;
    updatePermit(permit.id, { status: 'rejected' });
    addTimelineEvent(permit.id, `Rejected — ${comment}`, 'D. Fernandes (HOD)');
    pushToast(`${permit.id} rejected`, 'error');
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
          <div className="text-sm text-slate-500">{permit.type} · {permit.equipment} · {permit.location}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      {permit.warnings?.length > 0 && (
        <Card className="mb-4 p-4">
          <SectionLabel>Contextual Warnings</SectionLabel>
          <div className="space-y-2">
            {permit.warnings.map((w, i) => <WarningBanner key={i} text={w.text} />)}
          </div>
        </Card>
      )}

      <div className="mb-4 grid grid-cols-2 gap-4">
        <Card className="p-4">
          <SectionLabel>Equipment Validity</SectionLabel>
          {equipment ? (
            <div className="flex items-center gap-2 text-sm">
              <span className={`h-2 w-2 rounded-full ${equipment.calibrationStatus === 'valid' ? 'bg-nz-green' : 'bg-nz-red'}`} />
              {equipment.name} — calibration {equipment.calibrationStatus} ({equipment.calibrationDate})
            </div>
          ) : <div className="text-sm text-slate-400">No linked equipment record.</div>}
        </Card>
        <Card className="p-4">
          <SectionLabel>Competency Check</SectionLabel>
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-nz-amber" />
            Requester certification renewing soon — see warnings.
          </div>
        </Card>
      </div>

      <Card className="mb-4 p-4">
        <SectionLabel>Hazards / PPE / Controls (auto-populated)</SectionLabel>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div><div className="mb-1 font-semibold text-slate-400">Hazards</div>{permit.hazards.map((h) => <div key={h} className="text-slate-600">• {h}</div>)}</div>
          <div><div className="mb-1 font-semibold text-slate-400">PPE</div>{permit.ppe.map((h) => <div key={h} className="text-slate-600">• {h}</div>)}</div>
          <div><div className="mb-1 font-semibold text-slate-400">Controls</div>{permit.controls.map((h) => <div key={h} className="text-slate-600">• {h}</div>)}</div>
        </div>
      </Card>

      {isBlocked && (
        <Card className="mb-4 flex items-center gap-3 border-nz-red/30 bg-nz-red-light p-4">
          <ShieldAlert className="text-nz-red" size={20} />
          <div className="text-sm font-semibold text-nz-red">
            This permit is system-blocked. You cannot approve until the blocking condition is resolved.
          </div>
        </Card>
      )}

      <Card className="mb-4 p-4">
        <SignaturePad signed={signed} onSign={() => {}} label="Sign to approve" />
      </Card>

      {rejectOpen && (
        <Card className="mb-4 p-4">
          <SectionLabel>Rejection Comment (required)</SectionLabel>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Explain what must change before re-submission…"
            className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
          />
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="success" className="flex-1" disabled={isBlocked || !!signed} onClick={approve}>
          <CheckCircle2 size={16} /> Approve
        </Button>
        {canDirectIssue && (
          <Button variant="primary" className="flex-1" disabled={isBlocked || !!signed} onClick={approveAndIssue}>
            <CheckCircle2 size={16} /> Approve & Issue
          </Button>
        )}
        {!rejectOpen ? (
          <Button variant="danger" className="flex-1" onClick={() => setRejectOpen(true)}>
            <XCircle size={16} /> Reject
          </Button>
        ) : (
          <Button variant="danger" className="flex-1" disabled={!comment.trim()} onClick={reject}>
            <XCircle size={16} /> Confirm Reject
          </Button>
        )}
        <Button variant="outline" className="flex-1" onClick={() => pushToast('Request-changes thread opened with requester')}>
          <MessageSquareWarning size={16} /> Request Changes
        </Button>
      </div>
    </div>
  );
}
