import React, { useState } from 'react';
import { ArrowLeft, Lock, LockOpen, ShieldAlert, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

const CHECKLIST_ITEMS = [
  ['controlsBack', 'All controls back in place'],
  ['interlocksRestored', 'All interlocks restored'],
  ['guardsInPlace', 'All guards in position'],
  ['permitsSurrendered', 'All permits/agreements surrendered by crew']
];

// Phase 9 (#9 — Worker role): proper group-lockout sequencing.
// Step 1 — Apply Lock: only once the Isolation Officer's master lock is
//   already on (permit.status === 'live' implies that).
// Step 2 — Remove Lock: once removed, the Apply Lock button never comes
//   back for this worker on this permit (tracked via the `removed` flag,
//   not just `applied` — re-applying isn't offered again).
// Step 3 — Close Permit: replaces the lock buttons once the lock cycle is
//   done. Opens a completion checklist; submitting it closes out this
//   worker's part of the job.
// Step 4 — Forward: submitting moves the permit to 'pending-closure',
//   automatically landing in the Approver's queue for final verification
//   (see ApproverDashboard.jsx / VerifyIssue.jsx) — the next responsible
//   person in the chain.
export default function WorkerJobDetail({ navigate, params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast, currentUser, personalLockRegister, reservePersonalLock, releasePersonalLock } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const myEntry = permit?.workers?.find((w) => w.name === currentUser.name);
  const myLock = personalLockRegister.find((l) => l.ownerName === currentUser.name);
  const [checklist, setChecklist] = useState({ controlsBack: false, interlocksRestored: false, guardsInPlace: false, permitsSurrendered: false });
  const [showChecklist, setShowChecklist] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!permit || !myEntry) {
    return (
      <div className="px-4 py-4">
        <button onClick={() => navigate('dashboard')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
          <ArrowLeft size={15} /> Back
        </button>
        <Card className="p-4 text-sm text-slate-500">You aren't assigned to this permit.</Card>
      </div>
    );
  }

  const canAct = permit.status === 'live';
  const allChecked = Object.values(checklist).every(Boolean);

  function applyLock() {
    const reserved = reservePersonalLock(myEntry.personalLockId, permit.id);
    if (!reserved) {
      pushToast(`${myEntry.personalLockId} is already in use on another permit — cannot apply here`, 'error');
      return;
    }
    updatePermit(permit.id, {
      workers: permit.workers.map((w) => (w.name === currentUser.name ? { ...w, applied: true, appliedAt: 'Just now' } : w))
    });
    addTimelineEvent(permit.id, `Personal lock ${myEntry.personalLockId} applied`, `${currentUser.name} (Worker)`);
    pushToast(`${myEntry.personalLockId} applied — the required lock has been applied.`);
  }

  function removeLock() {
    releasePersonalLock(myEntry.personalLockId);
    updatePermit(permit.id, {
      workers: permit.workers.map((w) => (w.name === currentUser.name ? { ...w, applied: false, removed: true, removedAt: 'Just now' } : w))
    });
    addTimelineEvent(permit.id, `Personal lock ${myEntry.personalLockId} removed`, `${currentUser.name} (Worker)`);
    pushToast(`${myEntry.personalLockId} removed`);
  }

  function submitClosure() {
    const now = { name: currentUser.name, timestamp: 'Just now' };
    setSubmitted(true);
    updatePermit(permit.id, {
      status: 'pending-closure',
      closure: { ...permit.closure, requesterChecklist: checklist, requesterSigned: now, requesterDate: 'Today', requesterTime: 'Just now' }
    });
    addTimelineEvent(permit.id, 'Job Execution completed', `${currentUser.name} (Worker)`);
    addTimelineEvent(permit.id, 'Closure submitted — awaiting Approver verification', `${currentUser.name} (Worker)`);
    pushToast(`${permit.id} submitted — forwarded to the Approver for final verification`);
    setTimeout(() => navigate('dashboard'), 900);
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('dashboard')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-nz-navy">{permit.id} — {permit.equipment}</div>
          <div className="text-sm text-slate-500">{permit.location} · {permit.requester}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      <div className="mb-4 overflow-x-auto"><PTWStepper permit={permit} compact /></div>

      <Card className="mb-4 p-4">
        <SectionLabel>Your Personal Lock</SectionLabel>
        <div className="mb-3 flex items-center justify-between rounded-lg border border-nz-border bg-nz-surface px-3 py-2.5 text-sm">
          <span className="font-semibold text-nz-navy">{myEntry.personalLockId}</span>
          <span className={myEntry.applied ? 'text-nz-green font-semibold' : myEntry.removed ? 'text-slate-400' : 'text-slate-400'}>
            {myEntry.applied ? `Applied · ${myEntry.appliedAt}` : myEntry.removed ? `Removed · ${myEntry.removedAt}` : 'Not applied'}
          </span>
        </div>

        {myEntry.applied && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-green-light px-3 py-2 text-xs font-semibold text-nz-green">
            <CheckCircle2 size={14} /> The required lock has been applied.
          </div>
        )}

        {!canAct && permit.status !== 'pending-closure' && permit.status !== 'closed' && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-amber-light px-3 py-2 text-xs font-semibold text-nz-amber">
            <ShieldAlert size={14} /> Waiting on the Isolation Officer's master lock — you can apply your own lock once this permit is live.
          </div>
        )}

        {/* Step 1: Apply Lock — only offered before the lock has ever been removed */}
        {!myEntry.applied && !myEntry.removed && (
          <Button variant="primary" size="lg" className="w-full" disabled={!canAct} onClick={applyLock}>
            <Lock size={16} /> Apply Lock
          </Button>
        )}

        {/* Step 2: Remove Lock */}
        {myEntry.applied && (
          <Button variant="danger" size="lg" className="w-full" disabled={!canAct} onClick={removeLock}>
            <LockOpen size={16} /> Remove Lock — Job Complete
          </Button>
        )}

        {!myLock && <div className="mt-2 text-center text-xs text-nz-red">No personal lock is registered to your account.</div>}
      </Card>

      {/* Step 3 & 4: once the lock has been applied and removed, no more
          Apply Lock — replaced by Close Permit, which forwards the permit
          to the Approver. */}
      {myEntry.removed && !myEntry.applied && permit.status === 'live' && !submitted && (
        <Card className="mb-4 p-4">
          {!showChecklist ? (
            <Button variant="orange" size="lg" className="w-full" onClick={() => setShowChecklist(true)}>
              <ClipboardCheck size={16} /> Finish / Close Permit
            </Button>
          ) : (
            <>
              <SectionLabel>Completion Checklist</SectionLabel>
              <div className="space-y-2">
                {CHECKLIST_ITEMS.map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 rounded-lg border border-nz-border px-3 py-2.5 text-sm text-slate-700">
                    <input type="checkbox" checked={checklist[key]} onChange={(e) => setChecklist((c) => ({ ...c, [key]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>
              <Button variant="orange" size="lg" className="mt-3 w-full" disabled={!allChecked} onClick={submitClosure}>
                <CheckCircle2 size={16} /> Submit Permit
              </Button>
              {!allChecked && <div className="mt-2 text-center text-xs text-slate-400">Confirm every checkpoint above to submit.</div>}
            </>
          )}
        </Card>
      )}

      {(permit.status === 'pending-closure' || permit.status === 'closed' || submitted) && myEntry.removed && (
        <Card className="p-4 text-center text-sm font-semibold text-nz-orange">
          Submitted — awaiting Approver's final closure verification.
        </Card>
      )}
    </div>
  );
}
