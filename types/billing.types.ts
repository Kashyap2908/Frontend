export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  branch_id: string;
  status: InvoiceStatus;
  total_amount?: number;
  discount_percent?: number;
  discount_amount?: number;
  final_amount?: number;
  items?: InvoiceItem[];
  created_at: string;
}

export interface Transaction {
  id: string;
  branch_id: string;
  invoice_id: string | null;
  amount: number;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface CreateInvoicePayload {
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
  }>;
  discount_percent: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
}
