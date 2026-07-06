// ============================================================================
// MOCK AI ASSISTANT DATA — keyword-matched canned replies per role.
// No live model calls. All replies are pre-authored demo content.
// ============================================================================
export const aiAssistant = {
  requester: {
    chips: ['Create a hot work permit', "What's blocking permit WP-1042?", 'Show my pending permits', 'What PPE do I need for welding?'],
    intents: [
      { match: ['create', 'new permit', 'hot work', 'welding'], reply: "Sure — describe the job in plain language and I'll pre-fill it. Example: *'welding on conveyor belt 7 in crushing plant, tomorrow morning shift.'* I'll set **Permit Type = Hot Work**, **Equipment = Conveyor Belt #7**, **Location = Crushing Plant**, and auto-add hazards, PPE and controls for review." },
      { match: ['blocking', 'block', 'why', 'wp-1042', 'status'], reply: '**Permit WP-1042 is blocked.** Reason: Equipment *Conveyor Belt #7* has an **overdue calibration** (expired 12 Jun). Also your **Hot Work certification** renews in 4 days. Resolve calibration via Shift Supervisor, then resubmit.' },
      { match: ['pending', 'my permits', 'list'], reply: 'You have **3 active items**: WP-1042 (Blocked), WP-1039 (Awaiting Approval), WP-1031 (Approved — awaiting issue).' },
      { match: ['ppe', 'protective', 'welding gear'], reply: 'For Hot Work / welding: **fire-resistant coveralls, welding helmet, leather gloves, face shield, fire watch + extinguisher on standby.** Auto-added to your permit — review before submit.' }
    ],
    fallback: 'I can help you create permits, check status, or explain safety requirements. Try one of the suggestions above.'
  },
  approver: {
    chips: ['Summarize my approval queue', 'Any high-risk permits?', 'Why is WP-1042 flagged?', 'What needs my signature?'],
    intents: [
      { match: ['queue', 'summarize', 'pending'], reply: '**5 permits awaiting you.** 2 high-risk (Hot Work), 1 aging >24h (WP-1037), 1 re-submitted (WP-1042), 1 routine. Recommend reviewing WP-1037 first (SLA breach risk).' },
      { match: ['high-risk', 'risk', 'dangerous'], reply: 'High-risk in queue: **WP-1044 (Confined Space)** and **WP-1042 (Hot Work near conveyor)**. Both have incident history at the location — see the Compliance panel before signing.' },
      { match: ['wp-1042', 'flagged', 'why'], reply: 'WP-1042 is flagged because the linked equipment calibration is **overdue** and the location had **2 near-misses in 90 days**. You cannot sign until calibration is cleared.' },
      { match: ['signature', 'sign', 'need'], reply: '3 permits are cleared for your signature: WP-1039, WP-1031, WP-1028. WP-1042 and WP-1044 are **blocked** pending safety resolution.' }
    ],
    fallback: 'I can summarize your queue, surface risk, or explain why a permit is flagged.'
  },
  observer: {
    chips: ["Show today's safety flags", 'Any expired certifications?', 'Incident history for Crushing Plant', 'Which permits are high-risk?'],
    intents: [
      { match: ['flag', 'today', 'safety'], reply: '**4 open flags today.** 1 critical: LOTO not applied on WP-1044 though work marked active. Recommend escalation to Shift Supervisor.' },
      { match: ['expired', 'certification', 'cert'], reply: '**7 personnel** have certifications expiring in 30 days; **2 are already expired** (R. Das — Confined Space, M. Khan — LOTO). Any permit linking them is auto-blocked.' },
      { match: ['incident', 'history', 'crushing'], reply: '**Crushing Plant, last 90 days:** 2 near-misses, 1 unsafe-act report. Most recent: hot-work spark near conveyor guard, 18 May.' },
      { match: ['high-risk', 'risk'], reply: 'Currently high-risk: WP-1044 (Confined Space) and WP-1042 (Hot Work). Both open — monitoring.' }
    ],
    fallback: 'I give read-only safety insight: flags, expiries, incident history, and risk across all permits.'
  },
  issuer: {
    chips: ["What's ready to issue?", 'Is WP-1031 cleared to issue?', "What's due for closure?", 'Any LOTO pending?'],
    intents: [
      { match: ['ready', 'issue', 'list'], reply: '**2 permits ready to issue:** WP-1031 and WP-1028 (approved, signatures complete, no blocks).' },
      { match: ['wp-1031', 'cleared'], reply: '**WP-1031 is cleared.** Approvals ✅, competency ✅, equipment valid ✅, LOTO not required. Safe to issue and notify the receiver.' },
      { match: ['closure', 'close', 'due'], reply: '**1 permit due for closure:** WP-1019 — all checklists complete, awaiting your closure signature (will confirm job closure to SAP PM).' },
      { match: ['loto', 'pending'], reply: 'WP-1044 requires LOTO — lockout **not yet acknowledged** by the LOTO Responsible person. Cannot issue until lock is applied and reserved.' }
    ],
    fallback: 'I help you verify, issue, and close permits, and flag anything blocking issuance.'
  },
  receiver: {
    chips: ['What permits are assigned to me?', 'What checklist is due?', 'What are the hazards on WP-1031?', 'Report a safety concern'],
    intents: [
      { match: ['assigned', 'my permits'], reply: '**1 permit issued to you: WP-1031** (Mechanical, Crushing Plant, morning shift). Acknowledge receipt to begin.' },
      { match: ['checklist', 'due', 'tasks'], reply: 'WP-1031 has a **6-item SAP maintenance checklist** (2 done, 4 pending). You can complete it offline; it syncs when you\'re back online.' },
      { match: ['hazard', 'wp-1031', 'risk', 'danger'], reply: '**WP-1031 hazards:** rotating equipment, pinch points. **Controls:** machine guarding, isolation confirmed. **PPE:** gloves, safety glasses, steel-toe boots.' },
      { match: ['report', 'concern', 'stop', 'unsafe'], reply: 'Opening a **Stop-Work / Safety Flag**. Describe or speak the concern and attach a photo — it notifies the Issuer and Safety Officer immediately.' }
    ],
    fallback: 'I help you receive permits, run checklists, and raise safety concerns from the field.'
  },
  loto: {
    chips: ['What LOTO tasks are assigned?', 'Which locks are available?', 'Isolation steps for WP-1044', 'Release a lock'],
    intents: [
      { match: ['task', 'assigned', 'loto'], reply: '**1 LOTO task: WP-1044** — isolate conveyor drive (electrical + hydraulic). Assigned by Shift Supervisor at 08:15.' },
      { match: ['lock', 'available', 'device'], reply: '**3 certified locks available:** LK-207, LK-214, LK-231. LK-198 is **reserved** (WP-1039). LK-176 is **cert-expired** and hidden from selection.' },
      { match: ['isolation', 'steps', 'wp-1044'], reply: '**Isolation for WP-1044:** 1) De-energize drive MCC-3, 2) Lock main breaker, 3) Bleed hydraulic accumulator, 4) Apply lock + tag, 5) Upload photo & acknowledge.' },
      { match: ['release', 'unlock'], reply: 'To release: confirm work complete on the permit, then formally release the lock. Reservation lifts system-wide and the event is logged with your ID and timestamp.' }
    ],
    fallback: 'I help with LOTO tasks, lock selection/reservation, isolation steps, and lock release.'
  },
  competent: {
    chips: ['When do my certs expire?', 'Am I cleared for hot work?', 'What am I assigned to?', 'Upload a renewed certificate'],
    intents: [
      { match: ['expire', 'cert', 'when'], reply: '**Your certifications:** Hot Work — expires in **4 days** ⚠️, Working at Height — valid 6 months, First Aid — valid 1 year.' },
      { match: ['hot work', 'cleared', 'qualified'], reply: 'You are currently cleared for Hot Work, but it **expires in 4 days**. Renew now to avoid permit blocks.' },
      { match: ['assigned', 'jobs', 'work'], reply: "You're linked to **WP-1031** (Mechanical) as competent personnel. Competency match: ✅." },
      { match: ['upload', 'renew', 'renewal'], reply: 'Opening the renewal uploader — attach your renewed certificate; it goes to the Super Admin for verification.' }
    ],
    fallback: 'I track your certifications, competency, assignments, and renewals.'
  },
  supervisor: {
    chips: ["Who's on shift for LOTO?", 'Assign LOTO for WP-1044', 'Any blocked permits this shift?', 'Prepare shift handover'],
    intents: [
      { match: ['shift', 'loto', 'who', 'roster'], reply: '**Certified & available for LOTO this shift:** A. Singh, P. Rao. (M. Khan hidden — LOTO cert expired.)' },
      { match: ['assign', 'wp-1044'], reply: 'Opening LOTO assignment for **WP-1044**. Select from the shift roster dropdown; the person is notified instantly.' },
      { match: ['blocked', 'block', 'issue'], reply: '**2 blocked this shift:** WP-1042 (equipment calibration overdue), WP-1044 (LOTO not yet applied). Both need action before issue.' },
      { match: ['handover', 'transfer'], reply: 'Preparing handover: **3 open permits** to transfer to next shift, plus 1 active LOTO reservation. Add notes (text or voice) and sign off.' }
    ],
    fallback: 'I help you manage the shift: LOTO assignment, blocks, roster, and handover.'
  },
  superadmin: {
    chips: ['System health check', 'Any integration errors?', 'Users with expired certs', 'How many active permits?'],
    intents: [
      { match: ['health', 'status', 'check'], reply: '**System healthy.** SAP PM ✅, Enablon ✅, OCR engine ⚠️ (elevated latency). 142 active users, 38 open permits.' },
      { match: ['integration', 'error', 'sync'], reply: '**1 issue:** OCR engine returned 3 low-confidence extractions in the last hour (field-mapping review suggested). SAP PM and Enablon syncing normally.' },
      { match: ['expired', 'cert', 'user'], reply: '**2 users with expired certifications:** R. Das (Confined Space), M. Khan (LOTO). Permits linking them are auto-blocked.' },
      { match: ['active permits', 'how many', 'count'], reply: '**38 active permits:** 12 draft, 9 awaiting approval, 6 approved, 8 in execution, 3 due closure.' }
    ],
    fallback: 'I surface system health, integrations, users, master data, and permit stats.'
  }
};

export function matchIntent(roleKey, userText) {
  const roleData = aiAssistant[roleKey];
  if (!roleData) return "I don't have information for this role yet.";
  const text = userText.toLowerCase();
  for (const intent of roleData.intents) {
    if (intent.match.some((kw) => text.includes(kw))) {
      return intent.reply;
    }
  }
  return roleData.fallback;
}
