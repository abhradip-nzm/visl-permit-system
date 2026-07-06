import React, { useState } from 'react';
import { Upload, Check, ChevronRight } from 'lucide-react';
import { EQUIPMENT, HAZARD_CONTROL_LIBRARY, PERSONNEL } from '../../data/mockData.js';
import { Card, Button, SectionLabel, StatusBadge } from '../shared/Primitives.jsx';
import { useApp } from '../../context/AppContext.jsx';

const TABS = ['Equipment Inventory', 'Permit Types', 'Hazard–Control Mapping', 'Users'];

export default function MasterData() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div>
      <div className="mb-4 flex gap-2 border-b border-nz-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold ${
              tab === t ? 'border-b-2 border-nz-blue text-nz-blue' : 'text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Equipment Inventory' && <EquipmentTab />}
      {tab === 'Permit Types' && <PermitTypesTab />}
      {tab === 'Hazard–Control Mapping' && <HazardMappingTab />}
      {tab === 'Users' && <UsersTab />}
    </div>
  );
}

function EquipmentTab() {
  const [importOpen, setImportOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" onClick={() => setImportOpen((o) => !o)}>
          <Upload size={15} /> Import from Excel / CSV / JSON / SAP
        </Button>
      </div>
      {importOpen && <ImportWizard onClose={() => setImportOpen(false)} />}
      <Card>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-2.5">Equipment ID</th>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Location</th>
              <th className="px-4 py-2.5">Calibration</th>
              <th className="px-4 py-2.5">Inspection</th>
            </tr>
          </thead>
          <tbody>
            {EQUIPMENT.map((e) => (
              <tr key={e.id} className="border-b border-nz-border/60 last:border-0">
                <td className="px-4 py-2.5 font-semibold text-nz-navy">{e.id}</td>
                <td className="px-4 py-2.5 text-slate-600">{e.name}</td>
                <td className="px-4 py-2.5 text-slate-600">{e.location}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-semibold ${e.calibrationStatus === 'valid' ? 'text-nz-green' : 'text-nz-red'}`}>
                    {e.calibrationStatus} ({e.calibrationDate})
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs font-semibold text-nz-green">{e.inspectionStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ImportWizard({ onClose }) {
  const { pushToast } = useApp();
  const [step, setStep] = useState(1);
  const [source, setSource] = useState(null);

  return (
    <Card className="p-4">
      <SectionLabel>Import Wizard — Step {step} of 3</SectionLabel>
      {step === 1 && (
        <div>
          <div className="mb-3 text-sm text-slate-500">Choose a data source:</div>
          <div className="flex gap-2">
            {['Excel', 'CSV', 'JSON', 'SAP'].map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                  source === s ? 'border-nz-blue bg-nz-blue-light text-nz-blue' : 'border-nz-border text-slate-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Button variant="primary" className="mt-4" disabled={!source} onClick={() => setStep(2)}>Next: Field Mapping</Button>
        </div>
      )}
      {step === 2 && (
        <div>
          <div className="mb-3 text-sm text-slate-500">Field mapping preview (auto-detected from {source}):</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="rounded bg-nz-surface px-3 py-2">Source: equip_name → Target: name</div>
            <div className="rounded bg-nz-surface px-3 py-2">Source: calib_date → Target: calibrationDate</div>
            <div className="rounded bg-nz-surface px-3 py-2">Source: plant_area → Target: location</div>
            <div className="rounded bg-nz-surface px-3 py-2">Source: insp_status → Target: inspectionStatus</div>
          </div>
          <Button variant="primary" className="mt-4" onClick={() => setStep(3)}>Next: Validate & Preview</Button>
        </div>
      )}
      {step === 3 && (
        <div>
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-nz-green-light px-3 py-2 text-sm font-semibold text-nz-green">
            <Check size={15} /> 42 records validated, 0 errors found.
          </div>
          <div className="flex gap-2">
            <Button variant="success" onClick={() => { pushToast('Equipment inventory imported'); onClose(); }}>Confirm Import</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function PermitTypesTab() {
  return (
    <Card>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
            <th className="px-4 py-2.5">Permit Type</th>
            <th className="px-4 py-2.5">Hazard Count</th>
            <th className="px-4 py-2.5">LOTO Trigger</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(HAZARD_CONTROL_LIBRARY).map(([type, data]) => (
            <tr key={type} className="border-b border-nz-border/60 last:border-0">
              <td className="px-4 py-2.5 font-semibold text-nz-navy">{type}</td>
              <td className="px-4 py-2.5 text-slate-600">{data.hazards.length}</td>
              <td className="px-4 py-2.5">
                <StatusBadge status={type === 'Electrical' || type === 'Confined Space' ? 'active' : 'closed'} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function HazardMappingTab() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(HAZARD_CONTROL_LIBRARY).map(([type, data]) => (
        <Card key={type} className="p-4">
          <div className="mb-2 text-sm font-bold text-nz-navy">{type}</div>
          <div className="mb-2">
            <div className="text-xs font-semibold text-slate-400">Hazards → Controls</div>
            {data.hazards.map((h, i) => (
              <div key={h} className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                {h} <ChevronRight size={11} className="text-slate-300" /> {data.controls[i] || data.controls[0]}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function UsersTab() {
  return (
    <Card>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
            <th className="px-4 py-2.5">Name</th>
            <th className="px-4 py-2.5">Role</th>
            <th className="px-4 py-2.5">Department</th>
            <th className="px-4 py-2.5">Certifications</th>
          </tr>
        </thead>
        <tbody>
          {PERSONNEL.map((p) => (
            <tr key={p.id} className="border-b border-nz-border/60 last:border-0">
              <td className="px-4 py-2.5 font-semibold text-nz-navy">{p.name}</td>
              <td className="px-4 py-2.5 text-slate-600">{p.role}</td>
              <td className="px-4 py-2.5 text-slate-600">{p.department}</td>
              <td className="px-4 py-2.5">
                <div className="flex flex-wrap gap-1">
                  {p.certifications.map((c) => (
                    <span
                      key={c.type}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        c.status === 'expired' ? 'bg-nz-red-light text-nz-red' :
                        c.status === 'expiring' ? 'bg-nz-amber-light text-nz-amber' : 'bg-nz-green-light text-nz-green'
                      }`}
                    >
                      {c.type}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
