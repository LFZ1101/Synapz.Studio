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

export type ProjectGalleryItem = {
  src?: string;
  alt: string;
  caption?: string;
  video?: string;
  poster?: string;
  youtube?: string;
  note?: string;
};

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
  gallery: ProjectGalleryItem[];
  beforeAfter?: { before: string; after: string; label?: string }[];
  results: ProjectResult[];
  testimonial?: ProjectTestimonial;
  nextProject?: string;
  updatedAt: string;
  externalUrl?: string;
}
