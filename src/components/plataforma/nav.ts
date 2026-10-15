export type NavIcon =
  | "overview"
  | "clients"
  | "crm"
  | "projects"
  | "tasks"
  | "sales"
  | "cash"
  | "portfolio"
  | "team"
  | "settings"
  | "design"
  | "library"
  | "play"
  | "leads"
  | "generator"
  | "builder"
  | "live"
  | "images";

export const PLATFORM_NAV: Array<{
  href: string;
  label: string;
  icon: NavIcon;
  exact?: boolean;
  group?: "core" | "extras";
}> = [
  { href: "/plataforma", label: "Visão geral", icon: "overview", exact: true, group: "core" },
  { href: "/plataforma/clientes", label: "Clientes", icon: "clients", group: "core" },
  { href: "/plataforma/crm", label: "CRM Kanban", icon: "crm", group: "core" },
  { href: "/plataforma/projetos", label: "Projetos", icon: "projects", group: "core" },
  { href: "/plataforma/tarefas", label: "Tarefas", icon: "tasks", group: "core" },
  { href: "/plataforma/vendas", label: "Vendas", icon: "sales", group: "core" },
  { href: "/plataforma/ao-vivo", label: "Ao vivo", icon: "live", group: "core" },
  { href: "/plataforma/fluxo", label: "Fluxo de caixa", icon: "cash", group: "core" },
  { href: "/plataforma/portfolio", label: "Portfólio", icon: "portfolio", group: "core" },
  { href: "/plataforma/equipe", label: "Equipe", icon: "team", group: "core" },
  { href: "/plataforma/configuracoes", label: "Configurações", icon: "settings", group: "core" },
  { href: "/plataforma/design", label: "SYNAPZ Design", icon: "design", group: "extras" },
  { href: "/plataforma/biblioteca", label: "Prompts e Skills", icon: "library", group: "extras" },
  { href: "/plataforma/play", label: "SYNAPZ Play", icon: "play", group: "extras" },
  { href: "/plataforma/prospeccao", label: "Prospecção", icon: "leads", group: "extras" },
  { href: "/plataforma/gerador-prompts", label: "Gerador de Prompts", icon: "generator", group: "extras" },
  { href: "/plataforma/builder", label: "Builder de Sites", icon: "builder", group: "extras" },
  { href: "/plataforma/imagens", label: "Imagens IA", icon: "images", group: "extras" },
];
