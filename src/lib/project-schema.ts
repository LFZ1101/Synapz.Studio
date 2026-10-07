import { z } from "zod";

const galleryItemSchema = z.object({
  src: z.string().optional(),
  alt: z.string().min(1),
  caption: z.string().optional(),
  video: z.string().optional(),
  poster: z.string().optional(),
  youtube: z.string().optional(),
  note: z.string().optional(),
});

export const projectInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  name: z.string().min(1).max(120),
  client: z.string().max(120).optional().or(z.literal("")),
  segment: z.string().min(1).max(80),
  year: z.coerce.number().int().min(1990).max(2100),
  summary: z.string().min(1).max(400),
  cover: z.string().min(1),
  coverAlt: z.string().min(1).max(200),
  video: z.string().optional().or(z.literal("")),
  services: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  context: z.string().default(""),
  problem: z.string().default(""),
  objective: z.string().default(""),
  strategy: z.string().default(""),
  creativeDirection: z.string().default(""),
  design: z.string().default(""),
  development: z.string().default(""),
  deliverables: z.array(z.string()).default([]),
  gallery: z.array(galleryItemSchema).default([]),
  nextProject: z.string().optional().or(z.literal("")),
  externalUrl: z.string().optional().or(z.literal("")),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export function emptyProjectDraft(partial?: Partial<ProjectInput>): ProjectInput {
  return {
    slug: "",
    name: "",
    client: "",
    segment: "Identidade visual",
    year: new Date().getFullYear(),
    summary: "",
    cover: "",
    coverAlt: "",
    video: "",
    services: [],
    featured: false,
    published: true,
    context: "",
    problem: "",
    objective: "",
    strategy: "",
    creativeDirection: "",
    design: "",
    development: "",
    deliverables: [],
    gallery: [],
    nextProject: "",
    externalUrl: "",
    ...partial,
  };
}
