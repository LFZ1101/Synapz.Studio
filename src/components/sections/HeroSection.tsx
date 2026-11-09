import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { CTA, SITE } from "@/content/site";

const HERO_WORKS = [
  {
    src: "/media/projects/branding/syelle/cover.webp",
    alt: "Capa do estudo de caso Syelle Joias — identidade visual",
    name: "Syelle Joias",
    area: "Identidade visual",
    priority: true,
  },
  {
    src: "/media/projects/branding/viane/cover.webp",
    alt: "Capa do estudo de caso Viane Brasil — identidade visual",
    name: "Viane Brasil",
    area: "Identidade visual",
    priority: false,
  },
  {
    src: "/media/projects/web/dunamis/cover.webp",
    alt: "Capa do estudo de caso Dunamis Wear — e-commerce",
    name: "Dunamis Wear",
    area: "E-commerce",
    priority: false,
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-28 pb-16 md:pb-20">
      <Container wide className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:items-center min-h-[calc(100svh-8rem)]">
          <div className="lg:col-span-6 space-y-7 md:space-y-8">
            <div className="inline-flex items-center gap-3">
              <span
                className="h-1.5 w-1.5 rounded-full bg-synapz-impulse"
                aria-hidden
              />
              <Eyebrow accent>{SITE.identification.type}</Eyebrow>
            </div>

            <h1 className="font-display text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[3.75rem] leading-[1.04] text-balance">
              {SITE.headline}
            </h1>

            <p className="max-w-xl text-base md:text-lg leading-relaxed text-synapz-signal text-pretty">
              {SITE.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
              <Button
                href={CTA.primary.href}
                variant="impulse"
                size="lg"
                className="w-full sm:w-auto min-h-11"
              >
                {CTA.primary.label}
              </Button>
              <Button
                href={CTA.secondary.href}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto min-h-11"
              >
                {CTA.secondary.label}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ul className="grid grid-cols-2 gap-3 sm:gap-4">
              <li className="col-span-2 sm:col-span-1 sm:row-span-2">
                <HeroWorkCard work={HERO_WORKS[0]} tall />
              </li>
              <li>
                <HeroWorkCard work={HERO_WORKS[1]} />
              </li>
              <li>
                <HeroWorkCard work={HERO_WORKS[2]} />
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeroWorkCard({
  work,
  tall = false,
}: {
  work: (typeof HERO_WORKS)[number];
  tall?: boolean;
}) {
  return (
    <figure
      className={`group relative overflow-hidden border border-synapz-neural/10 bg-synapz-graphite ${
        tall ? "aspect-[4/5] sm:h-full sm:min-h-[28rem]" : "aspect-[16/11]"
      }`}
    >
      <Image
        src={work.src}
        alt={work.alt}
        fill
        priority={work.priority}
        className="object-contain p-2 sm:p-3 transition duration-700 group-hover:scale-[1.02]"
        sizes={
          tall
            ? "(max-width:640px) 100vw, (max-width:1024px) 50vw, 28vw"
            : "(max-width:640px) 50vw, (max-width:1024px) 25vw, 18vw"
        }
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-synapz-black/90 via-synapz-black/40 to-transparent p-3 sm:p-4">
        <p className="font-display text-sm sm:text-base text-synapz-neural leading-tight">
          {work.name}
        </p>
        <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-synapz-signal">
          {work.area}
        </p>
      </figcaption>
    </figure>
  );
}
