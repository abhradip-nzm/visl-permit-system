import { USERS } from './usersData.js';

// Phase 9: every person carries their own personal LOTO key (distinct from
// the departmental equipment lock register in lockRegisterData.js). Per the
// explicit requirement: "when a key is in use, it should be disabled from
// getting used from every other permit" — so this is tracked live in
// AppContext (reservePersonalLock/releasePersonalLock), mirroring the
// existing department lock register's uniqueness enforcement exactly. Each
// user gets exactly one personal lock, derived from their user id so it's
// stable and guaranteed unique.
export const PERSONAL_LOCK_REGISTER = USERS.map((u) => ({
  id: `PL-${u.id.split('-')[1]}`,
  ownerId: u.id,
  ownerName: u.name,
  state: 'available',
  permitId: null
}));
