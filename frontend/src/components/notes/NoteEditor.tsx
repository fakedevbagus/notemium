'use client';

import React from 'react';
import { useNotesStore } from '../../store/notesStore';
import type { Note } from '../../store/notesStore';

export default function NoteEditor({ note }: { note: Note | null }) {
  const { updateNote, deleteNote } = useNotesStore();
  const [title, setTitle] = React.useState(note?.title || '');
  const [content, setContent] = React.useState(note?.content || '');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
        <span className="text-4xl mb-3">✏️</span>
        <p className="text-sm font-medium">Select a note to view or edit</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col h-full"
      onSubmit={async e => {
        e.preventDefault();
        setSaving(true);
        try {
          await updateNote(note.id, { title, content });
        } finally {
          setSaving(false);
        }
      }}
    >
      <input
        className="mb-3 p-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title"
      />
      <textarea
        className="flex-1 p-3 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition leading-relaxed"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Start writing…"
      />
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
          onClick={async () => { if (window.confirm('Delete this note?')) await deleteNote(note.id); }}
        >
          Delete
        </button>
      </div>
    </form>
  );
}
