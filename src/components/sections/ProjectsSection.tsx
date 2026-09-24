import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { getPublishedProjects } from "@/content/projects";
import Link from "next/link";

export function ProjectsSection() {
  const projects = getPublishedProjects();

  return (
    <Section tone="graphite" id="projetos">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-synapz-impulse mb-4">Projetos</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
              Conexões que viraram experiência.
            </h2>
          </div>
          <Button href="/projetos" variant="secondary" className="shrink-0">
            Ver projetos
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="mt-12 border border-synapz-neural/10 p-8 md:p-10 max-w-2xl">
            <p className="eyebrow text-synapz-impulse mb-3">Em breve</p>
            <h3 className="font-display text-2xl text-synapz-neural">
              Estudos de caso reais serão publicados aqui.
            </h3>
            <p className="mt-3 text-synapz-signal leading-relaxed">
              Sem clientes ou métricas inventadas.
            </p>
            <div className="mt-6">
              <Button href="/contato" variant="impulse" size="sm">
                Iniciar um projeto
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-12 divide-y divide-synapz-neural/10 border-y border-synapz-neural/10">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projetos/${project.slug}`}
                  className="group grid gap-4 py-8 md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-5">
                    <p className="eyebrow mb-2">
                      {project.segment} · {project.year}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl group-hover:text-synapz-impulse transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <p className="md:col-span-5 text-synapz-signal text-sm md:text-base">
                    {project.summary}
                  </p>
                  <span className="md:col-span-2 md:text-right text-sm text-synapz-impulse">
                    Explorar →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
