import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { methodSteps } from "@/content/studio";

/** Four editorial moments — SYNAPZ own process, not a complex timeline. */
export function MethodSection() {
  return (
    <Section id="metodo" tone="graphite">
      <Container>
        <div className="max-w-2xl">
          <ScrollReveal variant="fade">
            <p className="eyebrow text-synapz-impulse mb-4">Método</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={60}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
              Clareza antes de criação. Direção até a entrega.
            </h2>
          </ScrollReveal>
        </div>

        <ol className="mt-12 md:mt-14 grid gap-0 sm:grid-cols-2 lg:grid-cols-4 border-t border-synapz-neural/10">
          {methodSteps.map((step, index) => (
            <ScrollReveal key={step.number} variant="up" delay={index * 70}>
              <li className="border-b border-synapz-neural/10 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0 p-6 md:p-7 h-full">
                <p className="eyebrow text-synapz-impulse mb-4">
                  {step.number}
                </p>
                <h3 className="font-display text-xl md:text-2xl text-synapz-neural">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-synapz-signal leading-relaxed">
                  {step.description}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
