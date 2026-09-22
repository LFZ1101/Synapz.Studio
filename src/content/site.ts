/**
 * Site-wide constants and brand configuration.
 * Replace placeholder contact values before production publish.
 */

export const SITE = {
  name: "SYNAPZ STUDIO",
  shortName: "SYNAPZ",
  legalName: "SYNAPZ STUDIO",
  tagline: "Estratégia, criatividade e tecnologia em conexão.",
  concept: "O impulso que conecta.",
  purpose:
    "Transformar ideias e necessidades de negócio em experiências digitais relevantes, funcionais e memoráveis.",
  positioning:
    "A SYNAPZ STUDIO é um estúdio digital que conecta estratégia, marketing, criatividade, design e tecnologia para construir marcas, experiências e resultados.",
  promise: "Conectar competências diferentes para colocar negócios em movimento.",
  headline: "Criamos tudo que uma marca precisa para ocupar o digital.",
  description:
    "Da estratégia ao conteúdo, da campanha ao site, conectamos design, marketing e tecnologia para criar experiências que movimentam negócios.",
  identification: {
    type: "Estúdio digital independente",
    pillars: "Marketing · Design · Tecnologia",
  },
  /** Replace with real production domain before publish */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://synapz.studio",
  locale: "pt_BR",
  language: "pt-BR",
  founder: {
    name: "Luiz Felipe Barbosa Zambianco",
    role: "Fundador",
    /** Optional fields — leave empty until real data is available */
    photo: "/brand/placeholders/founder.jpg",
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
    /** Replace with official channels before publish */
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
    whatsappDisplay: "",
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
  { href: "/studio", label: "Studio" },
  { href: "/servicos", label: "Serviços" },
  { href: "/projetos", label: "Projetos" },
  { href: "/#metodo", label: "Método" },
  { href: "/studio#sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
] as const;

export const CTA = {
  primary: { href: "/contato", label: "Iniciar um projeto" },
  secondary: { href: "/projetos", label: "Conhecer trabalhos" },
  whatsapp: { label: "Conversar pelo WhatsApp" },
} as const;
