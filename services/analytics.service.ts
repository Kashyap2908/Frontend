import api from '@/lib/api';
import type { ApiEnvelope, PaginatedEnvelope, PaginationParams } from '@/types/api.types';
import type { DashboardSummary, SalesReport, StockReport } from '@/types/analytics.types';
import type { ActivityLog } from '@/types/activity.types';

export const analyticsService = {
  getDashboard: async (): Promise<DashboardSummary> => {
    const { data } = await api.get<ApiEnvelope<DashboardSummary>>('/dashboard/dashboard');
    return data.data;
  },

  getSalesReport: async (params?: {
    date_from?: string;
    date_to?: string;
    branch_id?: string;
  }): Promise<SalesReport> => {
    const { data } = await api.get<ApiEnvelope<SalesReport>>('/dashboard/sales', { params });
    return data.data;
  },

  getStockReport: async (params?: {
    branch_id?: string;
    threshold?: number;
  }): Promise<StockReport> => {
    const { data } = await api.get<ApiEnvelope<StockReport>>('/dashboard/stock', { params });
    return data.data;
  },

  getActivityLogs: async (
    params: PaginationParams = {}
  ): Promise<PaginatedEnvelope<ActivityLog>> => {
    const { data } = await api.get<PaginatedEnvelope<ActivityLog>>('/dashboard/activity', {
      params,
    });
    return data;
  },
};
