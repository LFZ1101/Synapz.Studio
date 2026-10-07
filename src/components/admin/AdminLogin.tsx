"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Não foi possível entrar.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Falha de rede. Tente de novo.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-synapz-black px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 border border-synapz-neural/15 bg-synapz-graphite p-8"
      >
        <div>
          <p className="eyebrow text-synapz-impulse mb-3">Acesso restrito</p>
          <h1 className="font-display text-2xl text-synapz-neural">
            Painel SYNAPZ
          </h1>
          <p className="mt-2 text-sm text-synapz-signal">
            Área separada do site. Visitantes não veem nem usam esta tela.
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-secret" className="eyebrow text-synapz-signal">
            Senha admin
          </label>
          <input
            id="admin-secret"
            type="password"
            autoComplete="current-password"
            className="field-input"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            minLength={8}
          />
        </div>
        {error ? (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 w-full items-center justify-center bg-synapz-impulse px-6 text-sm font-medium text-synapz-black disabled:opacity-50"
        >
          {busy ? "Entrando…" : "Entrar no painel"}
        </button>
      </form>
    </div>
  );
}
