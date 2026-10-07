import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectsCatalog } from "@/components/projects/ProjectsCatalog";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { getPublishedProjects } from "@/content/projects";
import { CTA } from "@/content/site";

export const dynamic = "force-dynamic";

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

      <Section className="relative overflow-hidden pt-28 md:pt-32 !pb-8 md:!pb-10">
        <div className="pointer-events-none absolute inset-0 ambient-glow opacity-50" />
        <Container className="relative">
          <Eyebrow accent className="mb-4">
            Projetos
          </Eyebrow>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl max-w-4xl text-balance">
            Trabalhos reais, com entrega visível.
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-synapz-signal leading-relaxed text-pretty">
            Identidade, social, web e vídeo — filtre por tipo e abra o case para
            ver a galeria completa.
          </p>
        </Container>
      </Section>

      <Section tone="graphite" className="!pt-6 md:!pt-8">
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
            <ProjectsCatalog projects={projects} />
          )}
        </Container>
      </Section>
    </main>
  );
}
