export const ROLES = ["owner", "admin", "member", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const CLIENT_STAGES = [
  "lead",
  "negociacao",
  "proposta_enviada",
  "cliente",
] as const;
export type ClientStage = (typeof CLIENT_STAGES)[number];

export const PROJECT_TYPES = [
  "site_institucional",
  "landing_page",
  "loja_virtual",
  "sistema",
  "outro",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_STATUSES = [
  "briefing",
  "em_andamento",
  "revisao",
  "entregue",
  "pausado",
  "arquivado",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_STATUSES = ["todo", "doing", "done", "blocked"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["baixa", "media", "alta", "urgente"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const OPPORTUNITY_PRIORITIES = ["baixa", "media", "alta"] as const;
export type OpportunityPriority = (typeof OPPORTUNITY_PRIORITIES)[number];

export const PORTFOLIO_STATUSES = [
  "publicado",
  "em_desenvolvimento",
  "arquivado",
] as const;
export type PortfolioStatus = (typeof PORTFOLIO_STATUSES)[number];

export const CASH_TYPES = ["entrada", "saida"] as const;
export type CashType = (typeof CASH_TYPES)[number];

export const STAGE_OUTCOMES = ["aberto", "ganho", "perdido"] as const;
export type StageOutcome = (typeof STAGE_OUTCOMES)[number];

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  orgId: string;
  orgName: string;
  role: Role;
  hideValues: boolean;
};

export const CLIENT_STAGE_LABELS: Record<ClientStage, string> = {
  lead: "Lead",
  negociacao: "Negociação",
  proposta_enviada: "Proposta enviada",
  cliente: "Cliente",
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  site_institucional: "Site institucional",
  landing_page: "Landing page",
  loja_virtual: "Loja virtual",
  sistema: "Sistema",
  outro: "Outro projeto",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  briefing: "Briefing",
  em_andamento: "Em andamento",
  revisao: "Em revisão",
  entregue: "Entregue",
  pausado: "Pausado",
  arquivado: "Arquivado",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "A fazer",
  doing: "Em progresso",
  done: "Concluída",
  blocked: "Bloqueada",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

export const PORTFOLIO_STATUS_LABELS: Record<PortfolioStatus, string> = {
  publicado: "Publicado",
  em_desenvolvimento: "Em desenvolvimento",
  arquivado: "Arquivado",
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Proprietário",
  admin: "Administrador",
  member: "Membro",
  viewer: "Visualizador",
};

export const PERIOD_FILTERS = [
  "hoje",
  "7d",
  "1m",
  "3m",
  "6m",
  "1a",
] as const;
export type PeriodFilter = (typeof PERIOD_FILTERS)[number];

export const PERIOD_LABELS: Record<PeriodFilter, string> = {
  hoje: "Hoje",
  "7d": "7 dias",
  "1m": "1 mês",
  "3m": "3 meses",
  "6m": "6 meses",
  "1a": "1 ano",
};
