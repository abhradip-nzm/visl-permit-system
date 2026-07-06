import React, { useState } from 'react';
import { ArrowLeft, Camera, Send, Mic } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, WarningBanner, StatusBadge } from '../shared/Primitives.jsx';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function MonitorDetail({ navigate, params }) {
  const { permits, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [obsText, setObsText] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [photo, setPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submitFlag() {
    if (!obsText.trim()) return;
    setSubmitted(true);
    pushToast('Observation logged and routed to Issuer & Safety team');
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-nz-navy">{permit.id} <span className="text-sm font-normal text-slate-400">(read-only)</span></div>
          <div className="text-sm text-slate-500">{permit.type} · {permit.equipment} · {permit.location}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      {permit.warnings?.length > 0 && (
        <Card className="mb-4 p-4">
          <SectionLabel>Safety Context</SectionLabel>
          <div className="space-y-2">{permit.warnings.map((w, i) => <WarningBanner key={i} text={w.text} />)}</div>
        </Card>
      )}

      <Card className="mb-4 p-4">
        <SectionLabel>Checklist Progress</SectionLabel>
        <div className="space-y-1.5">
          {permit.checklist.map((c) => (
            <div key={c.id} className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`h-2 w-2 rounded-full ${c.done ? 'bg-nz-green' : 'bg-slate-300'}`} /> {c.label}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <SectionLabel>Add Observation / Flag</SectionLabel>
        {submitted ? (
          <div className="rounded-lg bg-nz-green-light p-3 text-sm font-semibold text-nz-green">
            Observation submitted — Issuer and Safety Officer have been notified.
          </div>
        ) : (
          <>
            <textarea
              rows={3}
              value={obsText}
              onChange={(e) => setObsText(e.target.value)}
              placeholder="Describe the concern (voice input also supported)…"
              className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    severity === s ? 'bg-nz-navy text-white' : 'bg-nz-surface text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
              <button onClick={() => setPhoto(true)} className="ml-auto flex items-center gap-1 rounded-full border border-nz-border px-3 py-1 text-xs font-semibold text-slate-500">
                <Camera size={13} /> {photo ? 'Photo attached' : 'Attach photo'}
              </button>
              <button className="flex items-center gap-1 rounded-full border border-nz-border px-3 py-1 text-xs font-semibold text-slate-500">
                <Mic size={13} /> Voice
              </button>
            </div>
            <Button variant="danger" className="mt-3 w-full" onClick={submitFlag}>
              <Send size={15} /> Submit Observation
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
