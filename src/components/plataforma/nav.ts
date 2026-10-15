export const PLATFORM_NAV: Array<{
  href: string;
  label: string;
  icon: NavIcon;
  exact?: boolean;
}> = [
  { href: "/plataforma", label: "Visão geral", icon: "overview", exact: true },
  { href: "/plataforma/clientes", label: "Clientes", icon: "clients" },
  { href: "/plataforma/crm", label: "CRM Kanban", icon: "crm" },
  { href: "/plataforma/projetos", label: "Projetos", icon: "projects" },
  { href: "/plataforma/tarefas", label: "Tarefas", icon: "tasks" },
  { href: "/plataforma/vendas", label: "Vendas", icon: "sales" },
  { href: "/plataforma/fluxo", label: "Fluxo de caixa", icon: "cash" },
  { href: "/plataforma/portfolio", label: "Portfólio", icon: "portfolio" },
  { href: "/plataforma/equipe", label: "Equipe", icon: "team" },
  { href: "/plataforma/configuracoes", label: "Configurações", icon: "settings" },
];

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
  | "settings";
