// ============================================================================
// MOCK DATA — Shift calendar (Shift Calendar screen, Shift Dashboard)
// ============================================================================
const SLOTS = ['Morning', 'Afternoon', 'Night'];

function buildTwoWeeks() {
  const days = [];
  const start = new Date('2026-07-06');
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      date: iso,
      slots: SLOTS.map((slot) => ({
        slot,
        assignedCount: slot === 'Morning' ? 8 : slot === 'Afternoon' ? 6 : 4,
        personnel:
          slot === 'Morning'
            ? ['A. Singh', 'P. Rao', 'S. Iyer']
            : slot === 'Afternoon'
            ? ['R. Das', 'M. Khan']
            : ['A. Chatterjee']
      }))
    });
  }
  return days;
}

export const SHIFT_CALENDAR = buildTwoWeeks();

export const ACTIVE_PERSONNEL = [
  { id: 'P-001', name: 'A. Singh', role: 'Personnel', task: 'T-0087 — Conveyor Belt #7 recalibration', location: 'Crushing Plant', status: 'On duty', certStatus: 'valid' },
  { id: 'P-002', name: 'P. Rao', role: 'Personnel', task: 'T-0091 — Voltage isolation check', location: 'Crushing Plant', status: 'On duty', certStatus: 'valid' },
  { id: 'P-005', name: 'S. Iyer', role: 'Personnel', task: 'T-0081 — Lubricate bearings', location: 'Crushing Plant', status: 'On duty', certStatus: 'expiring' },
  { id: 'P-006', name: 'A. Chatterjee', role: 'Personnel', task: 'T-0084 — Confined space inspection', location: 'Tank Farm', status: 'On duty', certStatus: 'valid' },
  { id: 'P-003', name: 'R. Das', role: 'Personnel', task: 'Unassigned', location: 'Process Unit 2', status: 'Break', certStatus: 'expired' }
];
