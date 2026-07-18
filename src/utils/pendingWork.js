import { departmentsForTypes, needsClearance } from '../data/departmentsData.js';
import { CLEARANCE_DEPARTMENTS } from '../data/ptwFormData.js';

// Phase 9: notification-dot data for RoleSelector.jsx — how many items are
// waiting on this specific person, for a given role-capability, right now.
// Mirrors the same queue logic each role's own dashboard already uses.
const ACTION_STATUSES = ['draft', 'pending-declaration', 'live', 'returned'];

export function getPendingCount(role, department, permits, currentUser) {
  const inMyDept = (p) => !department || departmentsForTypes(p.types || [p.type]).includes(department);

  switch (role) {
    case 'personnel':
      return permits.filter((p) => p.requester === currentUser.name && (ACTION_STATUSES.includes(p.status) || p.status === 'pending-closure')).length;
    case 'hod':
      return permits.filter((p) => {
        if (p.status !== 'pending-clearance' || !needsClearance(p.types || [p.type])) return false;
        if (!department) return true;
        const myRowPending = p.deptClearances?.[department]?.status === 'pending';
        const allResolved = CLEARANCE_DEPARTMENTS.every((d) => p.deptClearances?.[d]?.status !== 'pending');
        return myRowPending || allResolved;
      }).length;
    case 'approver':
      return permits.filter((p) => (p.status === 'pending-approval' || p.status === 'pending-closure') && inMyDept(p)).length;
    case 'supervisor':
      return permits.filter(
        (p) => (p.isolationRequired && p.status === 'pending-isolation') || (p.isolationRequired && p.status === 'pending-closure' && !p.deIsolation)
      ).length;
    case 'worker':
      return permits.filter((p) => p.status === 'live' && p.workers?.some((w) => w.name === currentUser.name)).length;
    case 'rescuer':
      return permits.filter((p) => p.status !== 'closed' && p.status !== 'draft' && p.rescue?.rescuers?.includes(currentUser.name)).length;
    case 'firstaider':
      return permits.filter((p) => p.status !== 'closed' && p.status !== 'draft' && p.rescue?.firstAiders?.includes(currentUser.name)).length;
    default:
      return 0;
  }
}
