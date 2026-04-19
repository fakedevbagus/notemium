'use client';

import React from 'react';

type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'notemium.theme';

/** Resolve the effective theme (light or dark) given a preference. */
function resolveTheme(pref: Theme): 'light' | 'dark' {
  if (pref === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

/** Read persisted preference from localStorage. */
function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  return 'system';
}

/** Apply the resolved theme to the document root element. */
function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export default function ThemeToggle() {
  const [pref, setPref] = React.useState<Theme>('system');
  const [mounted, setMounted] = React.useState(false);

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    const saved = getSavedTheme();
    setPref(saved);
    applyTheme(resolveTheme(saved));
    setMounted(true);
  }, []);

  // Apply theme whenever preference changes (after mount)
  React.useEffect(() => {
    if (!mounted) return;
    const resolved = resolveTheme(pref);
    applyTheme(resolved);
    window.localStorage.setItem(THEME_KEY, pref);
  }, [pref, mounted]);

  // Listen for system theme changes when preference is "system"
  React.useEffect(() => {
    if (!mounted || pref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme(resolveTheme('system'));
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [pref, mounted]);

  function cycle() {
    const order: Theme[] = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(pref) + 1) % order.length];
    setPref(next);
  }

  const icon = !mounted
    ? '…'
    : pref === 'dark'
      ? '🌙'
      : pref === 'light'
        ? '☀️'
        : '💻';

  const label = !mounted ? 'Theme' : pref === 'dark' ? 'Dark' : pref === 'light' ? 'Light' : 'System';

  return (
    <button
      type="button"
      id="theme-toggle"
      aria-label={`Toggle theme – currently ${label}`}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium
                 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition-colors duration-200"
      onClick={cycle}
    >
      <span className="text-base">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
