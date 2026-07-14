import React, { useState } from 'react';
import { ArrowLeft, Camera, Lock, LockOpen, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { LOCKS } from '../../data/mockData.js';
import { Card, SectionLabel, Button, SignaturePad } from '../shared/Primitives.jsx';

export default function LotoExecution({ navigate, params }) {
  const { currentUser, permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [selectedLock, setSelectedLock] = useState(null);
  const [photo, setPhoto] = useState(false);
  const [signed, setSigned] = useState(null);
  const [released, setReleased] = useState(false);

  const availableLocks = LOCKS.filter((l) => !l.hidden);
  const isComplete = permit.lotoStatus === 'complete';

  function acknowledgeLockout() {
    setSigned({ name: currentUser.name, timestamp: 'Just now' });
    updatePermit(permit.id, { lotoStatus: 'complete' });
    addTimelineEvent(permit.id, `LOTO applied — ${selectedLock.id}`, currentUser.name);
    pushToast('Lock reserved system-wide — LOTO acknowledged');
  }

  function releaseLock() {
    updatePermit(permit.id, { lotoStatus: 'released' });
    addTimelineEvent(permit.id, `LOTO released — ${selectedLock?.id || 'lock'}`, currentUser.name);
    setReleased(true);
    pushToast('Lock released — reservation lifted');
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('loto')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-4">
        <div className="text-lg font-bold text-nz-navy">{permit.id}</div>
        <div className="text-sm text-slate-500">{permit.equipment} · {permit.location}</div>
      </div>

      {!isComplete && !signed ? (
        <>
          <Card className="mb-4 p-4">
            <SectionLabel>Start Request — Select Certified Lock Device</SectionLabel>
            <div className="space-y-2">
              {availableLocks.map((l) => (
                <button
                  key={l.id}
                  disabled={l.status !== 'available'}
                  onClick={() => setSelectedLock(l)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm ${
                    selectedLock?.id === l.id ? 'border-nz-blue bg-nz-blue-light' : 'border-nz-border'
                  } ${l.status !== 'available' ? 'opacity-40' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <Lock size={14} /> {l.id} — {l.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {l.status === 'available' ? 'Available' : `Reserved (${l.reservedFor})`}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-400">LK-176 is hidden — its certification has expired.</div>
          </Card>

          {selectedLock && (
            <Card className="mb-4 p-4">
              <SectionLabel>Isolation Steps</SectionLabel>
              <ol className="list-decimal space-y-1 pl-4 text-sm text-slate-600">
                <li>De-energize drive / power source</li>
                <li>Lock main breaker or isolation valve</li>
                <li>Bleed residual stored energy</li>
                <li>Apply lock + tag: <span className="font-semibold">{selectedLock.id}</span></li>
                <li>Upload photo evidence & acknowledge</li>
              </ol>
              <button
                onClick={() => { setPhoto(true); pushToast('Evidence photo attached'); }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-nz-border py-3 text-sm font-semibold text-slate-500"
              >
                <Camera size={16} /> {photo ? 'Photo attached' : 'Upload evidence photo'}
              </button>
            </Card>
          )}

          {selectedLock && photo && (
            <Card className="mb-4 p-4">
              <SignaturePad signed={signed} onSign={acknowledgeLockout} label="Sign to acknowledge lockout" />
            </Card>
          )}
        </>
      ) : (
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-green-light px-3 py-2 text-sm font-semibold text-nz-green">
            <CheckCircle2 size={16} /> Lock {selectedLock?.id || 'LK-207'} reserved system-wide
          </div>
          {!released ? (
            <Button variant="outline" className="w-full" onClick={releaseLock}>
              <LockOpen size={15} /> End Request — Release Lock
            </Button>
          ) : (
            <div className="rounded-lg bg-nz-blue-light px-3 py-2 text-sm font-semibold text-nz-blue-dark">
              Lock released — reservation lifted and event logged.
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
