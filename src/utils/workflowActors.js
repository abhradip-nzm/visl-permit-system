import { CLEARANCE_DEPARTMENTS } from '../data/ptwFormData.js';
import { hodsForDepartment } from '../data/departmentsData.js';

function hodForDept(dept) {
  return hodsForDepartment(dept)[0]?.name || `HOD — ${dept}`;
}

// Who last acted on this permit — the most recent timeline entry actually
// performed by a person. Most transitions log a real event (e.g. "Approved
// — ...", by the Approver) immediately followed by a System-authored
// "Awaiting X" filler describing what's queued up next; that filler isn't
// an action anyone took, so it's skipped in favor of the last real one.
export function getLastActor(permit) {
  const events = permit?.timeline || [];
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].by && events[i].by !== 'System') {
      return { stage: events[i].stage, by: events[i].by, at: events[i].at };
    }
  }
  const last = events[events.length - 1];
  return last ? { stage: last.stage, by: last.by, at: last.at } : null;
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
      // The permit's own assignedHod (chosen at request time) wins when set
      // — it's specific to this permit, not just "whoever holds the HOD
      // role for that department in general."
      const names = [...new Set(pendingDepts.map((d) => permit.deptClearances?.[d]?.assignedHod || hodForDept(d)))];
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
