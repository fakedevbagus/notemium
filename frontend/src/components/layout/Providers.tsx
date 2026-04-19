'use client';

import React from 'react';
import { ToastProvider } from '../ui/Toast';

/** Client-side providers wrapper for the app. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
