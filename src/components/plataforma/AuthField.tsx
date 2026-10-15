"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";

export function AuthField({
  label,
  index,
  icon,
  children,
  showPasswordToggle,
  ...input
}: {
  label: string;
  index: string;
  icon: ReactNode;
  children?: ReactNode;
  showPasswordToggle?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const type =
    showPasswordToggle && input.type === "password"
      ? visible
        ? "text"
        : "password"
      : input.type;

  return (
    <label className="sz-auth-field">
      <span className="sz-auth-field-label" data-index={index}>
        {label}
      </span>
      <span className="sz-auth-input">
        <i className="sz-auth-input-icon" aria-hidden>
          {icon}
        </i>
        <span className="sz-auth-input-control">
          <input {...input} type={type} />
        </span>
        {showPasswordToggle ? (
          <button
            type="button"
            className="sz-auth-eye"
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? "ocultar" : "mostrar"}
          </button>
        ) : null}
        {children}
      </span>
    </label>
  );
}

export function IconMail() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
    </svg>
  );
}

export function IconLock() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V6Zm3 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
    </svg>
  );
}

export function IconUser() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5Z" />
    </svg>
  );
}

export function IconKey() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M14 8a4 4 0 1 0-3.9 4.8L4 19v3h3l1.2-1.2L9.5 22H12l1.8-1.8L15 22h3v-3l-5.1-5.1A4 4 0 0 0 14 8Zm-4 0a2 2 0 1 1 2 2 2 2 0 0 1-2-2Z" />
    </svg>
  );
}

export function AuthSubmit({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className="sz-auth-submit">
      <span>{children}</span>
      <i aria-hidden>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M13.2 5.2 19 11H4v2h15l-5.8 5.8 1.4 1.4L22.8 12 14.6 3.8l-1.4 1.4Z" />
        </svg>
      </i>
    </button>
  );
}
