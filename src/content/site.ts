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
  /** Home hero — precise, not "we do everything" */
  headline: "Estratégia, design e tecnologia trabalhando juntos no seu negócio.",
  description:
    "A SYNAPZ cuida de marca, conteúdo, campanha e experiência digital com uma única direção — do diagnóstico à publicação.",
  identification: {
    type: "Estúdio digital",
    pillars: "Marca · Web · Campanhas",
  },
  /** Confirmed production domain when ready; override via NEXT_PUBLIC_SITE_URL */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://synapz.studio",
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
  primary: { href: "/contato", label: "Conversar sobre meu projeto" },
  secondary: { href: "/servicos", label: "Conhecer os serviços" },
  projects: { href: "/projetos", label: "Ver projetos" },
  whatsapp: { label: "Abrir WhatsApp" },
  activate: { href: "/contato", label: "Ative o próximo passo" },
} as const;
