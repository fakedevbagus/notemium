'use client';

import React from 'react';

type ShortcutMap = Record<string, (e: KeyboardEvent) => void>;

/**
 * Global keyboard shortcuts hook.
 * Keys are formatted as "ctrl+n", "ctrl+s", etc.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push('ctrl');
      if (e.shiftKey) parts.push('shift');
      if (e.altKey) parts.push('alt');
      parts.push(e.key.toLowerCase());
      const combo = parts.join('+');

      if (shortcuts[combo]) {
        e.preventDefault();
        shortcuts[combo](e);
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}
