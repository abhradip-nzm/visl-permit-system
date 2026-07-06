import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import RoleLanding from './components/shell/RoleLanding.jsx';
import SuperAdminApp from './components/superadmin/SuperAdminApp.jsx';
import RequesterApp from './components/requester/RequesterApp.jsx';
import ApproverApp from './components/approver/ApproverApp.jsx';
import ObserverApp from './components/observer/ObserverApp.jsx';
import IssuerApp from './components/issuer/IssuerApp.jsx';
import ReceiverApp from './components/receiver/ReceiverApp.jsx';
import LotoApp from './components/loto/LotoApp.jsx';
import CompetentApp from './components/competent/CompetentApp.jsx';
import SupervisorApp from './components/supervisor/SupervisorApp.jsx';

const ROLE_APPS = {
  superadmin: SuperAdminApp,
  requester: RequesterApp,
  approver: ApproverApp,
  observer: ObserverApp,
  issuer: IssuerApp,
  receiver: ReceiverApp,
  loto: LotoApp,
  competent: CompetentApp,
  supervisor: SupervisorApp
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
