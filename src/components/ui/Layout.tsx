import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Container({
  children,
  className,
  wide = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
}) {
  return (
    <Tag className={cn(wide ? "container-wide" : "container-synapz", className)}>
      {children}
    </Tag>
  );
}

export function Section({
  children,
  className,
  id,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "dark" | "graphite" | "light";
}) {
  const tones = {
    dark: "bg-synapz-black text-synapz-neural",
    graphite: "bg-synapz-graphite text-synapz-neural",
    light: "bg-synapz-neural text-synapz-black",
  };

  return (
    <section
      id={id}
      className={cn("py-[var(--spacing-section)]", tones[tone], className)}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <p
      className={cn(
        "eyebrow",
        accent && "text-synapz-impulse",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow accent className="mb-4">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.08] text-balance",
          light ? "text-synapz-black" : "text-synapz-neural",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-6 text-base md:text-lg leading-relaxed text-pretty",
            light ? "text-synapz-black/70" : "text-synapz-signal",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
