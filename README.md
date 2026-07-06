# VISL Work Permit Management System — Interactive Prototype

A clickable, sales/demo prototype of the **Vedanta Sesa: NLP – Work Permit Management System**, built by NextZen Minds.

> ⚠️ **This is a mock demo, not production software.** All data is hardcoded in-memory mock JSON. There are no backend calls, no real AI/NLP/OCR models, and nothing persists after you refresh the page.

## What's inside

- 9 role personas, switchable at any time from the top bar: Super Admin, Requester, Approver/HoD, Observer/Safety Officer, Permit Issuer, Permit Receiver, LOTO Responsible, Competent Personnel, Shift Supervisor.
- Mobile roles (Requester, Receiver, LOTO, Competent Personnel) render inside a phone-frame mock. Web roles render full-width.
- A floating **"Ask AI"** assistant on every screen, powered by keyword-matched mock replies (see `src/data/aiAssistantData.js`).
- Fully faked NLP text-parsing, voice input, OCR scanning, and SAP PM lookups — all driven from mock JSON.
- NextZen brand system: primary blue `#1E50A0`, deep navy `#0F2A5F`, orange accent `#F26A21`, Noto Sans JP typography.

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
    shared/         Reusable UI primitives (buttons, cards, badges, signature pad, phone frame)
    ai/             Floating "Ask AI" assistant drawer
    superadmin/      Admin Dashboard, Permission Matrix, Master Data
    requester/        My Permits, Create Permit (NLP/Voice/OCR/SAP), NLP-Prefilled Form, Permit Detail
    approver/          Pending Queue, Review & Sign
    observer/          Safety Dashboard, Monitor Detail + Add Observation
    issuer/            Issuer Dashboard, Verify → Issue/Close
    receiver/          My Assigned Permits, Receive & Execute
    loto/              LOTO Task List, Lock Selection & Reservation
    competent/         My Competency Dashboard
    supervisor/        Shift Dashboard, LOTO Assignment
  context/
    AppContext.jsx   # Global in-memory state: current role, permits, notifications, toasts
  data/
    mockData.js        Permits, equipment, personnel, locks, notifications, system health
    aiAssistantData.js  AI assistant chips + keyword-matched intents per role
    navConfig.js        Sidebar/tab-bar navigation config per role
  App.jsx            Role router
  main.jsx           React entry point
  index.css          Tailwind + global styles
```

## Notes for the demo

- Use the persona cards on the landing screen, or the role switcher in the top bar, to jump between roles.
- The **Requester → Create Permit → Type** flow (NLP-Prefilled Form) and the **Ask AI** assistant are the two features built with the most polish — start there for client demos.
- Everything is in-memory (React state only); refreshing the page resets all demo data back to its default mock state.
