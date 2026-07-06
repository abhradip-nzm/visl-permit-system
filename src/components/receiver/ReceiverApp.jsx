import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import MyAssignedPermits from './MyAssignedPermits.jsx';
import ReceiveAndExecute from './ReceiveAndExecute.jsx';

const TITLES = { mypermits: 'My Assigned Permits', execute: 'Receive & Execute' };

export default function ReceiverApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'execute':
        return <ReceiveAndExecute navigate={navigate} params={params} />;
      default:
        return <MyAssignedPermits navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'My Assigned Permits'} />;
}
