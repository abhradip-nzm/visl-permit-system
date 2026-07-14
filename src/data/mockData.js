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
export function emptyDeptClearances(overrides = {}) {
  return {
    Mechanical: { status: 'pending', name: '', datetime: '' },
    'E&I': { status: 'pending', name: '', datetime: '' },
    Production: { status: 'pending', name: '', datetime: '' },
    itApproval: { required: false, granted: false, name: '' },
    ohcInformed: false,
    ...overrides
  };
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

export const PERMITS = [
  {
    id: 'WP-1046', types: ['Cold/General'], type: 'Cold/General', equipment: 'Pump P-204', location: 'Utility Block',
    area: 'Utility Block', shift: 'Morning', requester: 'S. Iyer', requestor: 'S. Iyer', status: 'draft', createdAt: '2026-07-06',
    dateFrom: '2026-07-07', dateTill: '2026-07-07', fromTime: '07:00', toTime: '15:00',
    jobDescription: 'Routine pump seal inspection.', wiNo: '', ownerDepartment: 'Mechanical', contractor: '',
    hazards: [], ppe: [], controls: [], warnings: [], risk: 'low', ageHours: 0,
    toolsEquipment: [], hazardsIdentified: [], riskControlMeasures: [], ppeFireProtection: [],
    rescue: { nameOfRescuer: '', nameOfFirstAider: '', procedureAvailable: false, intimationProvided: false },
    deptClearances: emptyDeptClearances(), isolationRequired: false, isolationDetails: [], toolboxRecord: [], isolationTopicsCovered: '',
    additionalPrecautions: '', declaration: { requestorName: '', date: '', time: '', toolboxTalkConfirmed: false, signed: null },
    approval: { approverName: '', date: '', time: '', onGroundVerified: false, signed: null, rejectionReason: '' },
    criticalLift: null, confinedSpaceMonitoring: null, transfers: [], closure: emptyClosure(),
    checklist: [{ id: 1, label: 'Pre-job briefing', done: false }],
    timeline: [{ stage: 'Draft started', at: '06 Jul, 15:10', by: 'S. Iyer' }]
  },
  {
    id: 'WP-1037', types: ['Confined Space'], type: 'Confined Space', equipment: 'Storage Tank T-5', location: 'Tank Farm',
    area: 'Tank Farm', shift: 'Night', requester: 'A. Chatterjee', requestor: 'A. Chatterjee', status: 'pending-clearance', createdAt: '2026-07-04',
    dateFrom: '2026-07-05', dateTill: '2026-07-05', fromTime: '22:00', toTime: '06:00',
    jobDescription: 'Internal tank inspection and sludge removal.', wiNo: 'WI-4102', ownerDepartment: 'Mechanical', contractor: 'Coastal Industrial Services',
    hazards: HAZARD_CONTROL_LIBRARY['Confined Space'].hazards, ppe: HAZARD_CONTROL_LIBRARY['Confined Space'].ppe,
    controls: HAZARD_CONTROL_LIBRARY['Confined Space'].controls,
    warnings: [{ type: 'incident', text: '1 near-miss recorded at Tank Farm in last 90 days.' }],
    ageHours: 30, risk: 'high',
    toolsEquipment: ['Hand tools', 'Ladder'],
    hazardsIdentified: ['Oxygen deficiency', 'Toxic/Flammable gas', 'Engulfment', 'Less Illumination'],
    riskControlMeasures: ['Portable Gas monitor calibrated', 'Respirator/SCBA available', 'Authorized gas tester available', 'Standby person name ___', 'Use of 24V lamp and confined space', 'Ventilation'],
    ppeFireProtection: ['Safety helmet', 'Full Body harness', 'Safety goggles', 'First Aid Kit'],
    rescue: { nameOfRescuer: 'R. Das', nameOfFirstAider: 'M. Khan', procedureAvailable: true, intimationProvided: true },
    deptClearances: emptyDeptClearances(), isolationRequired: false, isolationDetails: [], toolboxRecord: [], isolationTopicsCovered: '',
    additionalPrecautions: '', declaration: { requestorName: '', date: '', time: '', toolboxTalkConfirmed: false, signed: null },
    approval: { approverName: '', date: '', time: '', onGroundVerified: false, signed: null, rejectionReason: '' },
    criticalLift: null,
    confinedSpaceMonitoring: { gasMonitorSlNo: 'GM-2091', calibrationValid: true, confinedSpaceId: 'CS-TF-05', standbyPerson: 'M. Khan', rescuers: 'R. Das', gasTests: [], personalEntryRegister: [], equipmentEntryRegister: [], specialInstructions: '' },
    transfers: [], closure: emptyClosure(),
    checklist: [{ id: 1, label: 'Atmosphere test', done: false }],
    timeline: [
      { stage: 'Created — Request & Risk Assessment', at: '04 Jul, 22:10', by: 'A. Chatterjee' },
      { stage: 'Submitted for Departmental Clearance', at: '04 Jul, 22:30', by: 'System' }
    ]
  },
  {
    id: 'WP-1039', types: ['Electrical & Instrumentation', 'Isolation & Electrical'], type: 'Isolation & Electrical', equipment: 'MCC-3 Drive Panel', location: 'Crushing Plant',
    area: 'Crushing Plant', shift: 'Morning', requester: 'S. Iyer', requestor: 'S. Iyer', status: 'pending-isolation', createdAt: '2026-07-05',
    dateFrom: '2026-07-06', dateTill: '2026-07-06', fromTime: '06:00', toTime: '14:00',
    jobDescription: 'Replace MCC-3 drive panel contactor.', wiNo: 'WI-4108', ownerDepartment: 'Electrical', contractor: '',
    hazards: HAZARD_CONTROL_LIBRARY.Electrical.hazards, ppe: HAZARD_CONTROL_LIBRARY.Electrical.ppe,
    controls: HAZARD_CONTROL_LIBRARY.Electrical.controls,
    warnings: [], ageHours: 6, risk: 'medium',
    toolsEquipment: ['Hand tools', 'Power tools'],
    hazardsIdentified: ['Electric Shock', 'Static Electricity', 'Entrapment'],
    riskControlMeasures: ['Earthing provided for electrical equipment', 'ELCB / RCCB provided at source', 'Equipment / Panel / Switch gear isolation required'],
    ppeFireProtection: ['Safety helmet', 'Electrical gloves', 'Arc flash suit', 'Face Shield', 'Safety shoes'],
    rescue: { nameOfRescuer: '', nameOfFirstAider: '', procedureAvailable: false, intimationProvided: false },
    deptClearances: emptyDeptClearances({
      Mechanical: { status: 'cleared', name: 'D. Fernandes', datetime: '05 Jul, 08:10' },
      'E&I': { status: 'cleared', name: 'D. Fernandes', datetime: '05 Jul, 08:12' },
      Production: { status: 'not-applicable', name: '', datetime: '' },
      itApproval: { required: false, granted: false, name: '' },
      ohcInformed: false
    }),
    isolationRequired: true,
    isolationDetails: [
      { equipment: 'MCC-3 Drive Panel', typeOfIsolation: 'Electrical', isolationPermitNo: '', isolationOfficerName: '', lotoIdNo: '', deptLockNo: '' }
    ],
    toolboxRecord: [{ name: 'S. Iyer', company: 'Vedanta', personalLockId: '', signed: false }],
    isolationTopicsCovered: '',
    additionalPrecautions: '', declaration: { requestorName: '', date: '', time: '', toolboxTalkConfirmed: false, signed: null },
    approval: { approverName: '', date: '', time: '', onGroundVerified: false, signed: null, rejectionReason: '' },
    criticalLift: null, confinedSpaceMonitoring: null, transfers: [], closure: emptyClosure(),
    checklist: [{ id: 1, label: 'Voltage test to zero', done: false }],
    timeline: [
      { stage: 'Created — Request & Risk Assessment', at: '05 Jul, 07:30', by: 'S. Iyer' },
      { stage: 'Departmental Clearance granted', at: '05 Jul, 08:12', by: 'D. Fernandes (HOD)' },
      { stage: 'Awaiting Isolation Setup', at: '05 Jul, 08:13', by: 'System' }
    ]
  },
  {
    id: 'WP-1044', types: ['Confined Space', 'Isolation & Electrical'], type: 'Confined Space', equipment: 'Hydraulic Accumulator H-9', location: 'Crushing Plant',
    area: 'Crushing Plant', shift: 'Morning', requester: 'A. Chatterjee', requestor: 'A. Chatterjee', status: 'pending-declaration', createdAt: '2026-07-05',
    dateFrom: '2026-07-06', dateTill: '2026-07-06', fromTime: '06:00', toTime: '14:00',
    jobDescription: 'Internal inspection of hydraulic accumulator after isolation.', wiNo: 'WI-4111', ownerDepartment: 'Mechanical', contractor: '',
    hazards: HAZARD_CONTROL_LIBRARY['Confined Space'].hazards, ppe: HAZARD_CONTROL_LIBRARY['Confined Space'].ppe,
    controls: HAZARD_CONTROL_LIBRARY['Confined Space'].controls,
    ageHours: 18, risk: 'high',
    warnings: [],
    toolsEquipment: ['Hand tools'],
    hazardsIdentified: ['Oxygen deficiency', 'Engulfment', 'Entrapment'],
    riskControlMeasures: ['Portable Gas monitor calibrated', 'Respirator/SCBA available', 'Standby person name ___', 'Purging', 'Ventilation'],
    ppeFireProtection: ['Safety helmet', 'Full Body harness', 'Safety goggles', 'First Aid Kit'],
    rescue: { nameOfRescuer: 'A. Singh', nameOfFirstAider: 'P. Rao', procedureAvailable: true, intimationProvided: true },
    deptClearances: emptyDeptClearances({
      Mechanical: { status: 'cleared', name: 'D. Fernandes', datetime: '05 Jul, 15:10' },
      'E&I': { status: 'cleared', name: 'D. Fernandes', datetime: '05 Jul, 15:11' },
      Production: { status: 'not-applicable', name: '', datetime: '' },
      itApproval: { required: false, granted: false, name: '' },
      ohcInformed: false
    }),
    isolationRequired: true,
    isolationDetails: [
      { equipment: 'Hydraulic Accumulator H-9', typeOfIsolation: 'Mechanical', isolationPermitNo: 'ISO-0231', isolationOfficerName: 'J. Mehta', lotoIdNo: 'LOTO-014', deptLockNo: 'LK-198' }
    ],
    toolboxRecord: [{ name: 'A. Chatterjee', company: 'Vedanta', personalLockId: 'PL-011', signed: true }],
    isolationTopicsCovered: 'Reviewed hydraulic bleed-down sequence and lock/tag placement with crew before entry.',
    additionalPrecautions: '', declaration: { requestorName: '', date: '', time: '', toolboxTalkConfirmed: false, signed: null },
    approval: { approverName: '', date: '', time: '', onGroundVerified: false, signed: null, rejectionReason: '' },
    criticalLift: null,
    confinedSpaceMonitoring: { gasMonitorSlNo: 'GM-2077', calibrationValid: true, confinedSpaceId: 'CS-CP-09', standbyPerson: 'P. Rao', rescuers: 'A. Singh', gasTests: [], personalEntryRegister: [], equipmentEntryRegister: [], specialInstructions: '' },
    lotoRequired: true, lotoStatus: 'complete', lotoAssignee: 'J. Mehta',
    transfers: [], closure: emptyClosure(),
    checklist: [{ id: 1, label: 'Atmosphere monitoring active', done: false }],
    timeline: [
      { stage: 'Created — Request & Risk Assessment', at: '05 Jul, 14:00', by: 'A. Chatterjee' },
      { stage: 'Departmental Clearance granted', at: '05 Jul, 15:11', by: 'D. Fernandes (HOD)' },
      { stage: 'Isolation confirmed — LK-198, LOTO-014', at: '05 Jul, 15:40', by: 'J. Mehta (Isolation Officer)' },
      { stage: 'Awaiting Precautions & Declaration', at: '05 Jul, 15:41', by: 'System' }
    ]
  },
  {
    id: 'WP-1028', types: ['Cold/General'], type: 'Mechanical', equipment: 'Reactor Vessel R-12', location: 'Process Unit 2',
    area: 'Process Unit 2', shift: 'Morning', requester: 'T. Roy', requestor: 'T. Roy', status: 'pending-approval', createdAt: '2026-07-01',
    dateFrom: '2026-07-02', dateTill: '2026-07-02', fromTime: '07:00', toTime: '15:00',
    jobDescription: 'Reactor vessel gasket replacement.', wiNo: 'WI-3998', ownerDepartment: 'Mechanical', contractor: '',
    hazards: HAZARD_CONTROL_LIBRARY.Mechanical.hazards, ppe: HAZARD_CONTROL_LIBRARY.Mechanical.ppe,
    controls: HAZARD_CONTROL_LIBRARY.Mechanical.controls, warnings: [], risk: 'medium', ageHours: 4,
    toolsEquipment: ['Hand tools', 'Power tools'],
    hazardsIdentified: ['Crush/Cut Injury', 'Hot Surface', 'Moving Vehicles'],
    riskControlMeasures: ['Loose objects removed', 'Maintain safe distance from line of fire hazard', 'Cables / Hoses free from damage'],
    ppeFireProtection: ['Safety helmet', 'Hand gloves', 'Safety shoes', 'Safety goggles'],
    rescue: { nameOfRescuer: '', nameOfFirstAider: '', procedureAvailable: false, intimationProvided: false },
    deptClearances: emptyDeptClearances({
      Mechanical: { status: 'cleared', name: 'D. Fernandes', datetime: '01 Jul, 08:20' },
      'E&I': { status: 'not-applicable', name: '', datetime: '' },
      Production: { status: 'cleared', name: 'N. Bose', datetime: '01 Jul, 08:25' }
    }),
    isolationRequired: false, isolationDetails: [], toolboxRecord: [], isolationTopicsCovered: '',
    additionalPrecautions: 'Vessel to remain depressurized and cooled below 40°C before gasket removal.',
    declaration: { requestorName: 'T. Roy', date: '01 Jul', time: '09:00', toolboxTalkConfirmed: true, signed: { name: 'T. Roy', timestamp: '01 Jul, 09:00' } },
    approval: { approverName: '', date: '', time: '', onGroundVerified: false, signed: null, rejectionReason: '' },
    criticalLift: null, confinedSpaceMonitoring: null, transfers: [], closure: emptyClosure(),
    checklist: [{ id: 1, label: 'Pre-job briefing', done: true }, { id: 2, label: 'Isolation confirmed', done: false }],
    timeline: [
      { stage: 'Created — Request & Risk Assessment', at: '01 Jul, 07:50', by: 'T. Roy' },
      { stage: 'Departmental Clearance granted', at: '01 Jul, 08:25', by: 'D. Fernandes (HOD)' },
      { stage: 'Precautions & Declaration signed', at: '01 Jul, 09:00', by: 'T. Roy' },
      { stage: 'Awaiting Approval', at: '01 Jul, 09:01', by: 'System' }
    ]
  },
  {
    id: 'WP-1031', types: ['Cold/General'], type: 'Mechanical', equipment: 'MCC-3 Drive Panel', location: 'Crushing Plant',
    area: 'Crushing Plant', shift: 'Morning', requester: 'S. Iyer', requestor: 'S. Iyer', status: 'live', createdAt: '2026-07-02',
    dateFrom: '2026-07-02', dateTill: '2026-07-02', fromTime: '08:00', toTime: '16:00',
    jobDescription: 'Drive coupling inspection and bearing lubrication.', wiNo: 'WI-4021', ownerDepartment: 'Mechanical', contractor: '',
    hazards: HAZARD_CONTROL_LIBRARY.Mechanical.hazards, ppe: HAZARD_CONTROL_LIBRARY.Mechanical.ppe,
    controls: HAZARD_CONTROL_LIBRARY.Mechanical.controls,
    warnings: [], risk: 'low', ageHours: 2,
    receiver: 'S. Iyer',
    toolsEquipment: ['Hand tools', 'Grinding machine'],
    hazardsIdentified: ['Crush/Cut Injury', 'Entrapment'],
    riskControlMeasures: ['Equipment / Panel / Switch gear isolation required', 'Loose objects removed'],
    ppeFireProtection: ['Safety helmet', 'Hand gloves', 'Safety shoes', 'Safety goggles'],
    rescue: { nameOfRescuer: '', nameOfFirstAider: '', procedureAvailable: false, intimationProvided: false },
    deptClearances: emptyDeptClearances({
      Mechanical: { status: 'cleared', name: 'D. Fernandes', datetime: '02 Jul, 08:20' },
      'E&I': { status: 'not-applicable', name: '', datetime: '' },
      Production: { status: 'not-applicable', name: '', datetime: '' }
    }),
    isolationRequired: false, isolationDetails: [], toolboxRecord: [], isolationTopicsCovered: '',
    additionalPrecautions: '',
    declaration: { requestorName: 'S. Iyer', date: '02 Jul', time: '08:40', toolboxTalkConfirmed: true, signed: { name: 'S. Iyer', timestamp: '02 Jul, 08:40' } },
    approval: { approverName: 'D. Fernandes', date: '02 Jul', time: '08:45', onGroundVerified: true, signed: { name: 'D. Fernandes', timestamp: '02 Jul, 08:45' }, rejectionReason: '' },
    criticalLift: null, confinedSpaceMonitoring: null, transfers: [], closure: emptyClosure(),
    checklist: [
      { id: 1, label: 'Confirm isolation with LOTO tag', done: true },
      { id: 2, label: 'Inspect drive coupling', done: true },
      { id: 3, label: 'Lubricate bearings', done: false },
      { id: 4, label: 'Replace belt guard', done: false },
      { id: 5, label: 'Function test', done: false },
      { id: 6, label: 'Supervisor sign-off', done: false }
    ],
    timeline: [
      { stage: 'Created — Request & Risk Assessment', at: '02 Jul, 08:00', by: 'S. Iyer' },
      { stage: 'Departmental Clearance granted', at: '02 Jul, 08:20', by: 'D. Fernandes (HOD)' },
      { stage: 'Precautions & Declaration signed', at: '02 Jul, 08:40', by: 'S. Iyer' },
      { stage: 'Approved — Permit is LIVE', at: '02 Jul, 08:45', by: 'D. Fernandes (HOD)' },
      { stage: 'Job Execution started', at: '02 Jul, 09:20', by: 'System' }
    ]
  },
  {
    id: 'WP-1019', types: ['Cold/General'], type: 'Mechanical', equipment: 'Storage Tank T-5', location: 'Tank Farm',
    area: 'Tank Farm', shift: 'Morning', requester: 'K. Verma', requestor: 'K. Verma', status: 'pending-closure', createdAt: '2026-06-28',
    dateFrom: '2026-06-28', dateTill: '2026-07-05', fromTime: '08:00', toTime: '16:00',
    jobDescription: 'Tank exterior recoating and housekeeping.', wiNo: 'WI-3902', ownerDepartment: 'Mechanical', contractor: '',
    hazards: HAZARD_CONTROL_LIBRARY.Mechanical.hazards, ppe: HAZARD_CONTROL_LIBRARY.Mechanical.ppe,
    controls: HAZARD_CONTROL_LIBRARY.Mechanical.controls, warnings: [], risk: 'low', ageHours: 0,
    toolsEquipment: ['Hand tools', 'Scaffold'],
    hazardsIdentified: ['Fall of Person', 'Dust/Fumes'],
    riskControlMeasures: ['Safe working platform provided', 'Handrails & Toe guards available'],
    ppeFireProtection: ['Safety helmet', 'Dust Mask', 'Safety shoes', 'Full Body harness'],
    rescue: { nameOfRescuer: '', nameOfFirstAider: '', procedureAvailable: false, intimationProvided: false },
    deptClearances: emptyDeptClearances({
      Mechanical: { status: 'cleared', name: 'D. Fernandes', datetime: '28 Jun, 08:30' },
      'E&I': { status: 'not-applicable', name: '', datetime: '' },
      Production: { status: 'not-applicable', name: '', datetime: '' }
    }),
    isolationRequired: false, isolationDetails: [], toolboxRecord: [], isolationTopicsCovered: '',
    additionalPrecautions: '',
    declaration: { requestorName: 'K. Verma', date: '28 Jun', time: '08:40', toolboxTalkConfirmed: true, signed: { name: 'K. Verma', timestamp: '28 Jun, 08:40' } },
    approval: { approverName: 'D. Fernandes', date: '28 Jun', time: '09:40', onGroundVerified: true, signed: { name: 'D. Fernandes', timestamp: '28 Jun, 09:40' }, rejectionReason: '' },
    criticalLift: null, confinedSpaceMonitoring: null, transfers: [],
    closure: emptyClosure({
      requesterChecklist: { controlsBack: true, interlocksRestored: true, guardsInPlace: true, permitsSurrendered: true },
      toolboxTalkRefNo: 'TBT-0562',
      requesterSigned: { name: 'K. Verma', timestamp: '05 Jul, 16:00' }, requesterDate: '05 Jul', requesterTime: '16:00'
    }),
    checklist: [
      { id: 1, label: 'Isolation verified', done: true }, { id: 2, label: 'Guarding reinstated', done: true },
      { id: 3, label: 'Area cleared of tools', done: true }, { id: 4, label: 'Supervisor walk-down', done: true },
      { id: 5, label: 'Housekeeping complete', done: true }, { id: 6, label: 'Final closure sign-off', done: false }
    ],
    timeline: [
      { stage: 'Created — Request & Risk Assessment', at: '28 Jun, 08:10', by: 'K. Verma' },
      { stage: 'Departmental Clearance granted', at: '28 Jun, 08:30', by: 'D. Fernandes (HOD)' },
      { stage: 'Approved — Permit is LIVE', at: '28 Jun, 09:40', by: 'D. Fernandes (HOD)' },
      { stage: 'Job Execution completed', at: '05 Jul, 15:45', by: 'K. Verma' },
      { stage: 'Closure submitted — awaiting Approver verification', at: '05 Jul, 16:00', by: 'K. Verma' }
    ]
  },
  {
    id: 'WP-1020', types: ['Cold/General'], type: 'Mechanical', equipment: 'Storage Tank T-5', location: 'Tank Farm',
    area: 'Tank Farm', shift: 'Morning', requester: 'K. Verma', requestor: 'K. Verma', status: 'closed', createdAt: '2026-06-20',
    dateFrom: '2026-06-20', dateTill: '2026-06-21', fromTime: '08:00', toTime: '16:00',
    jobDescription: 'Level gauge calibration.', wiNo: 'WI-3811', ownerDepartment: 'Mechanical', contractor: '',
    hazards: [], ppe: [], controls: [], warnings: [], risk: 'low', ageHours: 0,
    toolsEquipment: ['Hand tools'], hazardsIdentified: ['Fall of materials'], riskControlMeasures: ['Loose objects removed'],
    ppeFireProtection: ['Safety helmet', 'Safety shoes'],
    rescue: { nameOfRescuer: '', nameOfFirstAider: '', procedureAvailable: false, intimationProvided: false },
    deptClearances: emptyDeptClearances({ Mechanical: { status: 'cleared', name: 'D. Fernandes', datetime: '20 Jun, 08:15' } }),
    isolationRequired: false, isolationDetails: [], toolboxRecord: [], isolationTopicsCovered: '', additionalPrecautions: '',
    declaration: { requestorName: 'K. Verma', date: '20 Jun', time: '08:30', toolboxTalkConfirmed: true, signed: { name: 'K. Verma', timestamp: '20 Jun, 08:30' } },
    approval: { approverName: 'D. Fernandes', date: '20 Jun', time: '09:00', onGroundVerified: true, signed: { name: 'D. Fernandes', timestamp: '20 Jun, 09:00' }, rejectionReason: '' },
    criticalLift: null, confinedSpaceMonitoring: null, transfers: [],
    closure: emptyClosure({
      requesterChecklist: { controlsBack: true, interlocksRestored: true, guardsInPlace: true, permitsSurrendered: true },
      toolboxTalkRefNo: 'TBT-0541',
      requesterSigned: { name: 'K. Verma', timestamp: '21 Jun, 15:30' }, requesterDate: '21 Jun', requesterTime: '15:30',
      approverChecklist: { controlsRestored: true, siteNormalized: true, materialsRemoved: true }, deviationDetails: '',
      approverSigned: { name: 'D. Fernandes', timestamp: '21 Jun, 16:10' }, approverDate: '21 Jun', approverTime: '16:10'
    }),
    checklist: [{ id: 1, label: 'Final closure sign-off', done: true }],
    timeline: [
      { stage: 'Created — Request & Risk Assessment', at: '20 Jun, 08:00', by: 'K. Verma' },
      { stage: 'Departmental Clearance granted', at: '20 Jun, 08:15', by: 'D. Fernandes (HOD)' },
      { stage: 'Approved — Permit is LIVE', at: '20 Jun, 09:00', by: 'D. Fernandes (HOD)' },
      { stage: 'Closure submitted', at: '21 Jun, 15:30', by: 'K. Verma' },
      { stage: 'Closure verified — Permit Closed', at: '21 Jun, 16:10', by: 'D. Fernandes (HOD)' }
    ]
  },
  {
    id: 'WP-1042', types: ['Hot Work'], type: 'Hot Work', equipment: 'Conveyor Belt #7', location: 'Crushing Plant',
    area: 'Crushing Plant', shift: 'Morning', requester: 'S. Iyer', requestor: 'S. Iyer', status: 'returned', createdAt: '2026-07-06',
    dateFrom: '2026-07-06', dateTill: '2026-07-06', fromTime: '06:00', toTime: '14:00',
    jobDescription: 'Weld repair on conveyor belt frame.', wiNo: 'WI-4120', ownerDepartment: 'Mechanical', contractor: '',
    hazards: HAZARD_CONTROL_LIBRARY['Hot Work'].hazards, ppe: HAZARD_CONTROL_LIBRARY['Hot Work'].ppe,
    controls: HAZARD_CONTROL_LIBRARY['Hot Work'].controls,
    ageHours: 3, risk: 'high',
    warnings: [
      { type: 'equipment', text: 'Equipment Conveyor Belt #7 has an overdue calibration (expired 12 Jun).' },
      { type: 'competency', text: 'Requester\'s Hot Work certification renews in 4 days.' },
      { type: 'incident', text: '2 near-misses recorded at Crushing Plant in last 90 days.' }
    ],
    toolsEquipment: ['Gas cutter', 'Welding Machine'],
    hazardsIdentified: ['Fire Hazard', 'Hot Surface', 'Dust/Fumes'],
    riskControlMeasures: ['Flammable material removed', 'Flash back arrestor provided in gas cutting', 'Gas cylinders with trolley & vertically tied'],
    ppeFireProtection: ['Safety helmet', 'Leather gloves', 'Face Shield', 'Fire Extinguishers'],
    rescue: { nameOfRescuer: '', nameOfFirstAider: '', procedureAvailable: false, intimationProvided: false },
    deptClearances: emptyDeptClearances(),
    isolationRequired: false, isolationDetails: [], toolboxRecord: [], isolationTopicsCovered: '', additionalPrecautions: '',
    declaration: { requestorName: '', date: '', time: '', toolboxTalkConfirmed: false, signed: null },
    approval: { approverName: 'D. Fernandes', date: '06 Jul', time: '06:50', onGroundVerified: false, signed: null, rejectionReason: 'Equipment calibration is overdue — resolve with Shift Supervisor before resubmission.' },
    criticalLift: null, confinedSpaceMonitoring: null, transfers: [], closure: emptyClosure(),
    checklist: [{ id: 1, label: 'Gas test before start', done: false }],
    timeline: [
      { stage: 'Created — Request & Risk Assessment', at: '06 Jul, 06:40', by: 'S. Iyer' },
      { stage: 'Returned to Requester — equipment calibration overdue', at: '06 Jul, 06:50', by: 'D. Fernandes (HOD)' }
    ]
  }
];

export const NOTIFICATIONS = {
  useradmin: [
    { id: 1, text: 'OCR engine reporting elevated latency.', time: '25m ago', unread: true },
    { id: 2, text: '2 users with expired certifications.', time: '3h ago', unread: false },
    { id: 3, text: 'New announcement scheduled: Plant shutdown 15 Jul.', time: '1d ago', unread: false }
  ],
  hod: [
    { id: 1, text: 'WP-1042 re-submitted with corrections.', time: '5m ago', unread: true },
    { id: 2, text: 'WP-1037 aging beyond 24h SLA.', time: '1h ago', unread: true },
    { id: 3, text: 'WP-1031 and WP-1028 ready to issue.', time: '2h ago', unread: false },
    { id: 4, text: 'Compliance renewal request from R. Das.', time: '3h ago', unread: false }
  ],
  safety: [
    { id: 1, text: 'Critical flag: LOTO not applied on WP-1044.', time: '20m ago', unread: true },
    { id: 2, text: 'M. Khan LOTO certification expired.', time: '3h ago', unread: false }
  ],
  supervisor: [
    { id: 1, text: 'WP-1044 needs a LOTO Responsible assignment.', time: '1h ago', unread: true },
    { id: 2, text: 'M. Khan unavailable for LOTO — certification expired.', time: '2h ago', unread: false },
    { id: 3, text: 'New maintenance request: MR-308 submitted.', time: '4h ago', unread: false }
  ],
  personnel: [
    { id: 1, text: 'WP-1042 blocked — equipment calibration overdue.', time: '10m ago', unread: true },
    { id: 2, text: 'WP-1031 issued to you — acknowledge to begin.', time: '30m ago', unread: true },
    { id: 3, text: 'Your Hot Work certification expires in 4 days.', time: '1d ago', unread: false }
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

// Phase 0 role model — label/description match ROLE_LABELS in navConfig.js
// (internal keys unchanged; see usersData.js header comment for why).
export const ROLES = [
  { key: 'useradmin', label: 'Super Admin', platform: 'web', description: 'Back-office: users, RBAC, lock register & departments', icon: 'ShieldCheck' },
  { key: 'hod', label: 'Approver', platform: 'web', description: 'Departmental clearance & final on-ground approval', icon: 'Stamp' },
  { key: 'safety', label: 'Safety Officer', platform: 'mobile', description: 'On-ground approval, live monitoring & closure verification', icon: 'Eye' },
  { key: 'supervisor', label: 'Isolation Officer', platform: 'web', description: 'Independently isolates equipment & manages the lock register', icon: 'Users' },
  { key: 'personnel', label: 'Requester', platform: 'mobile', description: 'Raises permits, runs risk assessment & executes the job', icon: 'HardHat' }
];

// Ordered lifecycle used by the workflow connection strip / breadcrumb indicators.
export const WORKFLOW_STAGES = [
  { key: 'request', label: 'Request', role: 'personnel' },
  { key: 'review', label: 'Review', role: 'supervisor' },
  { key: 'approve', label: 'Approve', role: 'hod' },
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
