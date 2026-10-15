"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState, useTransition } from "react";

type SearchResult = {
  clients: Array<{ id: string; name: string; company: string | null }>;
  projects: Array<{ id: string; name: string }>;
  opportunities: Array<{ id: string; title: string; company: string | null }>;
  sales: Array<{ id: string; name: string }>;
};

const EMPTY: SearchResult = {
  clients: [],
  projects: [],
  opportunities: [],
  sales: [],
};

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q.trim());
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<SearchResult>(EMPTY);
  const [pending, startTransition] = useTransition();
  const active = deferredQ.length >= 2;

  useEffect(() => {
    if (!active) return;
    const handle = setTimeout(() => {
      startTransition(async () => {
        const res = await fetch(
          `/api/plataforma/busca?q=${encodeURIComponent(deferredQ)}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as SearchResult;
        setResult(data);
        setOpen(true);
      });
    }, 220);
    return () => clearTimeout(handle);
  }, [deferredQ, active]);

  const shown = active ? result : EMPTY;
  const empty =
    active &&
    !pending &&
    shown.clients.length === 0 &&
    shown.projects.length === 0 &&
    shown.opportunities.length === 0 &&
    shown.sales.length === 0;

  return (
    <div className="relative w-full max-w-md">
      <label className="sr-only" htmlFor="platform-search">
        Busca global
      </label>
      <input
        id="platform-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => active && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Buscar cliente, empresa, telefone ou projeto"
        className="platform-input w-full"
      />
      {open && active ? (
        <div className="platform-search-panel">
          {pending ? (
            <p className="px-3 py-2 text-sm text-synapz-signal">Buscando…</p>
          ) : null}
          {empty ? (
            <p className="px-3 py-2 text-sm text-synapz-signal">Nada encontrado.</p>
          ) : null}
          {shown.clients.map((c) => (
            <Link
              key={c.id}
              href={`/plataforma/clientes?editar=${c.id}`}
              className="platform-search-item"
            >
              <span className="eyebrow">Cliente</span>
              <span>
                {c.name}
                {c.company ? ` · ${c.company}` : ""}
              </span>
            </Link>
          ))}
          {shown.opportunities.map((o) => (
            <Link
              key={o.id}
              href={`/plataforma/crm/${o.id}`}
              className="platform-search-item"
            >
              <span className="eyebrow">Oportunidade</span>
              <span>{o.title}</span>
            </Link>
          ))}
          {shown.projects.map((p) => (
            <Link
              key={p.id}
              href={`/plataforma/projetos?editar=${p.id}`}
              className="platform-search-item"
            >
              <span className="eyebrow">Projeto</span>
              <span>{p.name}</span>
            </Link>
          ))}
          {shown.sales.map((s) => (
            <Link
              key={s.id}
              href={`/plataforma/vendas?editar=${s.id}`}
              className="platform-search-item"
            >
              <span className="eyebrow">Venda</span>
              <span>{s.name}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
