import { USERS } from '../data/usersData.js';
import { CLEARANCE_DEPARTMENTS } from '../data/ptwFormData.js';

function hodForDept(dept) {
  const u = USERS.find((u) => u.status === 'active' && u.roles.some((r) => r.role === 'hod' && r.department === dept));
  return u?.name || `HOD — ${dept}`;
}

// Who last acted on this permit — just the most recent timeline entry.
// addTimelineEvent() always appends in chronological order, so the last
// entry is always the most recent thing that happened.
export function getLastActor(permit) {
  const events = permit?.timeline || [];
  if (!events.length) return null;
  const last = events[events.length - 1];
  return { stage: last.stage, by: last.by, at: last.at };
}

// Who acts next, and in what capacity, given the permit's current status —
// the single place that names "who's holding the ball" so every screen
// (Requester, Approver, HOD, Isolation Officer, Worker) can show the same
// answer instead of each re-deriving it. Mirrors the exact transition
// targets encoded in each screen's submit/approve/verify handler.
export function getNextActor(permit) {
  if (!permit) return null;
  switch (permit.status) {
    case 'draft':
      return { role: 'personnel', label: 'Request & Risk Assessment', name: permit.requester };
    case 'pending-clearance': {
      const pendingDepts = CLEARANCE_DEPARTMENTS.filter((d) => permit.deptClearances?.[d]?.status === 'pending');
      const names = [...new Set(pendingDepts.map(hodForDept))];
      return { role: 'hod', label: 'Departmental Clearance', name: names.join(', ') || 'HOD' };
    }
    case 'pending-approval':
      return { role: 'approver', label: 'Approval', name: permit.approver || 'Approver' };
    case 'pending-declaration':
      return { role: 'personnel', label: 'Precautions & Declaration', name: permit.requester };
    case 'pending-isolation':
      return { role: 'supervisor', label: 'Isolation Setup', name: permit.isolationOfficer || 'Isolation Officer' };
    case 'live':
      return { role: 'personnel', label: 'Job Execution & Closure Submission', name: permit.requester };
    case 'pending-closure':
      if (permit.isolationRequired && !permit.deIsolation) {
        return { role: 'supervisor', label: 'De-isolation', name: permit.isolationOfficer || 'Isolation Officer' };
      }
      return { role: 'approver', label: 'Closure Verification', name: permit.approver || 'Approver' };
    case 'returned':
      return { role: 'personnel', label: 'Correct & Resubmit', name: permit.requester };
    case 'closed':
    default:
      return null;
  }
}
