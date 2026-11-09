import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/** Offer thesis — distinct from services list. */
export function ManifestoSection() {
  return (
    <Section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-synapz-neural/10" aria-hidden />
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ScrollReveal variant="fade">
              <p className="eyebrow text-synapz-impulse mb-5">Direção</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={60}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.08] text-balance max-w-md">
                Uma boa presença não se resolve peça por peça.
              </h2>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-7 space-y-5 max-w-2xl">
            <ScrollReveal variant="up" delay={100}>
              <p className="text-base md:text-lg leading-relaxed text-synapz-signal text-pretty">
                Identidade, site e campanha perdem força quando comunicam
                direções diferentes. Cada peça pode até parecer boa sozinha —
                e ainda assim a marca soa inconsistente.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={160}>
              <p className="text-base md:text-lg leading-relaxed text-synapz-signal text-pretty">
                A SYNAPZ define uma direção e a traduz em linguagem visual,
                conteúdo, experiência digital e comunicação. Assim, o que a
                empresa diz e o que as pessoas experimentam seguem juntos.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
