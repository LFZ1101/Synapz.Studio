import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import { getService, services } from "@/content/services";
import { CTA } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/servicos/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.related
    .map((s) => getService(s))
    .filter(Boolean);

  return (
    <main id="conteudo-principal">
      <JsonLd
        data={[
          webPageSchema({
            title: service.seo.title,
            description: service.seo.description,
            path: `/servicos/${service.slug}`,
          }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Serviços", path: "/servicos" },
            { name: service.title, path: `/servicos/${service.slug}` },
          ]),
          serviceSchema(service),
        ]}
      />

      <Section className="pt-28 md:pt-32">
        <Container>
          <Eyebrow accent className="mb-4">
            {service.eyebrow}
          </Eyebrow>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl max-w-4xl text-balance">
            {service.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-synapz-signal leading-relaxed">
            {service.intro}
          </p>
          <div className="mt-8">
            <Button href={CTA.primary.href} variant="impulse" size="lg">
              {service.cta}
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="graphite">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl mb-4">Para quem é indicado</h2>
            <p className="text-synapz-signal leading-relaxed">{service.forWhom}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl mb-4">Problemas que resolvemos</h2>
            <ul className="space-y-3">
              {service.problems.map((p) => (
                <li
                  key={p}
                  className="border-l border-synapz-impulse/70 pl-4 text-synapz-signal"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl mb-6">Entregas</h2>
            <ul className="space-y-3">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-synapz-signal border-b border-synapz-neural/10 py-3"
                >
                  <span className="text-synapz-impulse" aria-hidden>
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl mb-6">Como funciona</h2>
            <ol className="space-y-4">
              {service.process.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="eyebrow text-synapz-impulse shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-synapz-signal">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="graphite">
          <Container>
            <h2 className="font-display text-2xl mb-8">Serviços relacionados</h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {related.map((item) =>
                item ? (
                  <li key={item.slug}>
                    <Link
                      href={`/servicos/${item.slug}`}
                      className="block border border-synapz-neural/10 p-5 hover:border-synapz-impulse/40 transition-colors h-full"
                    >
                      <p className="eyebrow mb-2">{item.eyebrow}</p>
                      <h3 className="font-display text-xl">{item.title}</h3>
                      <p className="mt-3 text-sm text-synapz-signal">
                        {item.summary}
                      </p>
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-synapz-neural/10 p-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl">
              Quer colocar isso em movimento?
            </h2>
            <p className="mt-2 text-synapz-signal">
              Conte o momento do seu negócio — definimos juntos o próximo passo.
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
