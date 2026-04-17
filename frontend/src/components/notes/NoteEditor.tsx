import React from 'react';
import { useNotesStore } from '../../store/notesStore';
import type { Note } from '../../store/notesStore';

export default function NoteEditor({ note }: { note: Note | null }) {
  const { updateNote, deleteNote } = useNotesStore();
  const [title, setTitle] = React.useState(note?.title || '');
  const [content, setContent] = React.useState(note?.content || '');
  React.useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
        Select a note to view or edit
      </div>
    );
  }

  return (
    <form
      className="flex flex-col h-full"
      onSubmit={async e => {
        e.preventDefault();
        await updateNote(note.id, { title, content });
      }}
    >
      <input
        className="mb-2 p-2 rounded border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-lg font-semibold"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="flex-1 p-2 rounded border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 resize-none"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
        <button
          type="button"
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={async () => { if (window.confirm('Delete this note?')) await deleteNote(note.id); }}
        >
          Delete
        </button>
      </div>
    </form>
  );
}
