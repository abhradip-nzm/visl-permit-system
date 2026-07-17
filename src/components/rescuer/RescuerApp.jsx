import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import StandbyDashboard from '../shared/StandbyDashboard.jsx';
import ShiftCalendar from '../shared/ShiftCalendar.jsx';
import Profile from '../shared/Profile.jsx';

const TITLES = {
  dashboard: 'My Assignments',
  shiftcalendar: 'Shift Calendar',
  profile: 'Profile'
};

export default function RescuerApp() {
  function renderScreen(screen) {
    switch (screen) {
      case 'shiftcalendar':
        return <ShiftCalendar scopeLabel="Your Shift" />;
      case 'profile':
        return <Profile />;
      default:
        return <StandbyDashboard field="rescuers" roleLabel="Rescuer" />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'My Assignments'} />;
}
