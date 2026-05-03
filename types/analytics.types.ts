export interface DashboardSummary {
  branch_id: string | null;
  total_sales: number;
  total_transactions: number;
  low_stock_items: number;
}

export interface DailyStat {
  date: string;
  revenue: number;
  transactions: number;
}

export interface SalesReport {
  total_revenue?: number;
  total_transactions?: number;
  paid_amount?: number;
  unpaid_amount?: number;
  profit?: number;
  daily_data?: DailyStat[];
}

export interface LowStockItem {
  product_id: string;
  product_name: string;
  quantity: number;
  threshold?: number;
}

export interface StockReport {
  total_products?: number;
  total_stock_value?: number;
  low_stock_items?: LowStockItem[];
}
