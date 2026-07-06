import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import MyPermits from './MyPermits.jsx';
import CreatePermit from './CreatePermit.jsx';
import PermitDetail from './PermitDetail.jsx';

const TITLES = { mypermits: 'My Permits', create: 'Create Permit', detail: 'Permit Detail' };

export default function RequesterApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'create':
        return <CreatePermit navigate={navigate} />;
      case 'detail':
        return <PermitDetail navigate={navigate} params={params} />;
      default:
        return <MyPermits navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'My Permits'} />;
}
