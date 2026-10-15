import { writeAudit } from "./audit";
import { getDb, nowIso, ensureDefaultStages } from "./db";
import { createId } from "./ids";
import type { SessionUser } from "./types";
import { upsertClient, upsertOpportunity, listStages } from "./services";

/* ---------- Prompts / Skills / Design ---------- */

export function listPrompts(orgId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM prompts WHERE org_id = ? AND archived_at IS NULL ORDER BY updated_at DESC`,
    )
    .all(orgId) as Array<Record<string, unknown>>;
}

export function upsertPrompt(
  user: SessionUser,
  data: { id?: string; title: string; body: string; category?: string; tags?: string[] },
) {
  const db = getDb();
  const now = nowIso();
  const tags = JSON.stringify(data.tags ?? []);
  if (data.id) {
    db.prepare(
      `UPDATE prompts SET title=?, body=?, category=?, tags_json=?, updated_at=? WHERE id=? AND org_id=?`,
    ).run(
      data.title.trim(),
      data.body.trim(),
      data.category?.trim() || null,
      tags,
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("prm");
  db.prepare(
    `INSERT INTO prompts (id, org_id, title, body, category, tags_json, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.title.trim(),
    data.body.trim(),
    data.category?.trim() || null,
    tags,
    user.id,
    now,
    now,
  );
  return id;
}

export function archivePrompt(user: SessionUser, id: string) {
  getDb()
    .prepare(`UPDATE prompts SET archived_at=?, updated_at=? WHERE id=? AND org_id=?`)
    .run(nowIso(), nowIso(), id, user.orgId);
}

export function listSkills(orgId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM skills WHERE org_id = ? AND archived_at IS NULL ORDER BY updated_at DESC`,
    )
    .all(orgId) as Array<Record<string, unknown>>;
}

export function upsertSkill(
  user: SessionUser,
  data: { id?: string; title: string; summary?: string; body: string; category?: string },
) {
  const db = getDb();
  const now = nowIso();
  if (data.id) {
    db.prepare(
      `UPDATE skills SET title=?, summary=?, body=?, category=?, updated_at=? WHERE id=? AND org_id=?`,
    ).run(
      data.title.trim(),
      data.summary?.trim() || null,
      data.body.trim(),
      data.category?.trim() || null,
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("skl");
  db.prepare(
    `INSERT INTO skills (id, org_id, title, summary, body, category, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.title.trim(),
    data.summary?.trim() || null,
    data.body.trim(),
    data.category?.trim() || null,
    user.id,
    now,
    now,
  );
  return id;
}

export function archiveSkill(user: SessionUser, id: string) {
  getDb()
    .prepare(`UPDATE skills SET archived_at=?, updated_at=? WHERE id=? AND org_id=?`)
    .run(nowIso(), nowIso(), id, user.orgId);
}

export function listDesignRefs(orgId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM design_refs WHERE org_id = ? AND archived_at IS NULL ORDER BY updated_at DESC`,
    )
    .all(orgId) as Array<Record<string, unknown>>;
}

export function upsertDesignRef(
  user: SessionUser,
  data: { id?: string; title: string; url?: string; notes?: string; tags?: string[] },
) {
  const db = getDb();
  const now = nowIso();
  const tags = JSON.stringify(data.tags ?? []);
  if (data.id) {
    db.prepare(
      `UPDATE design_refs SET title=?, url=?, notes=?, tags_json=?, updated_at=? WHERE id=? AND org_id=?`,
    ).run(
      data.title.trim(),
      data.url?.trim() || null,
      data.notes?.trim() || null,
      tags,
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("dref");
  db.prepare(
    `INSERT INTO design_refs (id, org_id, title, url, notes, tags_json, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.title.trim(),
    data.url?.trim() || null,
    data.notes?.trim() || null,
    tags,
    user.id,
    now,
    now,
  );
  return id;
}

export function archiveDesignRef(user: SessionUser, id: string) {
  getDb()
    .prepare(`UPDATE design_refs SET archived_at=?, updated_at=? WHERE id=? AND org_id=?`)
    .run(nowIso(), nowIso(), id, user.orgId);
}

export function seedSynapzLibrary(user: SessionUser) {
  const db = getDb();
  const prompts = (
    db.prepare(`SELECT COUNT(*) AS c FROM prompts WHERE org_id = ?`).get(user.orgId) as {
      c: number;
    }
  ).c;
  if (prompts === 0) {
    const starters = [
      {
        title: "Brief de landing SYNAPZ",
        category: "comercial",
        body: `Você é estrategista da SYNAPZ STUDIO. Com base no produto e no público abaixo, escreva um brief de landing page em português do Brasil com: promessa, proposta de valor, seções, CTAs e objeções.\n\nProduto:\n{{produto}}\n\nPúblico:\n{{publico}}`,
      },
      {
        title: "Roteiro de discovery",
        category: "projetos",
        body: `Monte um roteiro de discovery para projeto digital da SYNAPZ. Inclua perguntas de negócio, operação, marca, canais e critérios de sucesso. Tom claro e próximo.\n\nContexto:\n{{contexto}}`,
      },
      {
        title: "Diagnóstico de funil",
        category: "crm",
        body: `Analise o funil comercial abaixo e proponha próximos passos concretos por etapa (novos, qualificados, proposta, negociação).\n\nFunil:\n{{funil}}`,
      },
    ];
    for (const s of starters) {
      upsertPrompt(user, s);
    }
  }

  const skills = (
    db.prepare(`SELECT COUNT(*) AS c FROM skills WHERE org_id = ?`).get(user.orgId) as {
      c: number;
    }
  ).c;
  if (skills === 0) {
    upsertSkill(user, {
      title: "Método Impulso SYNAPZ",
      category: "método",
      summary: "Do ponto ao impulso: diagnosticar, conectar e entregar.",
      body: `1. Ponto — mapear cliente, oferta e restrições.\n2. Impulso — escolher a alavanca (marca, site, campanha ou sistema).\n3. Conexão — alinhar design, conteúdo e tecnologia.\n4. Ação — entregar com prazo, custo e resultado mensurável.`,
    });
    upsertSkill(user, {
      title: "Checklist de handoff",
      category: "entrega",
      summary: "Antes de publicar qualquer site ou sistema.",
      body: `- Domínio e DNS\n- Analytics com consentimento\n- Formulários testados\n- SEO básico e OG\n- Acessibilidade AA nos CTAs\n- Backup e acesso do cliente`,
    });
  }
}

/* ---------- Prompt generator (local, sem API paga) ---------- */

export function composePrompt(input: {
  mode: "criar" | "melhorar";
  format: "texto" | "json";
  text: string;
}) {
  const raw = input.text.trim();
  if (!raw) throw new Error("Descreva a ideia ou cole o prompt.");

  if (input.mode === "criar") {
    const text = [
      "Papel: estrategista e redator da SYNAPZ STUDIO.",
      "Objetivo: transformar a ideia abaixo em um prompt acionável, em português do Brasil.",
      "Regras: linguagem clara, sem jargão vazio, com passos e formato de saída.",
      "",
      "Ideia do usuário:",
      raw,
      "",
      "Estruture a resposta pedida com:",
      "1) Contexto",
      "2) Tarefa",
      "3) Restrições",
      "4) Formato de saída",
      "5) Critérios de qualidade",
    ].join("\n");

    if (input.format === "json") {
      return JSON.stringify(
        {
          papel: "Estrategista SYNAPZ STUDIO",
          ideia: raw,
          instrucoes: [
            "Esclareça contexto e público",
            "Defina a tarefa principal",
            "Liste restrições e tom",
            "Peça formato de saída explícito",
            "Inclua critérios de qualidade",
          ],
          prompt: text,
        },
        null,
        2,
      );
    }
    return text;
  }

  const improved = [
    "Melhore o prompt abaixo para uso profissional na SYNAPZ STUDIO.",
    "Mantenha a intenção original, remova ambiguidades e adicione estrutura.",
    "",
    "Prompt original:",
    raw,
    "",
    "Versão melhorada (use esta):",
    "---",
    `Contexto: operação digital SYNAPZ (estratégia, design e tecnologia).`,
    `Tarefa: ${raw}`,
    "Restrições: português do Brasil; resposta objetiva; sem inventar dados financeiros.",
    "Formato: seções numeradas + checklist final.",
    "Qualidade: cada seção deve orientar uma ação concreta.",
  ].join("\n");

  if (input.format === "json") {
    return JSON.stringify(
      {
        modo: "melhorar",
        original: raw,
        prompt: improved,
      },
      null,
      2,
    );
  }
  return improved;
}

export function saveGeneratedPrompt(
  user: SessionUser,
  data: {
    mode: "criar" | "melhorar";
    format: "texto" | "json";
    input_text: string;
    output_text: string;
  },
) {
  const id = createId("gpg");
  getDb()
    .prepare(
      `INSERT INTO generated_prompts (id, org_id, mode, format, input_text, output_text, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      user.orgId,
      data.mode,
      data.format,
      data.input_text,
      data.output_text,
      user.id,
      nowIso(),
    );
  return id;
}

export function listGeneratedPrompts(orgId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM generated_prompts WHERE org_id = ? ORDER BY created_at DESC LIMIT 50`,
    )
    .all(orgId) as Array<Record<string, unknown>>;
}

export function deleteGeneratedPrompt(user: SessionUser, id: string) {
  getDb()
    .prepare(`DELETE FROM generated_prompts WHERE id = ? AND org_id = ?`)
    .run(id, user.orgId);
}

/* ---------- Prospects / Prospection ---------- */

export function listProspects(orgId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM prospects WHERE org_id = ? AND archived_at IS NULL ORDER BY updated_at DESC`,
    )
    .all(orgId) as Array<Record<string, unknown>>;
}

export function upsertProspect(
  user: SessionUser,
  data: {
    id?: string;
    company: string;
    contact_name?: string;
    phone?: string;
    email?: string;
    segment?: string;
    city?: string;
    source?: string;
    notes?: string;
    status?: string;
  },
) {
  const db = getDb();
  const now = nowIso();
  if (data.id) {
    db.prepare(
      `UPDATE prospects SET company=?, contact_name=?, phone=?, email=?, segment=?, city=?, source=?, notes=?, status=?, updated_at=?
       WHERE id=? AND org_id=?`,
    ).run(
      data.company.trim(),
      data.contact_name?.trim() || null,
      data.phone?.trim() || null,
      data.email?.trim() || null,
      data.segment?.trim() || null,
      data.city?.trim() || null,
      data.source?.trim() || null,
      data.notes?.trim() || null,
      data.status || "novo",
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("prs");
  db.prepare(
    `INSERT INTO prospects
      (id, org_id, company, contact_name, phone, email, segment, city, source, notes, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.company.trim(),
    data.contact_name?.trim() || null,
    data.phone?.trim() || null,
    data.email?.trim() || null,
    data.segment?.trim() || null,
    data.city?.trim() || null,
    data.source?.trim() || "manual",
    data.notes?.trim() || null,
    data.status || "novo",
    now,
    now,
  );
  return id;
}

export function importProspectToCrm(user: SessionUser, prospectId: string) {
  ensureDefaultStages(user.orgId);
  const row = getDb()
    .prepare(`SELECT * FROM prospects WHERE id = ? AND org_id = ?`)
    .get(prospectId, user.orgId) as Record<string, unknown> | undefined;
  if (!row) throw new Error("Prospecto não encontrado.");

  const clientId = upsertClient(user, {
    name: String(row.contact_name || row.company),
    company: String(row.company),
    whatsapp: row.phone ? String(row.phone) : undefined,
    stage: "lead",
    notes: row.notes ? String(row.notes) : undefined,
  });

  const stages = listStages(user.orgId);
  const first = stages[0];
  const oppId = upsertOpportunity(user, {
    title: `Prospecção · ${String(row.company)}`,
    stage_id: first.id,
    client_id: clientId,
    company: String(row.company),
    contact_name: row.contact_name ? String(row.contact_name) : undefined,
    phone: row.phone ? String(row.phone) : undefined,
    email: row.email ? String(row.email) : undefined,
    value_cents: 0,
    priority: "media",
    source: row.source ? String(row.source) : "prospeccao",
    tags: ["prospeccao"],
  });

  getDb()
    .prepare(
      `UPDATE prospects SET status='importado', imported_client_id=?, imported_opportunity_id=?, updated_at=? WHERE id=? AND org_id=?`,
    )
    .run(clientId, oppId, nowIso(), prospectId, user.orgId);

  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "prospect.import_crm",
    entityType: "prospect",
    entityId: prospectId,
    meta: { clientId, oppId },
  });

  return { clientId, oppId };
}

export function archiveProspect(user: SessionUser, id: string) {
  getDb()
    .prepare(`UPDATE prospects SET archived_at=?, updated_at=? WHERE id=? AND org_id=?`)
    .run(nowIso(), nowIso(), id, user.orgId);
}

/* ---------- Site builder brief ---------- */

export function buildSiteBrief(description: string) {
  const text = description.trim();
  if (text.length < 8) throw new Error("Descreva o site com mais detalhes.");

  const titleMatch = text.split(/[.!\n]/)[0]?.trim() || "Novo site SYNAPZ";
  const brief = {
    titulo: titleMatch.slice(0, 80),
    objetivo: "Presença digital clara com conversão e identidade SYNAPZ.",
    secoes: [
      "Hero com marca e CTA",
      "Proposta de valor",
      "Prova social / cases",
      "Serviços ou oferta",
      "Contato",
    ],
    tom: "Claro, próximo, sem jargão",
    stack_sugerida: ["Next.js", "Tailwind", "Conteúdo editorial"],
    descricao_original: text,
    proximos_passos: [
      "Validar oferta e CTA",
      "Definir referências visuais",
      "Criar projeto de execução",
      "Publicar no portfólio quando pronto",
    ],
  };
  return brief;
}

export function saveSiteBrief(
  user: SessionUser,
  data: {
    title: string;
    description: string;
    brief: Record<string, unknown>;
    createProject?: boolean;
    createPortfolio?: boolean;
  },
) {
  const db = getDb();
  const now = nowIso();
  let projectId: string | null = null;
  let portfolioId: string | null = null;

  if (data.createProject) {
    projectId = createId("prj");
    db.prepare(
      `INSERT INTO projects
        (id, org_id, name, project_type, status, description, created_at, updated_at)
       VALUES (?, ?, ?, 'site_institucional', 'briefing', ?, ?, ?)`,
    ).run(projectId, user.orgId, data.title, data.description, now, now);
  }

  if (data.createPortfolio) {
    portfolioId = createId("pfs");
    db.prepare(
      `INSERT INTO portfolio_sites
        (id, org_id, title, status, description, created_at, updated_at)
       VALUES (?, ?, ?, 'em_desenvolvimento', ?, ?, ?)`,
    ).run(portfolioId, user.orgId, data.title, data.description.slice(0, 280), now, now);
  }

  const id = createId("sbr");
  db.prepare(
    `INSERT INTO site_briefs
      (id, org_id, title, description, brief_json, project_id, portfolio_id, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.title,
    data.description,
    JSON.stringify(data.brief),
    projectId,
    portfolioId,
    user.id,
    now,
    now,
  );
  return { id, projectId, portfolioId };
}

export function listSiteBriefs(orgId: string) {
  return getDb()
    .prepare(`SELECT * FROM site_briefs WHERE org_id = ? ORDER BY created_at DESC`)
    .all(orgId) as Array<Record<string, unknown>>;
}

/* ---------- Live sales / notifications / CSV ---------- */

export function getLiveSales(orgId: string) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const db = getDb();
  const sales = db
    .prepare(
      `SELECT s.*, c.name AS client_name
       FROM sales s
       LEFT JOIN clients c ON c.id = s.client_id
       WHERE s.org_id = ? AND s.archived_at IS NULL
         AND s.sold_at >= ? AND s.sold_at <= ?
       ORDER BY s.sold_at ASC`,
    )
    .all(orgId, start.toISOString(), end.toISOString()) as Array<{
    id: string;
    name: string;
    amount_cents: number;
    cost_cents: number;
    sold_at: string;
    client_name: string | null;
  }>;

  const revenue = sales.reduce((a, s) => a + s.amount_cents, 0);
  const profit = sales.reduce((a, s) => a + (s.amount_cents - s.cost_cents), 0);
  const ticket = sales.length ? Math.round(revenue / sales.length) : 0;

  const byHour = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: 0,
    revenue: 0,
  }));
  for (const sale of sales) {
    const h = new Date(sale.sold_at).getHours();
    byHour[h].count += 1;
    byHour[h].revenue += sale.amount_cents;
  }

  return { sales, revenue, profit, ticket, count: sales.length, byHour };
}

export function listNotifications(orgId: string, userId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM notifications
       WHERE org_id = ? AND (user_id IS NULL OR user_id = ?)
       ORDER BY created_at DESC LIMIT 40`,
    )
    .all(orgId, userId) as Array<Record<string, unknown>>;
}

export function createNotification(input: {
  orgId: string;
  userId?: string | null;
  title: string;
  body?: string;
  href?: string;
}) {
  getDb()
    .prepare(
      `INSERT INTO notifications (id, org_id, user_id, title, body, href, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      createId("ntf"),
      input.orgId,
      input.userId ?? null,
      input.title,
      input.body ?? null,
      input.href ?? null,
      nowIso(),
    );
}

export function markNotificationRead(user: SessionUser, id: string) {
  getDb()
    .prepare(
      `UPDATE notifications SET read_at = ? WHERE id = ? AND org_id = ? AND (user_id IS NULL OR user_id = ?)`,
    )
    .run(nowIso(), id, user.orgId, user.id);
}

export function refreshOperationalNotifications(user: SessionUser) {
  const db = getDb();
  const today = nowIso().slice(0, 10);
  const overdueTasks = db
    .prepare(
      `SELECT id, title FROM tasks
       WHERE org_id = ? AND archived_at IS NULL AND status != 'done'
         AND due_date IS NOT NULL AND due_date < ?`,
    )
    .all(user.orgId, today) as Array<{ id: string; title: string }>;

  for (const task of overdueTasks.slice(0, 10)) {
    const exists = db
      .prepare(
        `SELECT id FROM notifications WHERE org_id = ? AND href = ? AND read_at IS NULL LIMIT 1`,
      )
      .get(user.orgId, `/plataforma/tarefas?editar=${task.id}`);
    if (!exists) {
      createNotification({
        orgId: user.orgId,
        userId: user.id,
        title: "Tarefa atrasada",
        body: task.title,
        href: `/plataforma/tarefas?editar=${task.id}`,
      });
    }
  }
}

export function importClientsCsv(user: SessionUser, csvText: string) {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) throw new Error("CSV vazio ou sem linhas de dados.");

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const idx = {
    name: header.findIndex((h) => ["nome", "name"].includes(h)),
    company: header.findIndex((h) => ["empresa", "company"].includes(h)),
    whatsapp: header.findIndex((h) => ["whatsapp", "telefone", "phone"].includes(h)),
    stage: header.findIndex((h) => ["estagio", "stage", "status"].includes(h)),
  };
  if (idx.name < 0) throw new Error("CSV precisa da coluna nome.");

  let created = 0;
  for (const line of lines.slice(1)) {
    const cols = splitCsvLine(line);
    const name = cols[idx.name]?.trim();
    if (!name) continue;
    const stageRaw = idx.stage >= 0 ? cols[idx.stage]?.trim().toLowerCase() : "lead";
    const stageMap: Record<string, "lead" | "negociacao" | "proposta_enviada" | "cliente"> = {
      lead: "lead",
      negociacao: "negociacao",
      negociação: "negociacao",
      proposta: "proposta_enviada",
      proposta_enviada: "proposta_enviada",
      cliente: "cliente",
    };
    upsertClient(user, {
      name,
      company: idx.company >= 0 ? cols[idx.company] : undefined,
      whatsapp: idx.whatsapp >= 0 ? cols[idx.whatsapp] : undefined,
      stage: stageMap[stageRaw || "lead"] || "lead",
    });
    created += 1;
  }

  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "client.import_csv",
    entityType: "client",
    meta: { created },
  });
  return { created };
}

function splitCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
      continue;
    }
    if (ch === "," && !q) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

export function buildPeriodSummaryText(input: {
  orgName: string;
  periodLabel: string;
  revenueLabel: string;
  profitLabel: string;
  ticketLabel: string;
  salesCount: number;
}) {
  return [
    `${input.orgName} — resumo ${input.periodLabel}`,
    `Receita: ${input.revenueLabel}`,
    `Lucro: ${input.profitLabel}`,
    `Ticket médio: ${input.ticketLabel}`,
    `Vendas: ${input.salesCount}`,
    `Estratégia, design e tecnologia em conexão. · SYNAPZ STUDIO`,
  ].join("\n");
}
