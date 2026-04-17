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
      <div className="w-1/3 max-w-xs border-r pr-4 dark:border-gray-800">
        <h1 className="mb-4 text-2xl font-bold">Folders</h1>
        <FolderCreate />
        {loading && <div className="text-gray-400">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <FolderList
          onSelect={selectFolder}
          selectedId={selectedId}
          folders={folders}
        />
      </div>
      <div className="flex-1 pl-4">
        <FolderDetails folder={selectedFolder} />
      </div>
    </div>
  );
}
