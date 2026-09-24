"use client";

import { cn } from "@/lib/utils";
import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";

type RevealVariant = "up" | "fade" | "mask" | "left";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  as?: ElementType;
  once?: boolean;
};

/**
 * Scroll-triggered reveal for text and blocks.
 * Intersection Observer + CSS. Reduced motion handled in CSS.
 */
export function ScrollReveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as: Tag = "div",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const timers: number[] = [];

    const reveal = () => {
      if (!cancelled) setVisible(true);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timers.push(window.setTimeout(reveal, 0));
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          if (!cancelled) setVisible(false);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "reveal",
        `reveal-${variant}`,
        visible && "reveal-in",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function ScrollStagger({
  children,
  className,
  stagger = 90,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  variant?: RevealVariant;
}) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => (
        <ScrollReveal key={index} variant={variant} delay={index * stagger}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
