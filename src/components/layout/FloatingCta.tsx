"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SymbolMark } from "@/components/ui/Logo";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { CTA } from "@/content/site";

/**
 * Persistent contact CTA — appears after the hero.
 * Hidden on admin and contact (already the destination).
 */
export function FloatingCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname === "/contato") return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6 transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <Link
        href={CTA.primary.href}
        className="group pointer-events-auto inline-flex min-h-11 items-center gap-3 rounded-full border border-synapz-neural/15 bg-synapz-graphite/90 py-2 pl-3 pr-2 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md transition hover:border-synapz-impulse/40"
        aria-label={CTA.primary.label}
      >
        <SymbolMark size={28} className="opacity-90" />
        <span className="hidden sm:inline text-sm font-medium tracking-tight text-synapz-neural pl-1">
          {CTA.primary.label}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-synapz-neural py-1.5 pl-3.5 pr-1.5 text-sm font-medium tracking-tight text-synapz-black sm:bg-transparent sm:p-0 sm:text-synapz-neural">
          <span className="sm:hidden">Conversar</span>
          <ArrowCircle tone="impulse" size="sm" />
        </span>
      </Link>
    </div>
  );
}
