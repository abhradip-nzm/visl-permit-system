import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { PERMITS, NOTIFICATIONS } from '../data/mockData.js';
import { TASKS } from '../data/tasksData.js';
import { USERS } from '../data/usersData.js';
import { LOCK_REGISTER } from '../data/lockRegisterData.js';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  // Phase 0 auth: currentUser is the logged-in account; currentRole is which
  // of that account's role-capabilities they're currently acting as (an
  // account can hold several — see usersData.js); currentDepartment is the
  // department scope for capabilities that carry one (Approver, Isolation
  // Officer). Auth is stubbed (plain-text password match against USERS) but
  // kept behind login()/logout() so real auth/SSO can replace the internals
  // later without touching call sites.
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [permits, setPermits] = useState(PERMITS);
  const [tasks, setTasks] = useState(TASKS);
  const [lockRegister, setLockRegister] = useState(LOCK_REGISTER);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [toasts, setToasts] = useState([]);
  const [language, setLanguage] = useState('English');
  const [aiOpen, setAiOpen] = useState(false);

  const login = useCallback((username, password) => {
    const user = USERS.find((u) => u.username === username.trim().toLowerCase() && u.password === password && u.status === 'active');
    if (!user) return false;
    setCurrentUser(user);
    if (user.roles.length === 1) {
      setCurrentRole(user.roles[0].role);
      setCurrentDepartment(user.roles[0].department || null);
    }
    return true;
  }, []);

  const selectRole = useCallback((role, department = null) => {
    setCurrentRole(role);
    setCurrentDepartment(department);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentRole(null);
    setCurrentDepartment(null);
  }, []);

  const reserveLock = useCallback((lockId, permitId) => {
    setLockRegister((prev) => prev.map((l) => (l.id === lockId ? { ...l, state: 'in-use', permitId } : l)));
  }, []);

  const releaseLock = useCallback((lockId) => {
    setLockRegister((prev) => prev.map((l) => (l.id === lockId ? { ...l, state: 'available', permitId: null } : l)));
  }, []);

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

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      currentRole,
      currentDepartment,
      login,
      selectRole,
      logout,
      permits,
      setPermits,
      updatePermit,
      addTimelineEvent,
      tasks,
      setTasks,
      updateTask,
      lockRegister,
      reserveLock,
      releaseLock,
      notifications,
      markNotificationsRead,
      toasts,
      pushToast,
      language,
      setLanguage,
      aiOpen,
      setAiOpen
    }),
    [
      currentUser, currentRole, currentDepartment, login, selectRole, logout,
      permits, tasks, lockRegister, notifications, toasts, language, aiOpen,
      pushToast, updatePermit, addTimelineEvent, updateTask, reserveLock, releaseLock, markNotificationsRead
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
