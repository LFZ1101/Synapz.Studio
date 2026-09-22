import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ConnectionNetwork } from "@/components/animations/ConnectionNetwork";
import { CTA, SITE } from "@/content/site";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24 md:pt-28">
      <div className="absolute inset-0 opacity-70">
        <ConnectionNetwork />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-synapz-black/20 via-transparent to-synapz-black pointer-events-none" />

      <Container wide className="relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-center pb-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow accent>{SITE.identification.type}</Eyebrow>
              <span className="text-synapz-signal/40" aria-hidden>
                /
              </span>
              <Eyebrow>{SITE.identification.pillars}</Eyebrow>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.02] text-balance max-w-4xl">
              {SITE.headline}
            </h1>

            <p className="max-w-2xl text-base md:text-lg leading-relaxed text-synapz-signal text-pretty">
              {SITE.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button href={CTA.primary.href} variant="impulse" size="lg">
                {CTA.primary.label}
              </Button>
              <Button href={CTA.secondary.href} variant="secondary" size="lg">
                {CTA.secondary.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end">
            <div className="relative aspect-[4/5] max-w-sm border border-synapz-neural/10 bg-synapz-graphite overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(183,255,0,0.08))]" />
              <div className="absolute inset-6 flex flex-col justify-between">
                <Eyebrow accent>Impulso</Eyebrow>
                <p className="font-display text-2xl md:text-3xl text-synapz-neural leading-snug">
                  Toda grande ideia começa com uma conexão.
                </p>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-synapz-impulse" />
                  <span className="eyebrow">00 / Ativar</span>
                </div>
              </div>
            </div>
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
