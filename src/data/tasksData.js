// ============================================================================
// MOCK DATA — Tasks (Task Overview, Task Management, Maintenance Requests)
// ============================================================================
export const TASKS = [
  { id: 'T-0081', type: 'Maintenance', description: 'Lubricate bearings — MCC-3 Drive Panel', assignedTo: 'S. Iyer', department: 'Mechanical', equipment: 'MCC-3 Drive Panel', status: 'In Progress', dueDate: '2026-07-07', priority: 'Medium', permitId: 'WP-1031', lotoRequired: false },
  { id: 'T-0084', type: 'Inspection', description: 'Confined space entry inspection — Storage Tank T-5', assignedTo: 'A. Chatterjee', department: 'Mechanical', equipment: 'Storage Tank T-5', status: 'Pending', dueDate: '2026-07-06', priority: 'High', permitId: 'WP-1037', lotoRequired: false },
  { id: 'T-0087', type: 'Maintenance', description: 'Recalibrate Conveyor Belt #7', assignedTo: 'A. Singh', department: 'Mechanical', equipment: 'Conveyor Belt #7', status: 'Overdue', dueDate: '2026-07-04', priority: 'Critical', permitId: 'WP-1042', lotoRequired: true },
  { id: 'T-0091', type: 'Inspection', description: 'Voltage isolation check — MCC-3 Drive Panel', assignedTo: 'P. Rao', department: 'Electrical', equipment: 'MCC-3 Drive Panel', status: 'Overdue', dueDate: '2026-07-05', priority: 'High', permitId: 'WP-1039', lotoRequired: false },
  { id: 'T-0093', type: 'LOTO', description: 'Isolate Hydraulic Accumulator H-9', assignedTo: null, department: 'Mechanical', equipment: 'Hydraulic Accumulator H-9', status: 'Pending', dueDate: '2026-07-06', priority: 'High', permitId: 'WP-1044', lotoRequired: true },
  { id: 'T-0096', type: 'Maintenance', description: 'Closure housekeeping — Storage Tank T-5', assignedTo: 'K. Verma', department: 'Mechanical', equipment: 'Storage Tank T-5', status: 'Completed', dueDate: '2026-07-05', priority: 'Low', permitId: 'WP-1019', lotoRequired: false }
];

export const MAINTENANCE_REQUESTS = [
  { id: 'MR-301', taskType: 'Maintenance', description: 'Conveyor Belt #7 recalibration', equipment: 'Conveyor Belt #7', location: 'Crushing Plant', priority: 'High', status: 'Overdue — needs HOD escalation', submittedBy: 'J. Mehta', submittedAt: '2 days ago', lotoRequired: true, assignedTo: 'A. Singh' },
  { id: 'MR-305', taskType: 'Inspection', description: 'MCC-3 Drive Panel inspection', equipment: 'MCC-3 Drive Panel', location: 'Crushing Plant', priority: 'Medium', status: 'Submitted — awaiting HOD approval', submittedBy: 'J. Mehta', submittedAt: 'today', lotoRequired: false, assignedTo: 'P. Rao' },
  { id: 'MR-308', taskType: 'Emergency Repair', description: 'Storage Tank T-5 valve check', equipment: 'Storage Tank T-5', location: 'Tank Farm', priority: 'Low', status: 'Scheduled next week', submittedBy: 'L. Menon', submittedAt: '4h ago', lotoRequired: false, assignedTo: null }
];
