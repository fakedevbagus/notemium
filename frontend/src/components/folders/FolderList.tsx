import React from 'react';


export interface FolderListFolder {
  id: number;
  name: string;
  parentId?: number;
  noteCount?: number;
}

export default function FolderList({ folders, onSelect, selectedId }: { folders: FolderListFolder[]; onSelect: (id: number) => void; selectedId: number | null }) {
  return (
    <div className="space-y-2">
      {folders.map(folder => (
        <div
          key={folder.id}
          className={`p-3 rounded cursor-pointer border transition-colors ${selectedId === folder.id ? 'bg-green-100 dark:bg-green-900 border-green-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent'}`}
          onClick={() => onSelect(folder.id)}
        >
          <div className="font-semibold">{folder.name}</div>
          {typeof folder.noteCount === 'number' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">{folder.noteCount} notes</div>
          )}
        </div>
      ))}
    </div>
  );
}
