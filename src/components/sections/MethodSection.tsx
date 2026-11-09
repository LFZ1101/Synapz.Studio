"use client";

import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { methodSteps } from "@/content/studio";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Six-step method with scroll-activated progress —
 * visual language inspired by JorgeWebPro timeline, SYNAPZ palette.
 */
export function MethodSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll("[data-step]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.step ?? 0,
            );
            setActive(index);
          }
        });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0.1 },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="metodo" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-10 top-24 hidden h-64 w-64 opacity-[0.07] md:block"
        aria-hidden
      >
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 36 }).map((_, i) => (
            <span
              key={i}
              className="aspect-square bg-synapz-impulse"
              style={{ opacity: 0.35 + ((i * 7) % 10) / 20 }}
            />
          ))}
        </div>
      </div>

      <Container>
        <div className="max-w-2xl">
          <ScrollReveal variant="fade">
            <p className="eyebrow text-synapz-impulse mb-4">Método</p>
          </ScrollReveal>
          <ScrollReveal variant="mask" delay={70}>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08]">
              Do contato inicial à entrega:{" "}
              <span className="impulse-word">seis passos</span>.
            </h2>
            <p className="mt-4 text-synapz-signal max-w-xl text-pretty">
              Etapas claras — do entendimento do negócio à evolução contínua.
            </p>
          </ScrollReveal>
        </div>

        {/* Desktop: 2×3 editorial grid with progress line */}
        <div ref={ref} className="mt-12 md:mt-16">
          <div className="relative hidden md:block">
            <div
              className="absolute left-0 right-0 top-[1.15rem] h-px bg-synapz-neural/15"
              aria-hidden
            />
            <div
              className="absolute left-0 top-[1.15rem] h-px bg-synapz-impulse transition-all duration-500"
              style={{
                width: `${((active + 1) / methodSteps.length) * 100}%`,
              }}
              aria-hidden
            />

            <ol className="grid grid-cols-3 gap-x-8 gap-y-14">
              {methodSteps.map((step, index) => {
                const on = active >= index;
                return (
                  <li key={step.number} data-step={index} className="relative">
                    <span
                      className={cn(
                        "relative z-[1] mb-5 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors duration-300",
                        on
                          ? "border-synapz-impulse bg-synapz-impulse text-synapz-black"
                          : "border-synapz-neural/25 bg-synapz-black text-synapz-signal",
                      )}
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <ScrollReveal variant="up" delay={40}>
                      <p
                        className={cn(
                          "eyebrow mb-2",
                          on ? "text-synapz-impulse" : "text-synapz-signal",
                        )}
                      >
                        {step.number}
                      </p>
                      <h3
                        className={cn(
                          "font-display text-xl md:text-2xl transition-colors",
                          on ? "text-synapz-neural" : "text-synapz-signal",
                        )}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          "mt-3 text-sm md:text-base leading-relaxed max-w-xs transition-colors",
                          on ? "text-synapz-signal" : "text-synapz-signal/55",
                        )}
                      >
                        {step.description}
                      </p>
                    </ScrollReveal>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Mobile vertical timeline */}
          <ol className="relative space-y-8 md:hidden">
            <div
              className="absolute left-[11px] top-3 bottom-3 w-px bg-synapz-neural/15"
              aria-hidden
            />
            <div
              className="absolute left-[11px] top-3 w-px bg-synapz-impulse transition-all duration-500"
              style={{
                height: `${((active + 1) / methodSteps.length) * 100}%`,
                maxHeight: "calc(100% - 1.5rem)",
              }}
              aria-hidden
            />
            {methodSteps.map((step, index) => {
              const on = active >= index;
              return (
                <li key={step.number} data-step={index} className="relative pl-10">
                  <span
                    className={cn(
                      "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border text-[0.65rem] font-medium",
                      on
                        ? "border-synapz-impulse bg-synapz-impulse text-synapz-black"
                        : "border-synapz-neural/30 bg-synapz-black text-synapz-signal",
                    )}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <p className={cn("eyebrow mb-1", on && "text-synapz-impulse")}>
                    {step.number}
                  </p>
                  <h3 className="font-display text-xl text-synapz-neural">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-synapz-signal leading-relaxed">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
