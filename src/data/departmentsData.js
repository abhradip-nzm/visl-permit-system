// ============================================================================
// MOCK DATA — Department model (Phase 0 foundation)
// Departments are first-class entities: each owns its own Approvers and
// Isolation Officers (see usersData.js role-capability `department` field)
// and its own lock register (see lockRegisterData.js).
//
// Department-specific dashboards/queues and cross-department mandatory-
// clearance enforcement are Phase 1/3 work (C-4, H-5) — this file only
// establishes the data both phases build on.
// ============================================================================
import { USERS } from './usersData.js';

// Every active HOD scoped to a given department — usually just one today,
// but data-driven (not hardcoded) so a department with more than one HOD
// works without any code changes. Used both to show "current HOD" for the
// Owner Department and to populate the per-department clearance-routing
// dropdown on the request form.
export function hodsForDepartment(dept) {
  return USERS.filter((u) => u.status === 'active' && u.roles.some((r) => r.role === 'hod' && r.department === dept));
}

export const DEPARTMENTS = [
  { key: 'Mechanical', label: 'Mechanical' },
  { key: 'E&I', label: 'Electrical & Instrumentation (E&I)' },
  { key: 'Production', label: 'Production' }
];

// Which department(s) a permit requires clearance/isolation/approval from,
// derived from its selected Section A permit type(s).
export const PERMIT_TYPE_DEPARTMENTS = {
  'Cold/General': ['Mechanical'],
  'Hot Work': ['Mechanical'],
  Excavation: ['Mechanical', 'Production'],
  'Isolation & Electrical': ['E&I'],
  'Crane & Lifting': ['Mechanical'],
  'Height Work': ['Mechanical'],
  'Confined Space': ['Mechanical', 'Production'],
  Project: ['Mechanical', 'E&I', 'Production']
};

export function departmentsForTypes(types = []) {
  const set = new Set();
  types.forEach((t) => (PERMIT_TYPE_DEPARTMENTS[t] || []).forEach((d) => set.add(d)));
  return [...set];
}

// Phase 9: HOD departmental clearance is no longer a universal gate — it now
// only applies to Excavation-type permits or anything routed through the
// Production department. Everything else skips clearance entirely and goes
// straight from Declaration to Approval.
export function needsClearance(types = []) {
  return types.includes('Excavation') || departmentsForTypes(types).includes('Production');
}
