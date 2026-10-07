import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ConnectionNetwork } from "@/components/animations/ConnectionNetwork";
import { CTA, SITE } from "@/content/site";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24 md:pt-28">
      <div className="absolute inset-0 opacity-45">
        <ConnectionNetwork />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_12%_18%,rgba(183,255,0,0.10),transparent_70%)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-synapz-black/20 via-transparent to-synapz-black pointer-events-none" />

      <Container
        wide
        className="relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-center pb-16"
      >
        <div className="max-w-4xl space-y-7 md:space-y-8">
          <div className="inline-flex items-center gap-3">
            <span
              className="h-1.5 w-1.5 rounded-full bg-synapz-impulse motion-safe:animate-[pulse-dot_2.8s_ease-in-out_infinite]"
              aria-hidden
            />
            <Eyebrow accent>
              {SITE.identification.type} · {SITE.identification.pillars}
            </Eyebrow>
          </div>

          <h1 className="font-display text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.05rem] leading-[1.03] text-balance">
            {SITE.headline}
          </h1>

          <p className="max-w-xl text-base md:text-lg leading-relaxed text-synapz-signal text-pretty">
            {SITE.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
            <Button href={CTA.primary.href} variant="impulse" size="lg">
              {CTA.primary.label}
            </Button>
            <Button href={CTA.secondary.href} variant="secondary" size="lg">
              {CTA.secondary.label}
            </Button>
          </div>
        </div>

        <div className="mt-16 md:mt-20 flex items-center gap-3 text-synapz-signal">
          <span
            className="flex h-9 w-5 items-start justify-center rounded-full border border-synapz-neural/20 pt-1.5"
            aria-hidden
          >
            <span className="h-1.5 w-px bg-synapz-impulse motion-safe:animate-[scroll-cue_1.6s_ease-in-out_infinite]" />
          </span>
          <span className="eyebrow">Role para explorar</span>
        </div>
      </Container>
    </section>
  );
}
