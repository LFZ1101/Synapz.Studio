import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getFeaturedProjects, getPublishedProjects } from "@/content/projects";

export function ProjectsSection() {
  const featured = getFeaturedProjects();
  const projects =
    featured.length > 0 ? featured : getPublishedProjects().slice(0, 5);

  return (
    <Section tone="graphite" id="projetos">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <ScrollReveal variant="fade">
              <p className="eyebrow text-synapz-impulse mb-4">Projetos</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={70}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
                Conexões que viraram experiência.
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="fade" delay={120}>
            <Button href="/projetos" variant="secondary" className="shrink-0">
              Ver projetos
            </Button>
          </ScrollReveal>
        </div>

        {projects.length === 0 ? (
          <ScrollReveal variant="up" delay={100}>
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
          </ScrollReveal>
        ) : (
          <ul className="mt-12 divide-y divide-synapz-neural/10 border-y border-synapz-neural/10">
            {projects.map((project, index) => (
              <ScrollReveal key={project.slug} variant="up" delay={index * 80}>
                <li>
                  <Link
                    href={`/projetos/${project.slug}`}
                    className="group grid gap-4 py-8 md:grid-cols-12 md:items-center"
                  >
                    <div className="md:col-span-3 relative aspect-[16/10] bg-synapz-black border border-synapz-neural/10 overflow-hidden">
                      {project.cover ? (
                        <Image
                          src={project.cover}
                          alt={project.coverAlt}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width:768px) 100vw, 25vw"
                        />
                      ) : null}
                    </div>
                    <div className="md:col-span-4">
                      <p className="eyebrow mb-2">
                        {project.segment} · {project.year}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl group-hover:text-synapz-impulse transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <p className="md:col-span-3 text-synapz-signal text-sm md:text-base">
                      {project.summary}
                    </p>
                    <span className="md:col-span-2 md:text-right text-sm text-synapz-impulse">
                      Explorar →
                    </span>
                  </Link>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
