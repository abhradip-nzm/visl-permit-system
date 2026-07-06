// ============================================================================
// MOCK DATA — Safety observations, alerts & complaints (Safety Officer Reporting)
// ============================================================================
export const OBSERVATIONS = [
  { id: 'OB-21', type: 'Near-Miss', text: 'Near-miss at Tank Farm — dropped tool near confined space entry.', location: 'Tank Farm', severity: 'High', submittedBy: 'T. Roy', date: '2026-07-05', permitId: 'WP-1037' },
  { id: 'OB-22', type: 'Unsafe Act', text: 'Hot-work spark near conveyor guard, insufficient clearance.', location: 'Crushing Plant', severity: 'Medium', submittedBy: 'T. Roy', date: '2026-05-18', permitId: 'WP-1042' },
  { id: 'OB-23', type: 'Observation', text: 'LOTO isolation delay on hydraulic accumulator.', location: 'Crushing Plant', severity: 'High', submittedBy: 'T. Roy', date: '2026-07-05', permitId: 'WP-1044' }
];

export const SAFETY_ALERTS = [
  { id: 'AL-05', text: 'Lock L-1031 applied 6h ago — nearing shift end without release.', severity: 'Medium', source: 'LOTO Monitor' },
  { id: 'AL-06', text: 'Equipment Conveyor Belt #7 calibration overdue.', severity: 'High', source: 'Equipment' },
  { id: 'AL-07', text: '2 personnel with expired certifications assigned this shift.', severity: 'High', source: 'Compliance' }
];

export const COMPLAINTS = [
  { id: 'CP-02', text: 'Inadequate lighting near Tank Farm night-shift access point.', status: 'Investigating', submittedBy: 'A. Chatterjee', date: '2026-07-03' },
  { id: 'CP-03', text: 'PPE storage locker damaged at Crushing Plant.', status: 'Resolved', submittedBy: 'S. Iyer', date: '2026-06-25' }
];
