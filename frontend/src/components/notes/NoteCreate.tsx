'use client';

import React, { useState } from 'react';
import { useNotesStore } from '../../store/notesStore';
import { useToast } from '../ui/Toast';

interface NoteCreateProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function NoteCreate({ open: externalOpen, onOpenChange }: NoteCreateProps) {
  const { createNote } = useNotesStore();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Support both controlled and uncontrolled open state
  const open = externalOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await createNote({ title, content });
      setTitle('');
      setContent('');
      setOpen(false);
      toast('Note created', 'success');
    } catch {
      toast('Failed to create note', 'error');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mb-3">
      {open ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full p-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            placeholder="Note title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            className="w-full p-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
            placeholder="Start writing…"
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
          onClick={() => setOpen(true)}
        >
          <span className="text-sm">+</span> New Note
        </button>
      )}
    </div>
  );
}
