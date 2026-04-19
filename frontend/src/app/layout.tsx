import React from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import AppHeader from '../components/layout/AppHeader';
import Providers from '../components/layout/Providers';
import './globals.css';

export const metadata = {
  title: 'Notemium',
  description: 'Professional-grade, feature-rich note-taking application',
};

/** Inline script that runs before React hydration to prevent theme flash. */
const THEME_INIT_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('notemium.theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100" suppressHydrationWarning>
        <Providers>
          <div className="flex h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <AppHeader />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

