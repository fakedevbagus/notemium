import { create } from 'zustand';
import {
  createNote as createNoteRequest,
  deleteNote as deleteNoteRequest,
  fetchNotes as fetchNotesRequest,
  type Note,
  type NotePayload,
  updateNote as updateNoteRequest,
} from '../lib/api';

interface NotesState {
  notes: Note[];
  selectedId: number | null;
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  selectNote: (id: number | null) => void;
  createNote: (data: NotePayload) => Promise<void>;
  updateNote: (id: number, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  pinNote: (id: number, pinned: boolean) => Promise<void>;
}

const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  selectedId: null,
  loading: false,
  error: null,
  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const notes = await fetchNotesRequest();
      set({ notes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notes',
        loading: false,
      });
    }
  },
  selectNote: (id) => set({ selectedId: id }),
  createNote: async (data) => {
    set({ error: null });
    try {
      const created = await createNoteRequest(data);
      const notes = await fetchNotesRequest();
      set({ notes, selectedId: created.id });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create note',
      });
    }
  },
  updateNote: async (id, data) => {
    set({ error: null });
    try {
      await updateNoteRequest(id, data);
      const notes = await fetchNotesRequest();
      set({ notes });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update note',
      });
    }
  },
  deleteNote: async (id) => {
    set({ error: null });
    try {
      await deleteNoteRequest(id);
      const notes = await fetchNotesRequest();
      // Clear selection if deleted note was selected
      const currentSelected = get().selectedId;
      set({
        notes,
        selectedId: currentSelected === id ? null : currentSelected,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete note',
      });
    }
  },
  pinNote: async (id, pinned) => {
    set({ error: null });
    try {
      await updateNoteRequest(id, { isPinned: pinned } as Partial<Note>);
      const notes = await fetchNotesRequest();
      set({ notes });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to pin note',
      });
    }
  },
}));

export { useNotesStore };
export type { Note };
