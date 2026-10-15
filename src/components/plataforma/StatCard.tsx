import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="platform-stat">
      <p className="eyebrow">{label}</p>
      <div className="mt-3 font-display text-2xl text-synapz-neural md:text-3xl">
        {value}
      </div>
      {hint ? <div className="mt-2 text-xs text-synapz-signal">{hint}</div> : null}
    </div>
  );
}
