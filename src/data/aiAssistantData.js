// ============================================================================
// MOCK AI ASSISTANT DATA — keyword-matched canned replies per role.
// No live model calls. All replies are pre-authored demo content.
// Structure mirrors the 5-role mock-ai-responses.json spec: each role has a
// set of {match, reply} intents plus a role-specific fallback.
// ============================================================================
export const aiAssistant = {
  useradmin: {
    chips: ['System health check', 'Any integration errors?', 'Users with expired certs', 'How many active permits?', 'Show shift roster for tomorrow', 'List pending task assignments'],
    intents: [
      { match: ['health', 'system', 'status', 'integration'], reply: 'All systems operational.\n- SAP PM: connected (last sync 2 min ago)\n- Enablon: connected\n- OCR Engine: elevated latency (avg 2.3s, threshold 1.5s)\n\nRecommendation: check OCR queue depth.' },
      { match: ['expired', 'cert', 'certification'], reply: '2 certifications expired:\n- R. Das: Confined Space (expired 28 Jun)\n- M. Khan: LOTO (expired 01 Jul)\n\n1 expiring soon:\n- S. Iyer: Hot Work (expires in 4 days)\n\nAction: Notify personnel for renewal.' },
      { match: ['active permit', 'how many', 'permit'], reply: '38 open permits across all plants:\n- Draft: 12\n- Awaiting Approval: 9\n- Approved: 6\n- In Execution: 8\n- Due Closure: 3\n\n2 permits are currently blocked due to equipment/certification issues.' },
      { match: ['shift', 'roster', 'tomorrow', 'schedule'], reply: "Tomorrow's Morning Shift (07:00-15:00):\n- Crushing Plant: 8 personnel (1 cert expiring)\n- Tank Farm: 5 personnel (all certs valid)\n- Process Unit 2: 6 personnel\n\nNo LOTO tasks scheduled for morning shift." },
      { match: ['pending', 'task', 'assignment', 'unassigned'], reply: 'Task Overview:\n- Total: 24 active tasks\n- Assigned: 19\n- Pending assignment: 5\n- Overdue: 2 (Task T-0087 maintenance, Task T-0091 inspection)\n\nRecommendation: Assign pending tasks before next shift change.' }
    ],
    fallback: 'I surface system health, integrations, users, master data, shift rosters, and permit/task stats.'
  },
  hod: {
    chips: ['Pending approvals summary', 'Team certification status', 'Active LOTO tasks', 'Overdue compliance items'],
    intents: [
      { match: ['pending', 'approval', 'review', 'approve'], reply: '3 permits awaiting your approval:\n1. WP-1037 — Confined Space, A. Chatterjee (30h, SLA risk, High Risk)\n2. WP-1039 — Electrical, S. Iyer (6h, Medium Risk)\n3. WP-1042 — Hot Work, S. Iyer (Blocked — equipment calibration overdue)\n\nPriority: Review WP-1037 first (SLA breach in 2h).' },
      { match: ['team', 'cert', 'certification', 'competency'], reply: 'Department certification status:\n- 12 personnel total\n- 9 fully certified\n- 2 expired (R. Das: Confined Space, M. Khan: LOTO)\n- 1 expiring in 4 days (S. Iyer: Hot Work)\n\nBlocked permits: WP-1042 linked to S. Iyer\'s expiring cert.' },
      { match: ['loto', 'lockout', 'lock'], reply: 'Active LOTO tasks:\n1. WP-1044 — Hydraulic Accumulator H-9, isolation required (not yet acknowledged)\nEnergy source: Electrical + Hydraulic\nAssigned to: P. Rao\n\nNo other active lockouts in your department.' },
      { match: ['compliance', 'overdue', 'renewal'], reply: 'Compliance summary for your department:\n- 3 compliance items due this month\n- 1 overdue: Fire Safety Audit (was due 01 Jul)\n- Equipment calibration: 1 overdue (Conveyor Belt #7, expired 12 Jun)\n\nAction: Escalate Conveyor Belt #7 calibration to maintenance.' }
    ],
    fallback: 'I can summarize your approval queue, team certifications, active LOTO tasks, and compliance status.'
  },
  safety: {
    chips: ['Active LOTO summary', 'High-risk permits right now', 'Expired certifications', 'Recent safety observations'],
    intents: [
      { match: ['loto', 'lock', 'lockout', 'key'], reply: 'Currently active locks:\n1. Lock L-2044 — Hydraulic Accumulator H-9, applied by P. Rao, 3h ago\n2. Lock L-1031 — MCC-3 Drive Panel, applied by A. Singh, 6h ago (nearing shift end)\n\nAlert: L-1031 should be released before shift handover at 15:00.' },
      { match: ['high risk', 'risk', 'dangerous'], reply: '3 high-risk permits currently active:\n1. WP-1037 — Confined Space, Tank Farm (1 near-miss in 90 days)\n2. WP-1042 — Hot Work, Crushing Plant (equipment calibration overdue)\n3. WP-1044 — Confined Space, Crushing Plant (LOTO not yet acknowledged)\n\nRecommendation: Prioritize WP-1044 — LOTO isolation pending.' },
      { match: ['expired', 'cert', 'certification'], reply: 'Expired certifications across site:\n- A. Singh: LOTO, Confined Space\n- P. Rao: LOTO\n- R. Das: Confined Space, Working at Height\n- M. Khan: LOTO, First Aid\n- S. Iyer: Hot Work (4 days remaining)\n\nTotal: 8 expired certs affecting 4 personnel.' },
      { match: ['observation', 'safety', 'flag', 'report'], reply: 'Recent safety observations:\n- 3 open flags (all High Risk)\n- WP-1037: Near-miss at Tank Farm\n- WP-1042: Overdue calibration on Conveyor Belt #7\n- WP-1044: LOTO isolation delay\n\nNo new observations submitted today.' }
    ],
    fallback: 'I give read-only safety insight: LOTO status, risk, expiries, and observations across all permits.'
  },
  supervisor: {
    chips: ["Who's on shift right now?", 'Pending LOTO requests', 'Active maintenance tasks', 'Any overdue assignments?'],
    intents: [
      { match: ['shift', 'who', 'personnel', 'on duty', 'active'], reply: 'Morning Shift (07:00-15:00) — 19 active personnel:\n- Crushing Plant: A. Singh, S. Iyer, P. Rao + 5 others\n- Tank Farm: A. Chatterjee + 4 others\n- Process Unit 2: R. Das (cert expired — flagged) + 5 others\n\nAlert: R. Das should not be assigned to Confined Space tasks.' },
      { match: ['loto', 'pending', 'request', 'approval'], reply: '1 pending LOTO request:\n- WP-1044: Hydraulic Accumulator H-9, requested by S. Iyer\nEnergy source: Electrical + Hydraulic\nSuggested assignee: P. Rao (certified, on shift)\n\nAction: Approve and assign to proceed with isolation.' },
      { match: ['maintenance', 'request', 'task'], reply: 'Active maintenance requests:\n- MR-301: Conveyor Belt #7 recalibration (High Priority, submitted 2 days ago)\n- MR-305: MCC-3 Drive Panel inspection (Medium, submitted today)\n- MR-308: Storage Tank T-5 valve check (Low, scheduled next week)\n\n1 overdue: MR-301 needs HOD escalation.' },
      { match: ['overdue', 'late', 'behind'], reply: 'Overdue items on current shift:\n1. MR-301 — Conveyor Belt #7 calibration (2 days overdue)\n2. WP-1044 — LOTO acknowledgement pending (3h since assignment)\n\nNo overdue checklists. All active permits within SLA.' }
    ],
    fallback: 'I help you manage the shift: roster, maintenance requests, and LOTO approvals.'
  },
  personnel: {
    chips: ['My active tasks', 'Certification expiry dates', 'LOTO status for my locks', 'Upcoming shift assignments'],
    intents: [
      { match: ['task', 'my', 'active', 'assigned'], reply: 'Your active tasks:\n1. WP-1031 — Mechanical, MCC-3 Drive Panel (Issued, Crushing Plant, Morning Shift)\nChecklist: 4/6 items complete\n2. WP-1037 — Confined Space request (Awaiting Approval)\n\nNo LOTO tasks currently assigned to you.' },
      { match: ['cert', 'certification', 'expiry', 'competency'], reply: 'Your certifications:\n- Hot Work: Expires in 4 days ⚠️\n- Working at Height: Valid — 180 days remaining ✓\n- First Aid: Valid — 365 days remaining ✓\n\nAction: Upload renewed Hot Work certificate before expiry to avoid task blocking.' },
      { match: ['loto', 'lock', 'lockout'], reply: 'No active LOTO locks assigned to you.\n\nPending: WP-1044 LOTO assignment in progress (awaiting Shift Supervisor approval). You may be assigned as LOTO responsible.' },
      { match: ['shift', 'schedule', 'upcoming'], reply: 'Your shift schedule:\n- Today: Morning Shift (07:00-15:00) — Crushing Plant\n- Tomorrow: Morning Shift (07:00-15:00) — Crushing Plant\n- Day after: Off\n\nNo shift changes pending.' }
    ],
    fallback: 'I help you track tasks, certifications, LOTO status, and upcoming shifts.'
  }
};

export function matchIntent(roleKey, userText) {
  const roleData = aiAssistant[roleKey];
  if (!roleData) return "I don't have specific data for that query. Try asking about permits, tasks, certifications, or LOTO status.";
  const text = userText.toLowerCase();
  for (const intent of roleData.intents) {
    if (intent.match.some((kw) => text.includes(kw))) {
      return intent.reply;
    }
  }
  return roleData.fallback;
}
