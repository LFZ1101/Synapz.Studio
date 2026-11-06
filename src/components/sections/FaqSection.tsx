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
    <Section tone="graphite" id="faq" className="relative overflow-hidden">
      <JsonLd data={homeFaqSchema()} />
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-30" aria-hidden />
      <Container className="relative">
        <div className="max-w-2xl">
          <ScrollReveal variant="fade">
            <p className="eyebrow text-synapz-impulse mb-4">Dúvidas frequentes</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={70}>
            <h2 className="font-display text-3xl sm:text-4xl leading-[1.08]">
              Respostas objetivas para começar com{" "}
              <span className="impulse-word">clareza</span>.
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal variant="up" delay={120}>
          <div className="mt-10 max-w-3xl soft-panel p-2 md:p-3">
            <div className="px-4 md:px-5">
              <FaqAccordion items={HOME_FAQ} />
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}

export function ContactCtaSection() {
  return (
    <Section className="relative overflow-hidden film-grain !pt-10 md:!pt-14">
      <div className="pointer-events-none absolute inset-0 glow-mesh opacity-90" aria-hidden />
      <Container className="relative">
        <ScrollReveal variant="up">
          <div className="soft-panel relative overflow-hidden p-8 md:p-12 lg:p-14">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-synapz-impulse/15 blur-3xl"
              aria-hidden
            />
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center relative">
              <div className="lg:col-span-8 space-y-3">
                <p className="eyebrow text-synapz-impulse">Próximo passo</p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-[2.85rem] text-balance leading-tight">
                  Pronto para sua marca{" "}
                  <span className="impulse-word">vender mais</span> com presença
                  digital clara?
                </h2>
                <p className="text-synapz-signal max-w-md text-pretty">
                  Conte o momento da empresa. Em poucos minutos alinhamos
                  escopo, caminho e próximos passos — sem template, com
                  direção.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <Button href={CTA.primary.href} variant="pill" size="lg">
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
