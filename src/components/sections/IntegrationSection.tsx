import { Container, Section } from "@/components/ui/Layout";
import { integrationFlow } from "@/content/studio";

export function IntegrationSection() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow text-synapz-impulse mb-4">Integração</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
            Do primeiro impulso ao resultado.
          </h2>
          <p className="mt-5 text-synapz-signal leading-relaxed">
            Entramos em um ponto ou acompanhamos a jornada completa.
          </p>
        </div>

        <ol className="mt-12 hidden md:grid md:grid-cols-6 md:gap-0">
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
              <span className="font-display text-lg lg:text-xl text-synapz-neural leading-tight">
                {step}
              </span>
            </li>
          ))}
        </ol>

        <ol className="mt-12 flex flex-col md:hidden">
          {integrationFlow.map((step, index) => (
            <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="eyebrow text-synapz-impulse shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < integrationFlow.length - 1 ? (
                  <span
                    className="mt-2 w-px flex-1 min-h-5 bg-synapz-impulse/40"
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
