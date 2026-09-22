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

        {/* Desktop: horizontal track with connectors BETWEEN steps, not over numbers */}
        <ol className="mt-14 hidden md:grid md:grid-cols-6 md:gap-0">
          {integrationFlow.map((step, index) => (
            <li key={step} className="relative flex flex-col gap-3 pr-6">
              <div className="flex items-center gap-3">
                <span className="eyebrow relative z-10 bg-synapz-black pr-2 text-synapz-impulse">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < integrationFlow.length - 1 ? (
                  <span
                    className="h-px flex-1 bg-synapz-impulse/40"
                    aria-hidden
                  />
                ) : null}
              </div>
              <span className="font-display text-xl lg:text-2xl text-synapz-neural leading-tight">
                {step}
              </span>
            </li>
          ))}
        </ol>

        {/* Mobile: vertical sequence */}
        <ol className="mt-14 flex flex-col md:hidden">
          {integrationFlow.map((step, index) => (
            <li
              key={step}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <span className="eyebrow text-synapz-impulse shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < integrationFlow.length - 1 ? (
                  <span
                    className="mt-2 w-px flex-1 min-h-6 bg-synapz-impulse/40"
                    aria-hidden
                  />
                ) : null}
              </div>
              <span className="font-display text-xl text-synapz-neural pt-0.5">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
