'use client';

import React from 'react';
import { useNotesStore } from '../../store/notesStore';
import type { Note } from '../../store/notesStore';
import { useToast } from '../ui/Toast';
import { useKeyboardShortcuts } from '../../lib/useKeyboardShortcuts';

/** Minimal markdown-to-HTML renderer — supports headers, bold, italic, code, lists, links. */
function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener">$1</a>')
    // Unordered lists
    .replace(/^[-*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic text-gray-500">$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-4 border-gray-200 dark:border-gray-700">')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="mb-2">')
    // Line breaks
    .replace(/\n/g, '<br>');
  return `<p class="mb-2">${html}</p>`;
}

export default function NoteEditor({ note }: { note: Note | null }) {
  const { updateNote, deleteNote, pinNote } = useNotesStore();
  const { toast } = useToast();
  const [title, setTitle] = React.useState(note?.title || '');
  const [content, setContent] = React.useState(note?.content || '');
  const [saving, setSaving] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const autoSaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  // Sync state when note changes
  React.useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setLastSaved(null);
  }, [note?.id]);

  // Auto-save with debounce (2s after last keystroke)
  React.useEffect(() => {
    if (!note) return;
    if (title === note.title && content === note.content) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await updateNote(note.id, { title, content });
        setLastSaved(new Date());
      } catch {
        // Silent fail for auto-save; manual save will show errors
      }
    }, 2000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [title, content, note, updateNote]);

  // Keyboard shortcuts
  const shortcuts = React.useMemo(() => ({
    'ctrl+s': () => {
      if (!note) return;
      handleSave();
    },
    'ctrl+p': () => {
      setShowPreview(prev => !prev);
    },
  }), [note, title, content]);

  useKeyboardShortcuts(shortcuts);

  async function handleSave() {
    if (!note) return;
    setSaving(true);
    try {
      await updateNote(note.id, { title, content });
      setLastSaved(new Date());
      toast('Note saved', 'success');
    } catch {
      toast('Failed to save note', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!note) return;
    if (!window.confirm('Delete this note permanently?')) return;
    try {
      await deleteNote(note.id);
      toast('Note deleted', 'success');
    } catch {
      toast('Failed to delete note', 'error');
    }
  }

  async function handlePin() {
    if (!note) return;
    try {
      await pinNote(note.id, !note.isPinned);
      toast(note.isPinned ? 'Note unpinned' : 'Note pinned', 'info');
    } catch {
      toast('Failed to pin note', 'error');
    }
  }

  function handleExportMd() {
    if (!note) return;
    const blob = new Blob([`# ${title}\n\n${content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'note'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Exported as Markdown', 'success');
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
        <span className="text-4xl mb-3">✏️</span>
        <p className="text-sm font-medium">Select a note to view or edit</p>
        <p className="text-xs mt-1 text-gray-300 dark:text-gray-600">
          Ctrl+N to create a new note
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePin}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
            className={`p-1.5 rounded-md text-sm transition-colors ${
              note.isPinned
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            📌
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(p => !p)}
            title="Toggle preview (Ctrl+P)"
            className={`p-1.5 rounded-md text-sm transition-colors ${
              showPreview
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            👁
          </button>
          <button
            type="button"
            onClick={handleExportMd}
            title="Export as Markdown"
            className="p-1.5 rounded-md text-sm text-gray-400 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            📥
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {lastSaved && (
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
          )}
          {saving && <span>Saving…</span>}
        </div>
      </div>

      {/* Title */}
      <input
        className="mb-3 p-2.5 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title"
      />

      {/* Content area: Edit / Preview / Split */}
      <div className="flex-1 flex gap-3 min-h-0">
        {!showPreview && (
          <textarea
            ref={contentRef}
            className="flex-1 p-3 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition leading-relaxed font-mono text-sm"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing… (supports **markdown**)"
          />
        )}
        {showPreview && (
          <div
            className="flex-1 p-3 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-y-auto prose dark:prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          className="px-5 py-2 rounded-lg bg-red-600/10 text-red-600 text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
          onClick={handleDelete}
        >
          Delete
        </button>
        <div className="ml-auto text-[10px] text-gray-400 self-center">
          Ctrl+S save · Ctrl+P preview
        </div>
      </div>
    </div>
  );
}
