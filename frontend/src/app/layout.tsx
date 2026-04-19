import React from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import AppHeader from '../components/layout/AppHeader';
import './globals.css';

export const metadata = {
  title: 'Notemium',
  description: 'Professional-grade, feature-rich note-taking application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100" suppressHydrationWarning>
        <div className="flex h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
