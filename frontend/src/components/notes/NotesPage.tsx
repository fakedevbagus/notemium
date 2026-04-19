'use client';

import NoteEditor from './NoteEditor';
import { useNotesStore } from '../../store/notesStore';
import NoteList from './NoteList';
import React from 'react';
import NoteCreate from './NoteCreate';
import { useKeyboardShortcuts } from '../../lib/useKeyboardShortcuts';

export default function NotesPage() {
  const { notes, selectedId, fetchNotes, selectNote, loading, error } = useNotesStore();
  const [createOpen, setCreateOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const selectedNote = notes.find(n => n.id === selectedId) || null;

  // Sort: pinned first, then by updatedAt
  const sortedNotes = React.useMemo(() => {
    let filtered = notes;
    if (filter) {
      const q = filter.toLowerCase();
      filtered = notes.filter(n =>
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }
    return [...filtered].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [notes, filter]);

  // Global keyboard shortcuts
  const shortcuts = React.useMemo(() => ({
    'ctrl+n': () => setCreateOpen(true),
    'ctrl+f': () => searchInputRef.current?.focus(),
  }), []);

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* Sidebar panel */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900/50">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold">Notes</h1>
            <span className="text-xs text-gray-400">{notes.length}</span>
          </div>
          <NoteCreate open={createOpen} onOpenChange={setCreateOpen} />
        </div>

        {/* Quick filter */}
        <div className="px-4 pb-2">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Filter notes… (Ctrl+F)"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 px-4 py-4">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs">Loading…</span>
          </div>
        )}

        {error && (
          <div className="mx-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2.5 text-xs text-red-600 dark:text-red-400 mb-2">
            {error}
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500 px-4">
            <span className="text-3xl mb-2">📝</span>
            <p className="text-xs font-medium">No notes yet</p>
            <p className="text-[10px] mt-1">Press Ctrl+N to create one</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <NoteList onSelect={selectNote} selectedId={selectedId} notes={sortedNotes} />
        </div>
      </div>

      {/* Editor panel */}
      <div className="flex-1 p-5">
        <NoteEditor note={selectedNote} />
      </div>
    </div>
  );
}
