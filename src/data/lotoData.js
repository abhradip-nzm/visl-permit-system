// ============================================================================
// MOCK DATA — Active LOTO sessions (Safety LOTO Monitor, HOD Active Tasks & LOTO)
// Lock device inventory (LOCKS) lives in mockData.js.
// ============================================================================
export const ACTIVE_LOCK_SESSIONS = [
  { lockId: 'LK-198', deviceType: 'Electrical Lockout', appliedBy: 'P. Rao', permitId: 'WP-1039', equipment: 'MCC-3 Drive Panel', appliedAt: '3h ago', status: 'Locked' },
  { lockId: 'LK-176', deviceType: 'Electrical Lockout', appliedBy: 'A. Singh', permitId: 'WP-1031', equipment: 'MCC-3 Drive Panel', appliedAt: '6h ago', status: 'Locked — nearing shift end' }
];

export const LOTO_ANOMALIES = [
  { id: 'LA-01', text: 'Lock LK-176 applied 6+ hours ago — no release scheduled before shift handover at 15:00.', severity: 'Medium' }
];
