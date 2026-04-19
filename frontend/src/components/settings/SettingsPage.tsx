'use client';

import React from 'react';
import { clearAccessToken, setAccessToken, type AuthUser } from '../../lib/auth';
import { fetchMe, login, register } from '../../lib/apiAuth';

type AuthMode = 'login' | 'register';
type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'notemium.theme';

function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  return 'system';
}

function resolveTheme(pref: Theme): 'light' | 'dark' {
  if (pref === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

export default function SettingsPage() {
  const [mode, setMode] = React.useState<AuthMode>('login');
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState<string | null>(null);
  const [theme, setThemeState] = React.useState<Theme>('system');

  React.useEffect(() => {
    setThemeState(getSavedTheme());

    void fetchMe()
      .then((data) => {
        if ('user' in data) {
          setUser(data.user);
          return;
        }
        setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    window.localStorage.setItem(THEME_KEY, t);
    document.documentElement.classList.toggle('dark', resolveTheme(t) === 'dark');
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);

    try {
      const response =
        mode === 'register'
          ? await register({ email, password, name: name || undefined })
          : await login({ email, password });

      setAccessToken(response.accessToken);
      setUser(response.user);
      setPassword('');
      setStatus('Signed in');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Authentication failed');
    }
  }

  function handleSignOut() {
    clearAccessToken();
    setUser(null);
    setStatus('Signed out');
  }

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      {/* Theme section */}
      <div className="mb-6 space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-6 shadow-sm dark:bg-gray-900">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</label>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                id={`theme-${opt.value}`}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  theme === opt.value
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 dark:ring-blue-800'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setTheme(opt.value)}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Account section */}
      <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-6 shadow-sm dark:bg-gray-900">
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Account</label>
        {user ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Signed in as <span className="font-medium">{user.name || user.email}</span>
            </p>
            <button
              type="button"
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </div>
            {mode === 'register' && (
              <input
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            )}
            <input
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Password"
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
            >
              {mode === 'register' ? 'Create account' : 'Sign in'}
            </button>
          </form>
        )}
        {status && (
          <p className={`mt-2 text-sm ${status.includes('fail') || status.includes('error') ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
            {status}
          </p>
        )}
      </div>

      {/* About section */}
      <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
        Notemium v0.1.0
      </div>
    </div>
  );
}
