// ============================================================================
// MOCK / DEMO DATA — VISL Digital Work Permit Management System
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
  { id: 'EQ-5501', name: 'Storage Tank T-5', location: 'Tank Farm', calibrationStatus: 'valid', calibrationDate: '2026-12-05', inspectionStatus: 'valid' }
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

// ---- PERMITS ---------------------------------------------------------------
export const PERMITS = [
  {
    id: 'WP-1019', type: 'Mechanical', equipment: 'Storage Tank T-5', location: 'Tank Farm',
    shift: 'Morning', requester: 'K. Verma', status: 'closure-due', createdAt: '2026-06-28',
    hazards: HAZARD_CONTROL_LIBRARY.Mechanical.hazards, ppe: HAZARD_CONTROL_LIBRARY.Mechanical.ppe,
    controls: HAZARD_CONTROL_LIBRARY.Mechanical.controls, warnings: [],
    checklist: [
      { id: 1, label: 'Isolation verified', done: true }, { id: 2, label: 'Guarding reinstated', done: true },
      { id: 3, label: 'Area cleared of tools', done: true }, { id: 4, label: 'Supervisor walk-down', done: true },
      { id: 5, label: 'Housekeeping complete', done: true }, { id: 6, label: 'Final closure sign-off', done: false }
    ],
    timeline: [
      { stage: 'Created', at: '28 Jun, 08:10', by: 'K. Verma' },
      { stage: 'Approved', at: '28 Jun, 09:40', by: 'D. Fernandes (HoD)' },
      { stage: 'Issued', at: '28 Jun, 10:05', by: 'N. Bose (Issuer)' },
      { stage: 'In Execution', at: '28 Jun, 10:30', by: 'System' },
      { stage: 'Closure Pending', at: '05 Jul, 16:00', by: 'System' }
    ]
  },
  {
    id: 'WP-1028', type: 'Mechanical', equipment: 'Reactor Vessel R-12', location: 'Process Unit 2',
    shift: 'Morning', requester: 'T. Roy', status: 'approved', createdAt: '2026-07-01',
    hazards: HAZARD_CONTROL_LIBRARY.Mechanical.hazards, ppe: HAZARD_CONTROL_LIBRARY.Mechanical.ppe,
    controls: HAZARD_CONTROL_LIBRARY.Mechanical.controls, warnings: [],
    checklist: [{ id: 1, label: 'Pre-job briefing', done: true }, { id: 2, label: 'Isolation confirmed', done: false }],
    timeline: [
      { stage: 'Created', at: '01 Jul, 07:50', by: 'T. Roy' },
      { stage: 'Approved', at: '01 Jul, 09:15', by: 'D. Fernandes (HoD)' },
      { stage: 'Awaiting Issue', at: '01 Jul, 09:16', by: 'System' }
    ]
  },
  {
    id: 'WP-1031', type: 'Mechanical', equipment: 'MCC-3 Drive Panel', location: 'Crushing Plant',
    shift: 'Morning', requester: 'S. Iyer', status: 'issued', createdAt: '2026-07-02',
    hazards: HAZARD_CONTROL_LIBRARY.Mechanical.hazards, ppe: HAZARD_CONTROL_LIBRARY.Mechanical.ppe,
    controls: HAZARD_CONTROL_LIBRARY.Mechanical.controls,
    warnings: [],
    receiver: 'S. Iyer',
    checklist: [
      { id: 1, label: 'Confirm isolation with LOTO tag', done: true },
      { id: 2, label: 'Inspect drive coupling', done: true },
      { id: 3, label: 'Lubricate bearings', done: false },
      { id: 4, label: 'Replace belt guard', done: false },
      { id: 5, label: 'Function test', done: false },
      { id: 6, label: 'Supervisor sign-off', done: false }
    ],
    timeline: [
      { stage: 'Created', at: '02 Jul, 08:00', by: 'S. Iyer' },
      { stage: 'Approved', at: '02 Jul, 08:45', by: 'D. Fernandes (HoD)' },
      { stage: 'Issued', at: '02 Jul, 09:10', by: 'N. Bose (Issuer)' },
      { stage: 'In Execution', at: '02 Jul, 09:20', by: 'System' }
    ]
  },
  {
    id: 'WP-1037', type: 'Confined Space', equipment: 'Storage Tank T-5', location: 'Tank Farm',
    shift: 'Night', requester: 'A. Chatterjee', status: 'pending-approval', createdAt: '2026-07-04',
    hazards: HAZARD_CONTROL_LIBRARY['Confined Space'].hazards, ppe: HAZARD_CONTROL_LIBRARY['Confined Space'].ppe,
    controls: HAZARD_CONTROL_LIBRARY['Confined Space'].controls,
    warnings: [{ type: 'incident', text: '1 near-miss recorded at Tank Farm in last 90 days.' }],
    ageHours: 30, risk: 'high',
    checklist: [{ id: 1, label: 'Atmosphere test', done: false }],
    timeline: [
      { stage: 'Created', at: '04 Jul, 22:10', by: 'A. Chatterjee' },
      { stage: 'Awaiting Approval', at: '04 Jul, 22:30', by: 'System' }
    ]
  },
  {
    id: 'WP-1039', type: 'Electrical', equipment: 'MCC-3 Drive Panel', location: 'Crushing Plant',
    shift: 'Morning', requester: 'S. Iyer', status: 'pending-approval', createdAt: '2026-07-05',
    hazards: HAZARD_CONTROL_LIBRARY.Electrical.hazards, ppe: HAZARD_CONTROL_LIBRARY.Electrical.ppe,
    controls: HAZARD_CONTROL_LIBRARY.Electrical.controls,
    warnings: [], ageHours: 6, risk: 'medium',
    checklist: [{ id: 1, label: 'Voltage test to zero', done: false }],
    timeline: [
      { stage: 'Created', at: '05 Jul, 07:30', by: 'S. Iyer' },
      { stage: 'Awaiting Approval', at: '05 Jul, 07:45', by: 'System' }
    ]
  },
  {
    id: 'WP-1042', type: 'Hot Work', equipment: 'Conveyor Belt #7', location: 'Crushing Plant',
    shift: 'Morning', requester: 'S. Iyer', status: 'blocked', createdAt: '2026-07-06',
    hazards: HAZARD_CONTROL_LIBRARY['Hot Work'].hazards, ppe: HAZARD_CONTROL_LIBRARY['Hot Work'].ppe,
    controls: HAZARD_CONTROL_LIBRARY['Hot Work'].controls,
    ageHours: 3, risk: 'high',
    warnings: [
      { type: 'equipment', text: 'Equipment Conveyor Belt #7 has an overdue calibration (expired 12 Jun).' },
      { type: 'competency', text: 'Requester\'s Hot Work certification renews in 4 days.' },
      { type: 'incident', text: '2 near-misses recorded at Crushing Plant in last 90 days.' }
    ],
    checklist: [{ id: 1, label: 'Gas test before start', done: false }],
    timeline: [
      { stage: 'Created', at: '06 Jul, 06:40', by: 'S. Iyer' },
      { stage: 'Blocked', at: '06 Jul, 06:41', by: 'System — equipment calibration overdue' }
    ]
  },
  {
    id: 'WP-1044', type: 'Confined Space', equipment: 'Hydraulic Accumulator H-9', location: 'Crushing Plant',
    shift: 'Morning', requester: 'A. Chatterjee', status: 'approved', createdAt: '2026-07-05',
    hazards: HAZARD_CONTROL_LIBRARY['Confined Space'].hazards, ppe: HAZARD_CONTROL_LIBRARY['Confined Space'].ppe,
    controls: HAZARD_CONTROL_LIBRARY['Confined Space'].controls,
    ageHours: 18, risk: 'high',
    warnings: [{ type: 'loto', text: 'LOTO required — isolation not yet acknowledged.' }],
    lotoRequired: true, lotoStatus: 'pending', lotoAssignee: null,
    checklist: [{ id: 1, label: 'Atmosphere monitoring active', done: false }],
    timeline: [
      { stage: 'Created', at: '05 Jul, 14:00', by: 'A. Chatterjee' },
      { stage: 'Approved', at: '05 Jul, 15:30', by: 'D. Fernandes (HoD)' },
      { stage: 'Awaiting LOTO', at: '05 Jul, 15:31', by: 'System' }
    ]
  }
];

export const NOTIFICATIONS = {
  requester: [
    { id: 1, text: 'WP-1042 blocked — equipment calibration overdue.', time: '10m ago', unread: true },
    { id: 2, text: 'WP-1039 submitted and awaiting approval.', time: '2h ago', unread: true },
    { id: 3, text: 'WP-1031 issued — receiver notified.', time: '1d ago', unread: false }
  ],
  approver: [
    { id: 1, text: 'WP-1042 re-submitted with corrections.', time: '5m ago', unread: true },
    { id: 2, text: 'WP-1037 aging beyond 24h SLA.', time: '1h ago', unread: true },
    { id: 3, text: 'WP-1039 awaiting your approval.', time: '3h ago', unread: false }
  ],
  observer: [
    { id: 1, text: 'Critical flag: LOTO not applied on WP-1044.', time: '20m ago', unread: true },
    { id: 2, text: 'M. Khan LOTO certification expired.', time: '3h ago', unread: false }
  ],
  issuer: [
    { id: 1, text: 'WP-1031 and WP-1028 ready to issue.', time: '15m ago', unread: true },
    { id: 2, text: 'WP-1019 checklist complete — closure pending.', time: '1h ago', unread: false }
  ],
  receiver: [
    { id: 1, text: 'WP-1031 issued to you — acknowledge to begin.', time: '30m ago', unread: true }
  ],
  loto: [
    { id: 1, text: 'New LOTO assignment: WP-1044.', time: '18h ago', unread: true }
  ],
  competent: [
    { id: 1, text: 'Your Hot Work certification expires in 4 days.', time: '1d ago', unread: true }
  ],
  supervisor: [
    { id: 1, text: 'WP-1044 needs a LOTO Responsible assignment.', time: '1h ago', unread: true },
    { id: 2, text: 'M. Khan unavailable for LOTO — certification expired.', time: '2h ago', unread: false }
  ],
  superadmin: [
    { id: 1, text: 'OCR engine reporting elevated latency.', time: '25m ago', unread: true },
    { id: 2, text: '2 users with expired certifications.', time: '3h ago', unread: false }
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

export const ROLES = [
  { key: 'superadmin', label: 'Super Admin', platform: 'web', description: 'System configuration & governance', icon: 'ShieldCheck' },
  { key: 'requester', label: 'Requester', platform: 'mobile', description: 'Raises work permits on-site', icon: 'FilePlus2' },
  { key: 'approver', label: 'Approver / HoD', platform: 'web', description: 'Reviews & signs off permits', icon: 'Stamp' },
  { key: 'observer', label: 'Observer / Safety Officer', platform: 'web', description: 'Monitors safety across all permits', icon: 'Eye' },
  { key: 'issuer', label: 'Permit Issuer', platform: 'web', description: 'Verifies, issues & closes permits', icon: 'FileCheck2' },
  { key: 'receiver', label: 'Permit Receiver', platform: 'mobile', description: 'Executes issued work on-site', icon: 'HardHat' },
  { key: 'loto', label: 'LOTO Responsible', platform: 'mobile', description: 'Performs lockout / tagout', icon: 'Lock' },
  { key: 'competent', label: 'Competent Personnel', platform: 'mobile', description: 'Tracks own competency & certs', icon: 'BadgeCheck' },
  { key: 'supervisor', label: 'Shift Supervisor', platform: 'web', description: 'Oversees shift operations & LOTO assignment', icon: 'Users' }
];

export const SHIFT_ROSTER = [
  { id: 'P-001', name: 'A. Singh', certified: true },
  { id: 'P-002', name: 'P. Rao', certified: true },
  { id: 'P-004', name: 'M. Khan', certified: false, reason: 'LOTO certification expired' }
];

export const SYSTEM_HEALTH = {
  sapPm: 'ok', enablon: 'ok', ocr: 'warning',
  activeUsers: 142, openPermits: 38,
  breakdown: { draft: 12, awaitingApproval: 9, approved: 6, inExecution: 8, dueClosure: 3 }
};
