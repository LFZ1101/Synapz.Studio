"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/content/site";

type FilterId = "todos" | "marca" | "web" | "conteudo" | "video";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "marca", label: "Marca" },
  { id: "web", label: "Web" },
  { id: "conteudo", label: "Conteúdo" },
  { id: "video", label: "Vídeo e motion" },
];

const MARCA = new Set([
  "Identidade visual",
  "Manipulação digital",
  "Material publicitário",
]);
const WEB = new Set(["E-commerce", "Landing page", "Sites"]);
const CONTEUDO = new Set(["Social media"]);
const VIDEO = new Set(["Edição de vídeo", "Motion design"]);

function matchesFilter(project: Project, filter: FilterId) {
  if (filter === "todos") return true;
  if (filter === "marca") return MARCA.has(project.segment);
  if (filter === "web") return WEB.has(project.segment);
  if (filter === "conteudo") return CONTEUDO.has(project.segment);
  if (filter === "video") return VIDEO.has(project.segment);
  return true;
}

function hasNarrative(project: Project) {
  return Boolean(
    project.context?.trim() ||
      project.problem?.trim() ||
      project.objective?.trim() ||
      project.strategy?.trim() ||
      project.creativeDirection?.trim() ||
      project.design?.trim() ||
      project.development?.trim(),
  );
}

type Props = {
  projects: Project[];
};

export function ProjectsCatalog({ projects }: Props) {
  const [active, setActive] = useState<FilterId>("todos");

  const filtered = useMemo(
    () => projects.filter((project) => matchesFilter(project, active)),
    [projects, active],
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <p className="eyebrow text-synapz-signal">Filtrar por área</p>
          <p className="text-sm text-synapz-signal/80" aria-live="polite">
            {filtered.length} projeto{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtro de projetos"
        >
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              pressed={active === filter.id}
              onClick={() => setActive(filter.id)}
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
              <ProjectCard
                project={project}
                priority={index < 3}
                ctaLabel={
                  hasNarrative(project) ? "Ler o case" : "Ver o projeto"
                }
              />
            </li>
          ))}
        </ul>
      )}

      <div className="border border-synapz-neural/10 p-6 md:p-8 max-w-3xl">
        <h2 className="font-display text-2xl text-synapz-neural">
          Tem um desafio parecido?
        </h2>
        <p className="mt-3 text-synapz-signal leading-relaxed text-pretty">
          Conte o contexto da sua marca e vamos encontrar a entrega certa.
        </p>
        <div className="mt-6">
          <Button href={CTA.primary.href} variant="impulse" className="min-h-11">
            {CTA.primary.label}
          </Button>
        </div>
        <p className="mt-4 text-sm text-synapz-signal">
          Ou{" "}
          <Link href="/contato" className="text-synapz-impulse hover:underline">
            abra a página de contato
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={[
        "min-h-11 shrink-0 border px-4 py-2.5 text-sm tracking-tight transition-colors duration-300",
        pressed
          ? "border-synapz-impulse bg-synapz-impulse text-synapz-black"
          : "border-synapz-neural/15 bg-transparent text-synapz-signal hover:border-synapz-neural/35 hover:text-synapz-neural",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
