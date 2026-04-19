'use client';

import React, { useState } from 'react';
import { useFoldersStore } from '../../store/foldersStore';
import { useToast } from '../ui/Toast';

export default function FolderCreate() {
  const { createFolder } = useFoldersStore();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await createFolder({ name });
      setName('');
      setOpen(false);
      toast('Folder created', 'success');
    } catch {
      toast('Failed to create folder', 'error');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mb-3">
      {open ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full p-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            placeholder="Folder name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
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
          className="w-full px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
          onClick={() => setOpen(true)}
        >
          <span className="text-sm">+</span> New Folder
        </button>
      )}
    </div>
  );
}
