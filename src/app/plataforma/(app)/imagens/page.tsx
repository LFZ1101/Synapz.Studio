"use client";

import { useMemo, useState } from "react";
import { AiHandoff } from "@/components/plataforma/AiHandoff";
import { PageHeader } from "@/components/plataforma/PageHeader";
import { imagePromptForChatGpt } from "@/lib/plataforma/ai-handoff";

export default function ImagensPage() {
  const [brief, setBrief] = useState(
    "Hero abstrato com pontos e caminhos em verde impulso sobre preto SYNAPZ, atmosfera de conexão digital.",
  );
  const prompt = useMemo(() => imagePromptForChatGpt(brief), [brief]);

  return (
    <div>
      <PageHeader
        eyebrow="Ferramentas"
        title="Imagens com a sua IA"
        description="A plataforma monta o brief visual SYNAPZ e abre no ChatGPT da sua conta (ou Claude). Sem API DALL·E cobrada pela SYNAPZ."
      />

      <section className="platform-panel">
        <label className="block space-y-2 text-sm">
          <span>O que gerar</span>
          <textarea
            className="platform-input min-h-32 w-full"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </label>
        <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap font-mono text-xs text-synapz-signal">
          {prompt}
        </pre>
      </section>

      <AiHandoff
        prompt={prompt}
        label="Gerar imagem na sua conta"
        hint="No ChatGPT (plano com imagens), cole/envie o prompt. A SYNAPZ só prepara o pedido — o uso conta no seu ChatGPT, não numa API nossa."
      />
    </div>
  );
}
