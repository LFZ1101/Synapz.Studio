import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  tone?: "impulse" | "neural" | "black" | "soft";
  size?: "sm" | "md";
};

const tones = {
  impulse: "bg-synapz-impulse text-synapz-black",
  neural: "bg-synapz-neural text-synapz-black",
  black: "bg-synapz-black text-synapz-neural",
  soft: "border border-synapz-neural/25 bg-synapz-neural/10 text-synapz-neural",
} as const;

const sizes = {
  sm: "h-7 w-7",
  md: "h-8 w-8",
} as const;

/** Compact circular arrow used on CTAs (JorgeWebPro-level polish). */
export function ArrowCircle({
  className,
  tone = "impulse",
  size = "md",
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
        tones[tone],
        sizes[size],
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="h-3.5 w-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 11.5 11.5 4.5" />
        <path d="M5.5 4.5h6v6" />
      </svg>
    </span>
  );
}
