import api from '@/lib/api';
import type { LoginData } from '@/types/auth.types';
import type { ApiEnvelope } from '@/types/api.types';
import type { LoginFormData, RegisterFormData } from '@/features/auth/types';
import { getRefreshToken } from '@/lib/auth';

export const authService = {
  login: async (credentials: LoginFormData): Promise<LoginData> => {
    const { data } = await api.post<ApiEnvelope<LoginData>>('/auth/login', credentials);
    return data.data;
  },

  register: async (payload: RegisterFormData): Promise<LoginData> => {
    const { confirmPassword: _unused, ...body } = payload;
    void _unused;
    const { data } = await api.post<ApiEnvelope<LoginData>>('/auth/register', body);
    return data.data;
  },

  logout: async (): Promise<void> => {
    const refresh = getRefreshToken();
    await api
      .post('/auth/logout', { refresh: refresh ?? '' })
      .catch(() => {
        // Best-effort server logout; client state is cleared regardless
      });
  },
};
