'use client';

import React from 'react';

const navLinks = [
  { href: '/notes', label: 'Notes', icon: '📝' },
  { href: '/folders', label: 'Folders', icon: '📁' },
  { href: '/search', label: 'Search', icon: '🔍' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function AppSidebar({ pathname: injectedPathname }: { pathname?: string } = {}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const pathname = injectedPathname ?? (mounted ? window.location.pathname : '');

  return (
    <aside className="w-56 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      {/* Brand */}
      <a href="/" className="font-bold text-lg tracking-tight mb-6 px-2 text-gray-900 dark:text-gray-100 hover:opacity-80 transition-opacity">
        Notemium
      </a>

      <nav className="flex-1">
        <ul className="space-y-1">
          {navLinks.map(link => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={
                    `flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 ` +
                    (isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100')
                  }
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto px-2 text-[10px] text-gray-400 dark:text-gray-600">
        v0.1.0
      </div>
    </aside>
  );
}
