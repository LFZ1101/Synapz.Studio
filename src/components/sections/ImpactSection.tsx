import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CTA } from "@/content/site";

/**
 * Dramatic conversion band — JorgeWebPro "UM NOVO SITE..." energy,
 * rewritten in SYNAPZ voice and palette.
 */
export function ImpactSection() {
  return (
    <Section className="relative overflow-hidden film-grain !py-20 md:!py-28">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 glow-mesh opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-[var(--spacing-gutter)]"
        aria-hidden
      >
        <p className="watermark-type text-center text-[clamp(2.8rem,9vw,7.5rem)] uppercase">
          Um novo impulso
          <br />
          muda o jogo
        </p>
      </div>

      <Container className="relative z-[2]">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal variant="fade">
            <p className="eyebrow text-synapz-impulse mb-5">Resultado</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={60}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.05] text-balance">
              Uma presença digital forte pode fazer sua empresa{" "}
              <span className="impulse-word">vender muito mais</span>.
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={120}>
            <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-2 sm:gap-6 text-left sm:text-center">
              <p className="text-synapz-signal text-sm md:text-base leading-relaxed">
                Mais credibilidade desde a primeira visita.
              </p>
              <p className="text-synapz-signal text-sm md:text-base leading-relaxed">
                Menos visitantes perdidos. Mais decisões claras.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="fade" delay={180}>
            <div className="mt-9 flex justify-center">
              <Button href={CTA.primary.href} variant="pill" size="lg">
                {CTA.primary.label}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
