import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { INSTRUMENTS } from '../../data/instrumentsData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, Button } from '../shared/Primitives.jsx';

export default function Instruments() {
  const { pushToast } = useApp();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="orange" onClick={() => setShowCreate(true)}><Plus size={15} /> Add Instrument</Button>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Instrument ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Calibration</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {INSTRUMENTS.map((i) => (
              <tr key={i.id} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                <td className="px-4 py-2.5 font-semibold text-nz-navy">{i.id}</td>
                <td className="px-4 py-2.5 text-slate-600">{i.name}</td>
                <td className="px-4 py-2.5 text-slate-600">{i.type}</td>
                <td className="px-4 py-2.5 text-slate-600">{i.location}</td>
                <td className={`px-4 py-2.5 text-xs font-semibold ${i.calibrationStatus === 'valid' ? 'text-nz-green' : 'text-nz-red'}`}>
                  {i.calibrationStatus} ({i.calibrationDate})
                </td>
                <td className="px-4 py-2.5 text-slate-600">{i.assignedTo || <span className="italic text-slate-400">Unassigned</span>}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-2 text-xs font-semibold text-nz-blue">
                    <button onClick={() => pushToast(`${i.id} assigned to task`)} className="hover:underline">Assign</button>
                    <button onClick={() => pushToast(`Calibration history for ${i.id} (mock)`)} className="hover:underline">History</button>
                    <button onClick={() => pushToast(`${i.id} flagged for maintenance`, 'error')} className="hover:underline">Flag</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={() => setShowCreate(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl2 bg-white p-5 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-bold text-nz-navy">Add Instrument</div>
              <button onClick={() => setShowCreate(false)} className="rounded-full p-1 hover:bg-nz-surface"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <input placeholder="Instrument name" className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
              <input placeholder="Type" className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
              <input placeholder="Location" className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => { pushToast('Instrument added to inventory'); setShowCreate(false); }}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
