import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { PERMITS, NOTIFICATIONS } from '../data/mockData.js';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(null);
  const [permits, setPermits] = useState(PERMITS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [toasts, setToasts] = useState([]);
  const [language, setLanguage] = useState('English');
  const [aiOpen, setAiOpen] = useState(false);

  const pushToast = useCallback((message, tone = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const updatePermit = useCallback((id, patch) => {
    setPermits((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const addTimelineEvent = useCallback((id, stage, by) => {
    setPermits((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, timeline: [...p.timeline, { stage, at: 'Just now', by }] }
          : p
      )
    );
  }, []);

  const markNotificationsRead = useCallback((roleKey) => {
    setNotifications((prev) => ({
      ...prev,
      [roleKey]: (prev[roleKey] || []).map((n) => ({ ...n, unread: false }))
    }));
  }, []);

  const value = useMemo(
    () => ({
      currentRole,
      setCurrentRole,
      permits,
      setPermits,
      updatePermit,
      addTimelineEvent,
      notifications,
      markNotificationsRead,
      toasts,
      pushToast,
      language,
      setLanguage,
      aiOpen,
      setAiOpen
    }),
    [currentRole, permits, notifications, toasts, language, aiOpen, pushToast, updatePermit, addTimelineEvent, markNotificationsRead]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
