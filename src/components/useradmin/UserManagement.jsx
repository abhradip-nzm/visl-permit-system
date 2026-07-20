import React, { useState } from 'react';
import { Search, Plus, Pencil, Power, KeyRound, X, Trash2 } from 'lucide-react';
import { USERS, DEPARTMENT_SCOPED_ROLES } from '../../data/usersData.js';
import { DEPARTMENTS } from '../../data/departmentsData.js';
import { ROLE_LABELS } from '../../data/navConfig.js';
import { useApp } from '../../context/AppContext.jsx';
import { Card, Button, StatusBadge } from '../shared/Primitives.jsx';

const ROLE_OPTIONS = Object.keys(ROLE_LABELS); // ['useradmin','hod','safety','supervisor','personnel']

function roleBadgeText(r) {
  return `${ROLE_LABELS[r.role]}${r.department ? ` · ${r.department}` : ''}`;
}

export default function UserManagement() {
  const { pushToast } = useApp();
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalUser, setModalUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = users.filter((u) => {
    if (search && !`${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'All' && !u.roles.some((r) => r.role === roleFilter)) return false;
    if (statusFilter !== 'All' && u.status !== statusFilter) return false;
    return true;
  });

  function toggleStatus(id) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u)));
    pushToast('User status updated');
  }

  function saveUser(userData, isEdit) {
    if (isEdit) {
      setUsers((prev) => prev.map((u) => (u.id === userData.id ? userData : u)));
    } else {
      setUsers((prev) => [{ ...userData, id: `U-${String(prev.length + 1).padStart(3, '0')}`, status: 'active', lastLogin: 'Never' }, ...prev]);
    }
    pushToast(isEdit ? 'User updated' : `User created with ${userData.roles.length} role-capabilit${userData.roles.length === 1 ? 'y' : 'ies'}`);
    setShowCreate(false);
    setModalUser(null);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full rounded-lg border border-nz-border bg-white py-2 pl-9 pr-3 text-sm focus-ring"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
          <option value="All">All roles</option>
          {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-nz-border bg-white px-3 py-2 text-sm focus-ring">
          <option>All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button variant="orange" onClick={() => setShowCreate(true)}>
          <Plus size={15} /> Create User
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-nz-border text-xs uppercase text-slate-400">
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role-Capabilities</th>
              <th className="px-4 py-3">Plant</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-nz-border/60 last:border-0 hover:bg-nz-surface">
                <td className="px-4 py-2.5 font-semibold text-nz-navy">{u.id}</td>
                <td className="px-4 py-2.5 text-slate-700">{u.name}</td>
                <td className="px-4 py-2.5 text-slate-500">{u.email}</td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r, i) => (
                      <span key={i} className="rounded-full bg-nz-blue-light px-2 py-0.5 text-[11px] font-semibold text-nz-blue-dark">{roleBadgeText(r)}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-slate-600">{u.plant}</td>
                <td className="px-4 py-2.5"><StatusBadge status={u.status === 'active' ? 'active' : 'closed'} /></td>
                <td className="px-4 py-2.5 text-xs text-slate-400">{u.lastLogin}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setModalUser(u)} className="text-slate-400 hover:text-nz-blue" title="Edit"><Pencil size={14} /></button>
                    <button onClick={() => toggleStatus(u.id)} className="text-slate-400 hover:text-nz-red" title="Activate/Deactivate"><Power size={14} /></button>
                    <button onClick={() => pushToast(`Password reset email sent to ${u.name}`)} className="text-slate-400 hover:text-nz-orange" title="Reset Password"><KeyRound size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {(showCreate || modalUser) && (
        <UserModal
          user={modalUser}
          onClose={() => { setShowCreate(false); setModalUser(null); }}
          onSave={(data) => saveUser(data, !!modalUser)}
        />
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [employeeId, setEmployeeId] = useState(user?.employeeId || '');
  const [plant, setPlant] = useState(user?.plant || '');
  const [roles, setRoles] = useState(user?.roles?.length ? user.roles : [{ role: 'personnel', department: '' }]);

  function updateRole(i, patch) {
    setRoles((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRole() {
    setRoles((prev) => [...prev, { role: 'personnel', department: '' }]);
  }
  function removeRole(i) {
    setRoles((prev) => prev.filter((_, idx) => idx !== i));
  }

  const canSave = name.trim() && username.trim() && roles.length > 0 && roles.every((r) => !DEPARTMENT_SCOPED_ROLES.includes(r.role) || r.department);

  function handleSave() {
    onSave({
      ...user,
      name, username, email, employeeId, plant,
      password: user?.password || 'demo123',
      roles: roles.map((r) => ({ role: r.role, ...(DEPARTMENT_SCOPED_ROLES.includes(r.role) ? { department: r.department } : {}) }))
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl2 bg-white p-5 shadow-panel max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-bold text-nz-navy">{user ? 'Edit User' : 'Create User'}</div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-nz-surface"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm @lg:grid-cols-2">
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Employee ID" value={employeeId} onChange={setEmployeeId} />
          <Field label="Username (for login)" value={username} onChange={setUsername} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Plant" value={plant} onChange={setPlant} />
        </div>

        <div className="mt-5 border-t border-nz-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Role-Capabilities (RBAC)</span>
            <button onClick={addRole} className="flex items-center gap-1 text-xs font-semibold text-nz-blue"><Plus size={13} /> Add Role</button>
          </div>
          <p className="mb-3 text-[11px] text-slate-400">An account can hold multiple role-capabilities at once. Approver and Isolation Officer capabilities must be scoped to a department.</p>
          <div className="space-y-2">
            {roles.map((r, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-nz-border p-2.5">
                <select
                  value={r.role}
                  onChange={(e) => updateRole(i, { role: e.target.value, department: DEPARTMENT_SCOPED_ROLES.includes(e.target.value) ? (r.department || DEPARTMENTS[0].key) : '' })}
                  className="flex-1 rounded-lg border border-nz-border bg-white px-2.5 py-1.5 text-sm focus-ring"
                >
                  {Object.keys(ROLE_LABELS).map((key) => <option key={key} value={key}>{ROLE_LABELS[key]}</option>)}
                </select>
                {DEPARTMENT_SCOPED_ROLES.includes(r.role) && (
                  <select
                    value={r.department || ''}
                    onChange={(e) => updateRole(i, { department: e.target.value })}
                    className="flex-1 rounded-lg border border-nz-border bg-white px-2.5 py-1.5 text-sm focus-ring"
                  >
                    {DEPARTMENTS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
                  </select>
                )}
                <button onClick={() => removeRole(i)} disabled={roles.length === 1} className="text-slate-400 hover:text-nz-red disabled:opacity-30" title="Remove"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!canSave} onClick={handleSave}>Save</Button>
        </div>
      </div>
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
