import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import type { InvoiceStatus } from '@/types/billing.types';

const statusConfig: Record<InvoiceStatus, { label: string; variant: BadgeVariant }> = {
  draft: { label: 'Draft', variant: 'neutral' },
  pending: { label: 'Pending', variant: 'warning' },
  paid: { label: 'Paid', variant: 'success' },
  overdue: { label: 'Overdue', variant: 'danger' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status] ?? { label: status, variant: 'neutral' as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
