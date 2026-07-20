import React, { useState } from 'react';
import { RefreshCw, MapPin } from 'lucide-react';
import { PERSONNEL } from '../../data/mockData.js';
import { CERTIFICATION_TYPES, GEOFENCE_LOCATIONS } from '../../data/certificationsData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, Button, StatusBadge } from '../shared/Primitives.jsx';

const TABS = ['Certification Types', 'Personnel Certifications', 'Geofence Locations'];

export default function Certifications() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <div>
      <div className="mb-4 flex gap-2 border-b border-nz-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold ${tab === t ? 'border-b-2 border-nz-blue text-nz-blue' : 'text-slate-500'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'Certification Types' && <TypesTab />}
      {tab === 'Personnel Certifications' && <PersonnelTab />}
      {tab === 'Geofence Locations' && <GeofenceTab />}
    </div>
  );
}

function TypesTab() {
  const { pushToast } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" onClick={() => pushToast('Certification type created')}>Create Type</Button>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-2.5">Certification Type</th>
              <th className="px-4 py-2.5">Validity</th>
              <th className="px-4 py-2.5">Required For</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {CERTIFICATION_TYPES.map((c) => (
              <tr key={c.type} className="border-b border-nz-border/60 last:border-0">
                <td className="px-4 py-2.5 font-semibold text-nz-navy">{c.type}</td>
                <td className="px-4 py-2.5 text-slate-600">{c.validityMonths} months</td>
                <td className="px-4 py-2.5 text-slate-500">{c.requiredFor.join(', ')}</td>
                <td className="px-4 py-2.5"><button onClick={() => pushToast(`Editing ${c.type}`)} className="text-sm font-semibold text-nz-blue hover:underline">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function PersonnelTab() {
  const { pushToast } = useApp();
  const [syncing, setSyncing] = useState(false);
  const rows = PERSONNEL.flatMap((p) => p.certifications.map((c) => ({ person: p.name, ...c })));

  function sync() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      pushToast('Portal sync complete — 3 records updated');
    }, 1400);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={sync} disabled={syncing}>
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} /> {syncing ? 'Syncing…' : 'Sync from Portal'}
        </Button>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-2.5">Person</th>
              <th className="px-4 py-2.5">Cert Type</th>
              <th className="px-4 py-2.5">Expires In</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-nz-border/60 last:border-0">
                <td className="px-4 py-2.5 font-semibold text-nz-navy">{r.person}</td>
                <td className="px-4 py-2.5 text-slate-600">{r.type}</td>
                <td className="px-4 py-2.5 text-slate-500">{r.expiresInDays >= 0 ? `${r.expiresInDays} days` : `${Math.abs(r.expiresInDays)} days ago`}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={r.status === 'valid' ? 'approved' : r.status === 'expiring' ? 'closure-due' : 'rejected'} />
                </td>
                <td className="px-4 py-2.5"><button onClick={() => pushToast('Opening evidence document (mock)')} className="text-sm font-semibold text-nz-blue hover:underline">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function GeofenceTab() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {GEOFENCE_LOCATIONS.map((z) => (
        <Card key={z.zone} className="p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-nz-navy"><MapPin size={14} className="text-nz-orange" /> {z.zone}</div>
          <div className="mb-2 flex h-28 items-center justify-center rounded-lg bg-nz-surface text-xs text-slate-400">Static map placeholder</div>
          <div className="text-xs text-slate-500">Lat/Long: {z.lat}, {z.long} · Radius: {z.radiusMeters}m</div>
          <div className="mt-1 text-xs text-slate-500">Required certs: {z.requiredCerts.join(', ')}</div>
        </Card>
      ))}
    </div>
  );
}
