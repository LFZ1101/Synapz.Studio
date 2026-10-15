"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { actionLogout, actionToggleHideValues } from "@/lib/plataforma/actions";
import type { SessionUser } from "@/lib/plataforma/types";
import { ROLE_LABELS } from "@/lib/plataforma/types";
import { GlobalSearch } from "./GlobalSearch";
import { PLATFORM_NAV } from "./nav";
import { NavIcons } from "./NavIcons";

export function PlatformShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="platform-root">
      <aside className={`platform-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="flex items-center justify-between gap-3 px-4 py-5">
          <Link href="/plataforma" className="inline-flex min-w-[120px]" onClick={() => setMobileOpen(false)}>
            <Image
              src="/brand/logo-principal.png"
              alt="SYNAPZ STUDIO"
              width={140}
              height={38}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <button
            type="button"
            className="platform-icon-btn md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2 pb-4" aria-label="Principal">
          {PLATFORM_NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`platform-nav-item ${active ? "is-active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <NavIcons name={item.icon} className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-synapz-neural/10 px-4 py-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-synapz-signal">
            {user.orgName}
          </p>
          <p className="mt-1 truncate text-sm text-synapz-neural">{user.name}</p>
          <p className="text-xs text-synapz-signal">{ROLE_LABELS[user.role]}</p>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="platform-backdrop md:hidden"
          aria-label="Fechar navegação"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="platform-main">
        <header className="platform-topbar">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="platform-icon-btn md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="platform-chip"
              onClick={() => actionToggleHideValues(!user.hideValues)}
              title="Ocultar valores financeiros neste navegador"
            >
              {user.hideValues ? "Mostrar valores" : "Ocultar valores"}
            </button>
            <Link href="/plataforma/configuracoes" className="platform-chip">
              Conta
            </Link>
            <form action={actionLogout}>
              <button type="submit" className="platform-chip">
                Sair
              </button>
            </form>
          </div>
        </header>

        <main className="platform-content">{children}</main>
      </div>

      <nav className="platform-mobile-nav md:hidden" aria-label="Mobile">
        {PLATFORM_NAV.slice(0, 5).map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`platform-mobile-item ${active ? "is-active" : ""}`}
            >
              <NavIcons name={item.icon} className="h-5 w-5" />
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
