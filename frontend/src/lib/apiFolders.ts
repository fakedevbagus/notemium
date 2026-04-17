import { request } from './http';

export type FolderPayload = {
  id: number;
  name: string;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
};

type CreateFolderPayload = {
  name: string;
  parentId?: number;
};

export async function fetchFolders() {
  return request<FolderPayload[]>('/folders');
}

export async function fetchFolder(id: number) {
  return request<FolderPayload>(`/folders/${id}`);
}

export async function createFolder(data: CreateFolderPayload) {
  return request<FolderPayload>('/folders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateFolder(
  id: number,
  data: Partial<CreateFolderPayload>,
) {
  return request<FolderPayload>(`/folders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteFolder(id: number) {
  return request<FolderPayload>(`/folders/${id}`, {
    method: 'DELETE',
  });
}
