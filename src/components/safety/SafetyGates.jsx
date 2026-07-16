import React, { useState } from 'react';
import { ClipboardCheck, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { isOwnPermit } from '../../utils/segregationOfDuties.js';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

// Phase 7: the Safety Officer is now a formal two-touchpoint gate instead
// of an observer-only role — a Review before Departmental Clearance can
// even start, and an Inspection before the Approver's final closure. Both
// are blocking: a permit only reaches the next status once the Safety
// Officer here advances it.
export default function SafetyGates() {
  const { permits, updatePermit, addTimelineEvent, pushToast, currentUser } = useApp();
  const pendingReview = permits.filter((p) => p.status === 'pending-safety-review');
  const pendingInspection = permits.filter((p) => p.status === 'pending-safety-inspection');

  return (
    <div className="grid grid-cols-2 gap-6">
      <GateQueue
        icon={ShieldAlert}
        title="Pending Safety Review"
        emptyText="Nothing awaiting review right now."
        permits={pendingReview}
        actionLabel="Approve — Send to Clearance"
        onConfirm={(permit, comment) => {
          updatePermit(permit.id, { safetyReview: { comment, by: currentUser.name, at: 'Just now' }, status: 'pending-clearance' });
          addTimelineEvent(permit.id, `Safety Officer review complete${comment ? ` — "${comment}"` : ''}`, `${currentUser.name} (Safety Officer)`);
          addTimelineEvent(permit.id, 'Awaiting Departmental Clearance', 'System');
          pushToast(`${permit.id} cleared for Departmental Clearance`);
        }}
        onReturn={(permit, reason) => {
          updatePermit(permit.id, { status: 'returned', approval: { ...permit.approval, rejectionReason: reason } });
          addTimelineEvent(permit.id, `Returned to Requester by Safety Officer — ${reason}`, `${currentUser.name} (Safety Officer)`);
          pushToast(`${permit.id} returned to requester`, 'error');
        }}
      />
      <GateQueue
        icon={ClipboardCheck}
        title="Pending Safety Inspection"
        emptyText="Nothing awaiting inspection right now."
        permits={pendingInspection}
        actionLabel="Confirm Inspection — Send to Closure"
        onConfirm={(permit, comment) => {
          updatePermit(permit.id, { safetyInspection: { comment, by: currentUser.name, at: 'Just now' }, status: 'pending-closure' });
          addTimelineEvent(permit.id, `Safety Officer inspection complete${comment ? ` — "${comment}"` : ''}`, `${currentUser.name} (Safety Officer)`);
          addTimelineEvent(permit.id, "Awaiting Approver's final closure verification", 'System');
          pushToast(`${permit.id} cleared for final closure`);
        }}
      />
    </div>
  );
}

function GateQueue({ icon: Icon, title, emptyText, permits, actionLabel, onConfirm, onReturn }) {
  const { currentUser } = useApp();
  const [permitId, setPermitId] = useState(permits[0]?.id || null);
  const [comment, setComment] = useState('');
  const [returnOpen, setReturnOpen] = useState(false);
  const [reason, setReason] = useState('');

  const permit = permits.find((p) => p.id === permitId) || permits[0];
  const blocked = permit && isOwnPermit(permit, currentUser);

  function select(id) {
    setPermitId(id);
    setComment('');
    setReturnOpen(false);
    setReason('');
  }

  function confirm() {
    if (!permit) return;
    onConfirm(permit, comment.trim());
    setComment('');
  }

  function returnToRequester() {
    if (!permit || !reason.trim() || !onReturn) return;
    onReturn(permit, reason.trim());
    setReturnOpen(false);
    setReason('');
  }

  return (
    <div>
      <SectionLabel><span className="flex items-center gap-1.5"><Icon size={14} /> {title}</span></SectionLabel>
      <Card className="mb-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Permit #</th>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {permits.map((p) => (
              <tr key={p.id} className={`border-b border-nz-border/60 last:border-0 ${permitId === p.id ? 'bg-nz-blue-light/40' : ''}`}>
                <td className="px-4 py-2.5 font-semibold text-nz-navy">{p.id}</td>
                <td className="px-4 py-2.5 text-slate-600">{p.equipment}</td>
                <td className="px-4 py-2.5 text-slate-600">
                  {p.requester}
                  {isOwnPermit(p, currentUser) && <span className="ml-1.5 rounded-full bg-nz-red-light px-1.5 py-0.5 text-[10px] font-bold text-nz-red">YOURS</span>}
                </td>
                <td className="px-4 py-2.5">
                  <button onClick={() => select(p.id)} className="text-xs font-semibold text-nz-blue hover:underline">Select</button>
                </td>
              </tr>
            ))}
            {permits.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400">{emptyText}</td></tr>}
          </tbody>
        </table>
      </Card>

      {permit && (
        <>
          <Card className="mb-4 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-bold text-nz-navy">{permit.id} — {permit.equipment}</div>
              <StatusBadge status={permit.status} />
            </div>
            <div className="mb-3"><PTWStepper permit={permit} compact /></div>

            {blocked && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-red-light px-3 py-2 text-xs font-semibold text-nz-red">
                <ShieldAlert size={14} /> You raised this permit — you cannot action it yourself.
              </div>
            )}

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Comments (optional)</span>
              <textarea
                rows={2}
                value={comment}
                disabled={blocked}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Any notes for the record…"
                className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring disabled:opacity-60"
              />
            </label>
          </Card>

          {returnOpen && (
            <Card className="mb-4 p-4">
              <SectionLabel>Return Reason (required)</SectionLabel>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain what must change before this can be re-submitted…"
                className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
              />
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="primary" size="lg" className="flex-1" disabled={blocked} onClick={confirm}>
              {actionLabel}
            </Button>
            {onReturn && !returnOpen && (
              <Button variant="danger" size="lg" disabled={blocked} onClick={() => setReturnOpen(true)}>Return</Button>
            )}
            {onReturn && returnOpen && (
              <Button variant="danger" size="lg" disabled={blocked || !reason.trim()} onClick={returnToRequester}>Confirm Return</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
