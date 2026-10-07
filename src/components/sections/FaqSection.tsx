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
            <p className="eyebrow text-synapz-impulse mb-4">Dúvidas frequentes</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={70}>
            <h2 className="font-display text-3xl sm:text-4xl leading-[1.08]">
              Respostas objetivas para começar com clareza.
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
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_80%_20%,rgba(183,255,0,0.08),transparent_70%)]"
        aria-hidden
      />
      <Container className="relative">
        <ScrollReveal variant="up">
          <div className="surface-panel relative overflow-hidden p-8 md:p-12 lg:p-14">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center relative">
              <div className="lg:col-span-8 space-y-3">
                <p className="eyebrow text-synapz-impulse">Próximo passo</p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-balance leading-tight">
                  Vamos conversar sobre o que seu negócio precisa agora?
                </h2>
                <p className="text-synapz-signal max-w-md text-pretty">
                  Conte o momento da empresa. Em poucos minutos alinhamos
                  escopo, caminho e próximos passos.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button href={CTA.primary.href} variant="impulse" size="lg">
                  {CTA.activate.label}
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
