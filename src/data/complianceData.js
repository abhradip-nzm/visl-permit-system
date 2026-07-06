// ============================================================================
// MOCK DATA — Compliance (HOD Compliance Request Management, Safety Compliance)
// ============================================================================
export const COMPLIANCE_ITEMS = [
  { certType: 'Hot Work', personnelCount: 4, pctValid: 75, pctExpiring: 25, pctExpired: 0 },
  { certType: 'Confined Space', personnelCount: 3, pctValid: 33, pctExpiring: 0, pctExpired: 67 },
  { certType: 'LOTO', personnelCount: 3, pctValid: 33, pctExpiring: 0, pctExpired: 67 },
  { certType: 'Working at Height', personnelCount: 2, pctValid: 100, pctExpiring: 0, pctExpired: 0 },
  { certType: 'First Aid', personnelCount: 2, pctValid: 100, pctExpiring: 0, pctExpired: 0 }
];

export const COMPLIANCE_REQUESTS = [
  { id: 'CR-11', personnel: 'R. Das', complianceType: 'Confined Space renewal', currentStatus: 'Expired', requestedAction: 'Renewal', date: '2026-07-05' },
  { id: 'CR-12', personnel: 'M. Khan', complianceType: 'LOTO renewal', currentStatus: 'Expired', requestedAction: 'Renewal', date: '2026-07-04' },
  { id: 'CR-13', personnel: 'S. Iyer', complianceType: 'Hot Work renewal', currentStatus: 'Expiring in 4 days', requestedAction: 'Renewal', date: '2026-07-06' }
];

export const COMPLIANCE_VERSIONS = [
  { document: 'LOTO Procedure', currentVersion: 'v3.2', latestVersion: 'v3.3', updateAvailable: true },
  { document: 'Confined Space Entry SOP', currentVersion: 'v2.1', latestVersion: 'v2.1', updateAvailable: false },
  { document: 'Hot Work Permit Standard', currentVersion: 'v1.8', latestVersion: 'v1.9', updateAvailable: true }
];

export const COMPLIANCE_OVERDUE = [
  { item: 'Fire Safety Audit', dueDate: '2026-07-01', status: 'Overdue' },
  { item: 'Conveyor Belt #7 calibration', dueDate: '2026-06-12', status: 'Overdue' }
];
