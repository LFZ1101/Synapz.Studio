import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqItems } from "@/content/studio";
import { CTA } from "@/content/site";

/** Home FAQ: only the questions that unblock decision */
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
          <p className="eyebrow text-synapz-impulse mb-4">FAQ</p>
          <h2 className="font-display text-3xl sm:text-4xl leading-[1.08]">
            Perguntas rápidas.
          </h2>
        </div>
        <div className="mt-10 max-w-3xl">
          <FaqAccordion items={HOME_FAQ} />
        </div>
      </Container>
    </Section>
  );
}

export function ContactCtaSection() {
  return (
    <Section>
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center border border-synapz-neural/10 p-8 md:p-12">
          <div className="lg:col-span-8 space-y-3">
            <p className="eyebrow text-synapz-impulse">Contato</p>
            <h2 className="font-display text-3xl md:text-4xl text-balance">
              Vamos ativar a próxima conexão?
            </h2>
            <p className="text-synapz-signal max-w-md">
              Conte o momento do seu negócio. Definimos o próximo passo juntos.
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
