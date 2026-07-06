# Vedanta Work Permit Management System — Interactive Prototype

A clickable, sales/demo prototype of the **Vedanta Sesa: NLP – Work Permit Management System**, built by NextZen Minds.

> ⚠️ **This is a mock demo, not production software.** All data is hardcoded in-memory mock JSON. There are no backend calls, no real AI/NLP/OCR models, and nothing persists after you refresh the page.

## What's inside

- 5 role personas, switchable at any time from the top bar: **User Admin**, **HOD**, **Safety Officer**, **Shift Supervisor**, **Personnel** — consolidated from an earlier 9-role structure so the prototype reads as one connected permit workflow instead of separate siloed demos.
- A workflow connection strip (Request → Review → Approve → Execute → Monitor) appears on the landing page and on every role's main dashboard, highlighting where that role sits in the lifecycle.
- Mobile roles (Safety Officer, Personnel) render inside a phone-frame mock, each with a bottom tab bar including a shared Profile screen. Web roles (User Admin, HOD, Shift Supervisor) render full-width with a sidebar.
- A floating **"Vedanta AI"** assistant on every screen, powered by keyword-matched mock replies (see `src/data/aiAssistantData.js`).
- Fully faked NLP text-parsing, voice input, OCR scanning, and SAP PM lookups — all driven from mock JSON.
- Vedanta brand system: primary blue `#0164A9`, dark charcoal `#212529`, green accent `#66CC33`, Noto Sans JP typography.

## Requirements

- Node.js 18+ (Node 20/22 recommended)
- npm 9+

## Run it locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`). Open it in your browser.

Other scripts:

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  components/
    shell/         # App shell: sidebar, top bar, mobile chrome, role landing, notifications
    shared/         Reusable UI primitives (buttons, cards, badges, signature pad, phone frame,
                    ShiftCalendar, Profile, WorkflowStrip)
    ai/             Floating "Ask AI" assistant drawer
    useradmin/       Admin Dashboard, User Management, Role & Access, Task Overview,
                     Shift Calendar, Certifications, Announcements, Master Data
    hod/             HOD Dashboard (merged approval queue + issuance/closure), Review & Sign,
                     Verify & Issue, My Team, Task Management, Active Tasks & LOTO,
                     Compliance, Instruments
    safety/          Safety Dashboard, Monitor Permit Detail, LOTO Monitor,
                     Reporting/Alerts/Complaints, Compliance
    supervisor/       Shift Dashboard, Maintenance Requests, LOTO Approvals
    personnel/        My Tasks (merged requests + assignments), Task Detail, Request Task
                     (NLP/Voice/OCR/SAP + personal task/instrument requests), LOTO Task List,
                     LOTO Execution, Inventory (instruments + certifications)
  context/
    AppContext.jsx   # Global in-memory state: current role, permits, tasks, notifications, toasts
  data/
    mockData.js          Permits, equipment, personnel, locks, roles, workflow stages, system health
    usersData.js          User directory (User Management, Access Assignment)
    tasksData.js           Tasks + maintenance requests
    certificationsData.js  Certification types + geofence locations
    instrumentsData.js     Instrument inventory
    shiftsData.js           2-week shift calendar + active personnel roster
    announcementsData.js   Announcements
    complianceData.js       Compliance items, renewal requests, document versions
    observationsData.js    Safety observations, alerts, complaints
    lotoData.js             Active LOTO lock sessions + anomalies
    aiAssistantData.js     AI assistant chips + keyword-matched intents per role
    navConfig.js            Sidebar/tab-bar navigation config per role
  App.jsx            Role router
  main.jsx           React entry point
  index.css          Tailwind + global styles
```

## Notes for the demo

- Use the persona cards on the landing screen, or the role switcher in the top bar, to jump between roles.
- The **Personnel → Request Task → Type** flow (NLP-prefilled form) and the **Vedanta AI** assistant are the two features built with the most polish — start there for client demos.
- Follow a single permit end-to-end: Personnel requests → Shift Supervisor routes/approves LOTO → HOD approves & issues → Personnel executes → Safety Officer monitors. The workflow strip on each dashboard shows where you are in that chain.
- Everything is in-memory (React state only); refreshing the page resets all demo data back to its default mock state.
