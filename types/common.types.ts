export type Status = 'idle' | 'loading' | 'success' | 'error';

export type SortOrder = 'asc' | 'desc';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type Nullable<T> = T | null;
