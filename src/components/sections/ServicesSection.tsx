import Link from "next/link";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { nuclei } from "@/content/services";

const HOME_BLURB: Record<string, string> = {
  marca:
    "Para marcas que precisam de identidade, conteúdo e presença consistentes.",
  web: "Para quem precisa de sites, páginas ou sistemas claros e funcionais.",
  marketing:
    "Para ideias que precisam virar campanha — conceito, peças e páginas.",
};

const HOME_ITEMS: Record<string, string[]> = {
  marca: [
    "identidade e estratégia de conteúdo",
    "social media",
    "vídeo e materiais",
  ],
  web: ["sites e landing pages", "lojas virtuais", "sistemas personalizados"],
  marketing: [
    "conceito e peças",
    "páginas de campanha",
    "otimização",
  ],
};

export function ServicesSection() {
  return (
    <Section id="servicos">
      <Container>
        <div className="max-w-2xl">
          <ScrollReveal variant="fade">
            <p className="eyebrow text-synapz-impulse mb-4">Serviços</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={60}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
              O que sua marca precisa, trabalhando em conjunto.
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={120}>
            <p className="mt-5 text-synapz-signal leading-relaxed text-pretty">
              Dá para contratar uma entrega pontual ou conectar diferentes
              frentes — marca e conteúdo, web e tecnologia, marketing e
              campanhas — sob a mesma direção.
            </p>
          </ScrollReveal>
        </div>

        <ul className="mt-12 md:mt-14 divide-y divide-synapz-neural/10 border-y border-synapz-neural/10">
          {nuclei.map((nucleus, index) => (
            <ScrollReveal key={nucleus.id} variant="up" delay={index * 70}>
              <li className="grid gap-4 py-8 md:grid-cols-12 md:items-start md:gap-8">
                <p className="eyebrow text-synapz-impulse md:col-span-2">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="md:col-span-4 space-y-2">
                  <h3 className="font-display text-2xl text-synapz-neural">
                    {nucleus.title}
                  </h3>
                  <p className="text-sm text-synapz-signal leading-relaxed">
                    {HOME_BLURB[nucleus.id]}
                  </p>
                </div>
                <ul className="md:col-span-4 space-y-2 text-sm text-synapz-signal">
                  {(HOME_ITEMS[nucleus.id] ?? []).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-synapz-impulse" aria-hidden>
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="md:col-span-2 md:justify-self-end">
                  <Link
                    href={nucleus.href}
                    className="inline-flex min-h-11 items-center text-sm text-synapz-impulse hover:underline underline-offset-4"
                  >
                    Ver área →
                  </Link>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ul>

        <ScrollReveal variant="fade" delay={100}>
          <p className="mt-8">
            <Link href="/servicos" className="text-link text-sm">
              Ver todos os serviços →
            </Link>
          </p>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
