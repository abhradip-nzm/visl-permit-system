import React, { useState } from 'react';
import { Bell, ChevronDown, Wifi, WifiOff, Globe, User, Check, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ROLE_LABELS } from '../../data/navConfig.js';
import NotificationsPanel from './NotificationsPanel.jsx';
import { DemoBadge } from '../shared/Primitives.jsx';

const LANGUAGES = ['English', 'Hindi', 'Odia'];

export default function MobileTopBar({ title }) {
  const { currentRole, currentDepartment, currentUser, selectRole, logout, notifications, pushToast, language, setLanguage } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [online, setOnline] = useState(true);
  const unreadCount = (notifications[currentRole] || []).filter((n) => n.unread).length;
  const hasMultipleRoles = (currentUser?.roles?.length || 0) > 1;

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
            onClick={() => setShowAccount((s) => !s)}
            className="flex items-center gap-1 text-xs font-semibold text-nz-blue"
          >
            {currentUser?.name} · {ROLE_LABELS[currentRole]} <ChevronDown size={12} />
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
      {showAccount && (
        <div className="max-h-64 overflow-y-auto border-t border-nz-border bg-white px-2 py-2">
          {hasMultipleRoles && (
            <>
              <div className="px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">Switch role</div>
              {currentUser.roles.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    selectRole(r.role, r.department);
                    setShowAccount(false);
                    pushToast(`Acting as ${ROLE_LABELS[r.role]}${r.department ? ` · ${r.department}` : ''}`);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                    r.role === currentRole && r.department === currentDepartment ? 'font-semibold text-nz-blue' : 'text-slate-600'
                  }`}
                >
                  {ROLE_LABELS[r.role]}{r.department ? ` · ${r.department}` : ''}
                  {r.role === currentRole && r.department === currentDepartment && <Check size={13} />}
                </button>
              ))}
              <div className="my-1 border-t border-nz-border" />
            </>
          )}
          <button
            onClick={() => { setShowAccount(false); logout(); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}
