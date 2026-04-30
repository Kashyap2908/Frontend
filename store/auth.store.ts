import { create } from 'zustand';
import type { User, LoginData } from '@/types/auth.types';
import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  decodeToken,
  isTokenExpired,
} from '@/lib/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (data: LoginData) => {
    setToken(data.access);
    setRefreshToken(data.refresh);
    set({
      user: data.user,
      token: data.access,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    removeToken();
    removeRefreshToken();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  initialize: () => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      if (token) removeToken();
      removeRefreshToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      removeToken();
      removeRefreshToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    // Rebuild User from the JWT claims (user_id → id)
    const user: User = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      branch_id: decoded.branch_id,
    };
    set({ user, token, isAuthenticated: true, isLoading: false });
  },
}));
