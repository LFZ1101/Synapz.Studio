/**
 * Project / case study data.
 * Do not invent clients, metrics, or testimonials.
 * Add real projects here when approved assets and copy are available.
 */

export interface ProjectResult {
  label: string;
  value: string;
  context?: string;
  period?: string;
  source?: string;
}

export interface ProjectTestimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
}

export interface Project {
  slug: string;
  name: string;
  client?: string;
  segment: string;
  year: number;
  summary: string;
  cover: string;
  coverAlt: string;
  video?: string;
  services: string[];
  featured: boolean;
  published: boolean;
  context: string;
  problem: string;
  objective: string;
  strategy: string;
  creativeDirection: string;
  design: string;
  development: string;
  deliverables: string[];
  gallery: { src: string; alt: string; caption?: string }[];
  beforeAfter?: { before: string; after: string; label?: string }[];
  results: ProjectResult[];
  testimonial?: ProjectTestimonial;
  nextProject?: string;
  updatedAt: string;
}

/**
 * Published projects only appear in listings and sitemap.
 * Keep empty until real case studies are ready — no fictional clients.
 */
export const projects: Project[] = [];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug && p.published);
}

export function getPublishedProjects(): Project[] {
  return projects.filter((p) => p.published);
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
