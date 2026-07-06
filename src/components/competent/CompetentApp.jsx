import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import CompetencyDashboard from './CompetencyDashboard.jsx';

export default function CompetentApp() {
  function renderScreen() {
    return <CompetencyDashboard />;
  }
  return <AppShell renderScreen={renderScreen} titleFor={() => 'My Competency'} />;
}
