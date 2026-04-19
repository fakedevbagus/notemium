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
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* Sidebar panel */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900/50">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold">Folders</h1>
            <span className="text-xs text-gray-400">{folders.length}</span>
          </div>
          <FolderCreate />
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

        {!loading && !error && folders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500 px-4">
            <span className="text-3xl mb-2">📁</span>
            <p className="text-xs font-medium">No folders yet</p>
            <p className="text-[10px] mt-1">Create a folder to organize your notes</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <FolderList
            onSelect={selectFolder}
            selectedId={selectedId}
            folders={folders}
          />
        </div>
      </div>

      {/* Details panel */}
      <div className="flex-1 p-5">
        <FolderDetails folder={selectedFolder} />
      </div>
    </div>
  );
}
