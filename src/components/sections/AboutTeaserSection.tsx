import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SITE } from "@/content/site";

export function AboutTeaserSection() {
  return (
    <Section id="sobre">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 space-y-5">
            <ScrollReveal variant="fade">
              <p className="eyebrow text-synapz-impulse">Studio</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={60}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance max-w-xl">
                Um estúdio para manter tudo alinhado.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={120}>
              <p className="max-w-lg text-synapz-signal leading-relaxed text-pretty">
                Estratégia, criação e execução no mesmo processo — para mensagem,
                conteúdo, interface e tecnologia avançarem juntos.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={180}>
              <Button href="/studio" variant="secondary" className="min-h-11">
                Conhecer o Studio
              </Button>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="up" delay={140} className="lg:col-span-5">
            <div className="aspect-[16/10] lg:aspect-[4/5] bg-synapz-graphite relative overflow-hidden border border-synapz-neural/10">
              <Image
                src={SITE.founder.photo}
                alt={`${SITE.founder.name} — ${SITE.founder.role}`}
                fill
                className="object-cover object-[center_18%]"
                sizes="(max-width:1024px) 100vw, 40vw"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-synapz-black/90 via-synapz-black/35 to-transparent pt-24">
                <div className="p-5 md:p-6 text-synapz-neural">
                  <p className="eyebrow text-synapz-signal mb-2">Fundador</p>
                  <p className="font-display text-xl md:text-2xl leading-tight">
                    {SITE.founder.name}
                  </p>
                  <p className="mt-2 text-sm text-synapz-signal leading-relaxed">
                    {SITE.founder.role}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
