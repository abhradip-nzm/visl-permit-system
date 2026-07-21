import React, { useState } from 'react';
import { ArrowLeft, Camera, Send, Mic } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, WarningBanner, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';
import PermitSummary from '../shared/PermitSummary.jsx';
import DepartmentalClearanceSummary from '../shared/DepartmentalClearanceSummary.jsx';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function MonitorPermitDetail({ navigate, params }) {
  const { permits, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [obsText, setObsText] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [photo, setPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submitFlag() {
    if (!obsText.trim()) return;
    setSubmitted(true);
    pushToast('Observation logged for the record');
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('dashboard')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-nz-navy">{permit.id} <span className="text-xs font-normal text-slate-400">(read-only)</span></div>
          <div className="text-sm text-slate-500">{(permit.types || [permit.type]).join(', ')} · {permit.equipment} · {permit.location}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      <div className="mb-4 overflow-x-auto"><PTWStepper permit={permit} compact /></div>

      <PermitSummary permit={permit} />

      {permit.warnings?.length > 0 && (
        <Card className="mb-4 p-4">
          <SectionLabel>Safety Context</SectionLabel>
          <div className="space-y-2">{permit.warnings.map((w, i) => <WarningBanner key={i} text={w.text} />)}</div>
        </Card>
      )}

      {permit.status !== 'draft' && <DepartmentalClearanceSummary permit={permit} />}

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

      <Card className="p-4">
        <SectionLabel>Add Observation / Flag</SectionLabel>
        {submitted ? (
          <div className="rounded-lg bg-nz-green-light p-3 text-sm font-semibold text-nz-green">
            Observation submitted — HOD and Safety team have been notified.
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
                    severity === s ? 'bg-nz-charcoal text-nz-navy' : 'bg-nz-surface text-slate-500'
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

