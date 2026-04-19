import React from 'react';

export interface NoteListNote {
  id: number;
  title: string;
  content?: string;
  snippet?: string;
}

export default function NoteList({ notes, onSelect, selectedId }: { notes: NoteListNote[]; onSelect: (id: number) => void; selectedId: number | null }) {
  return (
    <div className="space-y-1.5">
      {notes.map(note => (
        <div
          key={note.id}
          role="button"
          tabIndex={0}
          className={`p-3 rounded-lg cursor-pointer border transition-all duration-150
            ${selectedId === note.id
              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 shadow-sm'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          onClick={() => onSelect(note.id)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSelect(note.id); }}
        >
          <div className="font-semibold text-sm">{note.title || 'Untitled'}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {note.snippet || note.content?.slice(0, 80) || 'No content'}
          </div>
        </div>
      ))}
    </div>
  );
}
