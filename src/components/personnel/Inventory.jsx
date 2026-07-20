import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { INSTRUMENTS } from '../../data/instrumentsData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button } from '../shared/Primitives.jsx';

const TABS = ['My Instruments', 'My Certifications'];
const MY_CERTS = [
  { type: 'Hot Work', status: 'expiring', expiresInDays: 4 },
  { type: 'Working at Height', status: 'valid', expiresInDays: 180 },
  { type: 'First Aid', status: 'valid', expiresInDays: 365 }
];

export default function Inventory({ navigate }) {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <div className="px-4 py-4">
      <h2 className="mb-4 text-lg font-bold text-nz-navy">Inventory</h2>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold ${tab === t ? 'bg-nz-blue text-white' : 'border border-nz-border bg-white text-slate-500'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'My Instruments' ? <MyInstruments navigate={navigate} /> : <MyCertifications />}
    </div>
  );
}

function MyInstruments({ navigate }) {
  const { currentUser } = useApp();
  const mine = INSTRUMENTS.filter((i) => i.assignedTo === currentUser.name);
  return (
    <div>
      <button
        onClick={() => navigate('create', null)}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl2 border-2 border-dashed border-nz-border bg-white py-3 text-sm font-semibold text-slate-500"
      >
        <Plus size={15} /> Request New Instrument
      </button>
      <div className="space-y-2">
        {mine.map((i) => (
          <Card key={i.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-nz-navy">{i.name}</div>
              <span className={`text-xs font-semibold ${i.calibrationStatus === 'valid' ? 'text-nz-green' : 'text-nz-red'}`}>{i.calibrationStatus}</span>
            </div>
            <div className="text-xs text-slate-400">{i.type} · Calibrated {i.calibrationDate}</div>
          </Card>
        ))}
        {mine.length === 0 && <div className="py-6 text-center text-xs text-slate-400">No instruments currently assigned to you.</div>}
      </div>
    </div>
  );
}

function MyCertifications() {
  const { pushToast } = useApp();
  const [uploaded, setUploaded] = useState(false);

  return (
    <div>
      <Card className="mb-4 p-4">
        <SectionLabel>Certifications</SectionLabel>
        <div className="space-y-2">
          {MY_CERTS.map((c) => (
            <div key={c.type} className="flex items-center justify-between rounded-lg border border-nz-border px-3 py-2.5">
              <div>
                <div className="text-sm font-semibold text-nz-navy">{c.type}</div>
                <div className="text-xs text-slate-400">
                  {c.status === 'expiring' ? `Expires in ${c.expiresInDays} days` : `Valid — ${c.expiresInDays} days remaining`}
                </div>
              </div>
              {c.status === 'expiring' ? (
                <AlertTriangle size={18} className="text-nz-amber" />
              ) : (
                <CheckCircle2 size={18} className="text-nz-green" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>My Assignments</SectionLabel>
        <div className="rounded-lg bg-nz-surface p-3 text-sm text-slate-600">
          <span className="font-semibold text-nz-navy">WP-1031</span> — Mechanical, Crushing Plant. Competency match: ✅
        </div>
      </Card>

      <Card className="p-4">
        <SectionLabel>Renewal</SectionLabel>
        {uploaded ? (
          <div className="rounded-lg bg-nz-green-light px-3 py-2.5 text-sm font-semibold text-nz-green">
            Renewal submitted for Super Admin verification.
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="orange"
              className="w-full"
              onClick={() => { setUploaded(true); pushToast('Renewal certificate uploaded'); }}
            >
              <Upload size={15} /> Upload Renewed Certificate
            </Button>
            <Button variant="outline" className="w-full" onClick={() => pushToast('Renewal request sent to HOD / Safety Officer')}>
              Request Renewal
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
