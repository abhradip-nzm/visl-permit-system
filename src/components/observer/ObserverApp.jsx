import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import SafetyDashboard from './SafetyDashboard.jsx';
import MonitorDetail from './MonitorDetail.jsx';

const TITLES = { dashboard: 'Safety Dashboard', monitor: 'Monitor Permit' };

export default function ObserverApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'monitor':
        return <MonitorDetail navigate={navigate} params={params} />;
      default:
        return <SafetyDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Safety Dashboard'} />;
}
