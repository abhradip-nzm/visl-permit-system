import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Ban } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { CLEARANCE_DEPARTMENTS } from '../../data/ptwFormData.js';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PermitSummary from '../shared/PermitSummary.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

export default function DepartmentalClearance({ navigate, params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [clearances, setClearances] = useState(permit.deptClearances);
  const [itApproval, setItApproval] = useState(clearances.itApproval);
  const [ohcInformed, setOhcInformed] = useState(clearances.ohcInformed);

  const allResolved = CLEARANCE_DEPARTMENTS.every((d) => clearances[d]?.status !== 'pending');

  function setDeptStatus(dept, status) {
    setClearances((c) => ({ ...c, [dept]: { status, name: 'D. Fernandes', datetime: 'Just now' } }));
  }

  function advance() {
    const merged = { ...clearances, itApproval, ohcInformed };
    updatePermit(permit.id, {
      deptClearances: merged,
      status: permit.isolationRequired ? 'pending-isolation' : 'pending-declaration'
    });
    addTimelineEvent(permit.id, 'Departmental Clearance granted', 'D. Fernandes (HOD)');
    addTimelineEvent(permit.id, permit.isolationRequired ? 'Awaiting Isolation Setup' : 'Awaiting Precautions & Declaration', 'System');
    pushToast(`${permit.id} cleared — ${permit.isolationRequired ? 'routed to Isolation Setup' : 'routed to Declaration'}`);
    setTimeout(() => navigate('dashboard'), 900);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('dashboard')} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back to dashboard
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-nz-navy">Departmental Clearance — {permit.id}</div>
          <div className="text-sm text-slate-500">{(permit.types || [permit.type]).join(', ')} · {permit.equipment} · {permit.location}</div>
        </div>
        <StatusBadge status={permit.status} />
      </div>

      <div className="mb-4"><PTWStepper permit={permit} /></div>

      <PermitSummary permit={permit} defaultOpen />

      <Card className="mb-4 p-4">
        <SectionLabel>G. Clearance from Concerned Department</SectionLabel>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="py-2">Department</th><th className="py-2">Status</th><th className="py-2">Cleared By</th><th className="py-2">Date & Time</th><th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {CLEARANCE_DEPARTMENTS.map((dept) => {
              const c = clearances[dept];
              return (
                <tr key={dept} className="border-b border-nz-border/60 last:border-0">
                  <td className="py-2.5 font-semibold text-nz-navy">{dept}</td>
                  <td className="py-2.5">
                    <span className={c.status === 'cleared' ? 'font-semibold text-nz-green' : c.status === 'not-applicable' ? 'text-slate-400' : 'font-semibold text-nz-amber'}>
                      {c.status === 'cleared' ? 'Cleared' : c.status === 'not-applicable' ? 'Not Applicable' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">{c.name || '—'}</td>
                  <td className="py-2.5 text-slate-500">{c.datetime || '—'}</td>
                  <td className="py-2.5">
                    {c.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button variant="success" size="sm" onClick={() => setDeptStatus(dept, 'cleared')}><CheckCircle2 size={13} /> Grant</Button>
                        <Button variant="outline" size="sm" onClick={() => setDeptStatus(dept, 'not-applicable')}><Ban size={13} /> N/A</Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-4 space-y-2 border-t border-nz-border pt-3">
          <label className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">IT Approval required?</span>
            <input type="checkbox" checked={itApproval.required} onChange={(e) => setItApproval((i) => ({ ...i, required: e.target.checked }))} />
          </label>
          {itApproval.required && (
            <label className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-600">IT Approval granted</span>
              <input type="checkbox" checked={itApproval.granted} onChange={(e) => setItApproval((i) => ({ ...i, granted: e.target.checked }))} />
            </label>
          )}
          <label className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">Informed to OHC (road blockage)</span>
            <input type="checkbox" checked={ohcInformed} onChange={(e) => setOhcInformed(e.target.checked)} />
          </label>
        </div>
      </Card>

      <Button variant="success" size="lg" className="w-full" disabled={!allResolved} onClick={advance}>
        <CheckCircle2 size={16} /> Confirm Clearance & Continue →
      </Button>
      {!allResolved && <div className="mt-2 text-center text-xs text-slate-400">Resolve every department row (Grant or mark Not Applicable) to continue.</div>}
    </div>
  );
}
