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

// Isolation Officer LOTO ID register (fixed list, matches the format already
// used in seed data e.g. LOTO-014).
export const LOTO_IDS = ['LOTO-011', 'LOTO-012', 'LOTO-013', 'LOTO-014', 'LOTO-015', 'LOTO-016'];

// Personal (individual) locks used in group lockout toolbox records —
// distinct from the departmental lock register, which tracks equipment
// isolation locks with live uniqueness enforcement. Personal locks aren't
// shared/contended so they don't need that same state tracking.
export const PERSONAL_LOCKS = ['PL-001', 'PL-002', 'PL-003', 'PL-004', 'PL-005', 'PL-006', 'PL-011', 'PL-012'];

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

// Section C — Tools & Equipment to be Used
export const TOOLS_EQUIPMENT = [
  'Gas cutter', 'JCB', 'Man basket', 'Pneumatic/hydraulic tools', 'Hand tools',
  'Power tools', 'Excavator', 'Scaffold', 'Ladder', 'Grinding machine',
  'Crane/Hydra', 'Lifting tools', 'Welding Machine', 'Wheel Loader'
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

// The 9-step lifecycle used by the WorkflowStepper component.
export const PTW_STEPS = [
  { key: 'request', num: 1, label: 'Request & Risk Assessment', status: 'draft' },
  { key: 'clearance', num: 2, label: 'Departmental Clearance', status: 'pending-clearance' },
  { key: 'isolation', num: 3, label: 'Isolation Setup', status: 'pending-isolation' },
  { key: 'declaration', num: 4, label: 'Precautions & Declaration', status: 'pending-declaration' },
  { key: 'approval', num: 5, label: 'Approval', status: 'pending-approval' },
  { key: 'execution', num: 6, label: 'Job Execution', status: 'live' },
  { key: 'transfer', num: 7, label: 'Shift Transfer', status: 'live' },
  { key: 'closure', num: 8, label: 'Closure', status: 'pending-closure' },
  { key: 'closed', num: 9, label: 'Closed', status: 'closed' }
];
