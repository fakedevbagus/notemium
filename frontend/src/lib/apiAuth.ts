import { AuthResponse, AuthUser } from './auth';
import { request } from './http';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = AuthCredentials & {
  name?: string;
};

export function register(data: RegisterPayload) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function login(data: AuthCredentials) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function fetchMe() {
  return request<AuthUser | { user: null }>('/auth/me');
}
