import React, { useState } from 'react';
import { Bell, ChevronDown, Menu, Wifi, WifiOff, Globe, User, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ROLE_LABELS } from '../../data/navConfig.js';
import { ROLES } from '../../data/mockData.js';
import NotificationsPanel from './NotificationsPanel.jsx';
import { DemoBadge } from '../shared/Primitives.jsx';

const LANGUAGES = ['English', 'Hindi', 'Odia'];

export default function MobileTopBar({ title }) {
  const { currentRole, setCurrentRole, notifications, pushToast, language, setLanguage } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [online, setOnline] = useState(true);
  const unreadCount = (notifications[currentRole] || []).filter((n) => n.unread).length;

  return (
    <div className="sticky top-0 z-20 border-b border-nz-border bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-nz-border/60 bg-nz-surface px-4 py-1.5">
        <DemoBadge />
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-nz-blue-light text-nz-blue">
          <User size={12} />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <button
            onClick={() => setShowRoles((s) => !s)}
            className="flex items-center gap-1 text-xs font-semibold text-nz-blue"
          >
            {ROLE_LABELS[currentRole]} <ChevronDown size={12} />
          </button>
          <h2 className="text-base font-bold text-nz-navy">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowLang((s) => !s)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-nz-surface text-slate-600"
            >
              <Globe size={14} />
            </button>
            {showLang && (
              <div className="absolute right-0 z-30 mt-2 w-36 rounded-lg border border-nz-border bg-white p-1 shadow-panel animate-fadeIn">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l);
                      setShowLang(false);
                      pushToast(`Language set to ${l}`);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs hover:bg-nz-surface"
                  >
                    {l} {language === l && <Check size={12} className="text-nz-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setOnline((o) => !o);
              pushToast(online ? 'Switched to offline mode (demo)' : 'Back online — syncing queued actions', online ? 'default' : 'success');
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${online ? 'text-nz-green' : 'text-nz-red'}`}
          >
            {online ? <Wifi size={16} /> : <WifiOff size={16} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifs((s) => !s)}
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-nz-surface text-slate-600"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-nz-red text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
          </div>
        </div>
      </div>
      {showRoles && (
        <div className="max-h-56 overflow-y-auto border-t border-nz-border bg-white px-2 py-2">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => {
                setCurrentRole(r.key);
                setShowRoles(false);
                pushToast(`Switched to ${r.label}`);
              }}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                currentRole === r.key ? 'font-semibold text-nz-blue' : 'text-slate-600'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
