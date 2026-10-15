import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="platform-auth">
      <div className="platform-auth-panel">
        <Link href="/" className="mb-8 inline-flex min-w-[120px]">
          <Image
            src="/brand/logo-principal.png"
            alt="SYNAPZ STUDIO"
            width={160}
            height={44}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <p className="eyebrow mb-3">Plataforma operacional</p>
        <h1 className="font-display text-3xl text-synapz-neural">{title}</h1>
        <p className="mt-2 text-sm text-synapz-signal">{description}</p>
        <div className="mt-8">{children}</div>
        {footer ? <div className="mt-6 text-sm text-synapz-signal">{footer}</div> : null}
        <p className="mt-10 text-xs text-synapz-signal">
          Estratégia, design e tecnologia em conexão.
        </p>
      </div>
    </div>
  );
}
