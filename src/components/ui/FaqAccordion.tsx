"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function FaqAccordion({
  items,
  className,
}: {
  items: readonly { question: string; answer: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "divide-y divide-synapz-neural/10 border-y border-synapz-neural/10",
        className,
      )}
    >
      {items.map((item) => (
        <details key={item.question} className="faq-item group">
          <summary className="flex items-start justify-between gap-6 py-5 md:py-6 transition-colors">
            <span className="faq-question font-display text-lg md:text-xl leading-snug text-synapz-neural pr-4 transition-colors">
              {item.question}
            </span>
            <span
              className="faq-chevron mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-synapz-neural/15 text-synapz-signal transition-all duration-300 group-open:border-synapz-impulse/50"
              aria-hidden
            >
              +
            </span>
          </summary>
          <div className="pb-6 md:pb-7 pr-10 text-synapz-signal leading-relaxed max-w-3xl text-pretty">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "motion-safe:animate-[fade-up_0.8s_cubic-bezier(0.22,1,0.36,1)_both]",
        className,
      )}
    >
      {children}
    </div>
  );
}
