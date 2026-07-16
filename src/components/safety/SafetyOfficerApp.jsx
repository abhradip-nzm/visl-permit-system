import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import SafetyDashboard from './SafetyDashboard.jsx';
import SafetyGates from './SafetyGates.jsx';
import MonitorPermitDetail from './MonitorPermitDetail.jsx';
import LotoMonitor from './LotoMonitor.jsx';
import Reporting from './Reporting.jsx';
import Compliance from './Compliance.jsx';
import Profile from '../shared/Profile.jsx';

const TITLES = {
  dashboard: 'Safety Dashboard',
  gates: 'Permit Gates',
  monitor: 'Monitor Permit',
  lotomonitor: 'LOTO Monitor',
  reporting: 'Reporting',
  compliance: 'Compliance',
  profile: 'Profile'
};

export default function SafetyOfficerApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'gates':
        return <SafetyGates />;
      case 'monitor':
        return <MonitorPermitDetail navigate={navigate} params={params} />;
      case 'lotomonitor':
        return <LotoMonitor />;
      case 'reporting':
        return <Reporting navigate={navigate} />;
      case 'compliance':
        return <Compliance />;
      case 'profile':
        return <Profile />;
      default:
        return <SafetyDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Safety Dashboard'} />;
}
