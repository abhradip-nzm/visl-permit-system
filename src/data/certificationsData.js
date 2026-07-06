// ============================================================================
// MOCK DATA — Certification types & geofence locations (Certifications screen)
// Personnel-level certifications live on PERSONNEL in mockData.js.
// ============================================================================
export const CERTIFICATION_TYPES = [
  { type: 'Hot Work', validityMonths: 12, requiredFor: ['Hot Work permits'] },
  { type: 'Confined Space', validityMonths: 12, requiredFor: ['Confined Space permits'] },
  { type: 'Working at Height', validityMonths: 24, requiredFor: ['Elevated work'] },
  { type: 'LOTO', validityMonths: 18, requiredFor: ['Lockout / tagout execution'] },
  { type: 'First Aid', validityMonths: 36, requiredFor: ['All field personnel'] }
];

export const GEOFENCE_LOCATIONS = [
  { zone: 'Crushing Plant', lat: 21.2787, long: 83.9412, radiusMeters: 250, requiredCerts: ['Hot Work', 'LOTO'] },
  { zone: 'Tank Farm', lat: 21.2803, long: 83.9455, radiusMeters: 180, requiredCerts: ['Confined Space'] },
  { zone: 'Process Unit 2', lat: 21.2765, long: 83.9430, radiusMeters: 300, requiredCerts: ['LOTO', 'Working at Height'] }
];
