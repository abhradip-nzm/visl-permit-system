import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Globe, User, Check, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { ROLE_LABELS } from '../../data/navConfig.js';
import NotificationsPanel from './NotificationsPanel.jsx';

const LANGUAGES = ['English', 'Hindi', 'Odia'];

export default function TopBar({ title }) {
  const { currentRole, currentDepartment, currentUser, selectRole, logout, language, setLanguage, notifications, pushToast } = useApp();
  const [showLang, setShowLang] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const ref = useRef(null);
  const hasMultipleRoles = (currentUser?.roles?.length || 0) > 1;

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowLang(false);
        setShowRoleMenu(false);
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const unreadCount = (notifications[currentRole] || []).filter((n) => n.unread).length;

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-nz-border bg-white px-6" ref={ref}>
      <div>
        <h1 className="text-lg font-bold text-nz-navy">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search permits, equipment, people…"
            className="w-64 rounded-lg border border-nz-border bg-nz-surface py-2 pl-9 pr-3 text-sm focus-ring focus:bg-white"
            onFocus={() => pushToast('Search is a visual demo only', 'default')}
            readOnly
          />
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLang((s) => !s)}
            className="flex items-center gap-1.5 rounded-lg border border-nz-border px-3 py-2 text-sm font-medium text-slate-600 hover:bg-nz-surface focus-ring"
          >
            <Globe size={15} /> {language} <ChevronDown size={14} />
          </button>
          {showLang && (
            <div className="absolute right-0 z-30 mt-2 w-40 rounded-lg border border-nz-border bg-white p-1 shadow-panel animate-fadeIn">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLanguage(l);
                    setShowLang(false);
                    pushToast(`Language set to ${l} (multilingual UI demo)`);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-nz-surface"
                >
                  {l} {language === l && <Check size={14} className="text-nz-blue" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs((s) => !s)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-nz-border text-slate-600 hover:bg-nz-surface focus-ring"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-nz-red px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
        </div>

        {/* Account menu — shows the signed-in user's identity; role-switching
            is limited to their own granted role-capabilities (see usersData.js) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu((s) => !s)}
            className="flex items-center gap-2 rounded-lg border border-nz-border pl-2 pr-3 py-1.5 hover:bg-nz-surface focus-ring"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-nz-blue-light text-nz-blue">
              <User size={15} />
            </div>
            <span className="text-sm font-semibold text-slate-700">{currentUser?.name}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {showRoleMenu && (
            <div className="absolute right-0 z-30 mt-2 w-64 rounded-lg border border-nz-border bg-white p-1 shadow-panel animate-fadeIn">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                {currentUser?.name} · {ROLE_LABELS[currentRole]}{currentDepartment ? ` (${currentDepartment})` : ''}
              </div>
              {hasMultipleRoles && (
                <>
                  <div className="px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-300">Switch role</div>
                  {currentUser.roles.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        selectRole(r.role, r.department);
                        setShowRoleMenu(false);
                        pushToast(`Acting as ${ROLE_LABELS[r.role]}${r.department ? ` · ${r.department}` : ''}`);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-nz-surface ${
                        r.role === currentRole && r.department === currentDepartment ? 'font-semibold text-nz-blue' : 'text-slate-600'
                      }`}
                    >
                      {ROLE_LABELS[r.role]}{r.department ? ` · ${r.department}` : ''}
                      {r.role === currentRole && r.department === currentDepartment && <Check size={14} />}
                    </button>
                  ))}
                  <div className="my-1 border-t border-nz-border" />
                </>
              )}
              <button
                onClick={() => { setShowRoleMenu(false); logout(); }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-nz-surface"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
