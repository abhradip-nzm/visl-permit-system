import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Card, Button } from '../shared/Primitives.jsx';
import { useApp } from '../../context/AppContext.jsx';

const MODULES = ['Permits', 'Personnel', 'Equipment', 'LOTO', 'Safety', 'Compliance', 'Documents', 'Reports', 'Integrations', 'System Settings'];
const PERMS = ['view', 'create', 'edit', 'approve', 'delete', 'configure', 'export'];
const ROLE_OPTIONS = ['Approver / HoD', 'Permit Issuer', 'Safety Officer', 'Shift Supervisor', 'Requester'];

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

export default function PermissionMatrix() {
  const { pushToast } = useApp();
  const [role, setRole] = useState(ROLE_OPTIONS[0]);
  const [grid, setGrid] = useState(defaultGrid);

  function toggle(mod, perm) {
    setGrid((g) => ({ ...g, [mod]: { ...g[mod], [perm]: !g[mod][perm] } }));
  }

  return (
    <div>
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
    </div>
  );
}
