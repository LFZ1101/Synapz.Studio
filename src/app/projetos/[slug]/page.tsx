import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  creativeWorkSchema,
  webPageSchema,
} from "@/lib/schema";
import {
  getNextProject,
  getProject,
  getPublishedProjects,
} from "@/content/projects";
import { CTA } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: `${project.name} — Estudo de Caso | SYNAPZ STUDIO`,
    description: project.summary,
    path: `/projetos/${project.slug}`,
    image: project.cover,
    type: "article",
  });
}

export default async function ProjectCasePage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);

  const blocks: { title: string; body: string }[] = [
    { title: "Contexto", body: project.context },
    { title: "Problema", body: project.problem },
    { title: "Objetivo", body: project.objective },
    { title: "Estratégia", body: project.strategy },
    { title: "Direção criativa", body: project.creativeDirection },
    { title: "Design", body: project.design },
    { title: "Desenvolvimento ou produção", body: project.development },
  ].filter((b) => b.body.trim().length > 0);

  return (
    <main id="conteudo-principal">
      <JsonLd
        data={[
          webPageSchema({
            title: project.name,
            description: project.summary,
            path: `/projetos/${project.slug}`,
          }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Projetos", path: "/projetos" },
            { name: project.name, path: `/projetos/${project.slug}` },
          ]),
          creativeWorkSchema(project),
        ]}
      />

      <Section className="pt-28 md:pt-32">
        <Container>
          <Eyebrow accent className="mb-4">
            {project.segment} · {project.year}
          </Eyebrow>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl max-w-4xl text-balance">
            {project.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-synapz-signal">
            {project.summary}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.services.map((s) => (
              <li
                key={s}
                className="eyebrow border border-synapz-neural/15 px-3 py-2"
              >
                {s}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container wide>
          <div className="relative aspect-[16/9] bg-synapz-graphite border border-synapz-neural/10 overflow-hidden">
            {project.cover ? (
              <Image
                src={project.cover}
                alt={project.coverAlt}
                fill
                className="object-cover grayscale"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-synapz-signal">
                Mídia do projeto indisponível
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section tone="graphite">
        <Container>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="eyebrow mb-2">Segmento</dt>
              <dd>{project.segment}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Ano</dt>
              <dd>{project.year}</dd>
            </div>
            {project.client ? (
              <div>
                <dt className="eyebrow mb-2">Cliente</dt>
                <dd>{project.client}</dd>
              </div>
            ) : null}
            <div>
              <dt className="eyebrow mb-2">Serviços</dt>
              <dd className="text-sm text-synapz-signal">
                {project.services.join(", ")}
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      {blocks.map((block, index) => (
        <Section key={block.title} tone={index % 2 ? "graphite" : "dark"}>
          <Container className="max-w-3xl">
            <h2 className="font-display text-3xl mb-6">{block.title}</h2>
            <p className="text-lg text-synapz-signal leading-relaxed whitespace-pre-line">
              {block.body}
            </p>
          </Container>
        </Section>
      ))}

      {project.deliverables.length > 0 ? (
        <Section>
          <Container>
            <h2 className="font-display text-3xl mb-8">Entregas</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {project.deliverables.map((item) => (
                <li
                  key={item}
                  className="border border-synapz-neural/10 px-4 py-3 text-synapz-signal"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {project.results.length > 0 ? (
        <Section tone="graphite">
          <Container>
            <h2 className="font-display text-3xl mb-8">Resultado</h2>
            <ul className="grid gap-6 md:grid-cols-3">
              {project.results.map((r) => (
                <li key={r.label} className="border border-synapz-neural/10 p-6">
                  <p className="font-display text-3xl text-synapz-impulse">
                    {r.value}
                  </p>
                  <p className="mt-2 text-synapz-neural">{r.label}</p>
                  {r.context ? (
                    <p className="mt-2 text-sm text-synapz-signal">{r.context}</p>
                  ) : null}
                  {(r.period || r.source) && (
                    <p className="mt-3 eyebrow">
                      {[r.period, r.source].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {project.gallery.length > 0 ? (
        <Section>
          <Container wide>
            <h2 className="font-display text-3xl mb-8">Galeria</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {project.gallery.map((item) => (
                <li key={item.src} className="space-y-2">
                  <div className="relative aspect-[16/10] bg-synapz-graphite border border-synapz-neural/10 overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover grayscale"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  </div>
                  {item.caption ? (
                    <p className="text-sm text-synapz-signal">{item.caption}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {project.beforeAfter && project.beforeAfter.length > 0 ? (
        <Section tone="graphite">
          <Container>
            <h2 className="font-display text-3xl mb-8">Antes e depois</h2>
            <ul className="space-y-8">
              {project.beforeAfter.map((pair) => (
                <li
                  key={pair.before + pair.after}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <div className="relative aspect-video bg-synapz-black border border-synapz-neural/10">
                    <Image
                      src={pair.before}
                      alt={`Antes — ${pair.label ?? project.name}`}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="relative aspect-video bg-synapz-black border border-synapz-neural/10">
                    <Image
                      src={pair.after}
                      alt={`Depois — ${pair.label ?? project.name}`}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {project.testimonial ? (
        <Section>
          <Container className="max-w-3xl">
            <blockquote className="border-l border-synapz-impulse pl-6">
              <p className="font-display text-2xl md:text-3xl leading-snug">
                “{project.testimonial.quote}”
              </p>
              <footer className="mt-6 text-synapz-signal">
                <cite className="not-italic text-synapz-neural">
                  {project.testimonial.name}
                </cite>
                {" — "}
                {project.testimonial.role}, {project.testimonial.company}
              </footer>
            </blockquote>
          </Container>
        </Section>
      ) : null}

      {next ? (
        <Section tone="graphite">
          <Container className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Próximo projeto</p>
              <Link
                href={`/projetos/${next.slug}`}
                className="font-display text-3xl hover:text-synapz-impulse"
              >
                {next.name} →
              </Link>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container className="border border-synapz-neural/10 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl">
              Vamos ativar sua próxima conexão?
            </h2>
            <p className="mt-2 text-synapz-signal">
              Conte o momento do seu negócio.
            </p>
          </div>
          <Button href={CTA.primary.href} variant="impulse" size="lg">
            {CTA.primary.label}
          </Button>
        </Container>
      </Section>
    </main>
  );
}
