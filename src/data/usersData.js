// ============================================================================
// MOCK DATA — User accounts & RBAC role-capability grants
// Phase 0: an account can hold multiple role-capabilities simultaneously
// (e.g. Requester + Isolation Officer). Capabilities that are department-
// scoped (Approver, Isolation Officer) carry a `department`; capabilities
// that aren't (Requester, Safety Officer, Super Admin) omit it.
//
// Role keys intentionally match the app's existing internal role keys
// (useradmin/hod/safety/supervisor/personnel) rather than the new display
// names — see ROLE_LABELS in navConfig.js for the Super Admin / Approver /
// Safety Officer / Isolation Officer / Requester labels shown to users.
//
// All demo accounts share the password "demo123".
// ============================================================================
export const USERS = [
  {
    id: 'U-001', name: 'D. Fernandes', username: 'dfernandes', password: 'demo123',
    email: 'd.fernandes@vedanta.com', employeeId: 'EMP-1001', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 08:12',
    roles: [{ role: 'hod', department: 'Mechanical' }]
  },
  {
    id: 'U-002', name: 'N. Bose', username: 'nbose', password: 'demo123',
    email: 'n.bose@vedanta.com', employeeId: 'EMP-1002', plant: 'Process Unit 2', status: 'active', lastLogin: '2026-07-06 07:55',
    roles: [{ role: 'hod', department: 'E&I' }]
  },
  {
    id: 'U-003', name: 'K. Verma', username: 'kverma', password: 'demo123',
    email: 'k.verma@vedanta.com', employeeId: 'EMP-1003', plant: 'Head Office', status: 'active', lastLogin: '2026-07-05 18:20',
    roles: [{ role: 'useradmin' }]
  },
  {
    id: 'U-004', name: 'T. Roy', username: 'troy', password: 'demo123',
    email: 't.roy@vedanta.com', employeeId: 'EMP-1004', plant: 'Tank Farm', status: 'active', lastLogin: '2026-07-06 06:40',
    roles: [{ role: 'safety' }]
  },
  {
    id: 'U-005', name: 'A. Chatterjee', username: 'achatterjee', password: 'demo123',
    email: 'a.chatterjee@vedanta.com', employeeId: 'EMP-1005', plant: 'Tank Farm', status: 'active', lastLogin: '2026-07-06 07:00',
    roles: [{ role: 'personnel' }]
  },
  {
    id: 'U-006', name: 'S. Iyer', username: 'siyer', password: 'demo123',
    email: 's.iyer@vedanta.com', employeeId: 'EMP-1006', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:45',
    roles: [{ role: 'personnel' }]
  },
  {
    id: 'U-007', name: 'A. Singh', username: 'asingh', password: 'demo123',
    email: 'a.singh@vedanta.com', employeeId: 'EMP-1007', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:30',
    // Multi-role example #1: Requester + Isolation Officer (Mechanical)
    roles: [{ role: 'personnel' }, { role: 'supervisor', department: 'Mechanical' }]
  },
  {
    id: 'U-008', name: 'P. Rao', username: 'prao', password: 'demo123',
    email: 'p.rao@vedanta.com', employeeId: 'EMP-1008', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:32',
    roles: [{ role: 'supervisor', department: 'E&I' }]
  },
  {
    id: 'U-009', name: 'R. Das', username: 'rdas', password: 'demo123',
    email: 'r.das@vedanta.com', employeeId: 'EMP-1009', plant: 'Process Unit 2', status: 'inactive', lastLogin: '2026-06-20 09:10',
    roles: [{ role: 'personnel' }]
  },
  {
    id: 'U-010', name: 'M. Khan', username: 'mkhan', password: 'demo123',
    email: 'm.khan@vedanta.com', employeeId: 'EMP-1010', plant: 'Process Unit 2', status: 'active', lastLogin: '2026-07-04 14:05',
    // Multi-role example #2: Requester + Approver (Production) — deliberately
    // set up so Phase 1's segregation-of-duties guard (C-5) has a real case
    // to block: this account could otherwise approve its own permit.
    roles: [{ role: 'personnel' }, { role: 'hod', department: 'Production' }]
  },
  {
    id: 'U-011', name: 'J. Mehta', username: 'jmehta', password: 'demo123',
    email: 'j.mehta@vedanta.com', employeeId: 'EMP-1011', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:00',
    roles: [{ role: 'supervisor', department: 'Mechanical' }]
  },
  {
    id: 'U-012', name: 'L. Menon', username: 'lmenon', password: 'demo123',
    email: 'l.menon@vedanta.com', employeeId: 'EMP-1012', plant: 'Tank Farm', status: 'active', lastLogin: '2026-07-06 06:05',
    roles: [{ role: 'supervisor', department: 'Production' }]
  }
];

// Role keys that are scoped to a department (used by login/role-selection UI
// and by the Super Admin user-management screen to decide whether to show
// a department picker for a given capability).
export const DEPARTMENT_SCOPED_ROLES = ['hod', 'supervisor'];
