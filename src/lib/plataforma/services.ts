import { writeAudit } from "./audit";
import { ensureDefaultStages, getDb, nowIso } from "./db";
import { createId, createToken } from "./ids";
import { createHash } from "crypto";
import { hashPassword } from "./auth";
import type {
  CashType,
  ClientStage,
  OpportunityPriority,
  PortfolioStatus,
  PeriodFilter,
  ProjectStatus,
  ProjectType,
  Role,
  SessionUser,
  TaskPriority,
  TaskStatus,
} from "./types";
import {
  percentChange,
  periodRange,
  previousPeriodRange,
} from "./format";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/* ---------------- Dashboard ---------------- */

export function getDashboardMetrics(orgId: string, period: PeriodFilter) {
  const db = getDb();
  const current = periodRange(period);
  const previous = previousPeriodRange(period);

  const sumSales = (start: string, end: string) => {
    const row = db
      .prepare(
        `SELECT
           COALESCE(SUM(amount_cents), 0) AS revenue,
           COALESCE(SUM(amount_cents - cost_cents), 0) AS profit,
           COUNT(*) AS sales_count
         FROM sales
         WHERE org_id = ? AND archived_at IS NULL
           AND sold_at >= ? AND sold_at <= ?`,
      )
      .get(orgId, start, end) as {
      revenue: number;
      profit: number;
      sales_count: number;
    };
    return row;
  };

  const cur = sumSales(current.start, current.end);
  const prev = sumSales(previous.start, previous.end);
  const ticket =
    cur.sales_count > 0 ? Math.round(cur.revenue / cur.sales_count) : 0;

  const recentSales = db
    .prepare(
      `SELECT s.*, c.name AS client_name
       FROM sales s
       LEFT JOIN clients c ON c.id = s.client_id
       WHERE s.org_id = ? AND s.archived_at IS NULL
       ORDER BY s.sold_at DESC
       LIMIT 6`,
    )
    .all(orgId);

  const clientCount = (
    db
      .prepare(
        `SELECT COUNT(*) AS c FROM clients WHERE org_id = ? AND archived_at IS NULL`,
      )
      .get(orgId) as { c: number }
  ).c;

  const series = db
    .prepare(
      `SELECT substr(sold_at, 1, 10) AS day,
              SUM(amount_cents) AS revenue,
              SUM(amount_cents - cost_cents) AS profit
       FROM sales
       WHERE org_id = ? AND archived_at IS NULL
         AND sold_at >= ? AND sold_at <= ?
       GROUP BY day
       ORDER BY day ASC`,
    )
    .all(orgId, current.start, current.end) as Array<{
    day: string;
    revenue: number;
    profit: number;
  }>;

  return {
    revenue: cur.revenue,
    profit: cur.profit,
    ticket,
    salesCount: cur.sales_count,
    revenueChange: percentChange(cur.revenue, prev.revenue),
    profitChange: percentChange(cur.profit, prev.profit),
    clientCount,
    recentSales,
    series,
  };
}

/* ---------------- Clients ---------------- */

export function listClients(
  orgId: string,
  opts: { stage?: ClientStage | "todos"; q?: string } = {},
) {
  const db = getDb();
  const params: unknown[] = [orgId];
  let sql = `
    SELECT c.*,
      (SELECT COALESCE(SUM(amount_cents),0) FROM sales s
        WHERE s.client_id = c.id AND s.archived_at IS NULL) AS revenue_cents
    FROM clients c
    WHERE c.org_id = ? AND c.archived_at IS NULL`;

  if (opts.stage && opts.stage !== "todos") {
    sql += ` AND c.stage = ?`;
    params.push(opts.stage);
  }
  if (opts.q) {
    sql += ` AND (
      c.name LIKE ? OR c.company LIKE ? OR c.whatsapp LIKE ?
    )`;
    const like = `%${opts.q}%`;
    params.push(like, like, like);
  }
  sql += ` ORDER BY c.updated_at DESC`;
  return db.prepare(sql).all(...params) as Array<Record<string, unknown>>;
}

export function clientStats(orgId: string) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT stage, COUNT(*) AS c FROM clients
       WHERE org_id = ? AND archived_at IS NULL GROUP BY stage`,
    )
    .all(orgId) as Array<{ stage: string; c: number }>;
  const byStage = Object.fromEntries(rows.map((r) => [r.stage, r.c]));
  const revenue = (
    db
      .prepare(
        `SELECT COALESCE(SUM(amount_cents),0) AS v FROM sales
         WHERE org_id = ? AND archived_at IS NULL`,
      )
      .get(orgId) as { v: number }
  ).v;
  const total = rows.reduce((acc, r) => acc + r.c, 0);
  return { total, byStage, revenue };
}

export function getClient(orgId: string, id: string) {
  return getDb()
    .prepare(`SELECT * FROM clients WHERE org_id = ? AND id = ?`)
    .get(orgId, id) as Record<string, unknown> | undefined;
}

export function upsertClient(
  user: SessionUser,
  data: {
    id?: string;
    name: string;
    company?: string;
    whatsapp?: string;
    stage: ClientStage;
    github?: string;
    site_url?: string;
    vercel_url?: string;
    notes?: string;
  },
) {
  const db = getDb();
  const now = nowIso();
  if (data.id) {
    db.prepare(
      `UPDATE clients SET name=?, company=?, whatsapp=?, stage=?, github=?,
       site_url=?, vercel_url=?, notes=?, updated_at=?
       WHERE id=? AND org_id=?`,
    ).run(
      data.name.trim(),
      data.company?.trim() || null,
      data.whatsapp?.trim() || null,
      data.stage,
      data.github?.trim() || null,
      data.site_url?.trim() || null,
      data.vercel_url?.trim() || null,
      data.notes?.trim() || null,
      now,
      data.id,
      user.orgId,
    );
    writeAudit({
      orgId: user.orgId,
      userId: user.id,
      action: "client.update",
      entityType: "client",
      entityId: data.id,
    });
    return data.id;
  }
  const id = createId("cli");
  db.prepare(
    `INSERT INTO clients
      (id, org_id, name, company, whatsapp, stage, github, site_url, vercel_url, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.name.trim(),
    data.company?.trim() || null,
    data.whatsapp?.trim() || null,
    data.stage,
    data.github?.trim() || null,
    data.site_url?.trim() || null,
    data.vercel_url?.trim() || null,
    data.notes?.trim() || null,
    now,
    now,
  );
  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "client.create",
    entityType: "client",
    entityId: id,
  });
  return id;
}

export function archiveClient(user: SessionUser, id: string) {
  getDb()
    .prepare(
      `UPDATE clients SET archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?`,
    )
    .run(nowIso(), nowIso(), id, user.orgId);
  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "client.archive",
    entityType: "client",
    entityId: id,
  });
}

/* ---------------- CRM ---------------- */

export function listStages(orgId: string) {
  ensureDefaultStages(orgId);
  return getDb()
    .prepare(
      `SELECT * FROM pipeline_stages WHERE org_id = ? ORDER BY position ASC`,
    )
    .all(orgId) as Array<{
    id: string;
    name: string;
    description: string | null;
    probability: number;
    outcome: string;
    position: number;
  }>;
}

export function listOpportunities(
  orgId: string,
  opts: {
    q?: string;
    filter?: "todas" | "minhas" | "atrasadas" | "prioritarias" | "arquivadas";
    userId?: string;
  } = {},
) {
  const db = getDb();
  const params: unknown[] = [orgId];
  let sql = `
    SELECT o.*, s.name AS stage_name, s.outcome AS stage_outcome, u.name AS owner_name
    FROM opportunities o
    JOIN pipeline_stages s ON s.id = o.stage_id
    LEFT JOIN users u ON u.id = o.owner_user_id
    WHERE o.org_id = ?`;

  if (opts.filter === "arquivadas") {
    sql += ` AND o.archived_at IS NOT NULL`;
  } else {
    sql += ` AND o.archived_at IS NULL`;
  }
  if (opts.filter === "minhas" && opts.userId) {
    sql += ` AND o.owner_user_id = ?`;
    params.push(opts.userId);
  }
  if (opts.filter === "prioritarias") {
    sql += ` AND o.priority IN ('alta')`;
  }
  if (opts.filter === "atrasadas") {
    sql += ` AND o.next_action_at IS NOT NULL AND o.next_action_at < ?`;
    params.push(nowIso());
  }
  if (opts.q) {
    sql += ` AND (o.title LIKE ? OR o.company LIKE ? OR o.contact_name LIKE ? OR o.phone LIKE ?)`;
    const like = `%${opts.q}%`;
    params.push(like, like, like, like);
  }
  sql += ` ORDER BY o.updated_at DESC`;
  return db.prepare(sql).all(...params) as Array<Record<string, unknown>>;
}

export function getOpportunity(orgId: string, id: string) {
  return getDb()
    .prepare(
      `SELECT o.*, s.name AS stage_name, s.outcome AS stage_outcome
       FROM opportunities o
       JOIN pipeline_stages s ON s.id = o.stage_id
       WHERE o.org_id = ? AND o.id = ?`,
    )
    .get(orgId, id) as Record<string, unknown> | undefined;
}

export function upsertOpportunity(
  user: SessionUser,
  data: {
    id?: string;
    stage_id: string;
    client_id?: string;
    title: string;
    company?: string;
    contact_name?: string;
    phone?: string;
    email?: string;
    value_cents: number;
    owner_user_id?: string;
    priority: OpportunityPriority;
    source?: string;
    next_action?: string;
    next_action_at?: string;
    tags?: string[];
  },
) {
  const db = getDb();
  const now = nowIso();
  const tags = JSON.stringify(data.tags ?? []);
  if (data.id) {
    const prev = getOpportunity(user.orgId, data.id);
    db.prepare(
      `UPDATE opportunities SET
        stage_id=?, client_id=?, title=?, company=?, contact_name=?, phone=?, email=?,
        value_cents=?, owner_user_id=?, priority=?, source=?, next_action=?, next_action_at=?,
        tags_json=?, updated_at=?
       WHERE id=? AND org_id=?`,
    ).run(
      data.stage_id,
      data.client_id || null,
      data.title.trim(),
      data.company?.trim() || null,
      data.contact_name?.trim() || null,
      data.phone?.trim() || null,
      data.email?.trim() || null,
      data.value_cents,
      data.owner_user_id || null,
      data.priority,
      data.source?.trim() || null,
      data.next_action?.trim() || null,
      data.next_action_at || null,
      tags,
      now,
      data.id,
      user.orgId,
    );
    if (prev && prev.stage_id !== data.stage_id) {
      db.prepare(
        `INSERT INTO opportunity_history
          (id, org_id, opportunity_id, actor_id, event, detail, created_at)
         VALUES (?, ?, ?, ?, 'stage_change', ?, ?)`,
      ).run(
        createId("oh"),
        user.orgId,
        data.id,
        user.id,
        `Etapa alterada`,
        now,
      );
    }
    writeAudit({
      orgId: user.orgId,
      userId: user.id,
      action: "opportunity.update",
      entityType: "opportunity",
      entityId: data.id,
    });
    return data.id;
  }

  const id = createId("opp");
  db.prepare(
    `INSERT INTO opportunities
      (id, org_id, stage_id, client_id, title, company, contact_name, phone, email,
       value_cents, owner_user_id, priority, source, next_action, next_action_at, tags_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.stage_id,
    data.client_id || null,
    data.title.trim(),
    data.company?.trim() || null,
    data.contact_name?.trim() || null,
    data.phone?.trim() || null,
    data.email?.trim() || null,
    data.value_cents,
    data.owner_user_id || user.id,
    data.priority,
    data.source?.trim() || null,
    data.next_action?.trim() || null,
    data.next_action_at || null,
    tags,
    now,
    now,
  );
  db.prepare(
    `INSERT INTO opportunity_history
      (id, org_id, opportunity_id, actor_id, event, detail, created_at)
     VALUES (?, ?, ?, ?, 'created', 'Oportunidade criada', ?)`,
  ).run(createId("oh"), user.orgId, id, user.id, now);
  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "opportunity.create",
    entityType: "opportunity",
    entityId: id,
  });
  return id;
}

export function moveOpportunity(
  user: SessionUser,
  id: string,
  stageId: string,
) {
  const db = getDb();
  const now = nowIso();
  db.prepare(
    `UPDATE opportunities SET stage_id = ?, updated_at = ? WHERE id = ? AND org_id = ?`,
  ).run(stageId, now, id, user.orgId);
  db.prepare(
    `INSERT INTO opportunity_history
      (id, org_id, opportunity_id, actor_id, event, detail, created_at)
     VALUES (?, ?, ?, ?, 'stage_change', 'Avanço de etapa', ?)`,
  ).run(createId("oh"), user.orgId, id, user.id, now);
  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "opportunity.move",
    entityType: "opportunity",
    entityId: id,
    meta: { stageId },
  });
}

export function archiveOpportunity(user: SessionUser, id: string) {
  getDb()
    .prepare(
      `UPDATE opportunities SET archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?`,
    )
    .run(nowIso(), nowIso(), id, user.orgId);
}

export function addOpportunityNote(
  user: SessionUser,
  opportunityId: string,
  body: string,
) {
  const id = createId("on");
  getDb()
    .prepare(
      `INSERT INTO opportunity_notes (id, org_id, opportunity_id, author_id, body, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(id, user.orgId, opportunityId, user.id, body.trim(), nowIso());
  return id;
}

export function listOpportunityNotes(orgId: string, opportunityId: string) {
  return getDb()
    .prepare(
      `SELECT n.*, u.name AS author_name
       FROM opportunity_notes n
       LEFT JOIN users u ON u.id = n.author_id
       WHERE n.org_id = ? AND n.opportunity_id = ?
       ORDER BY n.created_at DESC`,
    )
    .all(orgId, opportunityId);
}

export function listOpportunityHistory(orgId: string, opportunityId: string) {
  return getDb()
    .prepare(
      `SELECT h.*, u.name AS actor_name
       FROM opportunity_history h
       LEFT JOIN users u ON u.id = h.actor_id
       WHERE h.org_id = ? AND h.opportunity_id = ?
       ORDER BY h.created_at DESC`,
    )
    .all(orgId, opportunityId);
}

export function savePipelineStages(
  user: SessionUser,
  stages: Array<{
    id?: string;
    name: string;
    description?: string;
    probability: number;
    outcome: "aberto" | "ganho" | "perdido";
    position: number;
  }>,
  remap?: { fromStageId: string; toStageId: string },
) {
  const db = getDb();
  const now = nowIso();
  const existing = listStages(user.orgId);
  const keepIds = new Set(stages.map((s) => s.id).filter(Boolean) as string[]);

  const tx = db.transaction(() => {
    if (remap) {
      db.prepare(
        `UPDATE opportunities SET stage_id = ?, updated_at = ?
         WHERE org_id = ? AND stage_id = ?`,
      ).run(remap.toStageId, now, user.orgId, remap.fromStageId);
    }

    for (const stage of existing) {
      if (!keepIds.has(stage.id)) {
        const count = (
          db
            .prepare(
              `SELECT COUNT(*) AS c FROM opportunities WHERE org_id = ? AND stage_id = ?`,
            )
            .get(user.orgId, stage.id) as { c: number }
        ).c;
        if (count > 0) {
          throw new Error(
            `Não é possível remover a etapa "${stage.name}" com oportunidades. Remapeie antes.`,
          );
        }
        db.prepare(`DELETE FROM pipeline_stages WHERE id = ? AND org_id = ?`).run(
          stage.id,
          user.orgId,
        );
      }
    }

    for (const stage of stages) {
      if (stage.id && keepIds.has(stage.id)) {
        db.prepare(
          `UPDATE pipeline_stages SET name=?, description=?, probability=?, outcome=?, position=?
           WHERE id=? AND org_id=?`,
        ).run(
          stage.name.trim(),
          stage.description?.trim() || null,
          stage.probability,
          stage.outcome,
          stage.position,
          stage.id,
          user.orgId,
        );
      } else {
        db.prepare(
          `INSERT INTO pipeline_stages
            (id, org_id, name, description, probability, outcome, position, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ).run(
          createId("stg"),
          user.orgId,
          stage.name.trim(),
          stage.description?.trim() || null,
          stage.probability,
          stage.outcome,
          stage.position,
          now,
        );
      }
    }
  });
  tx();
  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "pipeline.update",
    entityType: "pipeline",
  });
}

/* ---------------- Projects / Sales / Tasks / Cash / Portfolio ---------------- */

export function listProjects(
  orgId: string,
  opts: { status?: string; q?: string } = {},
) {
  const params: unknown[] = [orgId];
  let sql = `
    SELECT p.*, c.name AS client_name
    FROM projects p
    LEFT JOIN clients c ON c.id = p.client_id
    WHERE p.org_id = ? AND p.archived_at IS NULL`;
  if (opts.status && opts.status !== "todos") {
    sql += ` AND p.status = ?`;
    params.push(opts.status);
  }
  if (opts.q) {
    sql += ` AND (p.name LIKE ? OR c.name LIKE ?)`;
    const like = `%${opts.q}%`;
    params.push(like, like);
  }
  sql += ` ORDER BY p.updated_at DESC`;
  return getDb().prepare(sql).all(...params);
}

export function upsertProject(
  user: SessionUser,
  data: {
    id?: string;
    name: string;
    client_id?: string;
    project_type: ProjectType;
    status: ProjectStatus;
    delivery_date?: string;
    description?: string;
  },
) {
  const db = getDb();
  const now = nowIso();
  if (data.id) {
    db.prepare(
      `UPDATE projects SET name=?, client_id=?, project_type=?, status=?, delivery_date=?, description=?, updated_at=?
       WHERE id=? AND org_id=?`,
    ).run(
      data.name.trim(),
      data.client_id || null,
      data.project_type,
      data.status,
      data.delivery_date || null,
      data.description?.trim() || null,
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("prj");
  db.prepare(
    `INSERT INTO projects
      (id, org_id, client_id, name, project_type, status, delivery_date, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.client_id || null,
    data.name.trim(),
    data.project_type,
    data.status,
    data.delivery_date || null,
    data.description?.trim() || null,
    now,
    now,
  );
  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "project.create",
    entityType: "project",
    entityId: id,
  });
  return id;
}

export function archiveProject(user: SessionUser, id: string) {
  getDb()
    .prepare(
      `UPDATE projects SET archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?`,
    )
    .run(nowIso(), nowIso(), id, user.orgId);
}

export function listSales(
  orgId: string,
  opts: {
    filter?:
      | "todas"
      | "melhor_margem"
      | "entrega_proxima"
      | "atrasadas"
      | "entregues"
      | "sem_cliente";
  } = {},
) {
  const db = getDb();
  let sql = `
    SELECT s.*, c.name AS client_name,
      CASE WHEN s.amount_cents > 0
        THEN ROUND(((s.amount_cents - s.cost_cents) * 100.0) / s.amount_cents, 1)
        ELSE 0 END AS margin_pct
    FROM sales s
    LEFT JOIN clients c ON c.id = s.client_id
    WHERE s.org_id = ? AND s.archived_at IS NULL`;
  const params: unknown[] = [orgId];
  const today = nowIso().slice(0, 10);

  if (opts.filter === "sem_cliente") sql += ` AND s.client_id IS NULL`;
  if (opts.filter === "atrasadas") {
    sql += ` AND s.delivery_forecast IS NOT NULL AND s.delivery_forecast < ?`;
    params.push(today);
  }
  if (opts.filter === "entrega_proxima") {
    sql += ` AND s.delivery_forecast IS NOT NULL AND s.delivery_forecast >= ? AND s.delivery_forecast <= date(?, '+14 days')`;
    params.push(today, today);
  }
  if (opts.filter === "entregues") {
    sql += ` AND EXISTS (
      SELECT 1 FROM projects p WHERE p.id = s.project_id AND p.status = 'entregue'
    )`;
  }
  if (opts.filter === "melhor_margem") {
    sql += ` ORDER BY margin_pct DESC, s.sold_at DESC`;
  } else {
    sql += ` ORDER BY s.sold_at DESC`;
  }
  return db.prepare(sql).all(...params);
}

export function salesStats(orgId: string) {
  const row = getDb()
    .prepare(
      `SELECT
         COALESCE(SUM(amount_cents),0) AS revenue,
         COALESCE(SUM(amount_cents - cost_cents),0) AS profit,
         COUNT(*) AS count
       FROM sales WHERE org_id = ? AND archived_at IS NULL`,
    )
    .get(orgId) as { revenue: number; profit: number; count: number };
  const ticket = row.count ? Math.round(row.revenue / row.count) : 0;
  const margin =
    row.revenue > 0 ? ((row.profit / row.revenue) * 100) : 0;
  return { ...row, ticket, margin };
}

export function upsertSale(
  user: SessionUser,
  data: {
    id?: string;
    name: string;
    client_id?: string;
    project_id?: string;
    amount_cents: number;
    cost_cents: number;
    project_type: ProjectType;
    sold_at: string;
    delivery_forecast?: string;
    notes?: string;
  },
) {
  const db = getDb();
  const now = nowIso();
  if (data.id) {
    db.prepare(
      `UPDATE sales SET name=?, client_id=?, project_id=?, amount_cents=?, cost_cents=?,
       project_type=?, sold_at=?, delivery_forecast=?, notes=?, updated_at=?
       WHERE id=? AND org_id=?`,
    ).run(
      data.name.trim(),
      data.client_id || null,
      data.project_id || null,
      data.amount_cents,
      data.cost_cents,
      data.project_type,
      data.sold_at,
      data.delivery_forecast || null,
      data.notes?.trim() || null,
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("sal");
  db.prepare(
    `INSERT INTO sales
      (id, org_id, client_id, project_id, name, amount_cents, cost_cents, project_type, sold_at, delivery_forecast, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.client_id || null,
    data.project_id || null,
    data.name.trim(),
    data.amount_cents,
    data.cost_cents,
    data.project_type,
    data.sold_at,
    data.delivery_forecast || null,
    data.notes?.trim() || null,
    now,
    now,
  );
  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "sale.create",
    entityType: "sale",
    entityId: id,
  });
  return id;
}

export function archiveSale(user: SessionUser, id: string) {
  getDb()
    .prepare(
      `UPDATE sales SET archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?`,
    )
    .run(nowIso(), nowIso(), id, user.orgId);
}

export function listTasks(
  orgId: string,
  opts: { status?: string; q?: string } = {},
) {
  const params: unknown[] = [orgId];
  let sql = `
    SELECT t.*, p.name AS project_name, u.name AS assignee_name
    FROM tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    LEFT JOIN users u ON u.id = t.assignee_id
    WHERE t.org_id = ? AND t.archived_at IS NULL`;
  if (opts.status && opts.status !== "todos") {
    sql += ` AND t.status = ?`;
    params.push(opts.status);
  }
  if (opts.q) {
    sql += ` AND t.title LIKE ?`;
    params.push(`%${opts.q}%`);
  }
  sql += ` ORDER BY
    CASE t.priority WHEN 'urgente' THEN 0 WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
    t.due_date IS NULL, t.due_date ASC, t.updated_at DESC`;
  return getDb().prepare(sql).all(...params);
}

export function upsertTask(
  user: SessionUser,
  data: {
    id?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date?: string;
    project_id?: string;
    opportunity_id?: string;
    assignee_id?: string;
  },
) {
  const db = getDb();
  const now = nowIso();
  if (data.id) {
    db.prepare(
      `UPDATE tasks SET title=?, description=?, status=?, priority=?, due_date=?,
       project_id=?, opportunity_id=?, assignee_id=?, updated_at=?
       WHERE id=? AND org_id=?`,
    ).run(
      data.title.trim(),
      data.description?.trim() || null,
      data.status,
      data.priority,
      data.due_date || null,
      data.project_id || null,
      data.opportunity_id || null,
      data.assignee_id || null,
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("tsk");
  db.prepare(
    `INSERT INTO tasks
      (id, org_id, project_id, opportunity_id, title, description, status, priority, due_date, assignee_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.project_id || null,
    data.opportunity_id || null,
    data.title.trim(),
    data.description?.trim() || null,
    data.status,
    data.priority,
    data.due_date || null,
    data.assignee_id || null,
    now,
    now,
  );
  return id;
}

export function archiveTask(user: SessionUser, id: string) {
  getDb()
    .prepare(
      `UPDATE tasks SET archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?`,
    )
    .run(nowIso(), nowIso(), id, user.orgId);
}

export function listCashEntries(orgId: string) {
  return getDb()
    .prepare(
      `SELECT * FROM cash_entries WHERE org_id = ? ORDER BY occurred_at DESC, created_at DESC`,
    )
    .all(orgId);
}

export function cashStats(orgId: string) {
  const row = getDb()
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN entry_type='entrada' THEN amount_cents ELSE 0 END),0) AS income,
         COALESCE(SUM(CASE WHEN entry_type='saida' THEN amount_cents ELSE 0 END),0) AS expense
       FROM cash_entries WHERE org_id = ?`,
    )
    .get(orgId) as { income: number; expense: number };
  return { ...row, balance: row.income - row.expense };
}

export function upsertCashEntry(
  user: SessionUser,
  data: {
    id?: string;
    entry_type: CashType;
    amount_cents: number;
    description: string;
    category?: string;
    occurred_at: string;
    sale_id?: string;
  },
) {
  const db = getDb();
  const now = nowIso();
  if (data.id) {
    db.prepare(
      `UPDATE cash_entries SET entry_type=?, amount_cents=?, description=?, category=?, occurred_at=?, sale_id=?, updated_at=?
       WHERE id=? AND org_id=?`,
    ).run(
      data.entry_type,
      data.amount_cents,
      data.description.trim(),
      data.category?.trim() || null,
      data.occurred_at,
      data.sale_id || null,
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("csh");
  db.prepare(
    `INSERT INTO cash_entries
      (id, org_id, entry_type, amount_cents, description, category, occurred_at, sale_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.entry_type,
    data.amount_cents,
    data.description.trim(),
    data.category?.trim() || null,
    data.occurred_at,
    data.sale_id || null,
    now,
    now,
  );
  return id;
}

export function deleteCashEntry(user: SessionUser, id: string) {
  getDb()
    .prepare(`DELETE FROM cash_entries WHERE id = ? AND org_id = ?`)
    .run(id, user.orgId);
}

export function listPortfolio(
  orgId: string,
  opts: { status?: PortfolioStatus | "todos" } = {},
) {
  const params: unknown[] = [orgId];
  let sql = `
    SELECT p.*, c.name AS client_name
    FROM portfolio_sites p
    LEFT JOIN clients c ON c.id = p.client_id
    WHERE p.org_id = ? AND p.archived_at IS NULL`;
  if (opts.status && opts.status !== "todos") {
    sql += ` AND p.status = ?`;
    params.push(opts.status);
  }
  sql += ` ORDER BY p.updated_at DESC`;
  return getDb().prepare(sql).all(...params);
}

export function portfolioStats(orgId: string) {
  const rows = getDb()
    .prepare(
      `SELECT status, COUNT(*) AS c FROM portfolio_sites
       WHERE org_id = ? AND archived_at IS NULL GROUP BY status`,
    )
    .all(orgId) as Array<{ status: string; c: number }>;
  const byStatus = Object.fromEntries(rows.map((r) => [r.status, r.c]));
  const total = rows.reduce((a, r) => a + r.c, 0);
  return { total, byStatus };
}

export function upsertPortfolioSite(
  user: SessionUser,
  data: {
    id?: string;
    title: string;
    status: PortfolioStatus;
    url?: string;
    client_id?: string;
    cover_url?: string;
    description?: string;
  },
) {
  const db = getDb();
  const now = nowIso();
  if (data.id) {
    db.prepare(
      `UPDATE portfolio_sites SET title=?, status=?, url=?, client_id=?, cover_url=?, description=?, updated_at=?
       WHERE id=? AND org_id=?`,
    ).run(
      data.title.trim(),
      data.status,
      data.url?.trim() || null,
      data.client_id || null,
      data.cover_url?.trim() || null,
      data.description?.trim() || null,
      now,
      data.id,
      user.orgId,
    );
    return data.id;
  }
  const id = createId("pfs");
  db.prepare(
    `INSERT INTO portfolio_sites
      (id, org_id, title, status, url, client_id, cover_url, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    user.orgId,
    data.title.trim(),
    data.status,
    data.url?.trim() || null,
    data.client_id || null,
    data.cover_url?.trim() || null,
    data.description?.trim() || null,
    now,
    now,
  );
  return id;
}

export function archivePortfolioSite(user: SessionUser, id: string) {
  getDb()
    .prepare(
      `UPDATE portfolio_sites SET archived_at = ?, updated_at = ? WHERE id = ? AND org_id = ?`,
    )
    .run(nowIso(), nowIso(), id, user.orgId);
}

/* ---------------- Team / Search ---------------- */

export function listTeam(orgId: string) {
  return getDb()
    .prepare(
      `SELECT u.id, u.name, u.email, u.username, m.role, m.created_at
       FROM memberships m
       JOIN users u ON u.id = m.user_id
       WHERE m.org_id = ?
       ORDER BY CASE m.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 WHEN 'member' THEN 2 ELSE 3 END, u.name`,
    )
    .all(orgId) as Array<{
    id: string;
    name: string;
    email: string;
    username: string;
    role: Role;
    created_at: string;
  }>;
}

export async function inviteMember(
  user: SessionUser,
  data: { email: string; role: Role; name: string; username: string; password: string },
) {
  if (data.role === "owner") throw new Error("Não é possível convidar outro proprietário.");
  if (data.password.length < 8) throw new Error("Senha mínima de 8 caracteres.");
  const db = getDb();
  const existing = db
    .prepare(`SELECT id FROM users WHERE email = ? COLLATE NOCASE`)
    .get(data.email.trim()) as { id: string } | undefined;
  if (existing) {
    const mem = db
      .prepare(`SELECT id FROM memberships WHERE org_id = ? AND user_id = ?`)
      .get(user.orgId, existing.id);
    if (mem) throw new Error("Este usuário já faz parte da equipe.");
  }

  const now = nowIso();
  const passwordHash = await hashPassword(data.password);
  let userId = existing?.id;
  const tx = db.transaction(() => {
    if (!userId) {
      userId = createId("usr");
      db.prepare(
        `INSERT INTO users (id, email, name, username, password_hash, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        userId,
        data.email.trim().toLowerCase(),
        data.name.trim(),
        data.username.trim().toLowerCase(),
        passwordHash,
        now,
        now,
      );
      db.prepare(
        `INSERT INTO user_preferences (user_id, hide_values, updated_at) VALUES (?, 0, ?)`,
      ).run(userId, now);
    }
    db.prepare(
      `INSERT INTO memberships (id, org_id, user_id, role, created_at) VALUES (?, ?, ?, ?, ?)`,
    ).run(createId("mem"), user.orgId, userId, data.role, now);
  });
  tx();
  writeAudit({
    orgId: user.orgId,
    userId: user.id,
    action: "team.invite",
    entityType: "user",
    entityId: userId,
    meta: { role: data.role, email: data.email },
  });
  return userId!;
}

export function updateMemberRole(
  actor: SessionUser,
  memberUserId: string,
  role: Role,
) {
  if (role === "owner") throw new Error("Transferência de proprietário não suportada neste MVP.");
  const db = getDb();
  const target = db
    .prepare(`SELECT role FROM memberships WHERE org_id = ? AND user_id = ?`)
    .get(actor.orgId, memberUserId) as { role: Role } | undefined;
  if (!target) throw new Error("Membro não encontrado.");
  if (target.role === "owner") throw new Error("Não é possível alterar o proprietário.");
  db.prepare(`UPDATE memberships SET role = ? WHERE org_id = ? AND user_id = ?`).run(
    role,
    actor.orgId,
    memberUserId,
  );
}

export function globalSearch(orgId: string, q: string) {
  const like = `%${q}%`;
  const db = getDb();
  const clients = db
    .prepare(
      `SELECT id, name, company, whatsapp FROM clients
       WHERE org_id = ? AND archived_at IS NULL
         AND (name LIKE ? OR company LIKE ? OR whatsapp LIKE ?)
       LIMIT 8`,
    )
    .all(orgId, like, like, like);
  const projects = db
    .prepare(
      `SELECT id, name FROM projects
       WHERE org_id = ? AND archived_at IS NULL AND name LIKE ?
       LIMIT 8`,
    )
    .all(orgId, like);
  const opportunities = db
    .prepare(
      `SELECT id, title, company FROM opportunities
       WHERE org_id = ? AND archived_at IS NULL
         AND (title LIKE ? OR company LIKE ? OR contact_name LIKE ?)
       LIMIT 8`,
    )
    .all(orgId, like, like, like);
  const sales = db
    .prepare(
      `SELECT id, name FROM sales
       WHERE org_id = ? AND archived_at IS NULL AND name LIKE ?
       LIMIT 8`,
    )
    .all(orgId, like);
  return { clients, projects, opportunities, sales };
}

export function createInviteToken(user: SessionUser, email: string, role: Role) {
  const token = createToken(24);
  getDb()
    .prepare(
      `INSERT INTO invites (id, org_id, email, role, token_hash, invited_by, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      createId("inv"),
      user.orgId,
      email.trim().toLowerCase(),
      role,
      hashToken(token),
      user.id,
      new Date(Date.now() + 7 * 864e5).toISOString(),
      nowIso(),
    );
  return token;
}
