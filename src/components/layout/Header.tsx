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
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    if (href.startsWith("/#")) return pathname === "/";
    if (href.includes("#")) {
      const base = href.split("#")[0];
      return pathname === base;
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
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled || open
            ? "bg-synapz-black/95 backdrop-blur-sm border-b border-synapz-neural/8"
            : "bg-transparent",
        )}
      >
        <div className="container-wide flex h-16 md:h-20 items-center justify-between gap-6">
          <Logo variant="compacta" priority className="h-8 md:h-9 w-auto" />

          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Principal"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm tracking-tight transition-colors",
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

          <div className="flex items-center gap-3">
            <Button
              href={CTA.primary.href}
              variant="impulse"
              size="sm"
              className="hidden sm:inline-flex"
            >
              {CTA.primary.label}
            </Button>

            <button
              type="button"
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center border border-synapz-neural/15 text-synapz-neural"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Fechar" : "Menu"}</span>
              <span className="relative block h-3 w-5" aria-hidden>
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-current transition-transform",
                    open && "translate-y-[6px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[6px] h-px w-full bg-current transition-opacity",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[12px] h-px w-full bg-current transition-transform",
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
          "fixed inset-0 z-40 bg-synapz-black pt-24 px-[var(--spacing-gutter)] pb-10 transition-opacity duration-300 lg:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        hidden={!open}
      >
        <nav aria-label="Mobile" className="relative flex flex-col gap-2">
          <span
            className="absolute left-0 top-3 bottom-3 w-px bg-synapz-impulse/80"
            aria-hidden
          />
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative pl-8 py-3 font-display text-3xl sm:text-4xl tracking-tight transition-colors",
                isActive(item.href)
                  ? "text-synapz-impulse"
                  : "text-synapz-neural",
              )}
              onClick={closeMenu}
            >
              <span
                className="absolute left-[-3px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-synapz-impulse"
                aria-hidden
              />
              <span className="eyebrow mr-3 text-synapz-signal">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </Link>
          ))}
          <div className="mt-10 pl-8">
            <Button
              href={CTA.primary.href}
              variant="impulse"
              size="lg"
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
