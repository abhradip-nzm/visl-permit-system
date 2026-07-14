import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { USERS } from '../../data/usersData.js';
import { ROLE_LABELS } from '../../data/navConfig.js';
import { useApp } from '../../context/AppContext.jsx';
import { DemoBadge, Button } from '../shared/Primitives.jsx';

// Replaces the old free "choose any of 9 personas" landing page. This is a
// real login form (stubbed auth against USERS — see AppContext.login) that,
// on success, hands the user only their own granted role-capability/ies —
// never a generic role picker. See usersData.js for the account list.
export default function LoginScreen() {
  const { login, pushToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) {
      setError('Invalid username or password.');
      return;
    }
    setError('');
    pushToast('Signed in');
  }

  function fillDemo(user) {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  }

  return (
    <div className="flex min-h-screen flex-col bg-nz-charcoal">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Vedanta" className="h-10 w-10 object-contain" />
          <div>
            <div className="text-lg font-bold text-nz-navy">Vedanta Work Permit System</div>
            <div className="text-xs text-slate-500">Vedanta Sesa · Digital Work Permit Management System</div>
          </div>
        </div>
        <DemoBadge />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-xl2 border border-nz-border bg-white p-8 shadow-card">
            <h1 className="mb-1 text-xl font-extrabold text-nz-navy">Sign in</h1>
            <p className="mb-6 text-sm text-slate-500">Enter your credentials. You'll only see the role(s) assigned to your account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dfernandes"
                  autoComplete="username"
                  className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2.5 text-sm focus-ring focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-nz-border bg-nz-surface px-3 py-2.5 text-sm focus-ring focus:bg-white"
                />
              </label>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-nz-red-light px-3 py-2 text-xs font-semibold text-nz-red">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <Button type="submit" variant="orange" size="lg" className="w-full">
                <LogIn size={16} /> Log In
              </Button>
            </form>
          </div>

          <div className="rounded-xl2 border border-black/10 bg-black/5 p-6">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Demo accounts</div>
            <p className="mb-4 text-xs text-slate-400">Auth is stubbed for this prototype — click an account to fill the form, then Log In. All demo accounts share the password "demo123".</p>
            <div className="max-h-96 space-y-1.5 overflow-y-auto pr-1">
              {USERS.filter((u) => u.status === 'active').map((u) => (
                <button
                  key={u.id}
                  onClick={() => fillDemo(u)}
                  className="flex w-full items-center justify-between rounded-lg border border-nz-border bg-white px-3 py-2 text-left hover:border-nz-orange/40 hover:bg-nz-surface focus-ring"
                >
                  <div>
                    <div className="text-sm font-semibold text-nz-navy">{u.name}</div>
                    <div className="text-[11px] text-slate-400">@{u.username}</div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    {u.roles.map((r, i) => (
                      <span key={i} className="rounded-full bg-nz-blue-light px-2 py-0.5 text-[10px] font-semibold text-nz-blue-dark">
                        {ROLE_LABELS[r.role]}{r.department ? ` · ${r.department}` : ''}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="px-8 py-4 text-center text-[11px] text-slate-400">
        NextZen Minds · Prototype build — all data is mock / demo data. No live systems are connected.
      </footer>
    </div>
  );
}
