import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";
import { faqItems } from "@/content/studio";
import { CTA } from "@/content/site";

export function FaqSection() {
  return (
    <Section tone="graphite" id="faq">
      <JsonLd data={faqSchema()} />
      <Container>
        <SectionHeading
          eyebrow="Perguntas frequentes"
          title="Respostas diretas antes do próximo passo."
        />
        <div className="mt-12 max-w-3xl">
          <FaqAccordion items={faqItems} />
        </div>
      </Container>
    </Section>
  );
}

export function ContactCtaSection() {
  return (
    <Section>
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end border border-synapz-neural/10 p-8 md:p-12">
          <div className="lg:col-span-8 space-y-4">
            <p className="eyebrow text-synapz-impulse">Contato</p>
            <h2 className="font-display text-3xl md:text-5xl text-balance">
              Vamos ativar a próxima conexão?
            </h2>
            <p className="text-synapz-signal max-w-xl leading-relaxed">
              Conte um pouco sobre sua empresa, seu momento e o que precisa ser
              colocado em movimento.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button href={CTA.primary.href} variant="impulse" size="lg">
              {CTA.primary.label}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
