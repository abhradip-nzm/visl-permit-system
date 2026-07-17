import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import HodDashboard from './HodDashboard.jsx';
import DepartmentalClearance from './DepartmentalClearance.jsx';
import ShiftCalendar from '../shared/ShiftCalendar.jsx';
import Profile from '../shared/Profile.jsx';

// Phase 9: HOD is now clearance-only — a narrow app with just the
// Clearance Dashboard, the Clearance screen itself, Shift Calendar, and
// Profile. Everything HOD used to do besides clearance (on-ground
// verification, closure, team/task oversight) now lives in ApproverApp.jsx.
const TITLES = {
  dashboard: 'Clearance Dashboard',
  clearance: 'Departmental Clearance',
  shiftcalendar: 'Shift Calendar',
  profile: 'Profile'
};

export default function HodApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'clearance':
        return <DepartmentalClearance navigate={navigate} params={params} />;
      case 'shiftcalendar':
        return <ShiftCalendar scopeLabel="Your Department" />;
      case 'profile':
        return <Profile />;
      default:
        return <HodDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Clearance Dashboard'} />;
}
