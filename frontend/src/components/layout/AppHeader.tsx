import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';

export default function AppHeader() {
  return (
    <header className="w-full h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="font-bold text-lg">Notepad Pro</div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* User avatar, notifications, etc. can go here */}
      </div>
    </header>
  );
}
