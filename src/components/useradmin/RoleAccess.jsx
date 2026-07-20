import React, { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Card, Button, SectionLabel } from '../shared/Primitives.jsx';
import { USERS } from '../../data/usersData.js';
import { ROLE_LABELS } from '../../data/navConfig.js';
import { useApp } from '../../context/AppContext.jsx';

const MODULES = ['Permits', 'Personnel', 'Equipment', 'LOTO', 'Safety', 'Compliance', 'Documents', 'Reports', 'Integrations', 'System Settings'];
const PERMS = ['view', 'create', 'edit', 'approve', 'delete', 'configure', 'export'];
const ROLE_OPTIONS = Object.values(ROLE_LABELS);
const TABS = ['Permission Matrix', 'Access Assignment'];

function defaultGrid() {
  const grid = {};
  MODULES.forEach((m) => {
    grid[m] = {};
    PERMS.forEach((p) => {
      grid[m][p] = p === 'view';
    });
  });
  return grid;
}

export default function RoleAccess() {
  const { pushToast } = useApp();
  const [tab, setTab] = useState(TABS[0]);
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [grid, setGrid] = useState(defaultGrid);
  const [showCreateRole, setShowCreateRole] = useState(false);

  function toggle(mod, perm) {
    setGrid((g) => ({ ...g, [mod]: { ...g[mod], [perm]: !g[mod][perm] } }));
  }

  return (
    <div>
      <div className="mb-4 flex gap-2 border-b border-nz-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold ${tab === t ? 'border-b-2 border-nz-blue text-nz-blue' : 'text-slate-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Permission Matrix' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-500">Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg border border-nz-border bg-white px-3 py-2 text-sm font-semibold text-nz-navy focus-ring"
              >
                {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateRole(true)}><Plus size={14} /> Create Custom Role</Button>
              <Button variant="outline" onClick={() => setGrid(defaultGrid())}>Reset to Default</Button>
              <Button variant="primary" onClick={() => pushToast(`Permissions saved for ${role}`)}>Save Changes</Button>
            </div>
          </div>

          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
                  <th className="px-4 py-3">Module</th>
                  {PERMS.map((p) => <th key={p} className="px-3 py-3 text-center capitalize">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {MODULES.map((m) => (
                  <tr key={m} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                    <td className="px-4 py-2.5 font-semibold text-nz-navy">{m}</td>
                    {PERMS.map((p) => (
                      <td key={p} className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => toggle(m, p)}
                          className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border ${
                            grid[m][p] ? 'border-nz-blue bg-nz-blue text-white' : 'border-nz-border bg-white'
                          }`}
                        >
                          {grid[m][p] && <Check size={13} />}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === 'Access Assignment' && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Effective Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {USERS.slice(0, 8).map((u) => (
                <tr key={u.id} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                  <td className="px-4 py-2.5 font-semibold text-nz-navy">{u.name}</td>
                  <td className="px-4 py-2.5 text-slate-600">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r, i) => (
                        <span key={i} className="rounded-full bg-nz-blue-light px-2 py-0.5 text-[11px] font-semibold text-nz-blue-dark">
                          {ROLE_LABELS[r.role]}{r.department ? ` · ${r.department}` : ''}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">2026-07-01</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => pushToast(`Access re-mapped for ${u.name}`)} className="text-sm font-semibold text-nz-blue hover:underline">
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showCreateRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={() => setShowCreateRole(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl2 bg-white p-5 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-bold text-nz-navy">Create Custom Role</div>
              <button onClick={() => setShowCreateRole(false)} className="rounded-full p-1 hover:bg-nz-surface"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Role name</span>
                <input className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" placeholder="e.g. Night Shift Coordinator" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Description</span>
                <textarea rows={2} className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Clone from base role</span>
                <select className="w-full rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
                  {ROLE_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateRole(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => { pushToast('Custom role created — opening permission matrix'); setShowCreateRole(false); }}
              >
                Create & Open Matrix
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
