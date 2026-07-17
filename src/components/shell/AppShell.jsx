import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import AIAssistant from '../ai/AIAssistant.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { NAV_CONFIG } from '../../data/navConfig.js';
import { ToastHost } from '../shared/Primitives.jsx';

// Phase 9: no mobile shell anywhere — every role renders through this same
// desktop Sidebar/TopBar layout (see ROLE_PLATFORM in navConfig.js, kept
// only as a legacy no-op hook point).
export default function AppShell({ renderScreen, titleFor }) {
  const { currentRole, toasts } = useApp();
  const items = NAV_CONFIG[currentRole] || [];
  const [screen, setScreen] = useState(items[0]?.key);
  const [screenParams, setScreenParams] = useState(null);

  function navigate(key, params = null) {
    setScreen(key);
    setScreenParams(params);
  }

  return (
    <div className="flex h-screen bg-nz-surface">
      <Sidebar activeScreen={screen} onNavigate={navigate} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={titleFor ? titleFor(screen) : ''} />
        <main className="flex-1 overflow-y-auto p-6">{renderScreen(screen, navigate, screenParams)}</main>
      </div>
      <AIAssistant />
      <ToastHost toasts={toasts} />
    </div>
  );
}
