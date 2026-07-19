import React, { useState } from 'react';
import { HardHat, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { Card, StatusBadge } from '../shared/Primitives.jsx';
import PTWStepper from '../shared/PTWStepper.jsx';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function startOfWeek(d) {
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const s = new Date(d);
  s.setDate(d.getDate() + diff);
  s.setHours(0, 0, 0, 0);
  return s;
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// Worker is a new fixed role: a crew member assigned to a live job who
// applies their own personal lock after the Isolation Officer's master
// lock, and removes it before the Isolation Officer de-isolates. Worker
// assignment happens on the Precautions & Declaration screen (Requester-
// filled worker + lock-key table). This dashboard offers an All / Week /
// Month view of assigned jobs, bucketed by each permit's scheduled date
// (dateFrom).
export default function WorkerDashboard({ navigate }) {
  const { permits, currentUser } = useApp();
  const [view, setView] = useState('all');
  const [anchor, setAnchor] = useState(() => new Date());

  const myJobs = permits.filter((p) => p.workers?.some((w) => w.name === currentUser.name));
  const liveIsolationJobs = permits.filter((p) => p.status === 'live' && p.isolationRequired);

  // Phase 10 KPIs: "done" = they've submitted their part (permit reached
  // pending-closure or closed); "current work" = permit is live and they're
  // assigned; "pending" = current work where their own step isn't done yet
  // (lock not applied/removed for isolation jobs, not started otherwise —
  // same fields WorkerJobDetail.jsx uses to decide what to show).
  const completedJobs = myJobs.filter((p) => p.status === 'pending-closure' || p.status === 'closed');
  const currentJobs = myJobs.filter((p) => p.status === 'live');
  const currentPending = currentJobs.filter((p) => {
    const w = p.workers.find((w) => w.name === currentUser.name);
    return p.isolationRequired ? !(w.applied || w.removed) : !w.started;
  });

  const jobsByDate = {};
  myJobs.forEach((p) => {
    if (!p.dateFrom) return;
    (jobsByDate[p.dateFrom] ||= []).push(p);
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <KpiTile label="Total Work Done" value={completedJobs.length} tone="green" />
        <KpiTile label="Current Work" value={currentJobs.length} tone="blue" />
        <KpiTile label="Current Work Pending" value={currentPending.length} tone="amber" />
      </div>

      <div className="mb-4 flex items-center gap-1.5 rounded-lg bg-nz-blue-light px-3 py-2 text-xs font-semibold text-nz-blue-dark">
        <HardHat size={13} /> Once assigned to a live job, apply your personal lock after the Isolation Officer's lock — remove it first when your work is done.
      </div>

      <div className="mb-4 flex gap-2">
        {[['all', 'All Jobs'], ['week', 'Weekly'], ['month', 'Monthly']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${view === key ? 'bg-nz-blue text-white' : 'border border-nz-border bg-white text-slate-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'all' && (
        <>
          <div className="mb-2 text-sm font-bold text-nz-navy">My Jobs</div>
          <Card className="mb-6">
            <JobList jobs={myJobs} navigate={navigate} />
          </Card>
        </>
      )}

      {view === 'week' && (
        <WeekView anchor={anchor} setAnchor={setAnchor} jobsByDate={jobsByDate} navigate={navigate} />
      )}

      {view === 'month' && (
        <MonthView anchor={anchor} setAnchor={setAnchor} jobsByDate={jobsByDate} navigate={navigate} />
      )}

      <div className="mb-2 mt-6 text-sm font-bold text-nz-navy">Completed Jobs</div>
      <Card className="mb-6">
        <JobList jobs={completedJobs} navigate={navigate} />
      </Card>

      <div className="mb-2 mt-6 flex items-center gap-1.5 text-sm font-bold text-nz-navy"><Lock size={14} /> Live Isolation-Gated Jobs (site-wide)</div>
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

function KpiTile({ label, value, tone }) {
  const tones = { amber: 'text-nz-amber', red: 'text-nz-red', blue: 'text-nz-blue', green: 'text-nz-green', orange: 'text-nz-orange' };
  return (
    <Card className="min-w-[150px] flex-1 p-4">
      <div className="text-xs font-semibold uppercase text-slate-400">{label}</div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone] || 'text-nz-navy'}`}>{value}</div>
    </Card>
  );
}

function JobList({ jobs, navigate }) {
  return (
    <div className="divide-y divide-nz-border/60">
      {jobs.map((p) => (
        <button key={p.id} onClick={() => navigate('jobdetail', { id: p.id })} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-nz-surface">
          <div>
            <div className="font-semibold text-nz-navy">{p.id} — {p.equipment}</div>
            <div className="text-xs text-slate-400">{p.dateFrom} · {p.location}</div>
            <div className="mt-1"><PTWStepper permit={p} compact /></div>
          </div>
          <StatusBadge status={p.status} />
        </button>
      ))}
      {jobs.length === 0 && (
        <div className="px-4 py-6 text-center text-xs text-slate-400">
          No jobs assigned to you yet — workers are assigned during Precautions &amp; Declaration.
        </div>
      )}
    </div>
  );
}

function WeekView({ anchor, setAnchor, jobsByDate, navigate }) {
  const [selected, setSelected] = useState(null);
  const weekStart = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * DAY_MS));
  const selectedJobs = selected ? jobsByDate[selected] || [] : [];

  return (
    <>
      <Card className="mb-4 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-bold text-nz-navy">
            Week of {toISODate(weekStart)}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAnchor(new Date(anchor.getTime() - 7 * DAY_MS))} className="rounded-md border border-nz-border p-1 hover:bg-nz-surface">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setAnchor(new Date(anchor.getTime() + 7 * DAY_MS))} className="rounded-md border border-nz-border p-1 hover:bg-nz-surface">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d, i) => {
            const iso = toISODate(d);
            const jobs = jobsByDate[iso] || [];
            return (
              <button
                key={iso}
                onClick={() => setSelected(iso)}
                className={`rounded-lg border p-2 text-left ${selected === iso ? 'border-nz-blue bg-nz-blue-light' : 'border-nz-border bg-white hover:bg-nz-surface'}`}
              >
                <div className="text-[11px] font-bold text-nz-navy">{WEEKDAY_LABELS[i]}</div>
                <div className="text-[10px] text-slate-400">{iso.slice(5)}</div>
                <div className={`mt-1 text-lg font-extrabold ${jobs.length ? 'text-nz-blue' : 'text-slate-300'}`}>{jobs.length}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {selected && (
        <Card className="mb-6">
          <div className="border-b border-nz-border px-4 py-2.5 text-xs font-bold uppercase text-slate-400">{selected}</div>
          <JobList jobs={selectedJobs} navigate={navigate} />
        </Card>
      )}
    </>
  );
}

function MonthView({ anchor, setAnchor, jobsByDate, navigate }) {
  const [selected, setSelected] = useState(null);
  const monthStart = startOfMonth(anchor);
  const gridStart = startOfWeek(monthStart);
  const cells = Array.from({ length: 42 }, (_, i) => new Date(gridStart.getTime() + i * DAY_MS));
  const selectedJobs = selected ? jobsByDate[selected] || [] : [];

  return (
    <>
      <Card className="mb-4 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-bold text-nz-navy">
            {monthStart.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1))} className="rounded-md border border-nz-border p-1 hover:bg-nz-surface">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1))} className="rounded-md border border-nz-border p-1 hover:bg-nz-surface">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase text-slate-400">
          {WEEKDAY_LABELS.map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1.5">
          {cells.map((d) => {
            const iso = toISODate(d);
            const inMonth = d.getMonth() === monthStart.getMonth();
            const jobs = jobsByDate[iso] || [];
            return (
              <button
                key={iso}
                onClick={() => setSelected(iso)}
                className={`rounded-lg border p-1.5 text-left ${selected === iso ? 'border-nz-blue bg-nz-blue-light' : 'border-nz-border bg-white hover:bg-nz-surface'} ${inMonth ? '' : 'opacity-30'}`}
              >
                <div className="text-[11px] font-semibold text-nz-navy">{d.getDate()}</div>
                {jobs.length > 0 && <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-nz-blue" />}
              </button>
            );
          })}
        </div>
      </Card>

      {selected && (
        <Card className="mb-6">
          <div className="border-b border-nz-border px-4 py-2.5 text-xs font-bold uppercase text-slate-400">{selected}</div>
          <JobList jobs={selectedJobs} navigate={navigate} />
        </Card>
      )}
    </>
  );
}
