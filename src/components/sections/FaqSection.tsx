import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { faqItems } from "@/content/studio";
import { CTA } from "@/content/site";

const HOME_FAQ = faqItems.slice(0, 4);

function homeFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function FaqSection() {
  return (
    <Section tone="graphite" id="faq">
      <JsonLd data={homeFaqSchema()} />
      <Container>
        <div className="max-w-2xl">
          <ScrollReveal variant="fade">
            <p className="eyebrow text-synapz-impulse mb-4">FAQ</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={70}>
            <h2 className="font-display text-3xl sm:text-4xl leading-[1.08]">
              Perguntas rápidas.
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal variant="up" delay={120}>
          <div className="mt-10 max-w-3xl">
            <FaqAccordion items={HOME_FAQ} />
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}

export function ContactCtaSection() {
  return (
    <Section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 ambient-glow opacity-60" />
      <Container className="relative">
        <ScrollReveal variant="up">
          <div className="surface-panel relative overflow-hidden p-8 md:p-12 lg:p-14">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-synapz-impulse/10 blur-3xl"
              aria-hidden
            />
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center relative">
              <div className="lg:col-span-8 space-y-3">
                <p className="eyebrow text-synapz-impulse">Contato</p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-balance leading-tight">
                  Vamos ativar sua próxima conexão?
                </h2>
                <p className="text-synapz-signal max-w-md text-pretty">
                  Conte o momento do seu negócio. Definimos o próximo passo
                  juntos.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button href={CTA.primary.href} variant="impulse" size="lg">
                  {CTA.primary.label}
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
