import React from 'react';
import { ArrowLeft, Lock, LockOpen, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

// Phase 9 (#9 — Worker role): proper group-lockout sequencing. A Worker can
// only apply their personal lock once the Isolation Officer's master lock
// is already on (permit.status === 'live' implies that, since a permit that
// needs isolation can't reach 'live' until LotoApprovals.jsx verifies it).
// Removing the lock is the mirror action, and must happen before the
// Isolation Officer can de-isolate (enforced in LotoApprovals.jsx's
// DeIsolationSection via the `applied` flag on permit.workers).
export default function WorkerJobDetail({ navigate, params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast, currentUser, personalLockRegister, reservePersonalLock, releasePersonalLock } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const myEntry = permit?.workers?.find((w) => w.name === currentUser.name);
  const myLock = personalLockRegister.find((l) => l.ownerName === currentUser.name);

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
    pushToast(`${myEntry.personalLockId} applied — you're locked in for this job`);
  }

  function removeLock() {
    releasePersonalLock(myEntry.personalLockId);
    updatePermit(permit.id, {
      workers: permit.workers.map((w) => (w.name === currentUser.name ? { ...w, applied: false, appliedAt: null } : w))
    });
    addTimelineEvent(permit.id, `Personal lock ${myEntry.personalLockId} removed`, `${currentUser.name} (Worker)`);
    pushToast(`${myEntry.personalLockId} removed`);
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
          <span className={myEntry.applied ? 'text-nz-green font-semibold' : 'text-slate-400'}>
            {myEntry.applied ? `Applied · ${myEntry.appliedAt}` : 'Not applied'}
          </span>
        </div>

        {!canAct && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-amber-light px-3 py-2 text-xs font-semibold text-nz-amber">
            <ShieldAlert size={14} /> Waiting on the Isolation Officer's master lock — you can apply your own lock once this permit is live.
          </div>
        )}

        {myEntry.applied ? (
          <Button variant="danger" size="lg" className="w-full" disabled={!canAct} onClick={removeLock}>
            <LockOpen size={16} /> Remove My Lock — Job Complete
          </Button>
        ) : (
          <Button variant="primary" size="lg" className="w-full" disabled={!canAct} onClick={applyLock}>
            <Lock size={16} /> Apply My Lock ({myEntry.personalLockId})
          </Button>
        )}
        {!myLock && <div className="mt-2 text-center text-xs text-nz-red">No personal lock is registered to your account.</div>}
      </Card>
    </div>
  );
}
