import React, { useState } from 'react';
import { ArrowLeft, Lock, LockOpen, ShieldAlert, CheckCircle2, ClipboardCheck, PlayCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

const CHECKLIST_ITEMS = [
  ['controlsBack', 'All controls back in place'],
  ['interlocksRestored', 'All interlocks restored'],
  ['guardsInPlace', 'All guards in position'],
  ['permitsSurrendered', 'All permits/agreements surrendered by crew']
];

// Phase 9 (#9 — Worker role): two different paths depending on whether
// this permit needs isolation.
//
// Isolation required — proper group-lockout sequencing:
//   Step 1 — Apply Lock: only once the Isolation Officer's master lock is
//     already on (permit.status === 'live' implies that).
//   Step 2 — Remove Lock: once removed, Apply Lock never comes back for
//     this worker on this permit (tracked via the `removed` flag, not
//     just `applied` — re-applying isn't offered again).
//
// Isolation NOT required — no lock to apply at all:
//   Step 1 — Start Work: a plain acknowledgement that work has begun.
//
// Either way, once that first stage is done, Close Permit replaces it:
// opens a completion checklist, and submitting it moves the permit to
// 'pending-closure' — automatically landing in the Approver's queue for
// final verification (see ApproverDashboard.jsx / VerifyIssue.jsx), the
// next responsible person in the chain.
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

  const needsIsolation = !!permit.isolationRequired;
  const canAct = permit.status === 'live';
  const allChecked = Object.values(checklist).every(Boolean);
  const readyToClose = needsIsolation ? (myEntry.removed && !myEntry.applied) : myEntry.started;

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

  function startWork() {
    updatePermit(permit.id, {
      workers: permit.workers.map((w) => (w.name === currentUser.name ? { ...w, started: true, startedAt: 'Just now' } : w))
    });
    addTimelineEvent(permit.id, 'Work started — no isolation required for this permit', `${currentUser.name} (Worker)`);
    pushToast('Work started');
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

      {needsIsolation ? (
        <Card className="mb-4 p-4">
          <SectionLabel>Your Personal Lock</SectionLabel>
          <div className="mb-3 flex items-center justify-between rounded-lg border border-nz-border bg-nz-surface px-3 py-2.5 text-sm">
            <span className="font-semibold text-nz-navy">{myEntry.personalLockId}</span>
            <span className={myEntry.applied ? 'text-nz-green font-semibold' : 'text-slate-400'}>
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
      ) : (
        !readyToClose && (
          <Card className="mb-4 p-4">
            <SectionLabel>Job Execution</SectionLabel>
            <p className="mb-3 text-xs text-slate-400">This permit doesn't require isolation — no lock to apply. Start the work when you're ready.</p>
            {!canAct && permit.status !== 'pending-closure' && permit.status !== 'closed' && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-amber-light px-3 py-2 text-xs font-semibold text-nz-amber">
                <ShieldAlert size={14} /> Waiting for the permit to go live before you can start.
              </div>
            )}
            <Button variant="primary" size="lg" className="w-full" disabled={!canAct} onClick={startWork}>
              <PlayCircle size={16} /> Start Work
            </Button>
          </Card>
        )
      )}

      {/* Close Permit: replaces the lock/start step once that stage is
          done, and forwards the permit to the Approver. */}
      {readyToClose && permit.status === 'live' && !submitted && (
        <Card className="mb-4 p-4">
          {!needsIsolation && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-green-light px-3 py-2 text-xs font-semibold text-nz-green">
              <CheckCircle2 size={14} /> Work started · {myEntry.startedAt}
            </div>
          )}
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

      {(permit.status === 'pending-closure' || permit.status === 'closed' || submitted) && readyToClose && (
        <Card className="p-4 text-center text-sm font-semibold text-nz-orange">
          Submitted — awaiting Approver's final closure verification.
        </Card>
      )}
    </div>
  );
}
