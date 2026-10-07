# Manutenção do site SYNAPZ STUDIO

## Textos e marca

- Dados gerais, CTAs e contato: `src/content/site.ts`
- Serviços e núcleos: `src/content/services.ts`
- Método, FAQ e opções do formulário: `src/content/studio.ts`
- Projetos (editáveis no painel): `data/projects.json` + tipos em `src/content/project-types.ts`
- Clientes: `src/content/clients.ts`

## Painel admin (só para você)

- URL: `/admin` — **não** aparece no menu público; bloqueada em `robots.txt`
- Senha: variável de ambiente `ADMIN_SECRET` (mín. 8 caracteres) em `.env.local` ou no servidor
- Visitantes do site **não** fazem login; só quem tem a senha entra no painel
- Funções: listar, criar, editar, remover projetos; upload de capas, imagens e vídeos
- Uploads vão para `public/media/projects/uploads/`
- Em hospedagem serverless (ex.: Vercel) o disco é efêmero — use VPS/`next start` ou adapte o storage depois

## Mídias

- Logos e foto do fundador: `public/brand/`
- Logos de clientes: `public/media/clients/`
- Projetos (imagens/vídeos): `public/media/projects/`
- Vídeos institucionais:
  - Intro: `public/media/videos/intro-synapz-desktop.mp4` e `intro-synapz-mobile.mp4`
  - Studio: `public/media/videos/studio-synapz.mp4`
- OG/share: `public/og/`

## Contato / WhatsApp

- Número padrão em `SITE.contact.whatsapp` (`src/content/site.ts`)
- Override por ambiente: `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`
- O formulário redireciona para WhatsApp com a mensagem preenchida

## SEO

- Metadados por página via `src/lib/seo.ts`
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`

## Identidade

- Manual: `docs/manual-identidade-synapz-studio.pdf`
- Paleta oficial: preto `#050605`, impulse `#B7FF00`, neural `#ECEDE7`, graphite `#121412`, signal `#898D86`
