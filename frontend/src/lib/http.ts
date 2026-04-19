import { getAccessToken } from './auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

export async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    // Try to extract error message from response body
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // Response body is not JSON — use default message
    }
    throw new Error(message);
  }

  // Handle empty responses (e.g. 204 No Content from DELETE)
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
