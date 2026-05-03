export interface Product {
  id: string;
  name: string;
  sku: string | null;
  branch_id: string | null;
  created_at: string;
}

export interface ProductStock {
  id: string;
  product_id: string;
  branch_id: string;
  quantity: number;
  created_at: string;
}

export interface StockSummaryItem {
  product_id: string;
  product_name: string;
  sku: string | null;
  quantity: number;
  branch_id: string | null;
  is_low_stock: boolean;
}

export interface StockSummary {
  total_products: number;
  total_stock_value: number;
  low_stock_count: number;
  items: StockSummaryItem[];
}

export interface CreateProductPayload {
  name: string;
  sku?: string;
  branch_id?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
