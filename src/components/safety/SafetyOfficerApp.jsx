import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import SafetyDashboard from './SafetyDashboard.jsx';
import MonitorPermitDetail from './MonitorPermitDetail.jsx';
import ShiftCalendar from '../shared/ShiftCalendar.jsx';
import Profile from '../shared/Profile.jsx';

// Phase 9: the Safety Officer is a pure, read-only observer now — one
// dashboard listing every permit's live status, and a detail view that
// mirrors the Requester's own lifecycle view (TaskDetail.jsx), read-only.
// No gates, no queues, no actions.
const TITLES = {
  dashboard: 'Observation Dashboard',
  monitor: 'Permit Observation',
  shiftcalendar: 'Shift Calendar',
  profile: 'Profile'
};

export default function SafetyOfficerApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'monitor':
        return <MonitorPermitDetail navigate={navigate} params={params} />;
      case 'shiftcalendar':
        return <ShiftCalendar scopeLabel="Your Shift" />;
      case 'profile':
        return <Profile />;
      default:
        return <SafetyDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Observation Dashboard'} />;
}
