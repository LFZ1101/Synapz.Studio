import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "principal" | "compacta" | "icone";
  className?: string;
  priority?: boolean;
  href?: string | null;
};

const dimensions = {
  principal: { width: 200, height: 55, src: "/brand/logo-principal.png" },
  compacta: { width: 160, height: 44, src: "/brand/logo-compacta.png" },
  icone: { width: 40, height: 34, src: "/brand/simbolo.png" },
} as const;

export function Logo({
  variant = "principal",
  className,
  priority = false,
  href = "/",
}: LogoProps) {
  const dim = dimensions[variant];
  const image = (
    <Image
      src={dim.src}
      alt="SYNAPZ STUDIO"
      width={dim.width}
      height={dim.height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
      sizes={
        variant === "icone"
          ? "40px"
          : "(max-width: 768px) 140px, 200px"
      }
    />
  );

  if (href === null) return image;

  return (
    <Link
      href={href}
      className="inline-flex items-center focus-visible:outline-offset-4"
      aria-label="SYNAPZ STUDIO — página inicial"
    >
      {image}
    </Link>
  );
}

export function SymbolMark({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/brand/simbolo.png"
      alt=""
      width={size}
      height={Math.round(size * 0.85)}
      className={cn("h-auto w-auto", className)}
      aria-hidden
    />
  );
}
