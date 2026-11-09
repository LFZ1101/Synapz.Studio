import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getProject } from "@/content/projects";

const FEATURED_SLUGS = ["syelle", "viane-brasil", "dunamis-wear"] as const;

export function ProjectsSection() {
  const projects = FEATURED_SLUGS.map((slug) => getProject(slug)).filter(
    Boolean,
  );

  return (
    <Section tone="graphite" id="projetos" className="relative">
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-10 md:mb-12">
          <div className="max-w-2xl">
            <ScrollReveal variant="fade">
              <p className="eyebrow text-synapz-impulse mb-3">Projetos</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={60}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
                A direção aparece nas entregas.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={100}>
              <p className="mt-4 max-w-lg text-synapz-signal text-pretty">
                Identidades e experiências digitais com decisões visuais
                próprias. Abra cada projeto para ver o trabalho e o raciocínio
                por trás dele.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="fade" delay={120}>
            <Button href="/projetos" variant="secondary" className="shrink-0 min-h-11">
              Explorar projetos
            </Button>
          </ScrollReveal>
        </div>

        <ul className="grid gap-8 lg:gap-10">
          {projects.map((project, index) => {
            if (!project) return null;
            const reverse = index % 2 === 1;
            return (
              <ScrollReveal key={project.slug} variant="up" delay={index * 70}>
                <li>
                  <Link
                    href={`/projetos/${project.slug}`}
                    className={`group grid gap-5 md:gap-8 md:grid-cols-12 md:items-center focus-visible:outline-offset-4`}
                  >
                    <div
                      className={`relative overflow-hidden border border-synapz-neural/10 bg-synapz-black aspect-[16/10] md:col-span-7 ${
                        reverse ? "md:order-2" : ""
                      }`}
                    >
                      {project.cover ? (
                        <Image
                          src={project.cover}
                          alt={project.coverAlt}
                          fill
                          priority={index === 0}
                          className="object-contain p-2 transition duration-700 group-hover:scale-[1.02]"
                          sizes="(max-width:768px) 100vw, 58vw"
                        />
                      ) : null}
                    </div>
                    <div
                      className={`md:col-span-5 space-y-3 ${
                        reverse ? "md:order-1" : ""
                      }`}
                    >
                      <p className="eyebrow text-synapz-signal">
                        {project.segment} · {project.year}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl text-synapz-neural group-hover:text-synapz-impulse transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm md:text-base text-synapz-signal leading-relaxed text-pretty">
                        {project.summary}
                      </p>
                      <span className="inline-flex items-center gap-2 pt-2 text-sm text-synapz-impulse min-h-11">
                        Ver estudo de caso
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              </ScrollReveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
