import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, FileCheck2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, SignaturePad, StatusBadge } from '../shared/Primitives.jsx';

export default function VerifyIssueClose({ navigate, params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [signed, setSigned] = useState(null);

  const isClosure = permit.status === 'closure-due';
  const checks = [
    { label: 'Approvals & signatures complete', ok: permit.status !== 'blocked' },
    { label: 'LOTO status resolved', ok: !permit.lotoRequired || permit.lotoStatus === 'complete' },
    { label: 'Personnel competency valid', ok: true },
    { label: 'Equipment validity confirmed', ok: !permit.warnings?.some((w) => w.type === 'equipment') }
  ];
  const allOk = checks.every((c) => c.ok);

  function action() {
    setSigned({ name: 'N. Bose', timestamp: 'Just now' });
    if (isClosure) {
      updatePermit(permit.id, { status: 'closed' });
      addTimelineEvent(permit.id, 'Closed — job closure sent to SAP PM', 'N. Bose (Issuer)');
      pushToast(`${permit.id} closed — SAP PM notified`);
    } else {
      updatePermit(permit.id, { status: 'issued' });
      addTimelineEvent(permit.id, 'Issued', 'N. Bose (Issuer)');
      pushToast(`${permit.id} issued — receiver notified`);
    }
    setTimeout(() => navigate('dashboard'), 900);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('dashboard')} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-nz-navy">{permit.id}</div>
          <div className="text-sm text-slate-500">{permit.type} · {permit.equipment}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      <Card className="mb-4 p-4">
        <SectionLabel>{isClosure ? 'Closure Verification' : 'Pre-Issue Verification'}</SectionLabel>
        <div className="space-y-2">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-2 text-sm">
              {c.ok ? <CheckCircle2 size={16} className="text-nz-green" /> : <XCircle size={16} className="text-nz-red" />}
              <span className={c.ok ? 'text-slate-600' : 'font-semibold text-nz-red'}>{c.label}</span>
            </div>
          ))}
        </div>
        {!allOk && (
          <div className="mt-3 rounded-lg bg-nz-red-light px-3 py-2 text-xs font-semibold text-nz-red">
            Resolve the flagged item(s) above before proceeding.
          </div>
        )}
      </Card>

      {isClosure && (
        <Card className="mb-4 p-4">
          <SectionLabel>Checklist Review</SectionLabel>
          <div className="space-y-1.5">
            {permit.checklist.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-sm text-slate-600">
                <span className={`h-2 w-2 rounded-full ${c.done ? 'bg-nz-green' : 'bg-slate-300'}`} /> {c.label}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mb-4 p-4">
        <SignaturePad signed={signed} onSign={() => {}} label={isClosure ? 'Sign to close' : 'Sign to issue'} />
      </Card>

      <Button variant={isClosure ? 'primary' : 'success'} size="lg" className="w-full" disabled={!allOk || !!signed} onClick={action}>
        <FileCheck2 size={16} /> {isClosure ? 'Close Permit' : 'Issue Permit'}
      </Button>
    </div>
  );
}
