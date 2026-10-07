import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getFeaturedProjects, getPublishedProjects } from "@/content/projects";

export function ProjectsSection() {
  const featured = getFeaturedProjects();
  const projects =
    featured.length > 0 ? featured.slice(0, 6) : getPublishedProjects().slice(0, 6);

  return (
    <Section tone="graphite" id="projetos">
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <ScrollReveal variant="fade">
              <p className="eyebrow text-synapz-impulse mb-3">Projetos</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={70}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
                Conexões que viraram experiência.
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="fade" delay={120}>
            <Button href="/projetos" variant="secondary" className="shrink-0">
              Ver todos
            </Button>
          </ScrollReveal>
        </div>

        {projects.length === 0 ? (
          <ScrollReveal variant="up" delay={100}>
            <div className="mt-10 border border-synapz-neural/10 p-8 md:p-10 max-w-2xl">
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
          <ul className="mt-8 md:mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ScrollReveal key={project.slug} variant="up" delay={index * 60}>
                <li className="h-full">
                  <ProjectCard project={project} priority={index < 3} />
                </li>
              </ScrollReveal>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
