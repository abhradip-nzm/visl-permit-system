// ============================================================================
// MOCK DATA — Isolation Officer LOTO ID register
// A fixed pool of LOTO ID numbers, tracked live in AppContext
// (reserveLotoId/releaseLotoId) with the exact same uniqueness enforcement
// as the departmental lock register in lockRegisterData.js — a LOTO ID
// already in use on one live permit can never be picked for another until
// the Isolation Officer de-isolates and releases it.
// ============================================================================
export const LOTO_ID_REGISTER = [
  { id: 'LOTO-011', state: 'available', permitId: null },
  { id: 'LOTO-012', state: 'available', permitId: null },
  { id: 'LOTO-013', state: 'available', permitId: null },
  { id: 'LOTO-014', state: 'available', permitId: null },
  { id: 'LOTO-015', state: 'available', permitId: null },
  { id: 'LOTO-016', state: 'available', permitId: null }
];
