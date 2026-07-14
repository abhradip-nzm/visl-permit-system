import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, AlertOctagon, WifiOff, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge, WarningBanner, Card, SectionLabel, Button, SignaturePad } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';
import PermitSummary from '../shared/PermitSummary.jsx';

export default function TaskDetail({ navigate, params }) {
  const { permits, updatePermit, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('mytasks')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-nz-navy">{permit.id}</div>
          <div className="text-sm text-slate-500">{(permit.types || [permit.type]).join(', ')} · {permit.equipment}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      <div className="mb-4 overflow-x-auto">
        <PTWStepper permit={permit} compact />
      </div>

      {permit.warnings?.length > 0 && (
        <div className="mb-4 space-y-2">
          {permit.warnings.map((w, i) => <WarningBanner key={i} text={w.text} />)}
        </div>
      )}

      <StatusAction navigate={navigate} permit={permit} updatePermit={updatePermit} pushToast={pushToast} />

      <PermitSummary permit={permit} />

      {permit.status !== 'draft' && <ClearanceSummary permit={permit} />}

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

      <ChatWithApprover />
    </div>
  );
}

function ClearanceSummary({ permit }) {
  const rows = [
    ['Mechanical', permit.deptClearances?.Mechanical],
    ['E&I', permit.deptClearances?.['E&I']],
    ['Production', permit.deptClearances?.Production]
  ];
  return (
    <Card className="mb-4 p-4">
      <SectionLabel>G. Departmental Clearance Status</SectionLabel>
      <div className="space-y-1.5">
        {rows.map(([dept, c]) => (
          <div key={dept} className="flex items-center justify-between rounded-lg border border-nz-border px-3 py-2 text-xs">
            <span className="font-semibold text-nz-navy">{dept}</span>
            <span className={c?.status === 'cleared' ? 'text-nz-green font-semibold' : c?.status === 'not-applicable' ? 'text-slate-400' : 'text-nz-amber font-semibold'}>
              {c?.status === 'cleared' ? `Cleared — ${c.name}` : c?.status === 'not-applicable' ? 'Not Applicable' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatusAction({ navigate, permit, updatePermit, pushToast }) {
  if (permit.status === 'returned') {
    return (
      <Card className="mb-4 border-nz-red/30 bg-nz-red-light p-4">
        <SectionLabel>Returned to Requester</SectionLabel>
        <p className="mb-3 text-sm text-slate-700">{permit.approval?.rejectionReason}</p>
        <Button
          variant="danger"
          className="w-full"
          onClick={() => {
            updatePermit(permit.id, { status: 'pending-clearance' });
            pushToast(`${permit.id} corrected and resubmitted for clearance`);
          }}
        >
          <RotateCcw size={15} /> Correct & Resubmit for Clearance
        </Button>
      </Card>
    );
  }

  if (permit.status === 'pending-isolation') {
    const initiated = permit.isolationDetails?.some((d) => d.isolationPermitNo);
    return (
      <Card className="mb-4 border-nz-amber/30 bg-nz-amber-light p-4">
        <div className="mb-2 text-sm font-semibold text-nz-amber">Isolation setup required before this permit can proceed.</div>
        <Button variant="orange" className="w-full" onClick={() => navigate('isolation', { id: permit.id })}>
          {initiated ? 'View Isolation Setup' : 'Set Up Isolation Details'} <ArrowRight size={15} />
        </Button>
      </Card>
    );
  }

  if (permit.status === 'pending-declaration') {
    return (
      <Card className="mb-4 border-nz-amber/30 bg-nz-amber-light p-4">
        <div className="mb-2 text-sm font-semibold text-nz-amber">Add any additional precautions, then sign the declaration & toolbox talk.</div>
        <Button variant="orange" className="w-full" onClick={() => navigate('declare', { id: permit.id })}>
          Precautions & Declaration <ArrowRight size={15} />
        </Button>
      </Card>
    );
  }

  if (permit.status === 'live') {
    return <ExecutionAction navigate={navigate} permit={permit} pushToast={pushToast} />;
  }

  if (permit.status === 'pending-closure' && permit.closure?.requesterSigned) {
    return (
      <Card className="mb-4 border-nz-orange/30 bg-nz-orange-light p-4 text-sm font-semibold text-nz-orange">
        Closure submitted — awaiting Approver's final on-site verification.
      </Card>
    );
  }

  return null;
}

function ExecutionAction({ navigate, permit, pushToast }) {
  const { currentUser, updatePermit } = useApp();
  const [acknowledged, setAcknowledged] = useState(!!permit.declaration?.signed);
  const [signed, setSigned] = useState(permit.declaration?.signed || null);
  const [checklist, setChecklist] = useState(permit.checklist);
  const [stopWork, setStopWork] = useState(false);

  function toggleItem(id) {
    setChecklist((c) => c.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
    pushToast('Checklist saved offline — will sync', 'default');
  }

  const checklistDone = checklist.every((c) => c.done);

  return (
    <>
      <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-nz-amber-light px-3 py-2 text-xs font-semibold text-nz-amber">
        <WifiOff size={13} /> Offline-capable — changes sync automatically when connected.
      </div>

      {!acknowledged ? (
        <Card className="mb-4 p-4">
          <SectionLabel>Acknowledge Safety Briefing</SectionLabel>
          <p className="mb-3 text-sm text-slate-500">Confirm you understand the hazards, controls, and PPE requirements.</p>
          <SignaturePad signed={signed} onSign={() => { setSigned({ name: currentUser.name, timestamp: 'Just now' }); setAcknowledged(true); pushToast('Receipt acknowledged'); }} label="Sign to acknowledge" />
        </Card>
      ) : (
        <>
          <Card className="mb-4 p-4">
            <SectionLabel>Job Execution Checklist</SectionLabel>
            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-nz-surface">
              <div className="h-full rounded-full bg-nz-blue transition-all" style={{ width: `${(checklist.filter((c) => c.done).length / checklist.length) * 100}%` }} />
            </div>
            <div className="space-y-2">
              {checklist.map((c) => (
                <button key={c.id} onClick={() => toggleItem(c.id)} className="flex w-full items-center gap-2 rounded-lg border border-nz-border px-3 py-2.5 text-left text-sm">
                  <span className={`flex h-5 w-5 items-center justify-center rounded border ${c.done ? 'border-nz-green bg-nz-green text-white' : 'border-slate-300'}`}>
                    {c.done && <CheckCircle2 size={14} />}
                  </span>
                  <span className={c.done ? 'text-slate-400 line-through' : 'text-slate-700'}>{c.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {permit.criticalLift !== null && (
            <Button variant="outline" className="mb-2 w-full" onClick={() => navigate('criticallift', { id: permit.id })}>
              Critical Lift Checklist <ArrowRight size={15} />
            </Button>
          )}
          {permit.confinedSpaceMonitoring !== null && (
            <Button variant="outline" className="mb-2 w-full" onClick={() => navigate('confinedspace', { id: permit.id })}>
              Confined Space Monitoring <ArrowRight size={15} />
            </Button>
          )}
          <Button variant="outline" className="mb-2 w-full" onClick={() => navigate('transfer', { id: permit.id })}>
            Transfer Permit (Shift Change) <ArrowRight size={15} />
          </Button>

          {stopWork ? (
            <WarningBanner text="Stop-work flag raised — HOD and Safety Officer notified. Await guidance before resuming." tone="red" />
          ) : (
            <Button variant="danger" className="mb-2 w-full" onClick={() => { setStopWork(true); pushToast('Stop-work flag sent', 'error'); }}>
              <AlertOctagon size={16} /> Report Issue / Stop Work
            </Button>
          )}

          <Button
            variant="orange"
            size="lg"
            className="w-full"
            disabled={!checklistDone}
            onClick={() => navigate('closepermit', { id: permit.id })}
          >
            Close Permit — Post-Job Verification <ArrowRight size={16} />
          </Button>
          {!checklistDone && <div className="mt-2 mb-4 text-center text-xs text-slate-400">Complete the checklist above to proceed to closure.</div>}
        </>
      )}
    </>
  );
}

function ChatWithApprover() {
  const [chat, setChat] = useState([{ from: 'hod', text: 'Please confirm equipment isolation before I sign.' }]);
  const [msg, setMsg] = useState('');
  return (
    <Card className="mb-4 p-4">
      <SectionLabel>Chat with HOD</SectionLabel>
      <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
        {chat.map((c, i) => (
          <div key={i} className={`flex ${c.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${c.from === 'me' ? 'bg-nz-blue text-white' : 'bg-nz-surface text-slate-600'}`}>{c.text}</div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); if (!msg.trim()) return; setChat((c) => [...c, { from: 'me', text: msg }]); setMsg(''); }}
        className="flex gap-2"
      >
        <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message the HOD…" className="flex-1 rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-xs focus-ring" />
        <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-lg bg-nz-blue text-white"><Send size={14} /></button>
      </form>
    </Card>
  );
}
