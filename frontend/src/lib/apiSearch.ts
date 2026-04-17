import { request } from './http';

export type SearchResult = {
  id: number;
  type: 'note' | 'folder';
  title: string;
  snippet: string;
};

export async function searchAll(query: string) {
  const searchParams = new URLSearchParams({ q: query });

  return request<SearchResult[]>(`/search?${searchParams.toString()}`);
}
