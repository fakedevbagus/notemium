import React, { useState } from 'react';
import { useFoldersStore } from '../../store/foldersStore';

export default function FolderCreate() {
  const { createFolder } = useFoldersStore();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createFolder({ name });
    setName('');
    setOpen(false);
  }

  return (
    <div className="mb-4">
      {open ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            placeholder="Folder name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Create</button>
            <button type="button" className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => setOpen(true)}>
          + New Folder
        </button>
      )}
    </div>
  );
}
