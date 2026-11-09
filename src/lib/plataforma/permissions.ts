import type { Role } from "./types";

export type Permission =
  | "read"
  | "write"
  | "archive"
  | "manage_team"
  | "manage_pipeline"
  | "manage_settings"
  | "audit_read";

const MATRIX: Record<Role, Permission[]> = {
  owner: [
    "read",
    "write",
    "archive",
    "manage_team",
    "manage_pipeline",
    "manage_settings",
    "audit_read",
  ],
  admin: [
    "read",
    "write",
    "archive",
    "manage_team",
    "manage_pipeline",
    "manage_settings",
    "audit_read",
  ],
  member: ["read", "write", "archive"],
  viewer: ["read"],
};

export function can(role: Role, permission: Permission) {
  return MATRIX[role]?.includes(permission) ?? false;
}

export function assertCan(role: Role, permission: Permission) {
  if (!can(role, permission)) {
    throw new Error("Sem permissão para esta ação.");
  }
}

export function canAssignRole(actor: Role, target: Role) {
  if (actor === "owner") return target !== "owner";
  if (actor === "admin") return target === "member" || target === "viewer";
  return false;
}
