import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import ShiftDashboard from './ShiftDashboard.jsx';
import LotoAssignment from './LotoAssignment.jsx';

const TITLES = { dashboard: 'Shift Dashboard', 'loto-assign': 'LOTO Assignment' };

export default function SupervisorApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'loto-assign':
        return <LotoAssignment navigate={navigate} params={params} />;
      default:
        return <ShiftDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Shift Dashboard'} />;
}
