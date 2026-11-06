"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SymbolMark } from "@/components/ui/Logo";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { SITE } from "@/content/site";
import { whatsappUrl } from "@/lib/utils";

/**
 * Persistent conversion CTA (inspired by jorgewebpro.com floating pill).
 * Hidden on admin and until the user scrolls past the hero.
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

  if (pathname?.startsWith("/admin")) return null;

  const href = whatsappUrl(
    SITE.contact.whatsapp || "5543999541462",
    "Olá! Quero conversar sobre um projeto com a SYNAPZ.",
  );

  return (
    <div
      className={`pointer-events-none fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6 transition-all duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group pointer-events-auto inline-flex items-center gap-3 rounded-full border border-synapz-neural/15 bg-synapz-graphite/90 py-2 pl-3 pr-2 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md transition hover:border-synapz-impulse/40 hover:shadow-[0_20px_60px_-20px_rgba(183,255,0,0.35)]"
        aria-label="Conversar no WhatsApp sobre meu projeto"
      >
        <SymbolMark size={28} className="opacity-90" />
        <span className="hidden sm:inline text-sm font-medium tracking-tight text-synapz-neural">
          Solicitar orçamento
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-synapz-neural py-1.5 pl-3.5 pr-1.5 text-sm font-medium tracking-tight text-synapz-black sm:bg-transparent sm:p-0 sm:text-synapz-neural">
          <span className="sm:hidden">Orçamento</span>
          <ArrowCircle tone="impulse" size="sm" />
        </span>
      </a>
    </div>
  );
}
