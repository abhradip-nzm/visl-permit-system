import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import ITDashboard from './ITDashboard.jsx';
import ShiftCalendar from '../shared/ShiftCalendar.jsx';
import Profile from '../shared/Profile.jsx';

const TITLES = {
  dashboard: 'IT Approval Dashboard',
  shiftcalendar: 'Shift Calendar',
  profile: 'Profile'
};

export default function ITProfessionalApp() {
  function renderScreen(screen) {
    switch (screen) {
      case 'shiftcalendar':
        return <ShiftCalendar scopeLabel="Your Shift" />;
      case 'profile':
        return <Profile />;
      default:
        return <ITDashboard />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'IT Approval Dashboard'} />;
}
