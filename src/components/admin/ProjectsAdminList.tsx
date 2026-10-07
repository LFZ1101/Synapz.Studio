"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/content/project-types";

export function ProjectsAdminList({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter === "published" && !p.published) return false;
      if (filter === "draft" && p.published) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.segment.toLowerCase().includes(q) ||
        (p.client || "").toLowerCase().includes(q)
      );
    });
  }, [projects, query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Todos"],
              ["published", "Publicados"],
              ["draft", "Rascunhos"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={
                filter === id
                  ? "border border-synapz-impulse bg-synapz-impulse px-3 py-2 text-sm text-synapz-black"
                  : "border border-synapz-neural/15 px-3 py-2 text-sm text-synapz-signal"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className="field-input max-w-sm"
          placeholder="Buscar nome, slug, segmento…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-synapz-signal">Nenhum projeto neste filtro.</p>
      ) : (
        <ul className="divide-y divide-synapz-neural/10 border border-synapz-neural/10">
          {filtered.map((project) => (
            <li
              key={project.slug}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-lg">{project.name}</p>
                  {!project.published ? (
                    <span className="border border-synapz-neural/20 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-synapz-signal">
                      Rascunho
                    </span>
                  ) : null}
                  {project.featured ? (
                    <span className="border border-synapz-impulse/40 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-synapz-impulse">
                      Destaque
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-synapz-signal">
                  {project.segment} · {project.year} · /projetos/{project.slug}
                </p>
                <p className="text-sm text-synapz-signal/80 line-clamp-1">
                  {project.summary}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={`/projetos/${project.slug}`}
                  className="border border-synapz-neural/15 px-3 py-2 text-sm text-synapz-signal hover:text-synapz-neural"
                  target="_blank"
                >
                  Ver
                </Link>
                <Link
                  href={`/admin/projetos/${project.slug}`}
                  className="border border-synapz-impulse/50 bg-synapz-impulse/10 px-3 py-2 text-sm text-synapz-impulse"
                >
                  Editar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
