# Deploy na Hostinger (Node.js Web App)

## Pré-requisito

É necessário um plano com **Node.js** (ex.: **Business / Unlimited** ou Cloud).
Sem assinatura ativa, o hPanel só mostra “Comprar hospedagem”.

Conta usada no painel: `felipe.zambianco2005@icloud.com`.

## Variáveis de ambiente (obrigatórias)

No painel do app Node.js → Environment variables:

| Nome | Valor |
| --- | --- |
| `ADMIN_SECRET` | `Studio200573` |
| `NEXT_PUBLIC_SITE_URL` | `https://synapz.studio` (ou o domínio apontado) |
| `NODE_ENV` | `production` |

## Deploy recomendado (GitHub)

1. hPanel → **Sites** → **Adicionar site** → **Node.js web app**
2. **Import Git repository** → autorizar GitHub
3. Repositório: `LFZ1101/Synapz.Studio` · branch `main`
4. Configuração típica:
   - Framework: Next.js
   - Node: 20 ou 22
   - Build: `npm run build`
   - Output: `.next`
   - Start: `npm run start` (Hostinger usa `$PORT`)
5. Colar as variáveis acima
6. **Deploy**

Em todo `git push` na branch conectada, a Hostinger reconstrói o app.

## Admin do site

- URL: `https://SEU-DOMINIO/admin`
- Senha: valor de `ADMIN_SECRET` (`Studio200573`)
- Visitantes do site **não** fazem login

## Domínio `synapz.studio`

Hoje o DNS público aponta para **Vercel** (`ns1.vercel-dns.com` / `ns2.vercel-dns.com`).
Depois do site no ar na Hostinger, atualize DNS/nameservers (ou registro A/CNAME) para a Hostinger.

## Dados persistentes

- Projetos: `data/projects.json`
- Uploads do admin: `public/media/projects/uploads/`

Em hospedagem Node da Hostinger o disco do app persiste entre deploys do mesmo app; faça backup periódico desses caminhos.
