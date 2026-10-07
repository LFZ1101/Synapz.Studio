# Deploy gratuito na Vercel

## Status

- Conta/team: `synapz-studio` (Hobby)
- Projeto: `synapz-studio-site`
- URLs públicas atuais:
  - https://synapz-studio-site.vercel.app
  - https://workspace-orcin-nine-46.vercel.app
- Admin: `/admin` · senha `ADMIN_SECRET` = `Studio200573`

## Domínio `synapz.studio`

O DNS já aponta para a Vercel, mas o domínio está registrado em **outra conta Vercel**
(não na team `synapz-studio`). Por isso ainda não dá para anexar aqui.

Para apontar o domínio para este projeto:

1. Entre na conta Vercel que hoje controla `synapz.studio`
2. Remova o domínio do projeto antigo **ou** transfira o domínio para a team `SYNAPZ-STUDIO`
3. Em `synapz-studio-site` → Settings → Domains → adicione:
   - `synapz.studio`
   - `www.synapz.studio`

Enquanto isso o site já está no ar no `*.vercel.app`.

## Variáveis de ambiente

Já configuradas em Production/Preview:

| Nome | Valor |
| --- | --- |
| `ADMIN_SECRET` | `Studio200573` |
| `NEXT_PUBLIC_SITE_URL` | `https://synapz.studio` |

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
