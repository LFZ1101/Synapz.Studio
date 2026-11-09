import Link from "next/link";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="platform-empty">
      <div className="platform-empty-node" aria-hidden />
      <h3 className="font-display text-xl text-synapz-neural">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-synapz-signal">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="platform-btn mt-6">
          {actionLabel}
        </Link>
      ) : null}
      {children}
    </div>
  );
}
