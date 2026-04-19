import React from 'react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-4xl font-bold mb-2 tracking-tight">Welcome to Notemium</h1>
      <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
        Your professional note-taking companion.
      </p>
      <div className="flex gap-3">
        <a href="/notes" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
          Notes
        </a>
        <a href="/folders" className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors">
          Folders
        </a>
        <a href="/search" className="px-5 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors">
          Search
        </a>
        <a href="/settings" className="px-5 py-2.5 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition-colors">
          Settings
        </a>
      </div>
    </main>
  );
}
