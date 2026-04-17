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
      <div className="w-1/3 max-w-xs border-r pr-4 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <NoteCreate />
        {loading && <div className="text-gray-400">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <NoteList onSelect={selectNote} selectedId={selectedId} notes={notes} />
      </div>
      <div className="flex-1 pl-4">
        <NoteEditor note={selectedNote} />
      </div>
    </div>
  );
}
