import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "fs";
import path from "path";
import type { Project } from "@/content/project-types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function readAllProjects(): Project[] {
  ensureDir();
  if (!existsSync(DATA_FILE)) return [];
  try {
    const raw = readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function writeAllProjects(projects: Project[]) {
  ensureDir();
  const tmp = `${DATA_FILE}.${Date.now()}.tmp`;
  writeFileSync(tmp, JSON.stringify(projects, null, 2) + "\n", "utf8");
  renameSync(tmp, DATA_FILE);
}

export function getProjectBySlug(slug: string, opts?: { includeDrafts?: boolean }) {
  const project = readAllProjects().find((p) => p.slug === slug);
  if (!project) return undefined;
  if (!opts?.includeDrafts && !project.published) return undefined;
  return project;
}

export function upsertProject(project: Project) {
  const all = readAllProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = { ...project, updatedAt: new Date().toISOString().slice(0, 10) };
  if (index >= 0) all[index] = next;
  else all.unshift(next);
  writeAllProjects(all);
  return next;
}

export function deleteProject(slug: string) {
  const all = readAllProjects();
  const next = all.filter((p) => p.slug !== slug);
  if (next.length === all.length) return false;
  writeAllProjects(next);
  return true;
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function projectsDataPath() {
  return DATA_FILE;
}
