# SYNAPZ STUDIO — Site institucional

Estúdio digital brasileiro que conecta estratégia, marketing, criatividade, design e tecnologia.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (disponível; animações principais em CSS/Canvas)
- Zod (validação do formulário)

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run lint
npm run build
npm start
```

## Conteúdo

- Dados centralizados em `src/content/`
- Projetos: adicione itens em `src/content/projects.ts` (não inventar clientes)
- Contatos e redes: `src/content/site.ts` ou variáveis `NEXT_PUBLIC_*`
- Formulário: configure `CONTACT_WEBHOOK_URL` ou `RESEND_API_KEY` + `CONTACT_TO_EMAIL`

## Identidade

Logos oficiais em `public/brand/` (extraídos do Manual de Identidade Visual V1.0).

## SEO

- `robots.ts` — Googlebot, Bingbot, OAI-SearchBot liberados
- `sitemap.ts` — atualiza com serviços e projetos publicados
- JSON-LD em páginas principais
- Metadados por rota

## Publicação

1. Definir domínio real em `NEXT_PUBLIC_SITE_URL`
2. Preencher e-mail, WhatsApp e redes oficiais
3. Configurar envio do formulário
4. Adicionar estudos de caso reais
5. Enviar sitemap ao Search Console / Bing Webmaster
