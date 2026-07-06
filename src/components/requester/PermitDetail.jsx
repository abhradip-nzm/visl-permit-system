import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StatusBadge, WarningBanner, Card, SectionLabel } from '../shared/Primitives.jsx';

export default function PermitDetail({ navigate, params }) {
  const { permits } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [chat, setChat] = useState([{ from: 'approver', text: 'Please confirm equipment isolation before I sign.' }]);
  const [msg, setMsg] = useState('');

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('mypermits')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
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

      <Card className="p-4">
        <SectionLabel>Chat with Approver</SectionLabel>
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
            placeholder="Message the approver…"
            className="flex-1 rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-xs focus-ring"
          />
          <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-lg bg-nz-blue text-white">
            <Send size={14} />
          </button>
        </form>
      </Card>
    </div>
  );
}
