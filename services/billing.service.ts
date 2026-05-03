import api from '@/lib/api';
import type { ApiEnvelope, PaginatedEnvelope, PaginationParams } from '@/types/api.types';
import type { Invoice, Transaction, CreateInvoicePayload } from '@/types/billing.types';

export const billingService = {
  listInvoices: async (params: PaginationParams = {}): Promise<PaginatedEnvelope<Invoice>> => {
    const { data } = await api.get<PaginatedEnvelope<Invoice>>('/billing/invoices', { params });
    return data;
  },

  getInvoice: async (invoiceId: string): Promise<Invoice> => {
    const { data } = await api.get<ApiEnvelope<Invoice>>(`/billing/invoices/${invoiceId}`);
    return data.data;
  },

  createInvoice: async (payload: CreateInvoicePayload): Promise<Invoice> => {
    const { data } = await api.post<ApiEnvelope<Invoice>>('/billing/invoices/create', payload);
    return data.data;
  },

  markAsPaid: async (invoiceId: string): Promise<void> => {
    await api.patch(`/billing/invoices/${invoiceId}/pay`);
  },

  listTransactions: async (params: PaginationParams = {}): Promise<PaginatedEnvelope<Transaction>> => {
    const { data } = await api.get<PaginatedEnvelope<Transaction>>('/transactions', { params });
    return data;
  },

  voidTransaction: async (transactionId: string): Promise<void> => {
    await api.patch(`/transactions/${transactionId}/void`);
  },
};
