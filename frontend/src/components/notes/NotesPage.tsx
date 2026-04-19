'use client';

import NoteEditor from './NoteEditor';
import { useNotesStore } from '../../store/notesStore';
import NoteList from './NoteList';
import React from 'react';
import NoteCreate from './NoteCreate';

export default function NotesPage() {
  const { notes, selectedId, fetchNotes, selectNote, loading, error } = useNotesStore();
  React.useEffect(() => { fetchNotes(); }, [fetchNotes]);
  const selectedNote = notes.find(n => n.id === selectedId) || null;

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      <div className="w-1/3 max-w-xs border-r pr-4 dark:border-gray-800 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <NoteCreate />

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 py-4">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading notes…
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400 mb-2">
            {error}
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500">
            <span className="text-3xl mb-2">📝</span>
            <p className="text-sm font-medium">No notes yet</p>
            <p className="text-xs mt-1">Click &quot;+ New Note&quot; to get started</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <NoteList onSelect={selectNote} selectedId={selectedId} notes={notes} />
        </div>
      </div>
      <div className="flex-1 pl-4">
        <NoteEditor note={selectedNote} />
      </div>
    </div>
  );
}
