'use client';

import React from 'react';

const features = [
  { icon: '📝', title: 'Notes', desc: 'Create and organize your thoughts', href: '/notes', color: 'blue' },
  { icon: '📁', title: 'Folders', desc: 'Organize notes into folders', href: '/folders', color: 'emerald' },
  { icon: '🔍', title: 'Search', desc: 'Find anything instantly', href: '/search', color: 'purple' },
  { icon: '⚙️', title: 'Settings', desc: 'Customize your experience', href: '/settings', color: 'gray' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/30',
  emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-emerald-900/30',
  purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-200 dark:shadow-purple-900/30',
  gray: 'bg-gray-600 hover:bg-gray-700 shadow-gray-200 dark:shadow-gray-900/30',
};

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Welcome to <span className="text-blue-600">Notemium</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          A professional note-taking app with markdown support, auto-save, and powerful organization tools.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
        {features.map(f => (
          <a
            key={f.href}
            href={f.href}
            className={`${colorMap[f.color]} text-white rounded-xl p-5 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl group`}
          >
            <span className="text-2xl mb-2 block">{f.icon}</span>
            <div className="font-semibold text-sm">{f.title}</div>
            <div className="text-[11px] opacity-80 mt-0.5">{f.desc}</div>
          </a>
        ))}
      </div>

      <div className="mt-8 text-center space-y-1">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          Keyboard shortcuts: <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px]">Ctrl+N</kbd> new note
          · <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px]">Ctrl+S</kbd> save
          · <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px]">Ctrl+F</kbd> search
        </p>
      </div>
    </main>
  );
}
