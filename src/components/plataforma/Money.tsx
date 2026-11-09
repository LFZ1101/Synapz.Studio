import { formatMoney, formatPercent } from "@/lib/plataforma/format";

export function Money({
  cents,
  hide,
  className,
}: {
  cents: number;
  hide?: boolean;
  className?: string;
}) {
  return (
    <span className={`font-mono tabular-nums ${className ?? ""}`}>
      {formatMoney(cents, hide)}
    </span>
  );
}

export function Percent({
  value,
  hide,
  className,
}: {
  value: number;
  hide?: boolean;
  className?: string;
}) {
  const tone =
    value > 0 ? "text-synapz-impulse" : value < 0 ? "text-synapz-danger" : "text-synapz-signal";
  return (
    <span className={`font-mono tabular-nums ${tone} ${className ?? ""}`}>
      {formatPercent(value, hide)}
    </span>
  );
}
