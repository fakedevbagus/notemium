'use client';

import React from 'react';

type Theme = 'light' | 'dark';

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>('light');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const preferredTheme = getPreferredTheme();

    setTheme(preferredTheme);
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) {
      return;
    }

    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [isMounted, theme]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {!isMounted ? '…' : theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
