import React from 'react';
import { HardHat, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

// Worker is a new fixed role: a crew member assigned to a live job who
// applies their own personal lock after the Isolation Officer's master
// lock, and removes it before the Isolation Officer de-isolates. Worker
// assignment happens on the Precautions & Declaration screen (Requester-
// filled worker + lock-key table) — until that's wired up, this dashboard
// shows every live permit that requires isolation as a placeholder view of
// "jobs a worker could be assigned to."
export default function WorkerDashboard({ navigate }) {
  const { permits, currentUser } = useApp();
  const myJobs = permits.filter((p) => p.workers?.some((w) => w.name === currentUser.name));
  const liveIsolationJobs = permits.filter((p) => p.status === 'live' && p.isolationRequired);

  return (
    <div>
      <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-nz-blue-light px-3 py-2 text-xs font-semibold text-nz-blue-dark">
        <HardHat size={13} /> Once assigned to a live job, apply your personal lock after the Isolation Officer's lock — remove it first when your work is done.
      </div>

      <div className="mb-2 text-sm font-bold text-nz-navy">My Jobs</div>
      <Card className="mb-6">
        <div className="divide-y divide-nz-border/60">
          {myJobs.map((p) => (
            <button key={p.id} onClick={() => navigate('jobdetail', { id: p.id })} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-nz-surface">
              <div>
                <div className="font-semibold text-nz-navy">{p.id} — {p.equipment}</div>
                <div className="mt-1"><PTWStepper permit={p} compact /></div>
              </div>
              <StatusBadge status={p.status} />
            </button>
          ))}
          {myJobs.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-slate-400">
              No jobs assigned to you yet — workers are assigned during Precautions &amp; Declaration.
            </div>
          )}
        </div>
      </Card>

      <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-nz-navy"><Lock size={14} /> Live Isolation-Gated Jobs (site-wide)</div>
      <Card>
        <div className="divide-y divide-nz-border/60">
          {liveIsolationJobs.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-semibold text-nz-navy">{p.id} — {p.equipment}</div>
                <div className="text-xs text-slate-400">{p.location} · {p.requester}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
          {liveIsolationJobs.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-slate-400">Nothing live right now.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
