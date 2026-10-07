# Deploy gratuito na Vercel

## Status

- Conta/team: `synapz-studio` (Hobby)
- Projeto: `synapz-studio-site`
- URLs públicas:
  - https://synapz-studio.com.br *(domínio Hostinger apontado)*
  - https://synapz-studio-site.vercel.app
  - https://workspace-orcin-nine-46.vercel.app
- Admin: `/admin` · senha `ADMIN_SECRET` = `Studio200573`

## Domínio `synapz-studio.com.br`

Domínio ativo na Hostinger (conta correta), anexado ao projeto Vercel
`synapz-studio-site`.

### DNS na Hostinger (Registros DNS)

| Tipo | Nome | Valor | TTL |
| --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | 14400 |
| A | `@` | `64.29.17.1` | 14400 |
| CNAME | `www` | `7ea7bf104c85a4d7.vercel-dns-017.com` | 300 |

Os dois registros **A** do apex já estão publicados e a Vercel marca o domínio
como `configured-correctly`. O HTTPS pode levar alguns minutos para emitir o
certificado SSL após a propagação.

Para o `www`, adicione o CNAME acima no hPanel → Domínios →
`synapz-studio.com.br` → DNS / Nameservers → Registros DNS.

### Verificação

```bash
dig +short A synapz-studio.com.br
npx vercel domains verify synapz-studio.com.br --scope synapz-studio
curl -I http://synapz-studio.com.br
```

## Variáveis de ambiente

Já configuradas em Production:

| Nome | Valor |
| --- | --- |
| `ADMIN_SECRET` | `Studio200573` |
| `NEXT_PUBLIC_SITE_URL` | `https://synapz-studio.com.br` |

## Redeploy

```bash
npx vercel deploy --prod --yes --scope synapz-studio
```

## Admin / uploads na Vercel

O painel `/admin` funciona, mas a Vercel é serverless: gravações em disco
(`data/projects.json` e uploads) **não persistem** de forma confiável.

Para mudanças permanentes de portfólio neste plano gratuito:

1. Edite localmente (ou no GitHub) `data/projects.json` e as mídias em `public/`
2. Faça `git push` + redeploy

Se no futuro quiser admin persistente na nuvem, use storage (Blob/KV) ou VPS.
