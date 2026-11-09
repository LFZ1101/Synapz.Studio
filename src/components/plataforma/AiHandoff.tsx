"use client";

import { useState } from "react";
import {
  chatGptUrl,
  claudeUrl,
  cursorComposerHint,
} from "@/lib/plataforma/ai-handoff";

type Props = {
  prompt: string;
  label?: string;
  hint?: string;
};

export function AiHandoff({
  prompt,
  label = "Rodar com a sua IA",
  hint = "Usa a conta que você já tem (ChatGPT, Claude ou Cursor). A SYNAPZ não paga API e não guarda chave desses serviços neste fluxo.",
}: Props) {
  const [copied, setCopied] = useState<"prompt" | "cursor" | null>(null);
  const ready = prompt.trim().length > 0;

  async function copy(text: string, kind: "prompt" | "cursor") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1600);
  }

  function downloadMd() {
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "synapz-prompt.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function openChatGpt() {
    await copy(prompt, "prompt");
    window.open(chatGptUrl(prompt), "_blank", "noopener,noreferrer");
  }

  async function openClaude() {
    await copy(prompt, "prompt");
    window.open(claudeUrl(prompt), "_blank", "noopener,noreferrer");
  }

  async function prepareCursor() {
    await copy(cursorComposerHint(prompt), "cursor");
  }

  if (!ready) return null;

  return (
    <div className="platform-panel mt-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-sm text-synapz-signal">{hint}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="platform-btn" onClick={openChatGpt}>
          Abrir no ChatGPT
        </button>
        <button type="button" className="platform-btn-ghost" onClick={openClaude}>
          Abrir no Claude
        </button>
        <button type="button" className="platform-chip" onClick={prepareCursor}>
          {copied === "cursor" ? "Copiado p/ Cursor" : "Copiar p/ Cursor"}
        </button>
        <button
          type="button"
          className="platform-chip"
          onClick={() => copy(prompt, "prompt")}
        >
          {copied === "prompt" ? "Prompt copiado" : "Só copiar prompt"}
        </button>
        <button type="button" className="platform-chip" onClick={downloadMd}>
          Baixar .md
        </button>
      </div>
      <p className="mt-3 text-xs text-synapz-signal">
        ChatGPT/Claude abrem com o texto no composer (faça login se pedir). Cursor não tem link
        público de chat — por isso copiamos o prompt pronto para colar no Composer/Agent.
      </p>
    </div>
  );
}
