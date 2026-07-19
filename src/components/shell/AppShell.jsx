import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
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
// previewed in either chrome. The toggle button lives here (not TopBar or
// Sidebar) so it's fixed top-left and reachable regardless of which
// branch is currently rendering.
export default function AppShell({ renderScreen, titleFor }) {
  const { currentRole, toasts, viewMode, toggleViewMode } = useApp();
  const items = NAV_CONFIG[currentRole] || [];
  const [screen, setScreen] = useState(items[0]?.key);
  const [screenParams, setScreenParams] = useState(null);

  function navigate(key, params = null) {
    setScreen(key);
    setScreenParams(params);
  }

  const toggleButton = (
    <button
      onClick={toggleViewMode}
      className="flex items-center gap-1.5 rounded-full border border-nz-border bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-panel hover:bg-nz-surface focus-ring"
      title="Switch between desktop and mobile view"
    >
      {viewMode === 'desktop' ? <Smartphone size={14} /> : <Monitor size={14} />}
      {viewMode === 'desktop' ? 'Mobile View' : 'Desktop View'}
    </button>
  );

  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen bg-nz-charcoal/5">
        <div className="fixed left-4 top-4 z-40">{toggleButton}</div>
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
      <div className="relative">
        <Sidebar activeScreen={screen} onNavigate={navigate} />
        <div className="absolute right-3 top-3 z-10">{toggleButton}</div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={titleFor ? titleFor(screen) : ''} />
        <main className="flex-1 overflow-y-auto p-6">{renderScreen(screen, navigate, screenParams)}</main>
      </div>
      <AIAssistant />
      <ToastHost toasts={toasts} />
    </div>
  );
}
