import { getDb, nowIso } from "./db";
import { createId } from "./ids";

export function writeAudit(input: {
  orgId: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}) {
  const db = getDb();
  db.prepare(
    `INSERT INTO audit_logs
      (id, org_id, user_id, action, entity_type, entity_id, meta_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    createId("aud"),
    input.orgId,
    input.userId ?? null,
    input.action,
    input.entityType,
    input.entityId ?? null,
    input.meta ? JSON.stringify(input.meta) : null,
    nowIso(),
  );
}

export function listAudit(orgId: string, limit = 50) {
  return getDb()
    .prepare(
      `SELECT a.*, u.name AS user_name, u.email AS user_email
       FROM audit_logs a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.org_id = ?
       ORDER BY a.created_at DESC
       LIMIT ?`,
    )
    .all(orgId, limit) as Array<{
    id: string;
    action: string;
    entity_type: string;
    entity_id: string | null;
    meta_json: string | null;
    created_at: string;
    user_name: string | null;
    user_email: string | null;
  }>;
}
