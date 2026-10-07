"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/projetos", label: "Projetos" },
  { href: "/admin/projetos/novo", label: "Novo projeto" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-[100svh] bg-synapz-black text-synapz-neural">
      <header className="border-b border-synapz-neural/10 bg-synapz-graphite">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="eyebrow text-synapz-impulse">SYNAPZ · Admin</p>
            <p className="text-sm text-synapz-signal">
              Gerencie projetos e vídeos sem afetar o login do site público.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="text-sm text-synapz-signal hover:text-synapz-neural"
              target="_blank"
            >
              Ver site ↗
            </Link>
            <button
              type="button"
              onClick={logout}
              className="border border-synapz-neural/20 px-3 py-2 text-sm text-synapz-signal hover:border-synapz-impulse/50 hover:text-synapz-neural"
            >
              Sair
            </button>
          </div>
        </div>
        <nav
          aria-label="Admin"
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 md:px-6"
        >
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : item.href === "/admin/projetos"
                  ? pathname === "/admin/projetos"
                  : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 border px-3 py-2 text-sm transition-colors",
                  active
                    ? "border-synapz-impulse bg-synapz-impulse text-synapz-black"
                    : "border-synapz-neural/15 text-synapz-signal hover:text-synapz-neural",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {children}
      </main>
    </div>
  );
}
