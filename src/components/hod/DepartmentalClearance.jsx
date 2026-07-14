import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Ban, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { isOwnPermit } from '../../utils/segregationOfDuties.js';
import { CLEARANCE_DEPARTMENTS } from '../../data/ptwFormData.js';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PermitSummary from '../shared/PermitSummary.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

export default function DepartmentalClearance({ navigate, params }) {
  const { currentUser, currentDepartment, permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const [clearances, setClearances] = useState(permit.deptClearances);
  const [itApproval, setItApproval] = useState(clearances.itApproval);
  const [ohcInformed, setOhcInformed] = useState(clearances.ohcInformed);
  const [comments, setComments] = useState({});
  const blocked = isOwnPermit(permit, currentUser);

  const allResolved = CLEARANCE_DEPARTMENTS.every((d) => clearances[d]?.status !== 'pending');

  // H-2: every clearance/approval touchpoint can carry an optional comment,
  // not just the Return-to-Requester path — it's persisted on the
  // department's own clearance record and echoed into the timeline so the
  // requester and other Approvers can see it without opening this screen.
  //
  // C-4: each department's grant is its own Approver's action and must
  // persist immediately — it can no longer wait on the bundled "Continue"
  // click, since that click may never come from an Approver who isn't
  // scoped to every outstanding department on this permit.
  function setDeptStatus(dept, status) {
    const comment = comments[dept]?.trim();
    const updated = { ...clearances, [dept]: { status, name: currentUser.name, datetime: 'Just now', comment: comment || '' } };
    setClearances(updated);
    updatePermit(permit.id, { deptClearances: { ...updated, itApproval, ohcInformed } });
    const verb = status === 'cleared' ? 'granted' : 'marked not applicable';
    addTimelineEvent(permit.id, `${dept} clearance ${verb}${comment ? ` — "${comment}"` : ''}`, `${currentUser.name} (Approver · ${dept})`);
    pushToast(`${dept} clearance recorded for ${permit.id}`);
  }

  function advance() {
    const merged = { ...clearances, itApproval, ohcInformed };
    updatePermit(permit.id, {
      deptClearances: merged,
      status: permit.isolationRequired ? 'pending-isolation' : 'pending-declaration'
    });
    addTimelineEvent(permit.id, 'Departmental Clearance complete — all departments resolved', `${currentUser.name} (Approver)`);
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

      {blocked && (
        <Card className="mb-4 border-nz-red/30 bg-nz-red-light p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-nz-red">
            <ShieldAlert size={16} /> You raised this permit — you cannot grant clearance on your own request.
          </div>
          <p className="mt-1 text-xs text-nz-red/80">Another Approver in this department must action this row.</p>
        </Card>
      )}

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
              const actionable = c.status === 'pending' && dept === currentDepartment && !blocked;
              return (
                <tr key={dept} className="border-b border-nz-border/60 last:border-0 align-top">
                  <td className="py-2.5 font-semibold text-nz-navy">{dept}</td>
                  <td className="py-2.5">
                    <span className={c.status === 'cleared' ? 'font-semibold text-nz-green' : c.status === 'not-applicable' ? 'text-slate-400' : 'font-semibold text-nz-amber'}>
                      {c.status === 'cleared' ? 'Cleared' : c.status === 'not-applicable' ? 'Not Applicable' : 'Pending'}
                    </span>
                    {c.comment && <div className="mt-0.5 max-w-[14rem] text-[11px] italic text-slate-400">"{c.comment}"</div>}
                  </td>
                  <td className="py-2.5 text-slate-500">{c.name || '—'}</td>
                  <td className="py-2.5 text-slate-500">{c.datetime || '—'}</td>
                  <td className="py-2.5">
                    {actionable && (
                      <div className="space-y-1.5">
                        <input
                          value={comments[dept] || ''}
                          onChange={(e) => setComments((prev) => ({ ...prev, [dept]: e.target.value }))}
                          placeholder="Comment (optional)"
                          className="w-40 rounded-lg border border-nz-border bg-white px-2 py-1 text-xs focus-ring"
                        />
                        <div className="flex gap-2">
                          <Button variant="success" size="sm" onClick={() => setDeptStatus(dept, 'cleared')}><CheckCircle2 size={13} /> Grant</Button>
                          <Button variant="outline" size="sm" onClick={() => setDeptStatus(dept, 'not-applicable')}><Ban size={13} /> N/A</Button>
                        </div>
                      </div>
                    )}
                    {c.status === 'pending' && dept === currentDepartment && blocked && (
                      <span className="text-xs italic text-nz-red">Blocked — your own permit</span>
                    )}
                    {c.status === 'pending' && dept !== currentDepartment && (
                      <span className="text-xs italic text-slate-400">Awaiting {dept} Approver</span>
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

      <Button variant="success" size="lg" className="w-full" disabled={blocked || !allResolved} onClick={advance}>
        <CheckCircle2 size={16} /> Confirm Clearance & Continue →
      </Button>
      {!blocked && !allResolved && <div className="mt-2 text-center text-xs text-slate-400">Resolve every department row (Grant or mark Not Applicable) to continue.</div>}
    </div>
  );
}
