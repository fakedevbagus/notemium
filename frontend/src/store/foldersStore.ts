import { create } from 'zustand';
import {
  createFolder as createFolderRequest,
  deleteFolder as deleteFolderRequest,
  fetchFolders as fetchFoldersRequest,
  updateFolder as updateFolderRequest,
} from '../lib/apiFolders';

export interface Folder {
  id: number;
  name: string;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface FoldersState {
  folders: Folder[];
  selectedId: number | null;
  loading: boolean;
  error: string | null;
  fetchFolders: () => Promise<void>;
  selectFolder: (id: number | null) => void;
  createFolder: (data: Omit<Folder, 'id'>) => Promise<void>;
  updateFolder: (id: number, data: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: number) => Promise<void>;
}

export const useFoldersStore = create<FoldersState>((set, get) => ({
  folders: [],
  selectedId: null,
  loading: false,
  error: null,
  fetchFolders: async () => {
    set({ loading: true, error: null });
    try {
      const folders = await fetchFoldersRequest();
      set({ folders, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch folders',
        loading: false,
      });
    }
  },
  selectFolder: (id) => set({ selectedId: id }),
  createFolder: async (data) => {
    set({ error: null });
    try {
      await createFolderRequest(data);
      const folders = await fetchFoldersRequest();
      set({ folders });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create folder',
      });
    }
  },
  updateFolder: async (id, data) => {
    set({ error: null });
    try {
      await updateFolderRequest(id, data);
      const folders = await fetchFoldersRequest();
      set({ folders });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update folder',
      });
    }
  },
  deleteFolder: async (id) => {
    set({ error: null });
    try {
      await deleteFolderRequest(id);
      const folders = await fetchFoldersRequest();
      const currentSelected = get().selectedId;
      set({
        folders,
        selectedId: currentSelected === id ? null : currentSelected,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete folder',
      });
    }
  },
}));
