import type { ReactNode } from "react";

export function Field({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5" htmlFor={name}>
      <span className="text-sm text-synapz-neural">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-synapz-signal">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`platform-input w-full ${props.className ?? ""}`} />;
}

export function TextSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`platform-input w-full ${props.className ?? ""}`} />;
}

export function TextTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={`platform-input min-h-24 w-full ${props.className ?? ""}`} />
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-wrap gap-3">{children}</div>;
}

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 border border-synapz-danger/40 bg-synapz-danger/10 px-3 py-2 text-sm text-synapz-neural">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 border border-synapz-impulse/40 bg-synapz-impulse/10 px-3 py-2 text-sm text-synapz-neural">
      {message}
    </div>
  );
}
