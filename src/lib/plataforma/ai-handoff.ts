/** Hand-off para IAs que o usuário já usa — sem API paga da plataforma. */

const MAX_Q = 5500;

export function truncateForUrl(text: string, max = MAX_Q) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 40)}\n\n[…texto truncado — cole o restante do clipboard]`;
}

export function chatGptUrl(prompt: string) {
  return `https://chatgpt.com/?q=${encodeURIComponent(truncateForUrl(prompt))}`;
}

export function claudeUrl(prompt: string) {
  return `https://claude.ai/new?q=${encodeURIComponent(truncateForUrl(prompt))}`;
}

export function imagePromptForChatGpt(brief: string) {
  return [
    "Gere uma imagem profissional para a marca SYNAPZ STUDIO.",
    "Paleta: fundo escuro #050605, acento verde impulso #B7FF00, texto claro #ECEDE7.",
    "Estilo: limpo, tecnológico, pontos/conexões, sem logotipo inventado e sem texto ilegível.",
    "",
    "Brief da imagem:",
    brief.trim(),
  ].join("\n");
}

export function sitePromptForAi(briefJsonOrText: string) {
  return [
    "Você é front-end sênior ajudando a SYNAPZ STUDIO.",
    "Com base no brief abaixo, produza:",
    "1) Estrutura de páginas/seções",
    "2) Copy em português do Brasil",
    "3) Sugestão de componentes React/Next.js + Tailwind",
    "4) Tokens de cor SYNAPZ (#050605, #B7FF00, #ECEDE7, #121412, #898D86)",
    "Não invente clientes ou métricas. Código limpo e pronto para colar.",
    "",
    "Brief:",
    briefJsonOrText.trim(),
  ].join("\n");
}

export function cursorComposerHint(prompt: string) {
  return [
    "Como usar no Cursor (Composer / Agent):",
    "1) O texto já está no clipboard (ou baixe o .md).",
    "2) Abra o Cursor no projeto.",
    "3) Abra o Composer/Agent (atalho do seu setup).",
    "4) Cole o prompt e rode.",
    "",
    "— Prompt SYNAPZ —",
    prompt.trim(),
  ].join("\n");
}
