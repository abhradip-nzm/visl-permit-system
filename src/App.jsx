import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import RoleLanding from './components/shell/RoleLanding.jsx';
import UserAdminApp from './components/useradmin/UserAdminApp.jsx';
import HodApp from './components/hod/HodApp.jsx';
import SafetyOfficerApp from './components/safety/SafetyOfficerApp.jsx';
import SupervisorApp from './components/supervisor/SupervisorApp.jsx';
import PersonnelApp from './components/personnel/PersonnelApp.jsx';

const ROLE_APPS = {
  useradmin: UserAdminApp,
  hod: HodApp,
  safety: SafetyOfficerApp,
  supervisor: SupervisorApp,
  personnel: PersonnelApp
};

function RootRouter() {
  const { currentRole } = useApp();
  if (!currentRole) return <RoleLanding />;
  const RoleApp = ROLE_APPS[currentRole];
  if (!RoleApp) return <RoleLanding />;
  // key forces a clean remount of internal screen state when switching roles
  return <RoleApp key={currentRole} />;
}

export default function App() {
  return (
    <AppProvider>
      <RootRouter />
    </AppProvider>
  );
}
