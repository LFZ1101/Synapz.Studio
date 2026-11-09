import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ClientAvatarStack } from "@/components/ui/ClientAvatarStack";
import { ConnectionNetwork } from "@/components/animations/ConnectionNetwork";
import { CTA, SITE } from "@/content/site";
import { clients } from "@/content/clients";

function Headline() {
  const accent = SITE.headlineAccent;
  const full = SITE.headline;
  if (!accent || !full.includes(accent)) {
    return <>{full}</>;
  }
  const [before, after] = full.split(accent);
  return (
    <>
      {before}
      <span className="impulse-word">{accent}</span>
      {after}
    </>
  );
}

export function HeroSection() {
  const brandCount = clients.filter((c) => c.published).length;

  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24 md:pt-28 film-grain">
      <div className="absolute inset-0 opacity-40">
        <ConnectionNetwork />
      </div>
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_12%_18%,rgba(183,255,0,0.14),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_85%_70%,rgba(183,255,0,0.06),transparent_70%)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-synapz-black/10 via-transparent to-synapz-black pointer-events-none" />

      <Container
        wide
        className="relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-center pb-16"
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="max-w-4xl space-y-7 md:space-y-8 lg:col-span-8">
            <div className="inline-flex items-center gap-3">
              <span
                className="h-1.5 w-1.5 rounded-full bg-synapz-impulse motion-safe:animate-[pulse-dot_2.8s_ease-in-out_infinite]"
                aria-hidden
              />
              <Eyebrow accent>
                {SITE.identification.type} · {SITE.identification.pillars}
              </Eyebrow>
            </div>

            <h1 className="font-display text-[2.45rem] sm:text-5xl md:text-6xl lg:text-[4.15rem] leading-[1.02] text-balance">
              <Headline />
            </h1>

            <p className="max-w-xl text-base md:text-lg leading-relaxed text-synapz-signal text-pretty">
              {SITE.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
              <Button
                href={CTA.primary.href}
                variant="pill"
                size="lg"
                className="w-full sm:w-auto"
              >
                {CTA.primary.label}
              </Button>
              <Button
                href={CTA.secondary.href}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto rounded-full"
              >
                {CTA.secondary.label}
              </Button>
            </div>

            <ClientAvatarStack
              count={5}
              label={`+${brandCount} marcas acompanhadas`}
              className="pt-2"
            />
          </div>

          <aside className="hidden lg:col-span-4 lg:block">
            <div className="soft-panel relative overflow-hidden p-6 xl:p-7">
              <p className="eyebrow text-synapz-impulse mb-4">Do zero</p>
              <p className="font-display text-2xl xl:text-[1.7rem] leading-tight text-synapz-neural">
                Sem template. Cada projeto nasce da essência da marca.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-synapz-signal">
                Estratégia, design e tecnologia alinhados para uma presença
                impossível de confundir.
              </p>
              <div className="mt-6 impulse-hairline" aria-hidden />
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-synapz-signal">
                Marca · Web · Campanhas
              </p>
            </div>
          </aside>
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
