import React from 'react';
import { CheckCircle2, XCircle, MapPin } from 'lucide-react';
import { COMPLIANCE_REQUESTS } from '../../data/complianceData.js';
import { GEOFENCE_LOCATIONS } from '../../data/certificationsData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, Button, SectionLabel } from '../shared/Primitives.jsx';

export default function Compliance() {
  const { pushToast } = useApp();

  return (
    <div>
      <SectionLabel>Incoming Compliance Requests</SectionLabel>
      <Card className="mb-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Request ID</th>
              <th className="px-4 py-3">Personnel</th>
              <th className="px-4 py-3">Compliance Type</th>
              <th className="px-4 py-3">Current Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {COMPLIANCE_REQUESTS.map((r) => (
              <tr key={r.id} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                <td className="px-4 py-2.5 font-semibold text-nz-navy">{r.id}</td>
                <td className="px-4 py-2.5 text-slate-600">{r.personnel}</td>
                <td className="px-4 py-2.5 text-slate-600">{r.complianceType}</td>
                <td className="px-4 py-2.5 text-nz-red font-semibold">{r.currentStatus}</td>
                <td className="px-4 py-2.5 text-slate-500">{r.date}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-2">
                    <Button variant="success" size="sm" onClick={() => pushToast(`${r.id} approved`)}><CheckCircle2 size={13} /></Button>
                    <Button variant="danger" size="sm" onClick={() => pushToast(`${r.id} rejected`, 'error')}><XCircle size={13} /></Button>
                    <Button variant="outline" size="sm" onClick={() => pushToast(`${r.id} forwarded to Safety Officer`)}>Forward</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <SectionLabel>Department Certification Overview — Geofence Linkage</SectionLabel>
      <div className="grid grid-cols-2 gap-4">
        {GEOFENCE_LOCATIONS.map((z) => (
          <Card key={z.zone} className="p-4">
            <div className="mb-1 flex items-center gap-2 text-sm font-bold text-nz-navy"><MapPin size={14} className="text-nz-orange" /> {z.zone}</div>
            <div className="text-xs text-slate-500">Required certifications: {z.requiredCerts.join(', ')}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
