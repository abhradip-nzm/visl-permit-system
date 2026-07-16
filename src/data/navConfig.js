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
  hod: [
    { key: 'dashboard', label: 'Approver Dashboard', icon: 'LayoutDashboard' },
    { key: 'myteam', label: 'My Team', icon: 'Users' },
    { key: 'shiftcalendar', label: 'Shift Calendar', icon: 'CalendarDays' },
    { key: 'taskmanagement', label: 'Task Management', icon: 'ListChecks' },
    { key: 'activeloto', label: 'Active Tasks & LOTO', icon: 'Lock' },
    { key: 'compliance', label: 'Compliance', icon: 'ShieldAlert' },
    { key: 'instruments', label: 'Instruments', icon: 'Wrench' }
  ],
  safety: [
    { key: 'dashboard', label: 'Dashboard', icon: 'ShieldAlert' },
    { key: 'gates', label: 'Permit Gates', icon: 'ClipboardCheck' },
    { key: 'lotomonitor', label: 'LOTO Monitor', icon: 'Lock' },
    { key: 'compliance', label: 'Compliance', icon: 'BadgeCheck' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ],
  supervisor: [
    { key: 'dashboard', label: 'Shift Dashboard', icon: 'Users' },
    { key: 'maintenance', label: 'Maintenance Requests', icon: 'Wrench' },
    { key: 'lotoapprovals', label: 'LOTO Approvals', icon: 'Lock' }
  ],
  personnel: [
    { key: 'mytasks', label: 'My Tasks', icon: 'ClipboardList' },
    { key: 'create', label: 'Create', icon: 'FilePlus2' },
    { key: 'loto', label: 'LOTO', icon: 'Lock' },
    { key: 'inventory', label: 'Inventory', icon: 'Package' },
    { key: 'profile', label: 'Profile', icon: 'User' }
  ]
};

// Phase 0 role model: display labels renamed to match the target role model
// (internal keys unchanged — see usersData.js header comment for why).
export const ROLE_LABELS = {
  useradmin: 'Super Admin',
  hod: 'Approver',
  safety: 'Safety Officer',
  supervisor: 'Isolation Officer',
  personnel: 'Requester'
};

export const ROLE_PLATFORM = {
  useradmin: 'web',
  hod: 'web',
  safety: 'mobile',
  supervisor: 'web',
  personnel: 'mobile'
};
