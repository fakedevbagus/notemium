import React from 'react';

export interface FolderListFolder {
  id: number;
  name: string;
  parentId?: number;
  noteCount?: number;
}

export default function FolderList({ folders, onSelect, selectedId }: { folders: FolderListFolder[]; onSelect: (id: number) => void; selectedId: number | null }) {
  return (
    <div className="space-y-0.5">
      {folders.map(folder => (
        <div
          key={folder.id}
          role="button"
          tabIndex={0}
          className={`p-2.5 rounded-lg cursor-pointer border transition-all duration-150
            ${selectedId === folder.id
              ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent'
            }`}
          onClick={() => onSelect(folder.id)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSelect(folder.id); }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📁</span>
            <span className="font-medium text-sm truncate">{folder.name}</span>
          </div>
          {typeof folder.noteCount === 'number' && (
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 ml-6">
              {folder.noteCount} note{folder.noteCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
