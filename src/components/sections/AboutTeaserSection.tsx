import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SITE } from "@/content/site";
import { differentials } from "@/content/studio";

export function AboutTeaserSection() {
  return (
    <Section tone="light" id="sobre">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 space-y-5">
            <ScrollReveal variant="fade">
              <p className="eyebrow text-synapz-black/50">Sobre</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={70}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-synapz-black text-balance max-w-xl">
                Um estúdio para manter tudo alinhado.
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="up" delay={140}>
              <p className="max-w-lg text-synapz-black/70 leading-relaxed text-pretty">
                Estratégia, criação e execução no mesmo processo — para mensagem,
                conteúdo, interface e tecnologia avançarem juntos.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade" delay={200}>
              <Button href="/studio" variant="primary">
                Conhecer o Studio
              </Button>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="up" delay={160} className="lg:col-span-5">
            <div className="aspect-[16/10] lg:aspect-[4/5] bg-synapz-black relative overflow-hidden border border-synapz-black/10">
              <Image
                src={SITE.founder.photo}
                alt={`${SITE.founder.name} — ${SITE.founder.role}`}
                fill
                className="object-cover object-[center_18%]"
                sizes="(max-width:1024px) 100vw, 40vw"
                priority={false}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-synapz-black/90 via-synapz-black/35 to-transparent pt-24">
                <div className="p-5 md:p-6 text-synapz-neural">
                  <p className="eyebrow text-synapz-signal mb-2">Fundador</p>
                  <p className="font-display text-xl md:text-2xl leading-tight">
                    {SITE.founder.name}
                  </p>
                  <p className="mt-2 text-sm md:text-[0.95rem] text-synapz-signal leading-relaxed">
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

export function DifferentialsSection() {
  return (
    <Section tone="graphite">
      <Container>
        <ScrollReveal variant="fade">
          <p className="eyebrow text-synapz-impulse mb-4">Diferenças</p>
        </ScrollReveal>
        <ScrollReveal variant="mask" delay={70}>
          <h2 className="font-display text-3xl md:text-4xl max-w-xl">
            O que muda quando tudo se conecta.
          </h2>
        </ScrollReveal>
        <ul className="mt-12 divide-y divide-synapz-neural/10 border-y border-synapz-neural/10">
          {differentials.map((item, index) => (
            <ScrollReveal key={item.title} variant="up" delay={index * 60}>
              <li className="grid gap-3 py-6 md:grid-cols-12 md:items-baseline">
                <span className="eyebrow text-synapz-impulse md:col-span-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl md:col-span-4">
                  {item.title}
                </h3>
                <p className="text-synapz-signal md:col-span-6 text-sm md:text-base">
                  {item.description}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function ResultsSection() {
  return null;
}
