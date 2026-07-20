import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import PhoneFrame from '../shared/PhoneFrame.jsx';
import MobileTopBar from './MobileTopBar.jsx';
import MobileTabBar from './MobileTabBar.jsx';
import AIAssistant from '../ai/AIAssistant.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { NAV_CONFIG } from '../../data/navConfig.js';
import { ToastHost } from '../shared/Primitives.jsx';

// Phase 10: viewMode is a session-wide Desktop/Mobile toggle (not tied to
// role, unlike the old deleted per-role mobile shell) — every role can be
// previewed in either chrome. The toggle button itself lives in each
// chrome's own top bar (TopBar.jsx / MobileTopBar.jsx, alongside the other
// header controls) rather than floating over the page, so it reads as part
// of the app instead of a stray overlay.
export default function AppShell({ renderScreen, titleFor }) {
  const { currentRole, toasts, viewMode } = useApp();
  const items = NAV_CONFIG[currentRole] || [];
  const [screen, setScreen] = useState(items[0]?.key);
  const [screenParams, setScreenParams] = useState(null);

  function navigate(key, params = null) {
    setScreen(key);
    setScreenParams(params);
  }

  if (viewMode === 'mobile') {
    return (
      <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-nz-charcoal/5">
        <PhoneFrame
          statusLabel="Vedanta Field App · Demo"
          overlay={
            <>
              <AIAssistant contained />
              <ToastHost toasts={toasts} contained />
            </>
          }
        >
          <MobileTopBar title={titleFor ? titleFor(screen) : ''} />
          <div className="pb-20">{renderScreen(screen, navigate, screenParams)}</div>
          <MobileTabBar activeScreen={screen} onNavigate={navigate} />
        </PhoneFrame>
      </div>
    );
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
