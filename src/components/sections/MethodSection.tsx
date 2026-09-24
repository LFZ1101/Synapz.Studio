"use client";

import { Container, Section } from "@/components/ui/Layout";
import { methodSteps } from "@/content/studio";
import { useEffect, useRef, useState } from "react";

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
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="metodo">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow text-synapz-impulse mb-4">Método</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08]">
            Seis etapas. Uma linha.
          </h2>
        </div>

        <div ref={ref} className="mt-12 relative">
          <div
            className="absolute left-[11px] top-3 bottom-3 w-px bg-synapz-neural/15 md:left-1/2 md:-translate-x-px"
            aria-hidden
          />
          <div
            className="absolute left-[11px] top-3 w-px bg-synapz-impulse transition-all duration-500 md:left-1/2 md:-translate-x-px"
            style={{
              height: `${((active + 1) / methodSteps.length) * 100}%`,
              maxHeight: "calc(100% - 1.5rem)",
            }}
            aria-hidden
          />

          <ol className="space-y-8 md:space-y-12">
            {methodSteps.map((step, index) => (
              <li
                key={step.number}
                data-step={index}
                className="relative grid gap-3 md:grid-cols-2 md:gap-16"
              >
                <div
                  className={`md:text-right ${index % 2 === 1 ? "md:order-2 md:text-left" : ""}`}
                >
                  <p
                    className={`eyebrow mb-2 ${active >= index ? "text-synapz-impulse" : ""}`}
                  >
                    {step.number}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl text-synapz-neural">
                    {step.title}
                  </h3>
                </div>
                <div
                  className={`pl-10 md:pl-0 ${index % 2 === 1 ? "md:order-1 md:text-right" : ""}`}
                >
                  <span
                    className={`absolute left-0 top-2 h-6 w-6 rounded-full border md:left-1/2 md:-translate-x-1/2 ${
                      active >= index
                        ? "border-synapz-impulse bg-synapz-impulse"
                        : "border-synapz-neural/30 bg-synapz-black"
                    }`}
                    aria-hidden
                  />
                  <p className="text-synapz-signal text-sm md:text-base leading-relaxed max-w-md md:inline-block">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
