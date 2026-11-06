import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { ClientAvatarStack } from "@/components/ui/ClientAvatarStack";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CTA } from "@/content/site";
import { clients } from "@/content/clients";

export function ManifestoSection() {
  const brandCount = clients.filter((c) => c.published).length;

  return (
    <Section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-synapz-impulse/35 to-transparent"
        aria-hidden
      />
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-end">
          <div className="lg:col-span-7">
            <ScrollReveal variant="fade" delay={0}>
              <p className="eyebrow text-synapz-impulse mb-6">Pense nisso</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={80}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance max-w-3xl">
                A percepção de valor está totalmente ligada ao{" "}
                <span className="impulse-word">visual</span>.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={140}>
              <div className="mt-6">
                <ClientAvatarStack
                  count={4}
                  label={`+${brandCount} marcas acompanhadas`}
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <ScrollReveal variant="up" delay={120}>
              <p className="text-base md:text-lg leading-relaxed text-synapz-signal text-pretty">
                Você pode ter um ótimo serviço e potencial para crescer muito mais.
                Mas se a presença digital não passa confiança, não valoriza o que
                você faz e não deixa claro por que escolher você, oportunidade fica
                pelo caminho.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={180}>
              <p className="text-sm md:text-base leading-relaxed text-synapz-neural/80 text-pretty">
                A SYNAPZ faz seu negócio parecer tão bom quanto ele realmente é —
                marca, conteúdo, campanha e tecnologia na mesma direção.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={220}>
              <Button href={CTA.primary.href} variant="pill" size="md">
                {CTA.primary.label}
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
