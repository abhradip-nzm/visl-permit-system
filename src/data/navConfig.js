export const NAV_CONFIG = {
  superadmin: [
    { key: 'dashboard', label: 'Admin Dashboard', icon: 'LayoutDashboard' },
    { key: 'permissions', label: 'Permission Matrix', icon: 'Grid3x3' },
    { key: 'masterdata', label: 'Master Data', icon: 'Database' }
  ],
  requester: [
    { key: 'mypermits', label: 'My Permits', icon: 'FileText' },
    { key: 'create', label: 'Create Permit', icon: 'FilePlus2' }
  ],
  approver: [
    { key: 'queue', label: 'Pending Queue', icon: 'ListChecks' }
  ],
  observer: [
    { key: 'dashboard', label: 'Safety Dashboard', icon: 'ShieldAlert' }
  ],
  issuer: [
    { key: 'dashboard', label: 'Issuer Dashboard', icon: 'FileCheck2' }
  ],
  receiver: [
    { key: 'mypermits', label: 'My Assigned Permits', icon: 'ClipboardList' }
  ],
  loto: [
    { key: 'tasks', label: 'LOTO Task List', icon: 'Lock' }
  ],
  competent: [
    { key: 'dashboard', label: 'My Competency', icon: 'BadgeCheck' }
  ],
  supervisor: [
    { key: 'dashboard', label: 'Shift Dashboard', icon: 'Users' },
    { key: 'loto-assign', label: 'LOTO Assignment', icon: 'Lock' }
  ]
};

export const ROLE_LABELS = {
  superadmin: 'Super Admin',
  requester: 'Requester',
  approver: 'Approver / HoD',
  observer: 'Safety Officer',
  issuer: 'Permit Issuer',
  receiver: 'Permit Receiver',
  loto: 'LOTO Responsible',
  competent: 'Competent Personnel',
  supervisor: 'Shift Supervisor'
};

export const ROLE_PLATFORM = {
  superadmin: 'web',
  requester: 'mobile',
  approver: 'web',
  observer: 'web',
  issuer: 'web',
  receiver: 'mobile',
  loto: 'mobile',
  competent: 'mobile',
  supervisor: 'web'
};
