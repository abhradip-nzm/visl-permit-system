// ============================================================================
// MOCK / DEMO DATA — Vedanta Digital Work Permit Management System
// All data below is fabricated for demonstration purposes only.
// Nothing in this file represents a real API response.
// ============================================================================

export const PERSONNEL = [
  { id: 'P-001', name: 'A. Singh', role: 'LOTO Responsible', department: 'Mechanical', certifications: [
    { type: 'LOTO', status: 'valid', expiresInDays: 142 },
    { type: 'Confined Space', status: 'valid', expiresInDays: 88 }
  ]},
  { id: 'P-002', name: 'P. Rao', role: 'LOTO Responsible', department: 'Electrical', certifications: [
    { type: 'LOTO', status: 'valid', expiresInDays: 210 }
  ]},
  { id: 'P-003', name: 'R. Das', role: 'Competent Personnel', department: 'Mechanical', certifications: [
    { type: 'Confined Space', status: 'expired', expiresInDays: -6 },
    { type: 'Working at Height', status: 'valid', expiresInDays: 180 }
  ]},
  { id: 'P-004', name: 'M. Khan', role: 'Competent Personnel', department: 'Electrical', certifications: [
    { type: 'LOTO', status: 'expired', expiresInDays: -14 },
    { type: 'First Aid', status: 'valid', expiresInDays: 300 }
  ]},
  { id: 'P-005', name: 'S. Iyer', role: 'Competent Personnel', department: 'Mechanical', certifications: [
    { type: 'Hot Work', status: 'expiring', expiresInDays: 4 },
    { type: 'Working at Height', status: 'valid', expiresInDays: 180 },
    { type: 'First Aid', status: 'valid', expiresInDays: 365 }
  ]}
];

export const EQUIPMENT = [
  { id: 'EQ-3007', name: 'Conveyor Belt #7', location: 'Crushing Plant', calibrationStatus: 'overdue', calibrationDate: '2026-06-12', inspectionStatus: 'valid' },
  { id: 'EQ-1102', name: 'Reactor Vessel R-12', location: 'Process Unit 2', calibrationStatus: 'valid', calibrationDate: '2027-01-10', inspectionStatus: 'valid' },
  { id: 'EQ-4410', name: 'MCC-3 Drive Panel', location: 'Crushing Plant', calibrationStatus: 'valid', calibrationDate: '2026-11-02', inspectionStatus: 'valid' },
  { id: 'EQ-2209', name: 'Hydraulic Accumulator H-9', location: 'Crushing Plant', calibrationStatus: 'valid', calibrationDate: '2026-09-18', inspectionStatus: 'valid' },
  { id: 'EQ-5501', name: 'Storage Tank T-5', location: 'Tank Farm', calibrationStatus: 'valid', calibrationDate: '2026-12-05', inspectionStatus: 'valid' },
  { id: 'EQ-6203', name: 'Pump P-204', location: 'Utility Block', calibrationStatus: 'valid', calibrationDate: '2026-10-20', inspectionStatus: 'valid' }
];

export const LOCKS = [
  { id: 'LK-207', type: 'Electrical Lockout', status: 'available' },
  { id: 'LK-214', type: 'Electrical Lockout', status: 'available' },
  { id: 'LK-231', type: 'Hydraulic Isolation', status: 'available' },
  { id: 'LK-198', type: 'Electrical Lockout', status: 'reserved', reservedFor: 'WP-1039' },
  { id: 'LK-176', type: 'Electrical Lockout', status: 'cert-expired', hidden: true }
];

export const HAZARD_CONTROL_LIBRARY = {
  'Hot Work': {
    hazards: ['Fire / ignition source', 'Sparks near combustibles', 'Toxic fumes'],
    ppe: ['Fire-resistant coveralls', 'Welding helmet', 'Leather gloves', 'Face shield'],
    controls: ['Fire watch posted', 'Extinguisher on standby', 'Combustibles cleared 10m radius', 'Gas test before start']
  },
  'Confined Space': {
    hazards: ['Oxygen deficiency', 'Toxic gas accumulation', 'Engulfment'],
    ppe: ['SCBA / air-supplied respirator', 'Full body harness', 'Gas monitor'],
    controls: ['Continuous atmosphere monitoring', 'Standby attendant', 'Rescue plan in place', 'Ventilation running']
  },
  'Mechanical': {
    hazards: ['Rotating equipment', 'Pinch points', 'Stored energy'],
    ppe: ['Gloves', 'Safety glasses', 'Steel-toe boots'],
    controls: ['Machine guarding verified', 'Isolation confirmed', 'Zero-energy state checked']
  },
  'Electrical': {
    hazards: ['Arc flash', 'Electric shock', 'Unexpected re-energization'],
    ppe: ['Insulated gloves', 'Arc-rated face shield', 'Non-conductive footwear'],
    controls: ['LOTO applied', 'Voltage tested to zero', 'Lock and tag verified']
  }
};

// ---- PERMITS (Vedanta PTW form FRMT/MR/26 Rev 4 — 9-step Maker-Checker lifecycle) -----
// Status enum: draft | pending-clearance | pending-isolation | pending-declaration |
//              pending-approval | live | pending-closure | closed | returned
// H-5: when requiredDepartments is passed (derived from the permit's
// selected types via departmentsForTypes), any department NOT in that list
// auto-seeds as not-applicable instead of sitting as a manually-clearable
// "pending" row — an Approver should never have to N/A a department that
// was never relevant to begin with. Existing callers that omit it keep the
// old all-pending behavior.
export function emptyDeptClearances(overrides = {}, requiredDepartments = null, deptHods = {}) {
  const base = {
    Mechanical: { status: 'pending', name: '', datetime: '', assignedHod: deptHods.Mechanical || '' },
    'E&I': { status: 'pending', name: '', datetime: '', assignedHod: deptHods['E&I'] || '' },
    Production: { status: 'pending', name: '', datetime: '', assignedHod: deptHods.Production || '' },
    itApproval: { required: false, granted: false, name: '' },
    ohcInformed: false
  };
  if (requiredDepartments) {
    ['Mechanical', 'E&I', 'Production'].forEach((d) => {
      if (!requiredDepartments.includes(d)) {
        base[d] = { status: 'not-applicable', name: 'System', datetime: 'Not required for selected permit type(s)', assignedHod: '' };
      }
    });
  }
  return { ...base, ...overrides };
}

export function emptyClosure(overrides = {}) {
  return {
    requesterChecklist: { controlsBack: false, interlocksRestored: false, guardsInPlace: false, permitsSurrendered: false },
    toolboxTalkRefNo: '',
    requesterSigned: null, requesterDate: '', requesterTime: '',
    approverChecklist: { controlsRestored: false, siteNormalized: false, materialsRemoved: false },
    deviationDetails: '',
    approverSigned: null, approverDate: '', approverTime: '',
    ...overrides
  };
}

export const PERMITS = [];

export const NOTIFICATIONS = {
  useradmin: [
    { id: 1, text: 'OCR engine reporting elevated latency.', time: '25m ago', unread: true },
    { id: 2, text: '2 users with expired certifications.', time: '3h ago', unread: false },
    { id: 3, text: 'New announcement scheduled: Plant shutdown 15 Jul.', time: '1d ago', unread: false }
  ],
  hod: [
    { id: 1, text: 'No permits currently awaiting Departmental Clearance.', time: 'now', unread: false }
  ],
  approver: [
    { id: 1, text: 'Compliance renewal request from R. Das.', time: '3h ago', unread: false }
  ],
  safety: [
    { id: 1, text: 'M. Khan LOTO certification expired.', time: '3h ago', unread: false }
  ],
  supervisor: [
    { id: 1, text: 'M. Khan unavailable for LOTO — certification expired.', time: '2h ago', unread: false },
    { id: 2, text: 'New maintenance request: MR-308 submitted.', time: '4h ago', unread: false }
  ],
  personnel: [
    { id: 1, text: 'Your Hot Work certification expires in 4 days.', time: '1d ago', unread: false }
  ]
};

export const OCR_SAMPLE_EXTRACTION = {
  permitType: 'Mechanical',
  equipment: 'Pump P-204',
  location: 'Utility Block',
  date: '2026-07-08',
  shift: 'Afternoon',
  confidence: 0.87,
  sourceFile: 'legacy-permit-scan-0417.jpg'
};

export const NLP_SAMPLE_PARSE = {
  inputText: 'welding work on conveyor belt 7 in crushing plant tomorrow morning shift',
  permitType: 'Hot Work',
  equipment: 'Conveyor Belt #7',
  location: 'Crushing Plant',
  date: '2026-07-07',
  shift: 'Morning'
};

// Phase 9 role model — label/description match ROLE_LABELS in navConfig.js
// (internal keys unchanged; see usersData.js header comment for why). HOD
// and Approver are now two separate roles; Worker, Rescuer, and First Aider
// are new fixed roles. No role runs on the mobile shell anymore.
export const ROLES = [
  { key: 'useradmin', label: 'Super Admin', platform: 'web', description: 'Back-office: users, RBAC, lock register & departments', icon: 'ShieldCheck' },
  { key: 'hod', label: 'HOD', platform: 'web', description: 'Departmental clearance for Excavation and Production permits', icon: 'Stamp' },
  { key: 'approver', label: 'Approver', platform: 'web', description: 'On-ground verification & final closure', icon: 'CheckSquare' },
  { key: 'safety', label: 'Safety Officer', platform: 'web', description: 'Read-only observer — every permit, every stage, no gates', icon: 'Eye' },
  { key: 'supervisor', label: 'Isolation Officer', platform: 'web', description: 'Independently isolates equipment & manages the lock register', icon: 'Users' },
  { key: 'personnel', label: 'Requester', platform: 'web', description: 'Raises permits, runs risk assessment & executes the job', icon: 'HardHat' },
  { key: 'worker', label: 'Worker', platform: 'web', description: 'Performs the job, applies personal lock after isolation', icon: 'HardHat' },
  { key: 'rescuer', label: 'Rescuer', platform: 'web', description: 'Standby rescue assignments across live permits', icon: 'LifeBuoy' },
  { key: 'firstaider', label: 'First Aid Personnel', platform: 'web', description: 'Standby first-aid assignments across live permits', icon: 'Cross' },
  { key: 'itprofessional', label: 'IT Professional', platform: 'web', description: 'Grants IT Approval sign-off on permits that require it', icon: 'Laptop' }
];

// Ordered lifecycle used by the workflow connection strip / breadcrumb indicators.
export const WORKFLOW_STAGES = [
  { key: 'request', label: 'Request', role: 'personnel' },
  { key: 'review', label: 'Review', role: 'supervisor' },
  { key: 'approve', label: 'Approve', role: 'approver' },
  { key: 'execute', label: 'Execute', role: 'personnel' },
  { key: 'monitor', label: 'Monitor', role: 'safety' }
];

export const SHIFT_ROSTER = [
  { id: 'P-001', name: 'A. Singh', certified: true },
  { id: 'P-002', name: 'P. Rao', certified: true },
  { id: 'P-004', name: 'M. Khan', certified: false, reason: 'LOTO certification expired' }
];

export const SYSTEM_HEALTH = {
  sapPm: 'ok', enablon: 'ok', ocr: 'warning',
  activeUsers: 142, openPermits: 38,
  breakdown: { draft: 6, pendingClearance: 8, pendingIsolation: 4, pendingDeclaration: 5, pendingApproval: 7, live: 5, pendingClosure: 3 }
};
