'use client';

import React from 'react';
import { clearAccessToken, setAccessToken, type AuthUser } from '../../lib/auth';
import { fetchMe, login, register } from '../../lib/apiAuth';

type AuthMode = 'login' | 'register';

export default function SettingsPage() {
  const [mode, setMode] = React.useState<AuthMode>('login');
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);

    const response =
      mode === 'register'
        ? await register({ email, password, name: name || undefined })
        : await login({ email, password });

    setAccessToken(response.accessToken);
    setUser(response.user);
    setPassword('');
    setStatus('Signed in');
  }

  function handleSignOut() {
    clearAccessToken();
    setUser(null);
    setStatus('Signed out');
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <div className="space-y-4 rounded-lg border bg-white p-6 shadow dark:bg-gray-900">
        <div>
          <label className="mb-1 block font-medium">Theme</label>
          <div className="flex gap-2">
            <button className="rounded bg-gray-200 px-3 py-1 dark:bg-gray-800">
              Light
            </button>
            <button className="rounded bg-gray-800 px-3 py-1 text-white dark:bg-gray-200 dark:text-black">
              Dark
            </button>
            <button className="rounded bg-blue-600 px-3 py-1 text-white">
              System
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block font-medium">Account</label>
          {user ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Signed in as {user.name || user.email}
              </p>
              <button
                type="button"
                className="rounded bg-gray-800 px-4 py-2 text-white dark:bg-gray-200 dark:text-black"
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
                  className={`rounded px-3 py-1 ${
                    mode === 'login'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                  onClick={() => setMode('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`rounded px-3 py-1 ${
                    mode === 'register'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-800'
                  }`}
                  onClick={() => setMode('register')}
                >
                  Register
                </button>
              </div>
              {mode === 'register' && (
                <input
                  className="w-full rounded border border-gray-300 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              )}
              <input
                className="w-full rounded border border-gray-300 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <input
                className="w-full rounded border border-gray-300 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Password"
                type="password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {mode === 'register' ? 'Create account' : 'Sign in'}
              </button>
            </form>
          )}
          {status && <p className="mt-2 text-sm text-gray-500">{status}</p>}
        </div>
      </div>
    </div>
  );
}
