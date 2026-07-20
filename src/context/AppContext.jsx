import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { PERMITS, NOTIFICATIONS } from '../data/mockData.js';
import { TASKS } from '../data/tasksData.js';
import { USERS } from '../data/usersData.js';
import { LOCK_REGISTER } from '../data/lockRegisterData.js';
import { PERSONAL_LOCK_REGISTER } from '../data/personalLockRegisterData.js';
import { LOTO_ID_REGISTER } from '../data/lotoIdRegisterData.js';

const AppContext = createContext(null);

let toastId = 0;
let shiftTransferId = 0;

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
  const [personalLockRegister, setPersonalLockRegister] = useState(PERSONAL_LOCK_REGISTER);
  const [lotoIdRegister, setLotoIdRegister] = useState(LOTO_ID_REGISTER);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [shiftTransfers, setShiftTransfers] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [language, setLanguage] = useState('English');
  const [aiOpen, setAiOpen] = useState(false);
  // Phase 10: a session-wide Desktop/Mobile toggle (see AppShell.jsx) —
  // independent of role, unlike the old per-role ROLE_PLATFORM split.
  // Defaults to whichever chrome actually fits the real screen on load (the
  // desktop Sidebar is a fixed 256px-wide element with no responsive
  // collapse, so a phone visitor landing in the desktop branch would see it
  // eat most of the viewport) — the toggle still lets anyone switch freely
  // afterwards.
  const [viewMode, setViewMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 'mobile' : 'desktop'
  );
  const toggleViewMode = useCallback(() => {
    setViewMode((m) => (m === 'desktop' ? 'mobile' : 'desktop'));
  }, []);

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

  // C-3: reserveLock is the single write path that can move a lock to
  // in-use, and it refuses to double-book a lock that's already reserved
  // elsewhere — the dept-scoped dropdowns only ever offer available locks,
  // but this guard keeps the register itself the source of truth even if a
  // stale selection is submitted.
  const reserveLock = useCallback(
    (lockId, permitId) => {
      const target = lockRegister.find((l) => l.id === lockId);
      if (!target || target.state !== 'available') return false;
      setLockRegister((prev) => prev.map((l) => (l.id === lockId ? { ...l, state: 'in-use', permitId } : l)));
      return true;
    },
    [lockRegister]
  );

  const releaseLock = useCallback((lockId) => {
    setLockRegister((prev) => prev.map((l) => (l.id === lockId && l.state === 'in-use' ? { ...l, state: 'available', permitId: null } : l)));
  }, []);

  // Phase 9: personal LOTO keys get the exact same live uniqueness guarantee
  // as the departmental lock register — a key already in use on one permit
  // can never be reserved for another until it's released.
  const reservePersonalLock = useCallback(
    (lockId, permitId) => {
      const target = personalLockRegister.find((l) => l.id === lockId);
      if (!target || target.state !== 'available') return false;
      setPersonalLockRegister((prev) => prev.map((l) => (l.id === lockId ? { ...l, state: 'in-use', permitId } : l)));
      return true;
    },
    [personalLockRegister]
  );

  const releasePersonalLock = useCallback((lockId) => {
    setPersonalLockRegister((prev) => prev.map((l) => (l.id === lockId && l.state === 'in-use' ? { ...l, state: 'available', permitId: null } : l)));
  }, []);

  // LOTO ID No. gets the exact same live uniqueness guarantee as the
  // departmental lock register and personal locks — a LOTO ID already
  // assigned to one live permit can never be picked for another until the
  // Isolation Officer de-isolates and releases it.
  const reserveLotoId = useCallback(
    (lotoId, permitId) => {
      const target = lotoIdRegister.find((l) => l.id === lotoId);
      if (!target || target.state !== 'available') return false;
      setLotoIdRegister((prev) => prev.map((l) => (l.id === lotoId ? { ...l, state: 'in-use', permitId } : l)));
      return true;
    },
    [lotoIdRegister]
  );

  const releaseLotoId = useCallback((lotoId) => {
    setLotoIdRegister((prev) => prev.map((l) => (l.id === lotoId && l.state === 'in-use' ? { ...l, state: 'available', permitId: null } : l)));
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

  // Phase 9: shift transfer is now available to every role, not just the
  // Requester's permit-level handoff (PermitTransfer.jsx) — this is a
  // role-level "I'm going off shift, hand my current duties to a colleague"
  // record, scoped to whoever else holds the same role (and department, if
  // scoped).
  const transferShift = useCallback((toName, role, department) => {
    setShiftTransfers((prev) => [
      { id: ++shiftTransferId, from: currentUser?.name, to: toName, role, department, at: 'Just now' },
      ...prev
    ]);
  }, [currentUser]);

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
      personalLockRegister,
      reservePersonalLock,
      releasePersonalLock,
      lotoIdRegister,
      reserveLotoId,
      releaseLotoId,
      notifications,
      markNotificationsRead,
      shiftTransfers,
      transferShift,
      toasts,
      pushToast,
      language,
      setLanguage,
      aiOpen,
      setAiOpen,
      viewMode,
      toggleViewMode
    }),
    [
      currentUser, currentRole, currentDepartment, login, selectRole, logout,
      permits, tasks, lockRegister, personalLockRegister, lotoIdRegister, notifications, shiftTransfers, toasts, language, aiOpen,
      pushToast, updatePermit, addTimelineEvent, updateTask, reserveLock, releaseLock,
      reservePersonalLock, releasePersonalLock, reserveLotoId, releaseLotoId, markNotificationsRead, transferShift, viewMode, toggleViewMode
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
