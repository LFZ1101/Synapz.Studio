import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { getPublishedProjects } from "@/content/projects";
import Link from "next/link";

export function ProjectsSection() {
  const projects = getPublishedProjects();

  return (
    <Section tone="graphite" id="projetos">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Projetos"
            title="Conexões que se tornaram experiências."
            description="Cada projeto começa com uma necessidade diferente. Nosso trabalho é encontrar a estratégia, a linguagem e a tecnologia capazes de transformar essa necessidade em resultado."
          />
          <Button href="/projetos" variant="secondary" className="shrink-0">
            Ver projetos
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="mt-14 border border-synapz-neural/10 p-8 md:p-12">
            <p className="eyebrow text-synapz-impulse mb-4">Em curadoria</p>
            <h3 className="font-display text-2xl md:text-3xl text-synapz-neural max-w-xl">
              Estudos de caso reais serão publicados aqui com processo, entregas
              e resultados comprovados.
            </h3>
            <p className="mt-4 max-w-2xl text-synapz-signal leading-relaxed">
              Não exibimos clientes fictícios ou métricas inventadas. Enquanto
              novos projetos são documentados, você pode conhecer nosso método
              ou iniciar uma conversa.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/#metodo" variant="secondary">
                Conhecer o método
              </Button>
              <Button href="/contato" variant="impulse">
                Iniciar um projeto
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-14 divide-y divide-synapz-neural/10 border-y border-synapz-neural/10">
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
                    Explorar projeto →
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
