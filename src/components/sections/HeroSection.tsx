import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ConnectionNetwork } from "@/components/animations/ConnectionNetwork";
import { CTA, SITE } from "@/content/site";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24 md:pt-28">
      <div className="absolute inset-0 opacity-60">
        <ConnectionNetwork />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-synapz-black/20 via-transparent to-synapz-black pointer-events-none" />

      <Container
        wide
        className="relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-center pb-16"
      >
        <div className="max-w-4xl space-y-8">
          <Eyebrow accent>
            {SITE.identification.type} · {SITE.identification.pillars}
          </Eyebrow>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.1rem] leading-[1.05] text-balance">
            {SITE.headline}
          </h1>

          <p className="max-w-xl text-base md:text-lg leading-relaxed text-synapz-signal">
            Estratégia, conteúdo, campanha e site — conectados em uma única
            direção.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button href={CTA.primary.href} variant="impulse" size="lg">
              {CTA.primary.label}
            </Button>
            <Button href="/servicos" variant="secondary" size="lg">
              Ver serviços
            </Button>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3 text-synapz-signal">
          <span className="h-8 w-px bg-synapz-impulse" aria-hidden />
          <span className="eyebrow">Role para explorar</span>
        </div>
      </Container>
    </section>
  );
}
