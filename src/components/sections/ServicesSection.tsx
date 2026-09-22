import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/Layout";
import { nuclei } from "@/content/services";
import Link from "next/link";

export function ServicesSection() {
  return (
    <Section tone="graphite" id="servicos">
      <Container>
        <SectionHeading
          eyebrow="Serviços"
          title="Uma conexão completa com o digital."
          description="Estratégia, criação e execução reunidas para que cada ponto da presença digital trabalhe na mesma direção."
        />

        <div className="mt-16 space-y-0 border-t border-synapz-neural/10">
          {nuclei.map((nucleus, index) => (
            <article
              key={nucleus.id}
              className="group grid gap-8 border-b border-synapz-neural/10 py-10 md:py-14 lg:grid-cols-12"
            >
              <div className="lg:col-span-1">
                <span className="eyebrow text-synapz-impulse">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="lg:col-span-5 space-y-4">
                <Eyebrow>{nucleus.title}</Eyebrow>
                <h3 className="font-display text-2xl md:text-3xl leading-snug text-synapz-neural">
                  {nucleus.headline}
                </h3>
                <p className="text-synapz-signal leading-relaxed">
                  {nucleus.description}
                </p>
                <Button href={nucleus.cta.href} variant="secondary" size="sm">
                  {nucleus.cta.label}
                </Button>
              </div>
              <div className="lg:col-span-6">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {nucleus.services.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-l border-synapz-neural/15 pl-4 text-sm text-synapz-signal transition-colors group-hover:border-synapz-impulse/50"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/servicos"
            className="text-sm text-synapz-impulse hover:underline underline-offset-4"
          >
            Ver todos os serviços →
          </Link>
        </div>
      </Container>
    </Section>
  );
}
