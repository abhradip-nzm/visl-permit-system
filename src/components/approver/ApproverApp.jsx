import React from 'react';
import AppShell from '../shell/AppShell.jsx';
import PendingQueue from './PendingQueue.jsx';
import ReviewAndSign from './ReviewAndSign.jsx';

const TITLES = { queue: 'Pending Queue', review: 'Review & Sign' };

export default function ApproverApp() {
  function renderScreen(screen, navigate, params) {
    switch (screen) {
      case 'review':
        return <ReviewAndSign navigate={navigate} params={params} />;
      default:
        return <PendingQueue navigate={navigate} />;
    }
  }
  return <AppShell renderScreen={renderScreen} titleFor={(s) => TITLES[s] || 'Pending Queue'} />;
}
