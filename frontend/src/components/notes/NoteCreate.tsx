'use client';

import React, { useState } from 'react';
import { useNotesStore } from '../../store/notesStore';

export default function NoteCreate() {
  const { createNote } = useNotesStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await createNote({ title, content });
      setTitle('');
      setContent('');
      setOpen(false);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mb-4">
      {open ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full p-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            className="w-full p-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
            placeholder="Content"
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={() => setOpen(true)}
        >
          + New Note
        </button>
      )}
    </div>
  );
}
