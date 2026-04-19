'use client';

import React from 'react';
import { useFoldersStore } from '../../store/foldersStore';
import FolderCreate from './FolderCreate';
import FolderDetails from './FolderDetails';
import FolderList from './FolderList';

export default function FoldersPage() {
  const { folders, selectedId, fetchFolders, selectFolder, loading, error } =
    useFoldersStore();

  React.useEffect(() => {
    void fetchFolders();
  }, [fetchFolders]);

  const selectedFolder = folders.find((folder) => folder.id === selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      <div className="w-1/3 max-w-xs border-r pr-4 dark:border-gray-800 flex flex-col">
        <h1 className="mb-4 text-2xl font-bold">Folders</h1>
        <FolderCreate />

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 py-4">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading folders…
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400 mb-2">
            {error}
          </div>
        )}

        {!loading && !error && folders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500">
            <span className="text-3xl mb-2">📁</span>
            <p className="text-sm font-medium">No folders yet</p>
            <p className="text-xs mt-1">Click &quot;+ New Folder&quot; to organize your notes</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <FolderList
            onSelect={selectFolder}
            selectedId={selectedId}
            folders={folders}
          />
        </div>
      </div>
      <div className="flex-1 pl-4">
        <FolderDetails folder={selectedFolder} />
      </div>
    </div>
  );
}
