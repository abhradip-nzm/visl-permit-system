import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import PermissionMatrix from './PermissionMatrix.jsx';
import MasterData from './MasterData.jsx';

const TITLES = { dashboard: 'Admin Dashboard', permissions: 'Permission Matrix', masterdata: 'Master Data' };

export default function SuperAdminApp() {
  function renderScreen(screen) {
    switch (screen) {
      case 'permissions':
        return <PermissionMatrix />;
      case 'masterdata':
        return <MasterData />;
      default:
        return <AdminDashboard />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Admin Dashboard'} />;
}
