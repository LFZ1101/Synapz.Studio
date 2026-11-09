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
          <ScrollReveal variant="mask" delay={60}>
            <h2 className="font-display text-3xl sm:text-4xl leading-[1.08]">
              Respostas objetivas para começar com clareza.
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal variant="up" delay={100}>
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
      <Container className="relative">
        <ScrollReveal variant="up">
          <div className="border border-synapz-neural/10 bg-synapz-graphite/60 p-8 md:p-12 lg:p-14">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-3">
                <p className="eyebrow text-synapz-impulse">Próximo passo</p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-balance leading-tight">
                  Vamos dar uma direção clara ao seu próximo projeto?
                </h2>
                <p className="text-synapz-signal max-w-md text-pretty">
                  Conte o que você quer construir. A conversa começa com seu
                  contexto e segue para um escopo adequado ao momento da marca.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button href={CTA.primary.href} variant="impulse" size="lg" className="min-h-11">
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
