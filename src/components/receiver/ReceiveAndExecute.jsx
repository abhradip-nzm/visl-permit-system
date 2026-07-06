import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertOctagon, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, SignaturePad, WarningBanner } from '../shared/Primitives.jsx';

export default function ReceiveAndExecute({ navigate, params }) {
  const { permits, updatePermit, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [acknowledged, setAcknowledged] = useState(false);
  const [signed, setSigned] = useState(null);
  const [checklist, setChecklist] = useState(permit.checklist);
  const [stopWork, setStopWork] = useState(false);

  function toggleItem(id) {
    setChecklist((c) => c.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
    pushToast('Checklist saved offline — will sync', 'default');
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('mypermits')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-nz-amber-light px-3 py-2 text-xs font-semibold text-nz-amber">
        <WifiOff size={13} /> Offline-capable — changes sync automatically when connected.
      </div>

      <Card className="mb-4 p-4">
        <SectionLabel>Safety Briefing</SectionLabel>
        <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
          <div><span className="font-semibold text-slate-400">Hazards:</span> {permit.hazards.join(', ')}</div>
          <div><span className="font-semibold text-slate-400">Controls:</span> {permit.controls.join(', ')}</div>
          <div><span className="font-semibold text-slate-400">PPE:</span> {permit.ppe.join(', ')}</div>
        </div>
      </Card>

      {!acknowledged ? (
        <Card className="mb-4 p-4">
          <SectionLabel>Acknowledge Receipt</SectionLabel>
          <p className="mb-3 text-sm text-slate-500">Confirm you understand the safety requirements above.</p>
          <SignaturePad signed={signed} onSign={() => { setSigned({ name: 'S. Iyer', timestamp: 'Just now' }); setAcknowledged(true); pushToast('Receipt acknowledged'); }} label="Sign to acknowledge" />
        </Card>
      ) : (
        <>
          <Card className="mb-4 p-4">
            <SectionLabel>Checklist Execution</SectionLabel>
            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-nz-surface">
              <div
                className="h-full rounded-full bg-nz-blue transition-all"
                style={{ width: `${(checklist.filter((c) => c.done).length / checklist.length) * 100}%` }}
              />
            </div>
            <div className="space-y-2">
              {checklist.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleItem(c.id)}
                  className="flex w-full items-center gap-2 rounded-lg border border-nz-border px-3 py-2.5 text-left text-sm"
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded border ${c.done ? 'border-nz-green bg-nz-green text-white' : 'border-slate-300'}`}>
                    {c.done && <CheckCircle2 size={14} />}
                  </span>
                  <span className={c.done ? 'text-slate-400 line-through' : 'text-slate-700'}>{c.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {stopWork ? (
            <WarningBanner text="Stop-work flag raised — Issuer and Safety Officer notified. Await guidance before resuming." tone="red" />
          ) : (
            <Button variant="danger" className="w-full" onClick={() => { setStopWork(true); pushToast('Stop-work flag sent', 'error'); }}>
              <AlertOctagon size={16} /> Raise Stop-Work / Safety Flag
            </Button>
          )}
        </>
      )}
    </div>
  );
}
