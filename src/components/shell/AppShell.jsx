import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import PhoneFrame from '../shared/PhoneFrame.jsx';
import AIAssistant from '../ai/AIAssistant.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { ROLE_PLATFORM, NAV_CONFIG } from '../../data/navConfig.js';
import { ToastHost } from '../shared/Primitives.jsx';
import MobileTopBar from './MobileTopBar.jsx';
import MobileTabBar from './MobileTabBar.jsx';

export default function AppShell({ renderScreen, titleFor }) {
  const { currentRole, toasts } = useApp();
  const platform = ROLE_PLATFORM[currentRole];
  const items = NAV_CONFIG[currentRole] || [];
  const [screen, setScreen] = useState(items[0]?.key);
  const [screenParams, setScreenParams] = useState(null);

  function navigate(key, params = null) {
    setScreen(key);
    setScreenParams(params);
  }

  if (platform === 'mobile') {
    return (
      <div className="min-h-screen bg-nz-charcoal/5">
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
