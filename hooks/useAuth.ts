'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, login: storeLogin, logout: storeLogout } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await authService.login({ email, password });
      storeLogin(data);
      router.replace('/dashboard');
    },
    [storeLogin, router]
  );

  const logout = useCallback(() => {
    void authService.logout();
    storeLogout();
    router.replace('/login');
  }, [storeLogout, router]);

  return { user, token, isAuthenticated, isLoading, login, logout };
}
