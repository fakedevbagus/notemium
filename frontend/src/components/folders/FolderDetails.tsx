'use client';

import React from 'react';
import { useFoldersStore, Folder } from '../../store/foldersStore';
import { useToast } from '../ui/Toast';

export default function FolderDetails({ folder }: { folder: Folder | null }) {
  const { updateFolder, deleteFolder } = useFoldersStore();
  const { toast } = useToast();
  const [name, setName] = React.useState(folder?.name || '');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setName(folder?.name || '');
  }, [folder?.id]);

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
        <span className="text-4xl mb-3">📁</span>
        <p className="text-sm font-medium">Select a folder to view details</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <input
        className="mb-3 p-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-lg font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Folder name"
      />

      <div className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>Folder ID: {folder.id}</p>
          {folder.createdAt && (
            <p>Created: {new Date(folder.createdAt).toLocaleDateString()}</p>
          )}
          {folder.updatedAt && (
            <p>Updated: {new Date(folder.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              await updateFolder(folder.id, { name });
              toast('Folder saved', 'success');
            } catch {
              toast('Failed to save folder', 'error');
            } finally {
              setSaving(false);
            }
          }}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          className="px-5 py-2 rounded-lg bg-red-600/10 text-red-600 text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
          onClick={async () => {
            if (!window.confirm('Delete this folder?')) return;
            try {
              await deleteFolder(folder.id);
              toast('Folder deleted', 'success');
            } catch {
              toast('Failed to delete folder', 'error');
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
