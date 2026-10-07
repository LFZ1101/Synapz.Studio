import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function ManifestoSection() {
  return (
    <Section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-synapz-impulse/35 to-transparent"
        aria-hidden
      />
      <Container>
        <ScrollReveal variant="fade" delay={0}>
          <p className="eyebrow text-synapz-impulse mb-6">Por que a SYNAPZ</p>
        </ScrollReveal>
        <ScrollReveal variant="mask" delay={80}>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance max-w-3xl">
            Peças isoladas não sustentam uma presença digital.
          </h2>
        </ScrollReveal>
        <ScrollReveal variant="up" delay={180}>
          <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-synapz-signal text-pretty">
            Marca, conteúdo, campanha e tecnologia precisam falar a mesma língua.
            A SYNAPZ organiza essas frentes em um único processo — para o que a
            empresa comunica e o que as pessoas experimentam seguirem juntos.
          </p>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
