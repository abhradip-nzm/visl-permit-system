export const NAV_CONFIG = {
  useradmin: [
    { key: 'dashboard', label: 'Admin Dashboard', icon: 'LayoutDashboard' },
    { key: 'users', label: 'User Management', icon: 'Users' },
    { key: 'access', label: 'Role & Access', icon: 'Grid3x3' },
    { key: 'taskoverview', label: 'Task Overview', icon: 'ListChecks' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'certifications', label: 'Certifications', icon: 'BadgeCheck' },
    { key: 'announcements', label: 'Announcements', icon: 'Megaphone' },
    { key: 'masterdata', label: 'Master Data', icon: 'Database' }
  ],
  // Phase 9: HOD is now clearance-only — a narrow role, narrow nav.
  hod: [
    { key: 'dashboard', label: 'Clearance Dashboard', icon: 'LayoutDashboard' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ],
  // Approver takes over everything HOD used to do besides clearance:
  // on-ground verification, final closure, team/task oversight.
  approver: [
    { key: 'dashboard', label: 'Approver Dashboard', icon: 'LayoutDashboard' },
    { key: 'myteam', label: 'My Team', icon: 'Users' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'taskmanagement', label: 'Task Management', icon: 'ListChecks' },
    { key: 'activeloto', label: 'Active Tasks & LOTO', icon: 'Lock' },
    { key: 'compliance', label: 'Compliance', icon: 'ShieldAlert' },
    { key: 'instruments', label: 'Instruments', icon: 'Wrench' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ],
  // Phase 9: pure observer — one read-only dashboard, no gates.
  safety: [
    { key: 'dashboard', label: 'Observation Dashboard', icon: 'Eye' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ],
  supervisor: [
    { key: 'dashboard', label: 'Shift Dashboard', icon: 'Users' },
    { key: 'maintenance', label: 'Maintenance Requests', icon: 'Wrench' },
    { key: 'lotoapprovals', label: 'LOTO Approvals', icon: 'Lock' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' }
  ],
  personnel: [
    { key: 'mytasks', label: 'My Tasks', icon: 'ClipboardList' },
    { key: 'create', label: 'Create', icon: 'FilePlus2' },
    { key: 'inventory', label: 'Inventory', icon: 'Package' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ],
  // New fixed roles.
  worker: [
    { key: 'dashboard', label: 'My Jobs', icon: 'HardHat' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ],
  rescuer: [
    { key: 'dashboard', label: 'My Assignments', icon: 'LifeBuoy' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ],
  firstaider: [
    { key: 'dashboard', label: 'My Assignments', icon: 'Cross' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ]
};

// Phase 9 role model: HOD (clearance-only) and Approver (on-ground
// verification + closure) are now two separate roles; Worker, Rescuer, and
// First Aider are new fixed roles (internal keys chosen to match — see
// usersData.js header comment for why keys stay stable across relabels).
export const ROLE_LABELS = {
  useradmin: 'Super Admin',
  hod: 'HOD',
  approver: 'Approver',
  safety: 'Safety Officer',
  supervisor: 'Isolation Officer',
  personnel: 'Requester',
  worker: 'Worker',
  rescuer: 'Rescuer',
  firstaider: 'First Aider'
};

// Phase 9: no mobile shell anywhere — every role renders through the same
// desktop Sidebar/TopBar layout.
export const ROLE_PLATFORM = {
  useradmin: 'web',
  hod: 'web',
  approver: 'web',
  safety: 'web',
  supervisor: 'web',
  personnel: 'web',
  worker: 'web',
  rescuer: 'web',
  firstaider: 'web'
};
