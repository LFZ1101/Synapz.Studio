"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

type Props = {
  projects: Project[];
};

export function ProjectsCatalog({ projects }: Props) {
  const segments = useMemo(() => {
    const values = Array.from(new Set(projects.map((p) => p.segment)));
    return values.sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [projects]);

  const [active, setActive] = useState<string>("todos");

  const filtered =
    active === "todos"
      ? projects
      : projects.filter((project) => project.segment === active);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-synapz-signal">Filtrar por tipo</p>
        <div
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filtro de projetos"
        >
          <FilterChip
            label="Todos"
            active={active === "todos"}
            onClick={() => setActive("todos")}
          />
          {segments.map((segment) => (
            <FilterChip
              key={segment}
              label={segment}
              active={active === segment}
              onClick={() => setActive(segment)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-synapz-signal">Nenhum projeto neste filtro.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <li key={project.slug} className="h-full">
              <ProjectCard project={project} priority={index < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "shrink-0 rounded-full border px-3.5 py-2 text-xs tracking-wide transition-colors",
        active
          ? "border-synapz-impulse bg-synapz-impulse text-synapz-black"
          : "border-synapz-neural/15 bg-transparent text-synapz-signal hover:border-synapz-neural/35 hover:text-synapz-neural",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
