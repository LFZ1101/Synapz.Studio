import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { nuclei } from "@/content/services";
import Link from "next/link";

const HOME_SERVICE_PREVIEW: Record<string, string[]> = {
  marca: [
    "estratégia de conteúdo",
    "social media",
    "vídeo e motion",
    "materiais publicitários",
  ],
  web: [
    "sites institucionais",
    "landing pages",
    "lojas virtuais",
    "sistemas personalizados",
  ],
  marketing: [
    "estratégia de campanha",
    "conceitos criativos",
    "páginas de campanha",
    "otimização",
  ],
};

const HOME_BLURB: Record<string, string> = {
  marca: "Conteúdo e identidade para marcas presentes e consistentes.",
  web: "Sites, páginas e sistemas claros, bonitos e funcionais.",
  marketing: "Campanhas que conectam ideia, mídia e conversão.",
};

export function ServicesSection() {
  return (
    <Section tone="graphite" id="servicos">
      <Container>
        <div className="max-w-2xl">
          <ScrollReveal variant="fade">
            <p className="eyebrow text-synapz-impulse mb-4">Serviços</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={70}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
              Três núcleos. Uma direção.
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="up" delay={140}>
            <p className="mt-5 text-synapz-signal leading-relaxed">
              Marca, web e campanha — juntos ou sob demanda.
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {nuclei.map((nucleus, index) => (
            <ScrollReveal
              key={nucleus.id}
              variant="up"
              delay={index * 100}
            >
              <article className="flex h-full flex-col border border-synapz-neural/10 p-6 md:p-8 transition-colors hover:border-synapz-impulse/40">
                <span className="eyebrow text-synapz-impulse mb-5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl text-synapz-neural">
                  {nucleus.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-synapz-signal">
                  {HOME_BLURB[nucleus.id]}
                </p>
                <ul className="mt-6 space-y-2 flex-1">
                  {(HOME_SERVICE_PREVIEW[nucleus.id] ?? []).map((item) => (
                    <li
                      key={item}
                      className="border-l border-synapz-impulse/50 pl-3 text-sm text-synapz-signal"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href={nucleus.cta.href} variant="secondary" size="sm">
                    {nucleus.cta.label}
                  </Button>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="fade" delay={120}>
          <div className="mt-10">
            <Link
              href="/servicos"
              className="text-sm text-synapz-impulse hover:underline underline-offset-4"
            >
              Ver todos os serviços →
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
