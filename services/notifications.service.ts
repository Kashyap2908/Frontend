import api from '@/lib/api';
import type { PaginatedEnvelope, PaginationParams } from '@/types/api.types';
import type { Notification } from '@/types/notifications.types';

export const notificationsService = {
  list: async (params: PaginationParams = {}): Promise<PaginatedEnvelope<Notification>> => {
    const { data } = await api.get<PaginatedEnvelope<Notification>>('/notifications', { params });
    return data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
