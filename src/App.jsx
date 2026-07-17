import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import LoginScreen from './components/shell/LoginScreen.jsx';
import RoleSelector from './components/shell/RoleSelector.jsx';
import UserAdminApp from './components/useradmin/UserAdminApp.jsx';
import HodApp from './components/hod/HodApp.jsx';
import ApproverApp from './components/approver/ApproverApp.jsx';
import SafetyOfficerApp from './components/safety/SafetyOfficerApp.jsx';
import SupervisorApp from './components/supervisor/SupervisorApp.jsx';
import PersonnelApp from './components/personnel/PersonnelApp.jsx';
import WorkerApp from './components/worker/WorkerApp.jsx';
import RescuerApp from './components/rescuer/RescuerApp.jsx';
import FirstAiderApp from './components/firstaider/FirstAiderApp.jsx';

const ROLE_APPS = {
  useradmin: UserAdminApp,
  hod: HodApp,
  approver: ApproverApp,
  safety: SafetyOfficerApp,
  supervisor: SupervisorApp,
  personnel: PersonnelApp,
  worker: WorkerApp,
  rescuer: RescuerApp,
  firstaider: FirstAiderApp
};

function RootRouter() {
  const { currentUser, currentRole, currentDepartment } = useApp();
  if (!currentUser) return <LoginScreen />;
  if (!currentRole) return <RoleSelector />;
  const RoleApp = ROLE_APPS[currentRole];
  if (!RoleApp) return <RoleSelector />;
  // key forces a clean remount of internal screen state when switching roles/departments
  return <RoleApp key={`${currentRole}-${currentDepartment || ''}`} />;
}

export default function App() {
  return (
    <AppProvider>
      <RootRouter />
    </AppProvider>
  );
}
