import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import IssuerDashboard from './IssuerDashboard.jsx';
import VerifyIssueClose from './VerifyIssueClose.jsx';

const TITLES = { dashboard: 'Issuer Dashboard', verify: 'Verify Permit' };

export default function IssuerApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'verify':
        return <VerifyIssueClose navigate={navigate} params={params} />;
      default:
        return <IssuerDashboard navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Issuer Dashboard'} />;
}
