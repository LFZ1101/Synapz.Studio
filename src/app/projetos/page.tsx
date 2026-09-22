import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { getPublishedProjects } from "@/content/projects";
import { CTA } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Projetos e Estudos de Caso — SYNAPZ STUDIO",
  description:
    "Explore projetos de estratégia, conteúdo, campanhas, web design e tecnologia desenvolvidos pela SYNAPZ STUDIO.",
  path: "/projetos",
});

export default function ProjetosPage() {
  const projects = getPublishedProjects();

  return (
    <main id="conteudo-principal">
      <JsonLd
        data={[
          webPageSchema({
            title: "Projetos — SYNAPZ STUDIO",
            description: metadata.description as string,
            path: "/projetos",
          }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Projetos", path: "/projetos" },
          ]),
        ]}
      />

      <Section className="pt-28 md:pt-32">
        <Container>
          <Eyebrow accent className="mb-4">
            Projetos
          </Eyebrow>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl max-w-4xl text-balance">
            Conexões que se tornaram experiências.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-synapz-signal leading-relaxed">
            Cada projeto começa com uma necessidade diferente. Nosso trabalho é
            encontrar a estratégia, a linguagem e a tecnologia capazes de
            transformar essa necessidade em resultado.
          </p>
        </Container>
      </Section>

      <Section tone="graphite">
        <Container>
          {projects.length === 0 ? (
            <div className="border border-synapz-neural/10 p-8 md:p-12 max-w-3xl">
              <p className="eyebrow text-synapz-impulse mb-4">Portfólio em construção</p>
              <h2 className="font-display text-3xl text-synapz-neural">
                Estudos de caso serão publicados com narrativa completa.
              </h2>
              <p className="mt-4 text-synapz-signal leading-relaxed">
                Cada estudo incluirá contexto, problema, objetivo, estratégia,
                direção criativa, design, desenvolvimento, entregas, galeria e —
                quando autorizados — resultados e depoimentos reais. Não
                publicamos clientes ou métricas fictícias.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/servicos" variant="secondary">
                  Ver serviços
                </Button>
                <Button href={CTA.primary.href} variant="impulse">
                  {CTA.primary.label}
                </Button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-synapz-neural/10 border-y border-synapz-neural/10">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projetos/${project.slug}`}
                    className="group grid gap-4 py-10 md:grid-cols-12 md:items-center"
                  >
                    <div className="md:col-span-4 aspect-[16/10] bg-synapz-black border border-synapz-neural/10" />
                    <div className="md:col-span-5 space-y-2">
                      <p className="eyebrow">
                        {project.segment} · {project.year}
                      </p>
                      <h2 className="font-display text-2xl md:text-3xl group-hover:text-synapz-impulse transition-colors">
                        {project.name}
                      </h2>
                      <p className="text-synapz-signal">{project.summary}</p>
                      <p className="text-xs text-synapz-signal/80">
                        {project.services.join(" · ")}
                      </p>
                    </div>
                    <span className="md:col-span-3 md:text-right text-synapz-impulse text-sm">
                      Explorar projeto →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </main>
  );
}
