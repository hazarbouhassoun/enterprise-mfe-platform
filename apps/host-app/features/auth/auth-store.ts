import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockLoginScopes } from './scopes';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  scopes: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const MOCK_TOKEN = 'mock.jwt.token';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      scopes: [],
      async login(email, _password) {
        await new Promise((r) => setTimeout(r, 250));
        set({
          token: MOCK_TOKEN,
          user: {
            id: 'usr_01',
            email,
            name: email.split('@')[0] ?? 'User',
          },
          scopes: mockLoginScopes(email),
        });
      },
      logout() {
        set({ token: null, user: null, scopes: [] });
      },
    }),
    // bumped once when scopes were added — old localStorage keys can be deleted manually
    { name: 'host-auth-demo-v2' }
  )
);

export function getIsAuthenticatedSnapshot() {
  const s = useAuthStore.getState();
  return Boolean(s.token && s.user);
}
