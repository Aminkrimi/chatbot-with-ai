interface MetricItemProps {
  label: string;
  value: string;
  /** Longer explanation for the tooltip and screen readers. */
  description: string;
}

export function MetricItem({ label, value, description }: MetricItemProps) {
  return (
    <span title={description} className="inline-flex items-baseline gap-1 whitespace-nowrap">
      <span className="sr-only">{description}: </span>
      <span aria-hidden>{label}</span>
      <span className="font-medium text-fg/70 tabular-nums">{value}</span>
    </span>
  );
}
