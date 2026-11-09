import { getDb, ensureDefaultStages, nowIso } from "../src/lib/plataforma/db";
import { createId } from "../src/lib/plataforma/ids";
import bcrypt from "bcryptjs";
import {
  upsertClient,
  listClients,
  upsertSale,
  getDashboardMetrics,
  listStages,
  upsertOpportunity,
  upsertProject,
  upsertTask,
  upsertCashEntry,
  upsertPortfolioSite,
} from "../src/lib/plataforma/services";
import { hasOwner } from "../src/lib/plataforma/auth";
import type { SessionUser } from "../src/lib/plataforma/types";

async function main() {
  console.log("hasOwner", hasOwner());
  let userId: string;
  let orgId: string;
  if (!hasOwner()) {
    const db = getDb();
    const now = nowIso();
    userId = createId("usr");
    orgId = createId("org");
    const passwordHash = await bcrypt.hash("senha-segura-123", 12);
    db.prepare(
      "INSERT INTO organizations (id, name, slug, created_at) VALUES (?, ?, ?, ?)",
    ).run(orgId, "SYNAPZ STUDIO", "synapz-studio", now);
    db.prepare(
      "INSERT INTO users (id, email, name, username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run(
      userId,
      "dono@synapz.studio",
      "Luis Felipe",
      "luis",
      passwordHash,
      now,
      now,
    );
    db.prepare(
      "INSERT INTO memberships (id, org_id, user_id, role, created_at) VALUES (?, ?, ?, 'owner', ?)",
    ).run(createId("mem"), orgId, userId, now);
    db.prepare(
      "INSERT INTO user_preferences (user_id, hide_values, updated_at) VALUES (?, 0, ?)",
    ).run(userId, now);
    ensureDefaultStages(orgId);
    console.log("created owner");
  } else {
    const row = getDb()
      .prepare("SELECT user_id, org_id FROM memberships WHERE role='owner' LIMIT 1")
      .get() as { user_id: string; org_id: string };
    userId = row.user_id;
    orgId = row.org_id;
  }

  const user: SessionUser = {
    id: userId,
    orgId,
    email: "dono@synapz.studio",
    name: "Luis Felipe",
    username: "luis",
    orgName: "SYNAPZ STUDIO",
    role: "owner",
    hideValues: false,
  };

  if (listClients(orgId).length === 0) {
    const clientId = upsertClient(user, {
      name: "Aegis Tech",
      company: "Aegis",
      whatsapp: "11988887777",
      stage: "negociacao",
    });
    const stages = listStages(orgId);
    upsertOpportunity(user, {
      title: "Portal institucional",
      stage_id: stages[2].id,
      value_cents: 850000,
      priority: "alta",
      client_id: clientId,
      company: "Aegis",
      contact_name: "Marina",
    });
    const projectId = upsertProject(user, {
      name: "Portal Aegis",
      client_id: clientId,
      project_type: "site_institucional",
      status: "em_andamento",
      delivery_date: "2026-11-15",
    });
    upsertTask(user, {
      title: "Wireframes da home",
      status: "doing",
      priority: "alta",
      project_id: projectId,
      assignee_id: userId,
    });
    upsertSale(user, {
      name: "Portal Aegis",
      client_id: clientId,
      project_id: projectId,
      amount_cents: 850000,
      cost_cents: 210000,
      project_type: "site_institucional",
      sold_at: new Date().toISOString(),
      delivery_forecast: "2026-11-15",
    });
    upsertCashEntry(user, {
      entry_type: "entrada",
      amount_cents: 425000,
      description: "Entrada 50% Portal Aegis",
      category: "Vendas",
      occurred_at: new Date().toISOString(),
    });
    upsertPortfolioSite(user, {
      title: "Aegis Tech",
      status: "em_desenvolvimento",
      url: "https://example.com",
      client_id: clientId,
      description: "Portal em construção",
    });
  }

  const metrics = getDashboardMetrics(orgId, "1m");
  console.log(
    JSON.stringify(
      {
        clients: listClients(orgId).length,
        revenue: metrics.revenue,
        profit: metrics.profit,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
