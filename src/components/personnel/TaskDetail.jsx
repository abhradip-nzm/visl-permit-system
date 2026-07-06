import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, AlertOctagon, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge, WarningBanner, Card, SectionLabel, Button, SignaturePad } from '../shared/Primitives.jsx';

export default function TaskDetail({ navigate, params }) {
  const { permits } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const kind = params?.kind || (permit.status === 'issued' || permit.receiver ? 'assigned' : 'request');

  return kind === 'assigned'
    ? <AssignedVariant navigate={navigate} permit={permit} />
    : <RequestVariant navigate={navigate} permit={permit} />;
}

function RequestVariant({ navigate, permit }) {
  const { pushToast } = useApp();
  const [chat, setChat] = useState([{ from: 'hod', text: 'Please confirm equipment isolation before I sign.' }]);
  const [msg, setMsg] = useState('');

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('mytasks')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-nz-navy">{permit.id}</div>
          <div className="text-sm text-slate-500">{permit.type} · {permit.equipment}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      {permit.warnings?.length > 0 && (
        <div className="mb-4 space-y-2">
          {permit.warnings.map((w, i) => <WarningBanner key={i} text={w.text} />)}
        </div>
      )}

      <Card className="mb-4 p-4">
        <SectionLabel>Status Timeline</SectionLabel>
        <div className="space-y-3">
          {permit.timeline.map((t, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`h-2.5 w-2.5 rounded-full ${i === permit.timeline.length - 1 ? 'bg-nz-orange' : 'bg-nz-blue'}`} />
                {i < permit.timeline.length - 1 && <span className="h-full w-px flex-1 bg-nz-border" />}
              </div>
              <div className="pb-3">
                <div className="text-sm font-semibold text-nz-navy">{t.stage}</div>
                <div className="text-xs text-slate-400">{t.at} · {t.by}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {permit.lotoRequired && (
        <Card className="mb-4 p-4">
          <SectionLabel>LOTO Status</SectionLabel>
          <div className="text-sm font-semibold text-nz-amber">Pending isolation acknowledgement</div>
        </Card>
      )}

      <Card className="mb-4 p-4">
        <SectionLabel>Chat with HOD</SectionLabel>
        <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
          {chat.map((c, i) => (
            <div key={i} className={`flex ${c.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${c.from === 'me' ? 'bg-nz-blue text-white' : 'bg-nz-surface text-slate-600'}`}>
                {c.text}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!msg.trim()) return;
            setChat((c) => [...c, { from: 'me', text: msg }]);
            setMsg('');
          }}
          className="flex gap-2"
        >
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Message the HOD…"
            className="flex-1 rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-xs focus-ring"
          />
          <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-lg bg-nz-blue text-white">
            <Send size={14} />
          </button>
        </form>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => pushToast('Extension request sent to HOD')}>Request Extension</Button>
        <Button variant="danger" className="flex-1" onClick={() => pushToast('Request cancelled', 'error')}>Cancel Request</Button>
      </div>
    </div>
  );
}

function AssignedVariant({ navigate, permit }) {
  const { updatePermit, pushToast } = useApp();
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
      <button onClick={() => navigate('mytasks')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
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
            <WarningBanner text="Stop-work flag raised — HOD and Safety Officer notified. Await guidance before resuming." tone="red" />
          ) : (
            <Button variant="danger" className="w-full" onClick={() => { setStopWork(true); pushToast('Stop-work flag sent', 'error'); }}>
              <AlertOctagon size={16} /> Report Issue / Stop Work
            </Button>
          )}
        </>
      )}
    </div>
  );
}
