"use client";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { NAV_ITEMS, CTA } from "@/content/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const isActive = (href: string) => {
    // In-page anchors should not stay highlighted for the whole page.
    if (href.includes("#")) {
      const [base = "/", hash] = href.split("#");
      const basePath = base || "/";
      if (pathname !== basePath) return false;
      if (typeof window === "undefined") return false;
      return window.location.hash === `#${hash}`;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <a href="#conteudo-principal" className="skip-link">
        Ir para o conteúdo
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled || open
            ? "bg-synapz-black/90 backdrop-blur-md border-b border-synapz-neural/[0.08] shadow-[0_10px_40px_-28px_rgba(0,0,0,0.9)]"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="container-wide flex h-[4.5rem] md:h-[5.5rem] items-center justify-between gap-3 sm:gap-6">
          <Logo
            variant="compacta"
            priority
            className="h-10 sm:h-11 md:h-14 w-auto shrink-0"
          />

          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Principal"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link text-sm tracking-tight",
                  isActive(item.href)
                    ? "text-synapz-impulse"
                    : "text-synapz-signal hover:text-synapz-neural",
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <Button href={CTA.primary.href} variant="impulse" size="sm">
                {CTA.primary.label}
              </Button>
            </div>

            <button
              type="button"
              className="lg:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center border border-synapz-neural/15 text-synapz-neural transition-colors hover:border-synapz-impulse/50"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Fechar" : "Menu"}</span>
              <span className="relative block h-3 w-5" aria-hidden>
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300",
                    open && "translate-y-[6px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[6px] h-px w-full bg-current transition-opacity duration-300",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[12px] h-px w-full bg-current transition-transform duration-300",
                    open && "-translate-y-[6px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id={menuId}
        className={cn(
          "fixed inset-0 z-40 bg-synapz-black/98 backdrop-blur-xl pt-24 px-[var(--spacing-gutter)] pb-10 transition-opacity duration-300 lg:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        hidden={!open}
      >
        <nav aria-label="Mobile" className="relative flex flex-col gap-1">
          <span
            className="absolute left-0 top-3 bottom-3 w-px bg-gradient-to-b from-synapz-neural/35 via-synapz-neural/15 to-transparent"
            aria-hidden
          />
          {NAV_ITEMS.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative pl-8 py-3.5 font-display text-3xl sm:text-4xl tracking-tight transition-colors",
                  active
                    ? "text-synapz-impulse"
                    : "text-synapz-neural hover:text-synapz-impulse",
                )}
                aria-current={active ? "page" : undefined}
                onClick={closeMenu}
              >
                <span
                  className={cn(
                    "absolute left-[-3px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-colors",
                    active ? "bg-synapz-impulse" : "bg-synapz-neural/25",
                  )}
                  aria-hidden
                />
                <span className="eyebrow mr-3 text-synapz-signal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            );
          })}
          <div className="mt-10 pl-8">
            <Button
              href={CTA.primary.href}
              variant="impulse"
              size="lg"
              className="w-full sm:w-auto"
              onClick={closeMenu}
            >
              {CTA.primary.label}
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
