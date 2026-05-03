import { Badge } from '@/components/ui/Badge';

interface StockBadgeProps {
  quantity: number;
  threshold?: number;
}

export function StockBadge({ quantity, threshold = 10 }: StockBadgeProps) {
  if (quantity === 0) return <Badge variant="danger">Out of Stock</Badge>;
  if (quantity <= threshold) return <Badge variant="warning">{quantity} — Low Stock</Badge>;
  return <Badge variant="success">{quantity} in Stock</Badge>;
}
