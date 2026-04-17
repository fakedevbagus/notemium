import React from 'react';

const navLinks = [
  { href: '/notes', label: 'Notes' },
  { href: '/folders', label: 'Folders' },
  { href: '/search', label: 'Search' },
  { href: '/settings', label: 'Settings' },
];

export default function AppSidebar({ pathname: injectedPathname }: { pathname?: string } = {}) {
  const pathname = injectedPathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
  return (
    <aside className="w-64 h-full bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      <nav>
        <ul className="space-y-2">
          {navLinks.map(link => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={
                    `block py-2 px-3 rounded transition-colors ` +
                    (isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-700'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-800')
                  }
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
