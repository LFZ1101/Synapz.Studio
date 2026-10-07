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
import { getNextProject, getProject } from "@/content/projects";
import { CTA } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const dynamicParams = true;

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
          {project.video ? (
            <div className="flex items-center justify-center bg-synapz-black border border-synapz-neural/10 overflow-hidden min-h-[220px]">
              <video
                className="max-w-full w-auto h-auto max-h-[70vh] md:max-h-[75vh]"
                controls
                playsInline
                preload="metadata"
                poster={project.cover || undefined}
              >
                <source src={project.video} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="relative aspect-[16/9] bg-synapz-graphite border border-synapz-neural/10 overflow-hidden">
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt={project.coverAlt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-synapz-signal">
                  Mídia do projeto indisponível
                </div>
              )}
            </div>
          )}
          {project.externalUrl ? (
            <p className="mt-4">
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-synapz-impulse hover:underline"
              >
                Ver projeto online →
              </a>
            </p>
          ) : null}
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
            <ul
              className={
                project.gallery.some((item) => item.video || item.youtube)
                  ? "grid gap-6 md:grid-cols-2"
                  : "grid gap-4 md:grid-cols-2"
              }
            >
              {project.gallery.map((item, index) => {
                const key =
                  item.video || item.youtube || item.src || `item-${index}`;
                const isMedia = Boolean(item.video || item.youtube);

                return (
                  <li
                    key={key}
                    className={
                      isMedia
                        ? "space-y-2 md:col-span-2 lg:col-span-1"
                        : "space-y-2"
                    }
                  >
                    {item.video ? (
                      <div className="flex items-center justify-center bg-synapz-black border border-synapz-neural/10 overflow-hidden min-h-[200px]">
                        <video
                          className="max-w-full w-auto h-auto max-h-[65vh] md:max-h-[70vh]"
                          controls
                          playsInline
                          preload="metadata"
                          poster={item.poster}
                        >
                          <source src={item.video} type="video/mp4" />
                        </video>
                      </div>
                    ) : item.youtube ? (
                      <div className="relative aspect-video bg-synapz-graphite border border-synapz-neural/10 overflow-hidden">
                        <iframe
                          src={item.youtube}
                          title={item.alt}
                          className="absolute inset-0 h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    ) : item.src ? (
                      <div className="relative aspect-[16/10] bg-synapz-graphite border border-synapz-neural/10 overflow-hidden">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, 50vw"
                        />
                      </div>
                    ) : null}
                    {item.caption ? (
                      <p className="text-sm text-synapz-neural">{item.caption}</p>
                    ) : null}
                    {item.note ? (
                      <p className="text-sm text-synapz-signal">{item.note}</p>
                    ) : null}
                  </li>
                );
              })}
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

      <Section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 ambient-glow opacity-40" />
        <Container className="relative">
          <div className="surface-panel p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl">
                Quer um resultado parecido para o seu negócio?
              </h2>
              <p className="mt-2 text-synapz-signal">
                Conte o momento da empresa e alinhamos o próximo passo.
              </p>
            </div>
            <Button href={CTA.primary.href} variant="impulse" size="lg">
              {CTA.primary.label}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
