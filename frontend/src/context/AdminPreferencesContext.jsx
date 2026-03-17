import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AdminPreferencesContext = createContext(null);

export const DEFAULT_ADMIN_PREFERENCES = {
  theme: 'system',
  language: 'es',
  dateFormat: 'DMY',
  timeFormat: '24h',
  panelNotifications: {
    newOrders: true,
    newMessages: true,
    weeklySummary: true
  }
};

function getUserKey(user) {
  return (user?._id || user?.id || '').toString();
}

function storageKey(userKey) {
  return `ituka_admin_prefs:${userKey}`;
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function mergePrefs(base, patch) {
  const out = { ...base, ...(patch || {}) };
  out.panelNotifications = { ...base.panelNotifications, ...(patch?.panelNotifications || {}) };
  return out;
}

export function AdminPreferencesProvider({ user, children }) {
  const userKey = getUserKey(user);
  const [prefs, setPrefs] = useState(DEFAULT_ADMIN_PREFERENCES);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!userKey) return;
    const raw = localStorage.getItem(storageKey(userKey));
    if (!raw) {
      setPrefs(DEFAULT_ADMIN_PREFERENCES);
      setInitialized(false);
      return;
    }
    const parsed = safeParse(raw);
    const loaded = parsed?.prefs || parsed;
    setPrefs(mergePrefs(DEFAULT_ADMIN_PREFERENCES, loaded));
    setInitialized(true);
  }, [userKey]);

  useEffect(() => {
    if (!userKey) return;
    setLoading(true);
    load();
    setLoading(false);
  }, [userKey, load]);

  useEffect(() => {
    if (!userKey) return;
    const onStorage = (e) => {
      if (e.key === storageKey(userKey)) load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [userKey, load]);

  const savePrefs = useCallback(
    (nextPrefs) => {
      if (!userKey) return;
      const normalized = mergePrefs(DEFAULT_ADMIN_PREFERENCES, nextPrefs);
      localStorage.setItem(storageKey(userKey), JSON.stringify({ prefs: normalized }));
      setPrefs(normalized);
      setInitialized(true);
      window.dispatchEvent(new CustomEvent('ituka:adminPrefsChanged', { detail: { userKey } }));
    },
    [userKey]
  );

  const value = useMemo(() => ({ prefs, initialized, loading, savePrefs, setPrefs }), [prefs, initialized, loading, savePrefs]);

  return <AdminPreferencesContext.Provider value={value}>{children}</AdminPreferencesContext.Provider>;
}

export function useAdminPreferences() {
  const ctx = useContext(AdminPreferencesContext);
  if (!ctx) {
    throw new Error('useAdminPreferences debe ser usado dentro de un AdminPreferencesProvider');
  }
  return ctx;
}
