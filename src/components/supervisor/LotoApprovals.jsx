import React, { useState } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

export default function LotoApprovals({ params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast } = useApp();
  const pending = permits.filter((p) => p.isolationRequired && p.status === 'pending-isolation');
  const verified = permits.filter((p) => p.isolationRequired && p.isolationDetails?.[0]?.lotoIdNo);
  const [permitId, setPermitId] = useState(params?.id || pending[0]?.id);
  const permit = permits.find((p) => p.id === permitId) || pending[0] || permits[0];
  const [form, setForm] = useState({ isolationPermitNo: '', isolationOfficerName: 'J. Mehta', lotoIdNo: '', deptLockNo: '' });
  const [confirmed, setConfirmed] = useState(false);

  const submittedByRequester = permit?.isolationDetails?.some((d) => d.typeOfIsolation);

  function verifyIsolation() {
    if (!permit) return;
    const details = (permit.isolationDetails || []).map((d) => ({ ...d, ...form }));
    updatePermit(permit.id, { isolationDetails: details, status: 'pending-declaration' });
    addTimelineEvent(permit.id, `Isolation confirmed — ${form.deptLockNo}, ${form.lotoIdNo}`, `${form.isolationOfficerName} (Isolation Officer)`);
    addTimelineEvent(permit.id, 'Awaiting Precautions & Declaration', 'System');
    setConfirmed(true);
    pushToast(`${permit.id} isolation verified — requester can proceed to Declaration`);
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <SectionLabel><span className="flex items-center gap-1.5"><Lock size={14} /> Pending Isolation Verification</span></SectionLabel>
        <Card className="mb-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
                <th className="px-4 py-3">Permit #</th>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Requested By</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id} className={`border-b border-nz-border/60 last:border-0 ${permitId === p.id ? 'bg-nz-blue-light/40' : ''}`}>
                  <td className="px-4 py-2.5 font-semibold text-nz-navy">{p.id}</td>
                  <td className="px-4 py-2.5 text-slate-600">{p.equipment}</td>
                  <td className="px-4 py-2.5 text-slate-600">{p.requester}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => { setPermitId(p.id); setConfirmed(false); }} className="text-xs font-semibold text-nz-blue hover:underline">Select</button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400">Nothing pending isolation right now.</td></tr>}
            </tbody>
          </table>
        </Card>

        <SectionLabel>Previously Verified</SectionLabel>
        <Card>
          <div className="divide-y divide-nz-border/60">
            {verified.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <div className="font-semibold text-nz-navy">{p.id}</div>
                  <div className="text-xs text-slate-400">LOTO {p.isolationDetails[0].lotoIdNo} · Lock {p.isolationDetails[0].deptLockNo}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
            {verified.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">None yet.</div>}
          </div>
        </Card>
      </div>

      {permit && (
        <div>
          <SectionLabel>Isolation Officer Verification</SectionLabel>
          <Card className="mb-4 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-bold text-nz-navy">{permit.id} — {permit.equipment}</div>
              <StatusBadge status={permit.status} />
            </div>
            <div className="mb-3"><PTWStepper permit={permit} compact /></div>

            <div className="mb-3 rounded-lg bg-nz-surface p-3 text-xs text-slate-600">
              <div className="mb-1 font-bold text-nz-navy">Requester-filled isolation details</div>
              {(permit.isolationDetails || []).map((d, i) => (
                <div key={i}>{d.equipment} — {d.typeOfIsolation || 'type not specified'}</div>
              ))}
              {!submittedByRequester && <div className="italic text-nz-amber">Requester has not filled isolation details yet.</div>}
            </div>

            <div className="space-y-2 text-sm">
              <Field label="Isolation Permit No" value={form.isolationPermitNo} onChange={(v) => setForm((f) => ({ ...f, isolationPermitNo: v }))} />
              <Field label="Isolation Officer Name" value={form.isolationOfficerName} onChange={(v) => setForm((f) => ({ ...f, isolationOfficerName: v }))} />
              <Field label="Isolation Officer LOTO ID No" value={form.lotoIdNo} onChange={(v) => setForm((f) => ({ ...f, lotoIdNo: v }))} />
              <Field label="Dept. Lock No" value={form.deptLockNo} onChange={(v) => setForm((f) => ({ ...f, deptLockNo: v }))} />
            </div>
          </Card>

          {confirmed ? (
            <div className="flex items-center gap-2 rounded-lg bg-nz-green-light px-4 py-3 text-sm font-semibold text-nz-green">
              <CheckCircle2 size={18} /> Isolation verified — requester notified to proceed.
            </div>
          ) : (
            <Button variant="primary" size="lg" className="w-full" disabled={!form.isolationPermitNo || !form.lotoIdNo || !form.deptLockNo} onClick={verifyIsolation}>
              Confirm Isolation & Notify Requester
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
    </label>
  );
}
