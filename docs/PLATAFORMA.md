# SYNAPZ STUDIO — Plataforma operacional

Central única em português do Brasil para operar clientes, CRM, projetos, tarefas, vendas, fluxo de caixa, portfólio e equipe.

**URL:** `/plataforma`  
**Assinatura:** Estratégia, design e tecnologia em conexão.

## O que foi entregue

### Fase A — Fundação
- Autenticação real (sessão httpOnly, senha com bcrypt, recuperação por token)
- Bootstrap explícito do proprietário via `PLATFORM_BOOTSTRAP_SECRET` (nunca o primeiro visitante público)
- Organização/workspace única por conta bootstrap + papéis: `owner`, `admin`, `member`, `viewer`
- Autorização no servidor (`assertCan` / matriz de permissões)
- Design system alinhado ao manual (tokens `#050605`, `#B7FF00`, `#ECEDE7`, `#121412`, `#898D86`)
- Tipografia Space Grotesk / Inter / IBM Plex Mono
- Logos oficiais em `public/brand/` (origem: manual em `docs/`)
- Navegação desktop (sidebar) + mobile (barra inferior)
- Estados vazios com CTA real
- Busca global (cliente, empresa, telefone, projeto, oportunidade, venda)
- Logs de auditoria
- SQLite local com migrações embutidas (`data/plataforma.db`)
- Validação e mensagens de erro em português

### Fase B — MVP operacional
| Área | Rotas | Operações |
|------|-------|-----------|
| Visão geral | `/plataforma` | Indicadores, filtros de período, gráfico, vendas recentes |
| Clientes | `/plataforma/clientes` | CRUD + arquivar, funil lateral, filtros |
| CRM Kanban | `/plataforma/crm` | Quadro/lista, dossiê, notas, histórico, mover etapa |
| Funil | `/plataforma/crm/funil` | Renomear, reordenar, probabilidade, remapeamento |
| Projetos | `/plataforma/projetos` | Execução separada das vendas |
| Tarefas | `/plataforma/tarefas` | Prioridade, prazo, vínculo projeto/oportunidade |
| Vendas | `/plataforma/vendas` | Receita, custo, lucro, filtros comerciais |
| Fluxo de caixa | `/plataforma/fluxo` | Entradas/saídas manuais |
| Portfólio | `/plataforma/portfolio` | Sites com status e capa |
| Equipe | `/plataforma/equipe` | Convite/papel |
| Configurações | `/plataforma/configuracoes` | Perfil, senha, sessões, ocultar valores, auditoria |

### Ferramentas liberadas (inspiradas na referência, conteúdo SYNAPZ)
| Módulo | Rota | O que faz |
|--------|------|-----------|
| SYNAPZ Design | `/plataforma/design` | Tokens + referências próprias |
| Prompts e Skills | `/plataforma/biblioteca` | Templates e métodos editáveis |
| SYNAPZ Play | `/plataforma/play` | Vídeos oficiais do estúdio |
| Prospecção | `/plataforma/prospeccao` | Leads manuais → import CRM |
| Gerador de Prompts | `/plataforma/gerador-prompts` | Criar/melhorar prompts localmente |
| Builder de Sites | `/plataforma/builder` | Brief + projeto/portfólio |
| Ao vivo | `/plataforma/ao-vivo` | Vendas do dia por horário |
| CSV | Clientes | Importação `nome,empresa,whatsapp,estagio` |
| Resumo | Visão geral | Copiar texto / WhatsApp |
| Notificações | Configurações | Tarefas atrasadas |

**Não copiado da referência:** bibliotecas pagas, DESIGN.md alheios, créditos de mapa, Asaas, cobrança/assinatura.

## Como subir localmente

1. Copie `.env.example` → `.env.local` e defina:
   ```bash
   PLATFORM_BOOTSTRAP_SECRET=um-segredo-longo-e-privado
   PLATFORM_SESSION_SECRET=outro-segredo-com-pelo-menos-32-chars
   ```
2. `npm install && npm run dev`
3. Abra `/plataforma/bootstrap`, use o segredo e crie o proprietário.
4. Depois use `/plataforma/entrar`.

## Regras importantes
- Assets em `docs/manual-identidade-synapz-studio.pdf` e logos em `public/brand/` são referência; não editar o PDF.
- Oportunidade ganha no CRM **não** cria venda automaticamente.
- Valores financeiros vazios não são preenchidos com números fictícios.
- Integrações de pagamento/cobrança ficam fora do escopo até haver credenciais e consentimento.

## Arquitetura de expansão (Fases C/D)
Módulos futuros devem viver como apps/rotas isoladas sob `/plataforma/...` ou pacotes internos, reutilizando auth, org, auditoria e design tokens — sem acoplar bibliotecas de conteúdo de terceiros.
