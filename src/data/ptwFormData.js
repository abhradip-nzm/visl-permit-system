// ============================================================================
// MOCK DATA — Vedanta PTW form master lists (FRMT/MR/26 Rev 4)
// Sections A, C, D, E, F checkbox options + Section G department list.
// ============================================================================

// Section B — plant area (fixed list; free text is not permitted on the
// certified form for a controlled-vocabulary field like this).
export const PLANT_AREAS = ['Crushing Plant', 'Tank Farm', 'Process Unit 2', 'Utility Block', 'Head Office'];

// Section B — Work Instruction numbers (fixed list). "Not available" keeps
// the existing JSA-required fallback path for jobs with no WI yet.
export const WI_NUMBERS = ['WI-4108', 'WI-4111', 'WI-4523', 'WI-4890', 'WI-5012', 'WI-5104', 'Not available (JSA required)'];

// Section B — approved contractor list. "N/A" covers in-house work with no
// external contractor.
export const CONTRACTORS = ['N/A', 'L&T Construction', 'Voltas Ltd', 'Thermax Engineering', 'Local Contractor — Other'];

// Isolation Officer LOTO IDs now live in lotoIdRegisterData.js — tracked
// live in AppContext (reserveLotoId/releaseLotoId) with the same
// uniqueness enforcement as the departmental lock register, instead of
// this being a free-pick static list.

// Phase 9: personal locks are no longer a free-pick list — every person has
// exactly one personal LOTO key permanently associated with their account,
// tracked live with the same uniqueness enforcement as the departmental
// lock register. See personalLockRegisterData.js / AppContext's
// reservePersonalLock / releasePersonalLock.

// Section A — Type of Permit (multi-select)
export const PERMIT_TYPES = [
  'Cold/General',
  'Hot Work',
  'Excavation',
  'Isolation & Electrical',
  'Crane & Lifting',
  'Height Work',
  'Confined Space',
  'Project'
];

// Phase 9: auto-check data for Sections C/D/F, keyed by Section A permit
// type — selecting a type in Section A pre-selects (unions into) the
// matching Tools/Hazards/PPE checkboxes below. The Requester can still
// uncheck anything that doesn't apply; this only ever adds, never removes.
export const AUTO_CHECK_BY_TYPE = {
  'Cold/General': {
    tools: ['Hand tools', 'Power tools', 'Other'],
    hazards: ['Fall of Person', 'Crush/Cut Injury', 'Dust/Fumes', 'Less Illumination', 'Lone Working', 'Moving Vehicles', 'Unguarded opening'],
    ppe: ['Safety helmet', 'Safety shoes', 'Safety goggles', 'Hand gloves', 'Dust Mask', 'Ear plug/Muff', 'First Aid Kit']
  },
  'Hot Work': {
    tools: ['Gas cutter', 'Welding Machine', 'Grinding machine', 'Power tools', 'Hand tools'],
    hazards: ['Fire Hazard', 'Hot Surface', 'High Temp.', 'Static Electricity', 'Toxic/Flammable gas', 'Dust/Fumes', 'Electric Shock', 'Excess Noise'],
    ppe: ['Safety helmet', 'Safety shoes', 'Safety goggles', 'Face Shield', 'Leather gloves', 'Leather Apron', 'Fire Blanket', 'Fire Extinguishers', 'Ear plug/Muff', 'Full body Suit', 'First Aid Kit']
  },
  Excavation: {
    tools: ['Excavator', 'JCB', 'Wheel Loader', 'Hand tools'],
    hazards: ['Soil Collapse', 'Entrapment', 'Engulfment', 'Overhead line', 'Moving Vehicles', 'Fall of materials', 'Fall of Person', 'Dust/Fumes'],
    ppe: ['Safety helmet', 'Safety shoes', 'Safety goggles', 'Hand gloves', 'Dust Mask', 'Ear plug/Muff', 'First Aid Kit']
  },
  'Isolation & Electrical': {
    tools: ['Hand tools', 'Power tools', 'Other'],
    hazards: ['Electric Shock', 'Static Electricity', 'Overhead line', 'Fire Hazard', 'Oil spill/splash', 'Entrapment'],
    ppe: ['Safety helmet', 'Safety shoes', 'Arc flash suit', 'Electrical gloves', 'Face Shield', 'First Aid Kit']
  },
  'Crane & Lifting': {
    tools: ['Crane/Hydra', 'Lifting tools', 'Man basket', 'Other'],
    hazards: ['Fall of materials', 'Crush/Cut Injury', 'Overhead line', 'Moving Vehicles', 'Simultaneous operation', 'Pressurized hose/hydraulic failure', 'Fall of Person'],
    ppe: ['Safety helmet', 'Safety shoes', 'Hand gloves', 'Safety goggles', 'Full Body harness', 'First Aid Kit']
  },
  'Height Work': {
    tools: ['Scaffold', 'Ladder', 'Man basket', 'Hand tools', 'Power tools'],
    hazards: ['Fall of Person', 'Fall of materials', 'Unguarded opening', 'Less Illumination', 'Moving Vehicles', 'Lone Working'],
    ppe: ['Safety helmet', 'Safety shoes', 'Full Body harness', 'Fall Arrestors', 'Lifeline', 'Hand gloves', 'First Aid Kit']
  },
  'Confined Space': {
    tools: ['Hand tools', 'Power tools', 'Other'],
    hazards: ['Oxygen deficiency', 'Toxic/Flammable gas', 'Engulfment', 'Entrapment', 'Less Illumination', 'Lone Working', 'Steam', 'Static Electricity'],
    ppe: ['Safety helmet', 'Safety shoes', 'Full Body harness', 'Lifeline', 'Dust Mask', 'Face Shield', 'First Aid Kit']
  },
  Project: {
    tools: ['Hand tools', 'Power tools', 'Scaffold', 'Ladder', 'Pneumatic/hydraulic tools', 'Other'],
    hazards: ['Fall of Person', 'Crush/Cut Injury', 'Dust/Fumes', 'Moving Vehicles', 'Fall of materials', 'Less Illumination', 'Lone Working', 'Simultaneous operation'],
    ppe: ['Safety helmet', 'Safety shoes', 'Safety goggles', 'Hand gloves', 'Dust Mask', 'Ear plug/Muff', 'First Aid Kit']
  }
};

// Section C — Tools & Equipment to be Used
export const TOOLS_EQUIPMENT = [
  'Gas cutter', 'JCB', 'Man basket', 'Pneumatic/hydraulic tools', 'Hand tools',
  'Power tools', 'Excavator', 'Scaffold', 'Ladder', 'Grinding machine',
  'Crane/Hydra', 'Lifting tools', 'Welding Machine', 'Wheel Loader', 'Other'
];

// Section D — Hazards Identified
export const HAZARDS_IDENTIFIED = [
  'Fall of Person', 'Fire Hazard', 'Excess Noise', 'Oxygen deficiency',
  'Toxic/Flammable gas', 'Crush/Cut Injury', 'Hot Surface', 'Dust/Fumes',
  'Overhead line', 'Soil Collapse', 'Static Electricity', 'High Temp.',
  'Less Illumination', 'Entrapment', 'Pressurized hose/hydraulic failure',
  'Electric Shock', 'Oil spill/splash', 'Moving Vehicles', 'Fall of materials',
  'Simultaneous operation', 'Unguarded opening', 'Lone Working', 'Steam', 'Engulfment'
];

// Section E — Risk Control Measures, grouped for readable UI (content matches form verbatim)
export const RISK_CONTROL_GROUPS = [
  {
    group: 'Excavation',
    items: [
      'Excavated pit edges free from heavy materials',
      'Work area excavated area/barricaded',
      'Underground cables/pipelines marked',
      'Excavation plan attached with permit'
    ]
  },
  {
    group: 'Height / Scaffold',
    items: [
      'Scaffolding certified by ___',
      'Top, Mid rail & Toe guard available',
      'Safe working platform provided',
      'Handrails & Toe guards available',
      'Certified & valid Life line & Harness',
      'Horizontal/Vertical lifeline provided',
      'Fall arrestors provided for > than 5m',
      'Crawling boards & Nets provided',
      'Rigid structure available for anchoring',
      'Ladder properly supported & levelled',
      'Scaffolds are not overloaded',
      'Pick & Carry 12 ins from the ground & upto 50m'
    ]
  },
  {
    group: 'Crane / Lifting',
    items: [
      'Approved critical lift plan available',
      'Trained operators / Riggers / Electricians',
      'Lifting tools are certified',
      'Outriggers supported, Crane levelled',
      'Lifting Hook has a Safety Hook Latch',
      'Guide rope is provided for the load',
      'Signal man identified',
      'Riggers are competent'
    ]
  },
  {
    group: 'Hot Work',
    items: [
      'Flammable material removed',
      'Combustible material removed / Maintain minimum 15m safe distance / Fire Blanket must be used/shielded with fire proof curtains',
      'Flash back arrestor provided in gas cutting',
      'Below hot work area covered with fire blanket',
      'Gas cylinders with trolley & vertically tied',
      'Regulator pressure gauges in working condition'
    ]
  },
  {
    group: 'Confined Space',
    items: [
      'Gas level ___ & Temp ___ °C',
      'Portable Gas monitor calibrated',
      'Respirator/SCBA available',
      'Authorized gas tester available',
      'Standby person name ___',
      'Use of 24V lamp and confined space',
      'Flammable gas LEL checked',
      'Purging',
      'Ventilation',
      'Height/Confined space Pass/Licence'
    ]
  },
  {
    group: 'Electrical',
    items: [
      'Earthing provided for electrical equipment',
      'ELCB / RCCB provided at source',
      'Equipment / Panel / Switch gear isolation required',
      'Equipment / tank depressurized and drained'
    ]
  },
  {
    group: 'General',
    items: [
      'Wind Speed is not > 32 km/h',
      'Maintain safe distance from line of fire hazard',
      'Loose objects removed',
      'Road barriers in place / Road closed',
      'Name of Supervisor / Fire watcher ___',
      'Cables / Hoses free from damage',
      'Full sleeve dress available',
      'All hand tools are tethered',
      'Rescue Team available',
      'Rescue Equipment'
    ]
  }
];

// Section F — PPE and Fire Protection
export const PPE_FIRE_PROTECTION = [
  'Safety helmet', 'Hand gloves', 'Arc flash suit', 'Leather gloves', 'Fire Hydrant',
  'Lifeline', 'Safety shoes', 'Gum boots', 'Fire Blanket', 'Leather Apron',
  'Fire Extinguishers', 'Fall Arrestors', 'Safety goggles', 'Dust Mask',
  'Ear plug/Muff', 'Leg guard', 'Electrical gloves', 'Full Body harness',
  'Face Shield', 'First Aid Kit', 'Full body Suit'
];

// Section G — Concerned departments for clearance (re-exported from the
// department model in departmentsData.js so there's a single source of truth)
export { DEPARTMENTS } from './departmentsData.js';
export const CLEARANCE_DEPARTMENTS = ['Mechanical', 'E&I', 'Production'];

// Phase 9 flow re-architecture: the Safety Officer is no longer a blocking
// gate anywhere in the sequence (pure read-only Observer instead — see
// SafetyOfficerApp.jsx). Departmental Clearance is now conditional — it only
// appears in the sequence when needsClearance() says so (see
// departmentsData.js) — the stepper filters this step out dynamically, same
// pattern as the existing isolation-required filter.
export const PTW_STEPS = [
  { key: 'request', num: 1, label: 'Request & Risk Assessment', status: 'draft' },
  { key: 'declaration', num: 2, label: 'Precautions & Declaration', status: 'pending-declaration' },
  { key: 'clearance', num: 3, label: 'Departmental Clearance', status: 'pending-clearance' },
  { key: 'approval', num: 4, label: 'Approval', status: 'pending-approval' },
  { key: 'isolation', num: 5, label: 'Isolation Setup', status: 'pending-isolation' },
  { key: 'execution', num: 6, label: 'Job Execution', status: 'live' },
  { key: 'transfer', num: 7, label: 'Shift Transfer', status: 'live' },
  { key: 'closure', num: 8, label: 'Closure', status: 'pending-closure' },
  { key: 'closed', num: 9, label: 'Closed', status: 'closed' }
];
