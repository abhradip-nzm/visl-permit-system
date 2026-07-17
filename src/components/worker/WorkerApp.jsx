import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import WorkerDashboard from './WorkerDashboard.jsx';
import WorkerJobDetail from './WorkerJobDetail.jsx';
import ShiftCalendar from '../shared/ShiftCalendar.jsx';
import Profile from '../shared/Profile.jsx';

const TITLES = {
  dashboard: 'My Jobs',
  jobdetail: 'Job Detail',
  shiftcalendar: 'Shift Calendar',
  profile: 'Profile'
};

export default function WorkerApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'jobdetail':
        return <WorkerJobDetail navigate={navigate} params={params} />;
      case 'shiftcalendar':
        return <ShiftCalendar scopeLabel="Your Shift" />;
      case 'profile':
        return <Profile />;
      default:
        return <WorkerDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'My Jobs'} />;
}
