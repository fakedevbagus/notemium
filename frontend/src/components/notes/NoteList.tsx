import React from 'react';

export interface NoteListNote {
  id: number;
  title: string;
  content?: string;
  snippet?: string;
}

export default function NoteList({ notes, onSelect, selectedId }: { notes: NoteListNote[]; onSelect: (id: number) => void; selectedId: number | null }) {
  return (
    <div className="space-y-2">
      {notes.map(note => (
        <div
          key={note.id}
          className={`p-3 rounded cursor-pointer border transition-colors ${selectedId === note.id ? 'bg-blue-100 dark:bg-blue-900 border-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent'}`}
          onClick={() => onSelect(note.id)}
        >
          <div className="font-semibold">{note.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{note.snippet || note.content?.slice(0, 60)}</div>
        </div>
      ))}
    </div>
  );
}
