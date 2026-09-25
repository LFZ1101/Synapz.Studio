import Image from "next/image";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getPublishedClients } from "@/content/clients";

/**
 * Home strip of client marks.
 * Renders a refined empty state until authorized logos are added
 * in src/content/clients.ts + public/media/clients/.
 */
export function ClientsSection() {
  const clients = getPublishedClients();

  return (
    <Section tone="graphite" id="clientes" className="!py-16 md:!py-20">
      <Container>
        <ScrollReveal variant="fade">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-10 md:mb-12">
            <div>
              <p className="eyebrow text-synapz-impulse mb-3">Clientes</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-synapz-neural text-balance max-w-xl">
                Marcas com quem já conectamos.
              </h2>
            </div>
            <p className="text-sm text-synapz-signal max-w-sm md:text-right">
              Parcerias reais — exibidas com autorização.
            </p>
          </div>
        </ScrollReveal>

        {clients.length === 0 ? (
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
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-synapz-neural/10 border border-synapz-neural/10">
            {clients.map((client, index) => (
              <ScrollReveal key={client.id} variant="fade" delay={index * 50}>
                <li className="bg-synapz-graphite">
                  {client.url ? (
                    <a
                      href={client.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-28 md:h-32 items-center justify-center px-6 transition-colors hover:bg-synapz-black focus-visible:outline-offset-[-4px]"
                      aria-label={client.name}
                    >
                      <ClientMark client={client} />
                    </a>
                  ) : (
                    <div className="group flex h-28 md:h-32 items-center justify-center px-6">
                      <ClientMark client={client} />
                    </div>
                  )}
                </li>
              </ScrollReveal>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}

function ClientMark({
  client,
}: {
  client: { name: string; logo: string };
}) {
  return (
    <Image
      src={client.logo}
      alt={client.name}
      width={160}
      height={48}
      className="h-8 md:h-10 w-auto max-w-[140px] object-contain opacity-55 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
    />
  );
}
