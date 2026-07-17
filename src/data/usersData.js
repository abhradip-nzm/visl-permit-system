// ============================================================================
// MOCK DATA — User accounts & RBAC role-capability grants
//
// Phase 9 role model: there are two kinds of account.
//
// 1. FIXED roles — useradmin, hod, safety, worker, rescuer, firstaider.
//    Each of these accounts holds exactly one role-capability and is shown
//    on the sign-in screen with its role badge (see LoginScreen.jsx). HOD
//    only ever does departmental clearance (and only for permits that need
//    it — see needsClearance() in departmentsData.js); it does NOT also get
//    the general staff tile set below.
//
// 2. General staff — every other account. These are shown on the sign-in
//    screen by name only, with no role badge — every general staff account
//    uniformly holds all three of Requester / Approver / Isolation Officer
//    (Approver and Isolation Officer scoped to that person's home
//    department). Logging in lands them on the three-tile RoleSelector,
//    each tile carrying a notification dot for pending work (see
//    utils/pendingWork.js).
//
// Role keys intentionally match the app's existing internal role keys
// rather than the new display names — see ROLE_LABELS in navConfig.js.
//
// All demo accounts share the password "demo123".
// ============================================================================
export const USERS = [
  // ---- Fixed roles ----
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
    // Phase 9: Safety Officer is now a pure observer — read-only across
    // every permit, no gates, no actions.
    roles: [{ role: 'safety' }]
  },
  {
    id: 'U-014', name: 'R. Nair', username: 'rnair', password: 'demo123',
    email: 'r.nair@vedanta.com', employeeId: 'EMP-1014', plant: 'Tank Farm', status: 'active', lastLogin: '2026-07-06 06:50',
    roles: [{ role: 'rescuer' }]
  },
  {
    id: 'U-015', name: 'S. Pillai', username: 'spillai', password: 'demo123',
    email: 's.pillai@vedanta.com', employeeId: 'EMP-1015', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:52',
    roles: [{ role: 'firstaider' }]
  },
  {
    id: 'U-016', name: 'K. Reddy', username: 'kreddy', password: 'demo123',
    email: 'k.reddy@vedanta.com', employeeId: 'EMP-1016', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:15',
    roles: [{ role: 'worker' }]
  },
  {
    id: 'U-017', name: 'B. Naik', username: 'bnaik', password: 'demo123',
    email: 'b.naik@vedanta.com', employeeId: 'EMP-1017', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:18',
    roles: [{ role: 'worker' }]
  },

  // ---- General staff — always Requester + Approver + Isolation Officer,
  // Approver/Isolation Officer scoped to their home department. ----
  {
    id: 'U-005', name: 'A. Chatterjee', username: 'achatterjee', password: 'demo123',
    email: 'a.chatterjee@vedanta.com', employeeId: 'EMP-1005', plant: 'Tank Farm', status: 'active', lastLogin: '2026-07-06 07:00',
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'Mechanical' }, { role: 'supervisor', department: 'Mechanical' }]
  },
  {
    id: 'U-006', name: 'S. Iyer', username: 'siyer', password: 'demo123',
    email: 's.iyer@vedanta.com', employeeId: 'EMP-1006', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:45',
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'Mechanical' }, { role: 'supervisor', department: 'Mechanical' }]
  },
  {
    id: 'U-007', name: 'A. Singh', username: 'asingh', password: 'demo123',
    email: 'a.singh@vedanta.com', employeeId: 'EMP-1007', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:30',
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'Mechanical' }, { role: 'supervisor', department: 'Mechanical' }]
  },
  {
    id: 'U-008', name: 'P. Rao', username: 'prao', password: 'demo123',
    email: 'p.rao@vedanta.com', employeeId: 'EMP-1008', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:32',
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'E&I' }, { role: 'supervisor', department: 'E&I' }]
  },
  {
    id: 'U-009', name: 'R. Das', username: 'rdas', password: 'demo123',
    email: 'r.das@vedanta.com', employeeId: 'EMP-1009', plant: 'Process Unit 2', status: 'inactive', lastLogin: '2026-06-20 09:10',
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'Mechanical' }, { role: 'supervisor', department: 'Mechanical' }]
  },
  {
    id: 'U-010', name: 'M. Khan', username: 'mkhan', password: 'demo123',
    email: 'm.khan@vedanta.com', employeeId: 'EMP-1010', plant: 'Process Unit 2', status: 'active', lastLogin: '2026-07-04 14:05',
    // C-5 demo case: this account can be Requester and Approver on the same
    // permit — the segregation-of-duties guard (isOwnPermit) must block it.
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'Production' }, { role: 'supervisor', department: 'Production' }]
  },
  {
    id: 'U-011', name: 'J. Mehta', username: 'jmehta', password: 'demo123',
    email: 'j.mehta@vedanta.com', employeeId: 'EMP-1011', plant: 'Crushing Plant', status: 'active', lastLogin: '2026-07-06 06:00',
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'Mechanical' }, { role: 'supervisor', department: 'Mechanical' }]
  },
  {
    id: 'U-012', name: 'L. Menon', username: 'lmenon', password: 'demo123',
    email: 'l.menon@vedanta.com', employeeId: 'EMP-1012', plant: 'Tank Farm', status: 'active', lastLogin: '2026-07-06 06:05',
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'Production' }, { role: 'supervisor', department: 'Production' }]
  },
  {
    id: 'U-013', name: 'V. Kulkarni', username: 'vkulkarni', password: 'demo123',
    email: 'v.kulkarni@vedanta.com', employeeId: 'EMP-1013', plant: 'Process Unit 2', status: 'active', lastLogin: '2026-07-06 07:10',
    roles: [{ role: 'personnel' }, { role: 'approver', department: 'E&I' }, { role: 'supervisor', department: 'E&I' }]
  }
];

// Role keys that are scoped to a department (used by login/role-selection UI
// and by the Super Admin user-management screen to decide whether to show
// a department picker for a given capability).
export const DEPARTMENT_SCOPED_ROLES = ['hod', 'approver', 'supervisor'];

// Phase 9: fixed, single-purpose role keys — shown with a role badge on the
// sign-in screen (see LoginScreen.jsx). Every other account is "general
// staff" and always holds exactly the three STAFF_TILE_ROLES below.
export const FIXED_ROLES = ['useradmin', 'hod', 'safety', 'worker', 'rescuer', 'firstaider'];

// The three role-capabilities every general staff account holds and
// switches between after login (Request / Approver / Isolation Officer).
export const STAFF_TILE_ROLES = ['personnel', 'approver', 'supervisor'];
