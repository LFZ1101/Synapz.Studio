import Image from "next/image";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getPublishedClients, type ClientLogo } from "@/content/clients";

/**
 * Home strip of client marks as a slow continuous marquee ("esteira").
 * Pauses on hover; falls back to a static wrap when reduced-motion is on.
 */
export function ClientsSection() {
  const clients = getPublishedClients();
  const track = [...clients, ...clients];

  return (
    <Section tone="graphite" id="clientes" className="!py-14 md:!py-16">
      <Container>
        <ScrollReveal variant="fade">
          <div className="mb-8 md:mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-synapz-impulse mb-3">Clientes</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-synapz-neural text-balance max-w-xl">
                Marcas com quem já conectamos.
              </h2>
            </div>
            <p className="text-sm text-synapz-signal max-w-xs md:text-right">
              Uma seleção de marcas acompanhadas em identidade, conteúdo e
              digital.
            </p>
          </div>
        </ScrollReveal>
      </Container>

      {clients.length === 0 ? (
        <Container>
          <ScrollReveal variant="up">
            <div className="border border-dashed border-synapz-neural/15 px-6 py-10 md:py-12">
              <p className="eyebrow text-synapz-impulse mb-3">Em preparação</p>
              <p className="font-display text-xl md:text-2xl text-synapz-neural max-w-lg">
                As logos dos clientes serão publicadas aqui.
              </p>
              <p className="mt-3 text-sm text-synapz-signal max-w-md">
                Envie os arquivos (PNG ou SVG, de preferência versão clara /
                monocromática) para incluirmos nesta faixa.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      ) : (
        <div
          className="clients-marquee relative border-y border-synapz-neural/10 bg-synapz-graphite"
          aria-label="Logos de clientes"
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-24 bg-gradient-to-r from-synapz-graphite to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-24 bg-gradient-to-l from-synapz-graphite to-transparent"
            aria-hidden
          />

          <p className="sr-only">
            {clients.map((client) => client.name).join(", ")}.
          </p>

          {/* Animated track — hidden when user prefers reduced motion */}
          <div className="clients-marquee-track motion-reduce:hidden" aria-hidden>
            <ul className="clients-marquee-group">
              {track.map((client, index) => (
                <li key={`${client.id}-${index}`} className="clients-marquee-item">
                  <ClientMark client={client} decorative />
                </li>
              ))}
            </ul>
          </div>

          {/* Static fallback for reduced motion */}
          <ul className="hidden motion-reduce:flex flex-wrap items-center justify-center gap-x-10 gap-y-8 px-6 py-10 md:px-10">
            {clients.map((client) => (
              <li key={client.id} className="clients-marquee-item">
                <ClientMark client={client} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

function ClientMark({
  client,
  decorative = false,
}: {
  client: ClientLogo;
  decorative?: boolean;
}) {
  const mark = (
    <Image
      src={client.logo}
      alt={decorative ? "" : client.name}
      width={180}
      height={64}
      className="h-10 md:h-12 w-auto max-w-[160px] md:max-w-[180px] object-contain opacity-55 transition duration-300 group-hover:opacity-100"
      draggable={false}
    />
  );

  if (decorative) {
    return (
      <div className="group flex h-24 md:h-28 items-center justify-center px-6 md:px-8" aria-hidden>
        {mark}
      </div>
    );
  }

  if (client.url) {
    return (
      <a
        href={client.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-24 md:h-28 items-center justify-center px-6 md:px-8 focus-visible:outline-offset-[-4px]"
        aria-label={client.name}
      >
        {mark}
      </a>
    );
  }

  return (
    <div className="group flex h-24 md:h-28 items-center justify-center px-6 md:px-8">
      {mark}
    </div>
  );
}
