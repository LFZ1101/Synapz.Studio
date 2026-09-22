import { Container, Section, SectionHeading } from "@/components/ui/Layout";
import { integrationFlow } from "@/content/studio";

export function IntegrationSection() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Integração"
          title="Uma empresa. Diferentes competências. Uma única direção."
          description="Podemos entrar em um ponto específico ou assumir uma jornada completa. Uma campanha pode começar na estratégia, ganhar identidade e conteúdo, virar vídeo, chegar às redes sociais, direcionar para uma landing page e terminar em uma experiência digital criada sob medida. É nesse encontro que a SYNAPZ acontece."
        />

        <ol className="mt-14 flex flex-col gap-0 md:flex-row md:flex-wrap md:items-stretch">
          {integrationFlow.map((step, index) => (
            <li
              key={step}
              className="relative flex md:flex-1 md:min-w-[140px] items-center gap-4 border-l border-synapz-impulse/60 pl-5 py-4 md:border-l-0 md:border-t md:pl-0 md:pt-6 md:flex-col md:items-start md:gap-3"
            >
              <span className="eyebrow text-synapz-impulse">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl md:text-2xl text-synapz-neural">
                {step}
              </span>
              {index < integrationFlow.length - 1 ? (
                <span
                  className="hidden md:block absolute right-0 top-8 h-px w-8 bg-synapz-impulse/50 translate-x-1/2"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
