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

export async function fetchNotes() {
  return request<Note[]>('/notes');
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
