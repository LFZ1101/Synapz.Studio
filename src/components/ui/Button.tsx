import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "impulse";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-synapz-neural text-synapz-black hover:bg-white border border-transparent shadow-[0_10px_40px_-24px_rgba(236,237,231,0.55)]",
  secondary:
    "bg-transparent text-synapz-neural border border-synapz-neural/20 hover:border-synapz-impulse/70 hover:bg-synapz-impulse/[0.04]",
  ghost:
    "bg-transparent text-synapz-signal hover:text-synapz-neural border border-transparent",
  impulse:
    "bg-synapz-impulse text-synapz-black hover:brightness-110 border border-transparent shadow-[0_16px_50px_-28px_rgba(183,255,0,0.85)]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-sm md:text-base",
  lg: "h-14 px-8 text-base",
};

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  impulse?: boolean;
};

type ButtonAsButton = Common &
  ComponentProps<"button"> & {
    href?: undefined;
  };

type ButtonAsLink = Common &
  Omit<ComponentProps<typeof Link>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  impulse = true,
  ...props
}: ButtonProps) {
  const classes = cn(
    "btn-impulse inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-[color,background-color,border-color,filter,box-shadow,transform] duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.985]",
    impulse && "btn-impulse",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        <span>{children}</span>
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      <span>{children}</span>
    </button>
  );
}
