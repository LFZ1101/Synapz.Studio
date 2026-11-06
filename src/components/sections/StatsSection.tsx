"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Section } from "@/components/ui/Layout";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { clients } from "@/content/clients";

type Stat = {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
};

const publishedCount = clients.filter((c) => c.published).length;

const STATS: Stat[] = [
  {
    value: publishedCount,
    suffix: "+",
    label: "Marcas acompanhadas",
  },
  {
    value: 3,
    suffix: "",
    label: "Núcleos de serviço",
  },
  {
    value: 6,
    suffix: "",
    label: "Etapas do método",
  },
  {
    value: 100,
    suffix: "%",
    label: "Projetos sob medida",
  },
];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatItem({
  stat,
  active,
  delay,
}: {
  stat: Stat;
  active: boolean;
  delay: number;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  const counted = useCountUp(stat.value, ready);

  return (
    <div className="text-center md:text-left">
      <p className="font-display text-4xl sm:text-5xl md:text-[3.25rem] leading-none tracking-tight text-synapz-neural">
        {stat.prefix}
        {counted}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-synapz-signal">{stat.label}</p>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section className="relative overflow-hidden !py-16 md:!py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(183,255,0,0.07),transparent_70%)]"
        aria-hidden
      />
      <Container className="relative">
        <ScrollReveal variant="fade">
          <div
            ref={ref}
            className="grid grid-cols-2 gap-8 border-y border-synapz-neural/10 py-10 md:grid-cols-4 md:gap-6 md:py-12"
          >
            {STATS.map((stat, index) => (
              <StatItem
                key={stat.label}
                stat={stat}
                active={active}
                delay={index * 90}
              />
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
