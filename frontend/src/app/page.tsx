import React from 'react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Notepad Pro</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">Professional-grade, feature-rich notepad app.</p>
      <div className="flex gap-4">
        <a href="/notes" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Notes</a>
        <a href="/folders" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Folders</a>
        <a href="/search" className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">Search</a>
        <a href="/settings" className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700">Settings</a>
      </div>
    </main>
  );
}
