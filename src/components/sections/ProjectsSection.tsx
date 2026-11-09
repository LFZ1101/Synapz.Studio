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
    <Section tone="graphite" id="projetos" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-synapz-black/40 to-transparent"
        aria-hidden
      />
      <Container className="relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <ScrollReveal variant="fade">
              <p className="eyebrow text-synapz-impulse mb-3">Projetos</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={70}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
                Veja na prática projetos{" "}
                <span className="impulse-word">reais</span> colocados em
                movimento.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={110}>
              <p className="mt-4 max-w-lg text-synapz-signal text-pretty">
                Cada entrega nasce de estratégia para valorizar a marca, prender
                atenção e facilitar a decisão.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="fade" delay={120}>
            <Button href="/projetos" variant="pill" className="shrink-0" size="md">
              Ver projetos
            </Button>
          </ScrollReveal>
        </div>

        {projects.length === 0 ? (
          <ScrollReveal variant="up" delay={100}>
            <div className="mt-10 soft-panel p-8 md:p-10 max-w-2xl">
              <p className="eyebrow text-synapz-impulse mb-3">Em breve</p>
              <h3 className="font-display text-2xl text-synapz-neural">
                Estudos de caso reais serão publicados aqui.
              </h3>
              <p className="mt-3 text-synapz-signal leading-relaxed">
                Sem clientes ou métricas inventadas.
              </p>
              <div className="mt-6">
                <Button href="/contato" variant="pill" size="sm">
                  Solicitar orçamento
                </Button>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <ul className="mt-10 md:mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
