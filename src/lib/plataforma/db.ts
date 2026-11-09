import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { createId } from "./ids";

const globalForDb = globalThis as unknown as {
  __synapzPlatformDb?: Database.Database;
};

function resolveDbPath() {
  if (process.env.PLATFORM_DB_PATH) {
    return path.isAbsolute(process.env.PLATFORM_DB_PATH)
      ? process.env.PLATFORM_DB_PATH
      : path.join(process.cwd(), process.env.PLATFORM_DB_PATH);
  }
  return path.join(process.cwd(), "data", "plataforma.db");
}

function migrate(db: Database.Database) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS memberships (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(org_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      user_agent TEXT,
      ip TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invites (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      email TEXT NOT NULL COLLATE NOCASE,
      role TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      invited_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      expires_at TEXT NOT NULL,
      accepted_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      hide_values INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      meta_json TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      company TEXT,
      whatsapp TEXT,
      stage TEXT NOT NULL DEFAULT 'lead',
      github TEXT,
      site_url TEXT,
      vercel_url TEXT,
      notes TEXT,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pipeline_stages (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      probability INTEGER NOT NULL DEFAULT 0,
      outcome TEXT NOT NULL DEFAULT 'aberto',
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      stage_id TEXT NOT NULL REFERENCES pipeline_stages(id),
      client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      company TEXT,
      contact_name TEXT,
      phone TEXT,
      email TEXT,
      value_cents INTEGER NOT NULL DEFAULT 0,
      owner_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      priority TEXT NOT NULL DEFAULT 'media',
      source TEXT,
      next_action TEXT,
      next_action_at TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS opportunity_notes (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
      author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS opportunity_history (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
      actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      event TEXT NOT NULL,
      detail TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      project_type TEXT NOT NULL DEFAULT 'outro',
      status TEXT NOT NULL DEFAULT 'briefing',
      delivery_date TEXT,
      description TEXT,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
      project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      amount_cents INTEGER NOT NULL DEFAULT 0,
      cost_cents INTEGER NOT NULL DEFAULT 0,
      project_type TEXT NOT NULL DEFAULT 'outro',
      sold_at TEXT NOT NULL,
      delivery_forecast TEXT,
      notes TEXT,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
      opportunity_id TEXT REFERENCES opportunities(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'todo',
      priority TEXT NOT NULL DEFAULT 'media',
      due_date TEXT,
      assignee_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cash_entries (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      entry_type TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      description TEXT NOT NULL,
      category TEXT,
      occurred_at TEXT NOT NULL,
      sale_id TEXT REFERENCES sales(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS portfolio_sites (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'em_desenvolvimento',
      url TEXT,
      client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
      cover_url TEXT,
      description TEXT,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prompts (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      category TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      summary TEXT,
      body TEXT NOT NULL,
      category TEXT,
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS design_refs (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      url TEXT,
      notes TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prospects (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      company TEXT NOT NULL,
      contact_name TEXT,
      phone TEXT,
      email TEXT,
      segment TEXT,
      city TEXT,
      source TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'novo',
      imported_opportunity_id TEXT,
      imported_client_id TEXT,
      archived_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS generated_prompts (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      mode TEXT NOT NULL,
      format TEXT NOT NULL DEFAULT 'texto',
      input_text TEXT NOT NULL,
      output_text TEXT NOT NULL,
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_briefs (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      brief_json TEXT NOT NULL,
      project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
      portfolio_id TEXT REFERENCES portfolio_sites(id) ON DELETE SET NULL,
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      body TEXT,
      href TEXT,
      read_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_clients_org ON clients(org_id);
    CREATE INDEX IF NOT EXISTS idx_opportunities_org ON opportunities(org_id);
    CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(org_id);
    CREATE INDEX IF NOT EXISTS idx_sales_org ON sales(org_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(org_id);
    CREATE INDEX IF NOT EXISTS idx_cash_org ON cash_entries(org_id);
    CREATE INDEX IF NOT EXISTS idx_portfolio_org ON portfolio_sites(org_id);
    CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(org_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_prompts_org ON prompts(org_id);
    CREATE INDEX IF NOT EXISTS idx_skills_org ON skills(org_id);
    CREATE INDEX IF NOT EXISTS idx_prospects_org ON prospects(org_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at);
  `);
}

function seedDefaultStages(db: Database.Database, orgId: string) {
  const count = db
    .prepare("SELECT COUNT(*) AS c FROM pipeline_stages WHERE org_id = ?")
    .get(orgId) as { c: number };
  if (count.c > 0) return;

  const now = new Date().toISOString();
  const defaults = [
    {
      name: "Novos contatos",
      description: "Primeiro contato registrado",
      probability: 10,
      outcome: "aberto",
    },
    {
      name: "Qualificados",
      description: "Lead com fit e interesse",
      probability: 25,
      outcome: "aberto",
    },
    {
      name: "Proposta enviada",
      description: "Proposta comercial enviada",
      probability: 50,
      outcome: "aberto",
    },
    {
      name: "Em negociação",
      description: "Ajustes de escopo e valor",
      probability: 75,
      outcome: "aberto",
    },
    {
      name: "Conquistados",
      description: "Oportunidade ganha",
      probability: 100,
      outcome: "ganho",
    },
    {
      name: "Encerrados",
      description: "Oportunidade perdida",
      probability: 0,
      outcome: "perdido",
    },
  ];

  const insert = db.prepare(`
    INSERT INTO pipeline_stages
      (id, org_id, name, description, probability, outcome, position, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  defaults.forEach((stage, index) => {
    insert.run(
      createId("stg"),
      orgId,
      stage.name,
      stage.description,
      stage.probability,
      stage.outcome,
      index,
      now,
    );
  });
}

export function getDb() {
  if (globalForDb.__synapzPlatformDb) {
    return globalForDb.__synapzPlatformDb;
  }

  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  migrate(db);
  globalForDb.__synapzPlatformDb = db;
  return db;
}

export function ensureDefaultStages(orgId: string) {
  seedDefaultStages(getDb(), orgId);
}

export function nowIso() {
  return new Date().toISOString();
}
