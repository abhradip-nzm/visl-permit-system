import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button } from '../shared/Primitives.jsx';

const MY_CERTS = [
  { type: 'Hot Work', status: 'expiring', expiresInDays: 4 },
  { type: 'Working at Height', status: 'valid', expiresInDays: 180 },
  { type: 'First Aid', status: 'valid', expiresInDays: 365 }
];

export default function CompetencyDashboard() {
  const { pushToast } = useApp();
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="px-4 py-4">
      <h2 className="mb-4 text-lg font-bold text-nz-navy">My Competency</h2>

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
          <Button
            variant="orange"
            className="w-full"
            onClick={() => { setUploaded(true); pushToast('Renewal certificate uploaded'); }}
          >
            <Upload size={15} /> Upload Renewed Certificate
          </Button>
        )}
      </Card>
    </div>
  );
}
