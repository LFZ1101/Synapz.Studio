import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { differentials } from "@/content/studio";
import { CTA } from "@/content/site";

const FEATURED = differentials.slice(0, 3);

/**
 * Curved dark shell + 3 reason cards — adapted from JorgeWebPro
 * "Por que trabalhar comigo", in SYNAPZ identity.
 */
export function WhySection() {
  return (
    <section className="relative bg-synapz-neural text-synapz-black pt-4 md:pt-6">
      <div className="curve-shell relative overflow-hidden bg-synapz-black text-synapz-neural film-grain pb-[var(--spacing-section)] pt-16 md:pt-20 lg:pt-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(183,255,0,0.10),transparent_65%)]"
          aria-hidden
        />
        <Container className="relative z-[1]">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal variant="fade">
              <p className="eyebrow text-synapz-impulse mb-4">Diferenciais</p>
            </ScrollReveal>
            <ScrollReveal variant="mask" delay={70}>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-balance">
                Por que marcas escolhem{" "}
                <span className="impulse-word">trabalhar com a SYNAPZ</span>?
              </h2>
            </ScrollReveal>
          </div>

          <ul className="mt-12 md:mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
            {FEATURED.map((item, index) => (
              <ScrollReveal key={item.title} variant="up" delay={index * 90}>
                <li className="soft-panel group flex h-full flex-col p-6 md:p-7">
                  <span className="eyebrow text-synapz-impulse mb-5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl leading-tight text-synapz-neural">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-[0.95rem] leading-relaxed text-synapz-signal flex-1">
                    {item.description}
                  </p>
                  <span
                    className="mt-6 h-px w-10 bg-synapz-impulse/50 transition-all duration-300 group-hover:w-16"
                    aria-hidden
                  />
                </li>
              </ScrollReveal>
            ))}
          </ul>

          <ScrollReveal variant="fade" delay={200}>
            <div className="mt-10 flex justify-center">
              <Button href={CTA.primary.href} variant="pill" size="lg">
                {CTA.primary.label}
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
