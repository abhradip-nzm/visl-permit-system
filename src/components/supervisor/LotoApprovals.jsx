import React, { useState } from 'react';
import { CheckCircle2, Lock, LockOpen, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { isOwnPermit } from '../../utils/segregationOfDuties.js';
import { LOTO_IDS, PERSONAL_LOCKS } from '../../data/ptwFormData.js';
import { USERS } from '../../data/usersData.js';
import { Card, SectionLabel, Button, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

const ISOLATION_TYPES = ['Electrical', 'Mechanical', 'Production', 'Other'];

// 6b-1: Type of Isolation auto-derives from the permit's own declared work
// types instead of asking the Isolation Officer to re-pick it from scratch —
// still editable if it's wrong for this specific job.
function deriveIsolationType(permit) {
  const types = permit?.types || [permit?.type].filter(Boolean);
  if (types.some((t) => t?.includes('Isolation') || t?.includes('Electrical'))) return 'Electrical';
  if (types.some((t) => ['Confined Space', 'Excavation'].includes(t))) return 'Production';
  if (types.some((t) => t)) return 'Mechanical';
  return '';
}

function generateIsolationPermitNo() {
  return `ISO-${1000 + Math.floor(Math.random() * 9000)}`;
}

function emptyForm(permit) {
  return {
    isolationPermitNo: generateIsolationPermitNo(),
    typeOfIsolation: deriveIsolationType(permit),
    lotoIdNo: '',
    deptLockNo: '',
    rows: [{ name: '', personalLockId: '' }],
    topics: ''
  };
}

// C-1: the Isolation Officer independently isolates equipment and is the
// sole author of the isolation record — there is no requester-filled maker
// step anymore. Equipment is read from the permit; every other field
// (type, permit no, toolbox/personal locks, topics, LOTO ID, dept lock) is
// entered here and here only.
export default function LotoApprovals({ params }) {
  const { permits, updatePermit, addTimelineEvent, pushToast, currentUser, currentDepartment, lockRegister, reserveLock } = useApp();
  const pending = permits.filter((p) => p.isolationRequired && p.status === 'pending-isolation');
  const verified = permits.filter((p) => p.isolationRequired && p.isolationDetails?.[0]?.lotoIdNo);
  const [permitId, setPermitId] = useState(params?.id || pending[0]?.id);
  const permit = permits.find((p) => p.id === permitId) || pending[0] || permits[0];
  const [form, setForm] = useState(emptyForm(permit));
  const [confirmed, setConfirmed] = useState(false);

  // Phase 0 (C-3 foundation): lock IDs are always a dropdown drawn from the
  // live register, scoped to this Isolation Officer's own department, and a
  // lock already in-use on another permit is never offered here.
  const availableLocks = lockRegister.filter((l) => l.state === 'available' && (!currentDepartment || l.department === currentDepartment));
  const personnelRoster = USERS.filter((u) => u.status === 'active' && u.roles.some((r) => r.role === 'personnel'));

  function updateRow(i, key, value) {
    setForm((f) => ({ ...f, rows: f.rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)) }));
  }

  const blocked = isOwnPermit(permit, currentUser);
  const canConfirm = !blocked && form.isolationPermitNo && form.typeOfIsolation && form.lotoIdNo && form.deptLockNo;

  function verifyIsolation() {
    if (!permit) return;
    // Reserve first: if another action beat us to this lock since the
    // dropdown was rendered, the register refuses the double-booking and we
    // bail out without advancing the permit.
    const reserved = reserveLock(form.deptLockNo, permit.id);
    if (!reserved) {
      pushToast(`Lock ${form.deptLockNo} was just taken by another permit — pick a different lock`, 'error');
      return;
    }
    const details = [{
      equipment: permit.equipment,
      typeOfIsolation: form.typeOfIsolation,
      isolationPermitNo: form.isolationPermitNo,
      isolationOfficerName: currentUser.name,
      lotoIdNo: form.lotoIdNo,
      deptLockNo: form.deptLockNo
    }];
    updatePermit(permit.id, {
      isolationDetails: details,
      toolboxRecord: form.rows.filter((r) => r.name).map((r) => ({ ...r, company: 'Vedanta', signed: true })),
      isolationTopicsCovered: form.topics,
      status: 'live'
    });
    addTimelineEvent(permit.id, `Isolation confirmed — ${form.deptLockNo}, ${form.lotoIdNo}${form.topics.trim() ? ` — "${form.topics.trim()}"` : ''}`, `${currentUser.name} (Isolation Officer)`);
    addTimelineEvent(permit.id, 'Job Execution started', 'System');
    setConfirmed(true);
    pushToast(`${permit.id} isolation verified — permit is now LIVE`);
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
                  <td className="px-4 py-2.5 text-slate-600">
                    {p.requester}
                    {isOwnPermit(p, currentUser) && <span className="ml-1.5 rounded-full bg-nz-red-light px-1.5 py-0.5 text-[10px] font-bold text-nz-red">YOURS</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => { setPermitId(p.id); setConfirmed(false); setForm(emptyForm(p)); }} className="text-xs font-semibold text-nz-blue hover:underline">Select</button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400">Nothing pending isolation right now.</td></tr>}
            </tbody>
          </table>
        </Card>

        <DeIsolationSection />

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

            {blocked && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-red-light px-3 py-2 text-xs font-semibold text-nz-red">
                <ShieldAlert size={14} /> You raised this permit — you cannot isolate your own equipment. Another Isolation Officer must action it.
              </div>
            )}

            <div className="mb-3 rounded-lg bg-nz-surface p-3 text-xs text-slate-600">
              <span className="font-bold text-nz-navy">Equipment to isolate: </span>{permit.equipment} · {permit.location}
            </div>

            <div className="space-y-2 text-sm">
              <Field label="Isolation Permit No" value={form.isolationPermitNo} onChange={(v) => setForm((f) => ({ ...f, isolationPermitNo: v }))} />
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Type of Isolation</span>
                <select value={form.typeOfIsolation} onChange={(e) => setForm((f) => ({ ...f, typeOfIsolation: e.target.value }))} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                  <option value="">Select…</option>
                  {ISOLATION_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <div className="rounded-lg bg-nz-surface px-3 py-2">
                <div className="text-xs font-semibold text-slate-500">Isolation Officer Name</div>
                <div className="text-sm font-medium text-nz-navy">{currentUser?.name} <span className="text-xs font-normal text-slate-400">(auto-filled from login)</span></div>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Isolation Officer LOTO ID No</span>
                <select value={form.lotoIdNo} onChange={(e) => setForm((f) => ({ ...f, lotoIdNo: e.target.value }))} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                  <option value="">Select…</option>
                  {LOTO_IDS.map((id) => <option key={id}>{id}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Dept. Lock No</span>
                <select
                  value={form.deptLockNo}
                  onChange={(e) => setForm((f) => ({ ...f, deptLockNo: e.target.value }))}
                  className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring"
                >
                  <option value="">Select an available lock…</option>
                  {availableLocks.map((l) => (
                    <option key={l.id} value={l.id}>{l.id} — {l.type} ({l.department})</option>
                  ))}
                </select>
                {availableLocks.length === 0 && <span className="mt-1 block text-[11px] text-nz-red">No available locks for this department right now.</span>}
              </label>
            </div>
          </Card>

          <Card className="mb-4 p-4">
            <SectionLabel>Toolbox Record for Isolated Equipment</SectionLabel>
            <div className="space-y-2">
              {form.rows.map((r, i) => (
                <div key={i} className="rounded-lg border border-nz-border p-2.5">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-400">
                    Crew member {i + 1}
                    {form.rows.length > 1 && (
                      <button onClick={() => setForm((f) => ({ ...f, rows: f.rows.filter((_, idx) => idx !== i) }))}>
                        <Trash2 size={13} className="text-nz-red" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-500">Name</span>
                      <select value={r.name} onChange={(e) => updateRow(i, 'name', e.target.value)} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                        <option value="">Select…</option>
                        {personnelRoster.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-500">Personal Lock ID</span>
                      <select value={r.personalLockId} onChange={(e) => updateRow(i, 'personalLockId', e.target.value)} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                        <option value="">Select…</option>
                        {PERSONAL_LOCKS.map((id) => <option key={id}>{id}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setForm((f) => ({ ...f, rows: [...f.rows, { name: '', personalLockId: '' }] }))} className="mt-2 flex items-center gap-1 text-xs font-semibold text-nz-blue">
              <Plus size={13} /> Add crew member
            </button>
          </Card>

          <Card className="mb-4 p-4">
            <SectionLabel>Topics Covered</SectionLabel>
            <textarea
              rows={3}
              value={form.topics}
              onChange={(e) => setForm((f) => ({ ...f, topics: e.target.value }))}
              placeholder="What was discussed during the isolation toolbox talk…"
              className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white"
            />
          </Card>

          {confirmed ? (
            <div className="flex items-center gap-2 rounded-lg bg-nz-green-light px-4 py-3 text-sm font-semibold text-nz-green">
              <CheckCircle2 size={18} /> Isolation verified — requester notified to proceed.
            </div>
          ) : (
            <Button variant="primary" size="lg" className="w-full" disabled={!canConfirm} onClick={verifyIsolation}>
              Confirm Isolation & Notify Requester
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// C-2: closure/de-isolation loop. A permit that required isolation cannot
// be closed by the Approver until the Isolation Officer independently
// confirms the equipment has been de-isolated — this is what actually
// releases the lock back to the register (see AppContext.releaseLock).
function DeIsolationSection() {
  const { permits, updatePermit, addTimelineEvent, pushToast, currentUser, releaseLock } = useApp();
  const pendingDeIsolation = permits.filter((p) => p.isolationRequired && p.status === 'pending-closure' && !p.deIsolation);
  const [comments, setComments] = useState({});

  function confirm(p) {
    const lockId = p.isolationDetails?.[0]?.deptLockNo;
    const comment = comments[p.id]?.trim();
    if (lockId) releaseLock(lockId);
    updatePermit(p.id, { deIsolation: { by: currentUser.name, at: 'Just now', comment: comment || '' } });
    addTimelineEvent(p.id, `De-isolation confirmed — lock ${lockId || '—'} released${comment ? ` — "${comment}"` : ''}`, `${currentUser.name} (Isolation Officer)`);
    pushToast(`${p.id} de-isolated — lock released back to register`);
  }

  return (
    <>
      <SectionLabel><span className="flex items-center gap-1.5"><LockOpen size={14} /> Pending De-isolation</span></SectionLabel>
      <Card className="mb-4">
        <div className="divide-y divide-nz-border/60">
          {pendingDeIsolation.map((p) => {
            const blocked = isOwnPermit(p, currentUser);
            return (
              <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <div className="font-semibold text-nz-navy">
                    {p.id} — {p.equipment}
                    {blocked && <span className="ml-1.5 rounded-full bg-nz-red-light px-1.5 py-0.5 text-[10px] font-bold text-nz-red">YOURS</span>}
                  </div>
                  <div className="text-xs text-slate-400">Lock {p.isolationDetails?.[0]?.deptLockNo || '—'} · LOTO {p.isolationDetails?.[0]?.lotoIdNo || '—'}</div>
                </div>
                {blocked ? (
                  <span className="text-xs italic text-nz-red">Blocked — your own permit</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      value={comments[p.id] || ''}
                      onChange={(e) => setComments((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      placeholder="Comment (optional)"
                      className="w-36 rounded-lg border border-nz-border bg-white px-2 py-1.5 text-xs focus-ring"
                    />
                    <Button variant="outline" onClick={() => confirm(p)}>Confirm De-isolation</Button>
                  </div>
                )}
              </div>
            );
          })}
          {pendingDeIsolation.length === 0 && <div className="px-4 py-6 text-center text-xs text-slate-400">Nothing awaiting de-isolation.</div>}
        </div>
      </Card>
    </>
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
