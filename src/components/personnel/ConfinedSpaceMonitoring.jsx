import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, SectionLabel, Button } from '../shared/Primitives.jsx';

export default function ConfinedSpaceMonitoring({ navigate, params }) {
  const { permits, updatePermit, pushToast } = useApp();
  const permit = permits.find((p) => p.id === params?.id) || permits[0];
  const csm = permit.confinedSpaceMonitoring || {};
  const [meta, setMeta] = useState({ gasMonitorSlNo: csm.gasMonitorSlNo || '', calibrationValid: csm.calibrationValid || false, confinedSpaceId: csm.confinedSpaceId || '', standbyPerson: csm.standbyPerson || '', rescuers: csm.rescuers || '' });
  const [gasTests, setGasTests] = useState(csm.gasTests || []);
  const [personalEntry, setPersonalEntry] = useState(csm.personalEntryRegister || []);
  const [special, setSpecial] = useState(csm.specialInstructions || '');

  function addGasTest() {
    setGasTests((prev) => [...prev, { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), oxygen: '20.9', co: '0', lel: '0', h2s: '0', temp: '28', tester: 'A. Chatterjee' }]);
  }
  function addEntry() {
    setPersonalEntry((prev) => [...prev, { name: '', in: '', out: '', sign: false }]);
  }

  function save() {
    updatePermit(permit.id, { confinedSpaceMonitoring: { ...csm, ...meta, gasTests, personalEntryRegister: personalEntry, specialInstructions: special } });
    pushToast('Confined space monitoring log saved');
    navigate('detail', { id: permit.id });
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate('detail', { id: permit.id })} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
        <ArrowLeft size={15} /> Back
      </button>
      <div className="mb-4 text-lg font-bold text-nz-navy">Confined Space Monitoring — {permit.id}</div>

      <Card className="mb-4 p-4">
        <SectionLabel>Monitor & Space Details</SectionLabel>
        <div className="space-y-2 text-sm">
          <Field label="Gas Monitor SL No" value={meta.gasMonitorSlNo} onChange={(v) => setMeta((m) => ({ ...m, gasMonitorSlNo: v }))} />
          <Field label="Confined Space ID" value={meta.confinedSpaceId} onChange={(v) => setMeta((m) => ({ ...m, confinedSpaceId: v }))} />
          <Field label="Name of Stand By Person" value={meta.standbyPerson} onChange={(v) => setMeta((m) => ({ ...m, standbyPerson: v }))} />
          <Field label="Name of Rescuers" value={meta.rescuers} onChange={(v) => setMeta((m) => ({ ...m, rescuers: v }))} />
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input type="checkbox" checked={meta.calibrationValid} onChange={(e) => setMeta((m) => ({ ...m, calibrationValid: e.target.checked }))} /> Calibration is Valid
          </label>
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Gas Test Results</SectionLabel>
          <button onClick={addGasTest} className="flex items-center gap-1 text-xs font-semibold text-nz-blue"><Plus size={13} /> Log Test</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-nz-border text-slate-400">
                <th className="py-1.5 pr-2">Time</th><th className="py-1.5 pr-2">O2 (19.5-23.5%)</th><th className="py-1.5 pr-2">CO (TLV-50)</th><th className="py-1.5 pr-2">LEL%</th><th className="py-1.5 pr-2">H2S (TLV-10)</th><th className="py-1.5 pr-2">Temp °C</th><th className="py-1.5">Tester</th>
              </tr>
            </thead>
            <tbody>
              {gasTests.map((t, i) => (
                <tr key={i} className="border-b border-nz-border/60">
                  <td className="py-1.5 pr-2">{t.time}</td><td className="py-1.5 pr-2">{t.oxygen}%</td><td className="py-1.5 pr-2">{t.co}</td><td className="py-1.5 pr-2">{t.lel}</td><td className="py-1.5 pr-2">{t.h2s}</td><td className="py-1.5 pr-2">{t.temp}</td><td className="py-1.5">{t.tester}</td>
                </tr>
              ))}
              {gasTests.length === 0 && <tr><td colSpan={7} className="py-3 text-center text-slate-400">No tests logged yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Personal Entry Time Register</SectionLabel>
          <button onClick={addEntry} className="flex items-center gap-1 text-xs font-semibold text-nz-blue"><Plus size={13} /> Add</button>
        </div>
        <div className="space-y-1.5">
          {personalEntry.map((p, i) => (
            <div key={i} className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              <input placeholder="Name" value={p.name} onChange={(e) => setPersonalEntry((prev) => prev.map((r, idx) => idx === i ? { ...r, name: e.target.value } : r))} className="col-span-2 rounded-lg border border-nz-border px-2 py-1.5 text-xs focus-ring sm:col-span-1" />
              <input placeholder="In" value={p.in} onChange={(e) => setPersonalEntry((prev) => prev.map((r, idx) => idx === i ? { ...r, in: e.target.value } : r))} className="rounded-lg border border-nz-border px-2 py-1.5 text-xs focus-ring" />
              <input placeholder="Out" value={p.out} onChange={(e) => setPersonalEntry((prev) => prev.map((r, idx) => idx === i ? { ...r, out: e.target.value } : r))} className="rounded-lg border border-nz-border px-2 py-1.5 text-xs focus-ring" />
            </div>
          ))}
          {personalEntry.length === 0 && <div className="text-xs text-slate-400">No entries logged yet.</div>}
        </div>
      </Card>

      <Card className="mb-4 p-4">
        <SectionLabel>Special Instructions / Safe Work Method Statement</SectionLabel>
        <textarea rows={3} value={special} onChange={(e) => setSpecial(e.target.value)} className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring" />
      </Card>

      <Button variant="orange" size="lg" className="w-full" onClick={save}>
        <CheckCircle2 size={16} /> Save Monitoring Log
      </Button>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2 text-sm focus-ring focus:bg-white" />
    </label>
  );
}
