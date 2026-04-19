import { request } from './http';

export type NotePayload = {
  title: string;
  content: string;
  folderId?: number;
  tags?: string[];
};

export type Note = {
  id: number;
  title: string;
  content: string;
  folderId?: number;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type NoteUpdatePayload = Partial<
  NotePayload & {
    isPinned: boolean;
    isArchived: boolean;
    isTrashed: boolean;
  }
>;

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function fetchNotes(): Promise<Note[]> {
  const result = await request<PaginatedResponse<Note> | Note[]>('/notes');
  // Handle both paginated (new) and plain array (legacy) responses
  if (Array.isArray(result)) return result;
  return result.data;
}

export async function fetchNote(id: number) {
  return request<Note>(`/notes/${id}`);
}

export async function createNote(data: NotePayload) {
  return request<Note>('/notes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateNote(id: number, data: NoteUpdatePayload) {
  return request<Note>(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteNote(id: number) {
  return request<Note>(`/notes/${id}`, {
    method: 'DELETE',
  });
}
