import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import LotoTaskList from './LotoTaskList.jsx';
import LockSelection from './LockSelection.jsx';

const TITLES = { tasks: 'LOTO Task List', lock: 'Lock Reservation' };

export default function LotoApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'lock':
        return <LockSelection navigate={navigate} params={params} />;
      default:
        return <LotoTaskList navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'LOTO Task List'} />;
}
