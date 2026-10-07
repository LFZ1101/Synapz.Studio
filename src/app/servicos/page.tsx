import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container, Section, Eyebrow } from "@/components/ui/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { nuclei, services } from "@/content/services";
import { CTA } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Serviços — Marca, Web e Campanhas | SYNAPZ STUDIO",
  description:
    "Conheça os serviços da SYNAPZ: marca e conteúdo, social media, vídeo, materiais, marketing, sites, landing pages, lojas virtuais e sistemas.",
  path: "/servicos",
});

export default function ServicosPage() {
  return (
    <main id="conteudo-principal">
      <JsonLd
        data={[
          webPageSchema({
            title: "Serviços — SYNAPZ STUDIO",
            description: metadata.description as string,
            path: "/servicos",
          }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Serviços", path: "/servicos" },
          ]),
        ]}
      />

      <Section className="pt-28 md:pt-32">
        <Container>
          <Eyebrow accent className="mb-4">
            Serviços
          </Eyebrow>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl max-w-4xl text-balance">
            O que a SYNAPZ pode fazer pelo seu negócio.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-synapz-signal leading-relaxed text-pretty">
            Três núcleos de atuação — marca e conteúdo, web e tecnologia,
            marketing e campanhas — para você contratar o que precisa agora ou
            estruturar uma jornada completa.
          </p>
        </Container>
      </Section>

      {nuclei.map((nucleus, index) => (
        <Section key={nucleus.id} tone={index % 2 ? "graphite" : "dark"}>
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-5">
                <Eyebrow accent>
                  {String(index + 1).padStart(2, "0")} / {nucleus.title}
                </Eyebrow>
                <h2 className="font-display text-3xl md:text-4xl leading-snug">
                  {nucleus.headline}
                </h2>
                <p className="text-synapz-signal leading-relaxed text-pretty">
                  {nucleus.description}
                </p>
                <Button href={nucleus.cta.href} variant="secondary">
                  {nucleus.cta.label}
                </Button>
              </div>
              <div className="lg:col-span-7">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {nucleus.services.map((item) => (
                    <li
                      key={item}
                      className="surface-panel surface-panel-hover px-4 py-3.5 text-sm text-synapz-signal"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      <Section tone="graphite">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <p className="eyebrow text-synapz-impulse mb-3">Detalhamento</p>
              <h2 className="font-display text-3xl">Páginas de serviço</h2>
            </div>
            <Button href={CTA.primary.href} variant="impulse" size="sm">
              {CTA.primary.label}
            </Button>
          </div>
          <ul className="divide-y divide-synapz-neural/10 border-y border-synapz-neural/10">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/servicos/${service.slug}`}
                  className="group flex flex-col gap-2 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="eyebrow mb-1">{service.eyebrow}</p>
                    <h3 className="font-display text-xl md:text-2xl group-hover:text-synapz-impulse transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="md:max-w-md text-sm text-synapz-signal">
                    {service.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </main>
  );
}
