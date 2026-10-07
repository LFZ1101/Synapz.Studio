/**
 * Project accessors for the public site.
 * Editable data lives in data/projects.json (managed via /admin).
 */

export type {
  Project,
  ProjectGalleryItem,
  ProjectResult,
  ProjectTestimonial,
} from "@/content/project-types";

import {
  getProjectBySlug,
  readAllProjects,
} from "@/lib/projects-store";
import type { Project } from "@/content/project-types";

/** @deprecated Prefer getPublishedProjects / readAllProjects — kept for rare direct reads */
export function getAllProjects(): Project[] {
  return readAllProjects();
}

export function getProject(slug: string): Project | undefined {
  return getProjectBySlug(slug, { includeDrafts: false });
}

export function getPublishedProjects(): Project[] {
  return readAllProjects().filter((p) => p.published);
}

export function getFeaturedProjects(): Project[] {
  return getPublishedProjects().filter((p) => p.featured);
}

export function getNextProject(currentSlug: string): Project | undefined {
  const published = getPublishedProjects();
  const current = published.find((p) => p.slug === currentSlug);
  if (!current) return undefined;
  if (current.nextProject) {
    return getProject(current.nextProject);
  }
  const index = published.findIndex((p) => p.slug === currentSlug);
  return published[(index + 1) % published.length];
}
