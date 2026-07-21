// ============================================================================
// MOCK DATA — Lock/Tag Register (Phase 0 foundation for C-2, C-3)
// A department-owned pool of predefined lock IDs. Lock IDs are never free
// text anywhere in the app — always a dropdown drawn from this register.
// State is held live in AppContext (see reserveLock/releaseLock) so
// uniqueness (C-3: a lock in use on one permit can't be picked for another)
// is enforced across the whole app, not just within one screen.
// ============================================================================
export const LOCK_REGISTER = [
  { id: 'LK-207', type: 'Electrical Lockout', department: 'E&I', state: 'available', permitId: null },
  { id: 'LK-214', type: 'Electrical Lockout', department: 'E&I', state: 'available', permitId: null },
  { id: 'LK-231', type: 'Hydraulic Isolation', department: 'Mechanical', state: 'available', permitId: null },
  { id: 'LK-198', type: 'Electrical Lockout', department: 'E&I', state: 'available', permitId: null },
  { id: 'LK-176', type: 'Electrical Lockout', department: 'E&I', state: 'available', permitId: null },
  { id: 'LK-052', type: 'Mechanical Isolation', department: 'Mechanical', state: 'available', permitId: null },
  { id: 'LK-063', type: 'Mechanical Isolation', department: 'Mechanical', state: 'available', permitId: null },
  { id: 'LK-089', type: 'Process Isolation', department: 'Production', state: 'available', permitId: null }
];
