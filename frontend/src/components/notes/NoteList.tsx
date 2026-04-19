import React from 'react';

export interface NoteListNote {
  id: number;
  title: string;
  content?: string;
  snippet?: string;
  isPinned?: boolean;
  updatedAt?: string;
}

export default function NoteList({ notes, onSelect, selectedId }: { notes: NoteListNote[]; onSelect: (id: number) => void; selectedId: number | null }) {
  return (
    <div className="space-y-0.5">
      {notes.map(note => (
        <div
          key={note.id}
          role="button"
          tabIndex={0}
          className={`p-2.5 rounded-lg cursor-pointer border transition-all duration-150 group
            ${selectedId === note.id
              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent'
            }`}
          onClick={() => onSelect(note.id)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSelect(note.id); }}
        >
          <div className="flex items-center gap-1.5">
            {note.isPinned && <span className="text-[10px]" title="Pinned">📌</span>}
            <span className="font-medium text-sm truncate">{note.title || 'Untitled'}</span>
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-snug">
            {note.snippet || note.content?.slice(0, 80) || 'No content'}
          </div>
          {note.updatedAt && (
            <div className="text-[9px] text-gray-400 dark:text-gray-600 mt-1">
              {new Date(note.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
