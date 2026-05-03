import api from '@/lib/api';
import type { ApiEnvelope, PaginatedEnvelope, PaginationParams } from '@/types/api.types';
import type {
  Product,
  StockSummary,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types/products.types';

export const productsService = {
  list: async (params: PaginationParams = {}): Promise<PaginatedEnvelope<Product>> => {
    const { data } = await api.get<PaginatedEnvelope<Product>>('/products', { params });
    return data;
  },

  get: async (productId: string): Promise<Product> => {
    const { data } = await api.get<ApiEnvelope<Product>>(`/products/${productId}`);
    return data.data;
  },

  create: async (payload: CreateProductPayload): Promise<Product> => {
    const { data } = await api.post<ApiEnvelope<Product>>('/products/create', payload);
    return data.data;
  },

  update: async (productId: string, payload: UpdateProductPayload): Promise<Product> => {
    const { data } = await api.patch<ApiEnvelope<Product>>(
      `/products/${productId}/update`,
      payload
    );
    return data.data;
  },

  delete: async (productId: string): Promise<void> => {
    await api.delete(`/products/${productId}/delete`);
  },

  getStockSummary: async (): Promise<StockSummary> => {
    const { data } = await api.get<ApiEnvelope<StockSummary>>('/products/stock');
    return data.data;
  },
};
