const TOKEN_KEY = 'notepad.accessToken';

export type AuthUser = {
  id: number;
  email: string;
  name?: string;
  avatarUrl?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export function getAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
