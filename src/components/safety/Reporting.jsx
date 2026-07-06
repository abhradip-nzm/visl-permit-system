import React, { useState } from 'react';
import { ArrowLeft, Camera, Mic, Send } from 'lucide-react';
import { OBSERVATIONS, SAFETY_ALERTS, COMPLAINTS } from '../../data/observationsData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, Button } from '../shared/Primitives.jsx';

const TABS = ['My Reports', 'Create Report', 'Alerts', 'Complaints'];
const TYPES = ['Observation', 'Near-Miss', 'Unsafe Act', 'Complaint'];

export default function Reporting({ navigate }) {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('dashboard')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <h2 className="mb-3 text-lg font-bold text-nz-navy">Reporting, Alerts & Complaints</h2>

      <div className="mb-4 flex gap-1.5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${tab === t ? 'bg-nz-blue text-white' : 'border border-nz-border bg-white text-slate-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'My Reports' && (
        <div className="space-y-2">
          {OBSERVATIONS.map((o) => (
            <Card key={o.id} className="p-3">
              <div className="mb-0.5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">{o.type}</span>
                <span className={`text-xs font-semibold ${o.severity === 'High' ? 'text-nz-red' : 'text-nz-amber'}`}>{o.severity}</span>
              </div>
              <div className="text-sm text-slate-700">{o.text}</div>
              <div className="mt-1 text-xs text-slate-400">{o.location} · {o.date}</div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Create Report' && <CreateReport />}

      {tab === 'Alerts' && (
        <div className="space-y-2">
          {SAFETY_ALERTS.map((a) => (
            <div key={a.id} className={`rounded-lg border px-3 py-2.5 text-sm ${a.severity === 'High' ? 'border-nz-red/30 bg-nz-red-light text-nz-red' : 'border-nz-amber/30 bg-nz-amber-light text-nz-amber'}`}>
              <div className="font-semibold">{a.text}</div>
              <div className="text-xs opacity-70">Source: {a.source}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Complaints' && (
        <div className="space-y-2">
          {COMPLAINTS.map((c) => (
            <Card key={c.id} className="p-3">
              <div className="text-sm text-slate-700">{c.text}</div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>{c.submittedBy} · {c.date}</span>
                <span className={`font-semibold ${c.status === 'Resolved' ? 'text-nz-green' : 'text-nz-amber'}`}>{c.status}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateReport() {
  const { pushToast } = useApp();
  const [type, setType] = useState('Observation');
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(false);

  function submit() {
    if (!text.trim()) return;
    pushToast('Report submitted');
    setText('');
  }

  return (
    <Card className="p-4">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${type === t ? 'bg-nz-navy text-white' : 'bg-nz-surface text-slate-500'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the issue (NLP / voice supported)…"
        className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
      />
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => setPhoto(true)} className="flex items-center gap-1 rounded-full border border-nz-border px-3 py-1.5 text-xs font-semibold text-slate-500">
          <Camera size={13} /> {photo ? 'Photo attached' : 'Attach evidence'}
        </button>
        <button className="flex items-center gap-1 rounded-full border border-nz-border px-3 py-1.5 text-xs font-semibold text-slate-500">
          <Mic size={13} /> Voice
        </button>
      </div>
      <Button variant="danger" className="mt-3 w-full" onClick={submit}>
        <Send size={15} /> Submit
      </Button>
    </Card>
  );
}
