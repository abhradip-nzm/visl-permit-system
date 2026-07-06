import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import ShiftDashboard from './ShiftDashboard.jsx';
import MaintenanceRequests from './MaintenanceRequests.jsx';
import LotoApprovals from './LotoApprovals.jsx';

const TITLES = { dashboard: 'Shift Dashboard', maintenance: 'Maintenance Requests', lotoapprovals: 'LOTO Approvals' };

export default function SupervisorApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'maintenance':
        return <MaintenanceRequests />;
      case 'lotoapprovals':
        return <LotoApprovals params={params} />;
      default:
        return <ShiftDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Shift Dashboard'} />;
}
