import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading, Eyebrow } from "@/components/ui/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, personSchema, webPageSchema } from "@/lib/schema";
import { SITE, CTA } from "@/content/site";
import { differentials, methodSteps } from "@/content/studio";

export const metadata: Metadata = buildMetadata({
  title: "Studio — SYNAPZ STUDIO",
  description:
    "Conheça a SYNAPZ STUDIO: estúdio digital que conecta estratégia, marketing, criatividade, design e tecnologia. Fundado por Luis Felipe B. Zambianco.",
  path: "/studio",
});

export default function StudioPage() {
  return (
    <main id="conteudo-principal">
      <JsonLd
        data={[
          webPageSchema({
            title: "Studio — SYNAPZ STUDIO",
            description: metadata.description as string,
            path: "/studio",
          }),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Studio", path: "/studio" },
          ]),
          personSchema(),
        ]}
      />

      <Section className="pt-28 md:pt-32">
        <Container>
          <Eyebrow accent className="mb-4">
            Studio
          </Eyebrow>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl max-w-4xl text-balance leading-[1.05]">
            Entre uma ideia e um resultado existe uma conexão bem construída.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-synapz-signal leading-relaxed">
            A SYNAPZ STUDIO é um estúdio digital que reúne estratégia,
            criatividade, marketing e tecnologia. Criamos marcas, conteúdos,
            campanhas, sites e sistemas a partir de uma visão integrada.
          </p>
        </Container>
      </Section>

      <Section tone="graphite" id="sobre">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-6 text-synapz-signal leading-relaxed">
              <h2 className="font-display text-3xl text-synapz-neural">
                O que é a SYNAPZ
              </h2>
              <p>
                Somos um estúdio digital independente. Nosso trabalho é conectar
                competências que muitas empresas ainda tratam separadamente —
                para que mensagem, conteúdo, interface e tecnologia avancem na
                mesma direção.
              </p>
              <p>
                Acreditamos em processos próximos, comunicação clara e soluções
                construídas de acordo com a realidade de cada negócio. Não
                entregamos peças isoladas: entregamos conexões que movimentam.
              </p>
              <p>
                <strong className="text-synapz-neural">Propósito:</strong>{" "}
                {SITE.purpose}
              </p>
              <p>
                <strong className="text-synapz-neural">Posicionamento:</strong>{" "}
                {SITE.positioning}
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="aspect-[4/5] bg-synapz-black border border-synapz-neural/10 relative overflow-hidden flex items-center justify-center">
                <video
                  className="max-h-full max-w-full w-full h-full object-contain bg-synapz-black"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source
                    src="/media/videos/studio-synapz.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="fundador">
        <Container>
          <SectionHeading
            eyebrow="Fundador"
            title="Uma visão criativa com pensamento de negócio."
            description={
              <>
                A SYNAPZ foi criada por{" "}
                <strong className="text-synapz-neural">
                  {SITE.founder.name}
                </strong>{" "}
                para aproximar áreas que muitas empresas ainda tratam
                separadamente. Design, marketing e tecnologia passam a trabalhar
                juntos, criando soluções mais consistentes desde a primeira ideia
                até a experiência final.
              </>
            }
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-12 surface-panel p-6 md:p-10">
            <div className="lg:col-span-4">
              <div className="relative aspect-[4/5] bg-synapz-graphite border border-synapz-neural/10 overflow-hidden">
                <Image
                  src={SITE.founder.photo}
                  alt={`${SITE.founder.name} — ${SITE.founder.role}`}
                  fill
                  className="object-cover object-[center_18%]"
                  sizes="(max-width:1024px) 100vw, 30vw"
                />
              </div>
            </div>
            <div className="lg:col-span-8 flex flex-col justify-center gap-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-2 text-synapz-impulse">Nome</p>
                  <p className="font-display text-xl">{SITE.founder.name}</p>
                </div>
                <div>
                  <p className="eyebrow mb-2 text-synapz-impulse">Atuação</p>
                  <p className="text-synapz-signal">{SITE.founder.role}</p>
                </div>
                {SITE.founder.bio ? (
                  <div className="sm:col-span-2">
                    <p className="eyebrow mb-2 text-synapz-impulse">Biografia</p>
                    <p className="text-synapz-signal text-sm leading-relaxed">
                      {SITE.founder.bio}
                    </p>
                  </div>
                ) : null}
                {SITE.founder.education ? (
                  <div>
                    <p className="eyebrow mb-2 text-synapz-impulse">Formação</p>
                    <p className="text-synapz-signal text-sm">
                      {SITE.founder.education}
                    </p>
                  </div>
                ) : null}
                {SITE.founder.experience ? (
                  <div>
                    <p className="eyebrow mb-2 text-synapz-impulse">Experiência</p>
                    <p className="text-synapz-signal text-sm">
                      {SITE.founder.experience}
                    </p>
                  </div>
                ) : null}
                {SITE.founder.location ? (
                  <div>
                    <p className="eyebrow mb-2 text-synapz-impulse">Localização</p>
                    <p className="text-synapz-signal text-sm">
                      {SITE.founder.location}
                    </p>
                  </div>
                ) : null}
              </div>
              <div>
                <Button href={CTA.primary.href} variant="impulse">
                  {CTA.primary.label}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="graphite">
        <Container>
          <SectionHeading eyebrow="Como trabalhamos" title="Método em seis impulsos." />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {methodSteps.map((step) => (
              <li
                key={step.number}
                className="border border-synapz-neural/10 p-6"
              >
                <p className="eyebrow text-synapz-impulse mb-3">{step.number}</p>
                <h3 className="font-display text-xl mb-3">{step.title}</h3>
                <p className="text-synapz-signal text-sm leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Diferenças" title="Princípios que orientam cada entrega." />
          <ul className="mt-12 space-y-6 max-w-3xl">
            {differentials.map((d) => (
              <li key={d.title} className="border-l border-synapz-impulse pl-5">
                <h3 className="font-display text-xl">{d.title}</h3>
                <p className="mt-2 text-synapz-signal">{d.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Button href={CTA.primary.href} variant="impulse" size="lg">
              {CTA.primary.label}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
