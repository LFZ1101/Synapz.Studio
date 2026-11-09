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
    <div className="sz-shell">
      <div className="sz-shell-grid" aria-hidden />

      <aside className={`sz-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="sz-sidebar-glass">
          <div className="sz-sidebar-top">
            <Link
              href="/plataforma"
              className="sz-sidebar-logo"
              onClick={() => setMobileOpen(false)}
            >
              <Image
                src="/brand/simbolo.png"
                alt="SYNAPZ"
                width={28}
                height={24}
                className="h-6 w-auto"
                priority
              />
            </Link>
            <button
              type="button"
              className="sz-icon-btn sz-only-mobile"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>

          <nav className="sz-sidebar-nav" aria-label="Principal">
            <p className="sz-nav-group">Operação</p>
            {PLATFORM_NAV.filter((i) => i.group !== "extras").map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`sz-nav-btn ${active ? "is-active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <NavIcons name={item.icon} className="sz-nav-icon" />
                  <span className="sz-nav-label">{item.label}</span>
                </Link>
              );
            })}
            <p className="sz-nav-group">Ferramentas</p>
            {PLATFORM_NAV.filter((i) => i.group === "extras").map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`sz-nav-btn ${active ? "is-active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <NavIcons name={item.icon} className="sz-nav-icon" />
                  <span className="sz-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sz-sidebar-foot">
            <p className="sz-sidebar-org">{user.orgName}</p>
            <p className="sz-sidebar-user">{user.name}</p>
            <p className="sz-sidebar-role">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="sz-backdrop sz-only-mobile"
          aria-label="Fechar navegação"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="sz-main">
        <header className="sz-topbar">
          <div className="sz-topbar-left">
            <button
              type="button"
              className="sz-icon-btn sz-only-mobile"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <GlobalSearch />
          </div>
          <div className="sz-topbar-actions">
            <button
              type="button"
              className="sz-chip"
              onClick={() => actionToggleHideValues(!user.hideValues)}
            >
              {user.hideValues ? "Mostrar valores" : "Ocultar valores"}
            </button>
            <Link href="/plataforma/configuracoes" className="sz-chip">
              Conta
            </Link>
            <form action={actionLogout}>
              <button type="submit" className="sz-chip">
                Sair
              </button>
            </form>
          </div>
        </header>

        <main className="sz-content">{children}</main>
      </div>

      <nav className="sz-mobile-nav sz-only-mobile" aria-label="Mobile">
        {PLATFORM_NAV.slice(0, 5).map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sz-mobile-item ${active ? "is-active" : ""}`}
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
