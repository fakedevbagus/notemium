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
}

const useNotesStore = create<NotesState>((set) => ({
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
    set({ loading: true, error: null });

    try {
      await createNoteRequest(data);
      const notes = await fetchNotesRequest();
      set({ notes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create note',
        loading: false,
      });
    }
  },
  updateNote: async (id, data) => {
    set({ loading: true, error: null });

    try {
      await updateNoteRequest(id, data);
      const notes = await fetchNotesRequest();
      set({ notes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update note',
        loading: false,
      });
    }
  },
  deleteNote: async (id) => {
    set({ loading: true, error: null });

    try {
      await deleteNoteRequest(id);
      const notes = await fetchNotesRequest();
      set({ notes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete note',
        loading: false,
      });
    }
  },
}));

export { useNotesStore };
export type { Note };
