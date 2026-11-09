/**
 * Site-wide constants and brand configuration.
 * Update contact channels and social profiles before production publish.
 */

export const SITE = {
  name: "SYNAPZ STUDIO",
  shortName: "SYNAPZ",
  legalName: "SYNAPZ STUDIO",
  tagline: "Estratégia, criatividade e tecnologia na mesma direção.",
  concept: "O impulso que conecta.",
  purpose:
    "Transformar ideias e necessidades de negócio em experiências digitais relevantes, funcionais e memoráveis.",
  positioning:
    "A SYNAPZ STUDIO é um estúdio digital que conecta estratégia, marketing, criatividade, design e tecnologia para construir marcas, experiências e resultados.",
  promise: "Reunir competências diferentes para colocar negócios em movimento.",
  /** Home hero */
  headline: "Uma direção para toda a sua marca.",
  description:
    "Estratégia, identidade, conteúdo, sites e campanhas concebidos em conjunto. Para que cada ponto de contato diga com clareza quem você é e por que importa.",
  identification: {
    type: "Estúdio de marca, web e campanhas",
    pillars: "Marca · Web · Campanhas",
  },
  /**
   * Canonical public URL until a custom domain is confirmed.
   * Override with NEXT_PUBLIC_SITE_URL in production.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://synapz-studio-vercel.vercel.app",
  locale: "pt_BR",
  language: "pt-BR",
  founder: {
    name: "Luis Felipe B. Zambianco",
    role: "Web designer, designer gráfico e editor de vídeo",
    photo: "/brand/founder-luis-felipe.webp",
    bio: "",
    education: "",
    experience: "",
    location: "",
    socials: {
      instagram: "",
      linkedin: "",
      behance: "",
    },
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5543999541462",
    whatsappDisplay: "+55 43 99954-1462",
    phone: "",
    address: "",
    city: "",
    region: "",
    country: "Brasil",
    areaServed: "Brasil",
  },
  social: {
    /** Use sameAs only for verified official profiles */
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN ?? "",
  },
  brand: {
    colors: {
      black: "#050605",
      impulse: "#B7FF00",
      neural: "#ECEDE7",
      graphite: "#121412",
      signal: "#898D86",
    },
  },
} as const;

export const NAV_ITEMS = [
  { href: "/servicos", label: "Serviços" },
  { href: "/projetos", label: "Projetos" },
  { href: "/studio", label: "Studio" },
  { href: "/#metodo", label: "Método" },
  { href: "/contato", label: "Contato" },
] as const;

export const CTA = {
  primary: { href: "/contato", label: "Conversar sobre um projeto" },
  secondary: { href: "/projetos", label: "Explorar projetos" },
  projects: { href: "/projetos", label: "Explorar projetos" },
  services: { href: "/servicos", label: "Conhecer os serviços" },
  whatsapp: { label: "Abrir sem preencher" },
  activate: { href: "/contato", label: "Conversar sobre um projeto" },
} as const;
