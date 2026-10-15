"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  eyebrow = "Acesse sua conta",
  title,
  titleAccent,
  description,
  children,
  footer,
  visualEyebrow = "SYNAPZ STUDIO / OPERATING SYSTEM",
  visualTitle = "Bem-vindo de volta.",
  visualDescription = "Sua central continua exatamente do ponto em que você parou.",
}: {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  visualEyebrow?: string;
  visualTitle?: string;
  visualDescription?: string;
}) {
  const [before, after] = titleAccent
    ? [title.replace(titleAccent, "").trimEnd(), titleAccent]
    : [title, null];

  return (
    <div className="sz-auth">
      <div className="sz-auth-frame">
        <section className="sz-auth-form-side">
          <div className="sz-auth-shell">
            <header className="sz-auth-header">
              <Link href="/" className="sz-auth-logo">
                <Image
                  src="/brand/logo-principal.png"
                  alt="SYNAPZ STUDIO"
                  width={168}
                  height={46}
                  className="h-9 w-auto"
                  priority
                />
              </Link>
            </header>

            <span className="sz-auth-eyebrow">{eyebrow}</span>
            <h1 className="sz-auth-title">
              {before}
              {after ? (
                <>
                  {" "}
                  <em>{after}</em>
                </>
              ) : null}
            </h1>
            <p className="sz-auth-desc">{description}</p>

            <div className="sz-auth-body">{children}</div>

            {footer ? <div className="sz-auth-footer">{footer}</div> : null}

            <p className="sz-auth-signature">
              Estratégia, design e tecnologia em conexão.
            </p>
          </div>
        </section>

        <aside className="sz-auth-visual" aria-hidden>
          <div className="sz-auth-visual-glow" />
          <div className="sz-auth-visual-grid" />
          <div className="sz-auth-visual-copy">
            <p className="sz-auth-visual-eyebrow">{visualEyebrow}</p>
            <h2 className="sz-auth-visual-title">{visualTitle}</h2>
            <p className="sz-auth-visual-desc">{visualDescription}</p>
          </div>
          <div className="sz-auth-visual-status">
            <span className="sz-auth-status-dot" />
            Ambiente protegido
          </div>
        </aside>

        <div className="sz-auth-divider" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
