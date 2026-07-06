import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { COMPLIANCE_ITEMS, COMPLIANCE_VERSIONS } from '../../data/complianceData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button } from '../shared/Primitives.jsx';

export default function Compliance() {
  const { pushToast } = useApp();

  return (
    <div className="px-4 py-4">
      <h2 className="mb-4 text-lg font-bold text-nz-navy">Compliance</h2>

      <SectionLabel>Compliance Monitoring</SectionLabel>
      <div className="mb-4 space-y-2">
        {COMPLIANCE_ITEMS.map((c) => (
          <Card key={c.certType} className="p-3">
            <div className="mb-1 flex items-center justify-between">
              <div className="font-bold text-nz-navy">{c.certType}</div>
              <div className="text-xs text-slate-400">{c.personnelCount} personnel</div>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full bg-nz-surface">
              <div className="bg-nz-green" style={{ width: `${c.pctValid}%` }} />
              <div className="bg-nz-amber" style={{ width: `${c.pctExpiring}%` }} />
              <div className="bg-nz-red" style={{ width: `${c.pctExpired}%` }} />
            </div>
            <div className="mt-1 flex gap-3 text-[11px] text-slate-500">
              <span>{c.pctValid}% valid</span><span>{c.pctExpiring}% expiring</span><span>{c.pctExpired}% expired</span>
            </div>
            <button onClick={() => pushToast(`Renewal requested for ${c.certType}`)} className="mt-2 text-xs font-semibold text-nz-blue hover:underline">
              Request Renewal →
            </button>
          </Card>
        ))}
      </div>

      <SectionLabel>Compliance Version Updates</SectionLabel>
      <div className="space-y-2">
        {COMPLIANCE_VERSIONS.map((v) => (
          <Card key={v.document} className="p-3">
            <div className="font-semibold text-nz-navy">{v.document}</div>
            <div className="text-xs text-slate-500">Current: {v.currentVersion}</div>
            {v.updateAvailable ? (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => pushToast(`${v.document} updated to ${v.latestVersion}`)}>
                <RefreshCcw size={12} /> Update to {v.latestVersion}
              </Button>
            ) : (
              <div className="mt-2 text-xs text-nz-green">Up to date</div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
