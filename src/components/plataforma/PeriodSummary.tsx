"use client";

import { useState } from "react";

export function PeriodSummary({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="platform-panel mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Resumo do período</p>
          <h2 className="font-display text-xl">Compartilhar resultado</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="platform-chip" onClick={copy}>
            {copied ? "Copiado" : "Copiar texto"}
          </button>
          <button type="button" className="platform-chip" onClick={shareWhatsApp}>
            WhatsApp
          </button>
        </div>
      </div>
      <pre className="mt-4 whitespace-pre-wrap font-mono text-xs text-synapz-signal">
        {text}
      </pre>
    </div>
  );
}
