export type ServiceSlug =
  | "marca-e-conteudo"
  | "social-media"
  | "video-e-motion"
  | "materiais-publicitarios"
  | "marketing-e-campanhas"
  | "sites"
  | "landing-pages"
  | "lojas-virtuais"
  | "sistemas";

export type ServiceNucleus = "marca" | "web" | "marketing";

export interface Service {
  slug: ServiceSlug;
  nucleus: ServiceNucleus;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  intro: string;
  forWhom: string;
  problems: string[];
  deliverables: string[];
  process: string[];
  related: ServiceSlug[];
  cta: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface Nucleus {
  id: ServiceNucleus;
  title: string;
  headline: string;
  description: string;
  services: string[];
  cta: { label: string; href: string };
  href: string;
}

export const nuclei: Nucleus[] = [
  {
    id: "marca",
    title: "Marca e conteúdo",
    headline: "Marcas precisam de consistência para permanecer relevantes.",
    description:
      "Planejamos e criamos conteúdos que traduzem posicionamento, fortalecem percepção e mantêm marcas presentes na rotina das pessoas.",
    services: [
      "estratégia de conteúdo",
      "planejamento de social media",
      "direção de arte",
      "criação para redes sociais",
      "materiais publicitários",
      "edição de vídeos",
      "motion design",
      "identidade visual para campanhas",
    ],
    cta: { label: "Construir presença", href: "/servicos/marca-e-conteudo" },
    href: "/servicos/marca-e-conteudo",
  },
  {
    id: "web",
    title: "Web e tecnologia",
    headline: "Experiências digitais precisam ser bonitas, claras e funcionais.",
    description:
      "Projetamos e desenvolvemos soluções que apresentam marcas, organizam informações, simplificam processos e transformam interesse em ação.",
    services: [
      "sites institucionais",
      "landing pages",
      "lojas virtuais",
      "sistemas personalizados",
      "portais",
      "áreas de clientes",
      "dashboards",
      "automações",
      "integrações",
      "experiências digitais interativas",
    ],
    cta: { label: "Criar uma experiência", href: "/servicos/sites" },
    href: "/servicos/sites",
  },
  {
    id: "marketing",
    title: "Marketing e campanhas",
    headline: "Boas ideias precisam alcançar as pessoas certas.",
    description:
      "Criamos campanhas integradas, conectando estratégia, conteúdo, design, vídeo, páginas e tecnologia em uma comunicação orientada por objetivos.",
    services: [
      "estratégia de marketing digital",
      "planejamento de campanhas",
      "campanhas de lançamento",
      "conceitos criativos",
      "criativos para anúncios",
      "páginas de campanha",
      "comunicação promocional",
      "acompanhamento e otimização",
    ],
    cta: {
      label: "Colocar uma ideia em movimento",
      href: "/servicos/marketing-e-campanhas",
    },
    href: "/servicos/marketing-e-campanhas",
  },
];

export const services: Service[] = [
  {
    slug: "marca-e-conteudo",
    nucleus: "marca",
    title: "Marca e conteúdo",
    shortTitle: "Marca e conteúdo",
    eyebrow: "Presença contínua",
    summary:
      "Estratégia de conteúdo, direção de arte e produção para manter marcas consistentes e presentes no digital.",
    intro:
      "A SYNAPZ planeja e cria conteúdos que traduzem posicionamento, fortalecem percepção e mantêm marcas relevantes na rotina das pessoas. Trabalhamos estratégia, linguagem visual e produção como um sistema único.",
    forWhom:
      "Empresas e marcas que precisam de presença digital consistente, com conteúdo alinhado à estratégia — não apenas publicações isoladas.",
    problems: [
      "Comunicação inconsistente entre canais",
      "Conteúdo sem direção estratégica",
      "Identidade visual diluída em campanhas",
      "Produção desconectada do posicionamento",
    ],
    deliverables: [
      "Estratégia e calendário de conteúdo",
      "Direção de arte e identidade para campanhas",
      "Peças para redes sociais",
      "Materiais publicitários digitais e impressos",
      "Vídeo e motion quando o projeto exigir",
    ],
    process: [
      "Diagnóstico de marca, público e canais",
      "Definição de mensagem, tom e sistema visual",
      "Planejamento editorial e de produção",
      "Criação, revisão e publicação",
      "Ajustes a partir de aprendizado real",
    ],
    related: ["social-media", "video-e-motion", "materiais-publicitarios"],
    cta: "Construir presença",
    seo: {
      title: "Marca e Conteúdo — SYNAPZ STUDIO",
      description:
        "Estratégia de conteúdo, social media, direção de arte, materiais publicitários e motion design para marcas que precisam de presença consistente.",
    },
  },
  {
    slug: "social-media",
    nucleus: "marca",
    title: "Social media",
    shortTitle: "Social media",
    eyebrow: "Presença nas redes",
    summary:
      "Planejamento e criação para redes sociais com direção estratégica, visual e narrativa.",
    intro:
      "Gestão de social media na SYNAPZ não é volume por volume. É planejamento, linguagem e execução para que cada publicação fortaleça a marca e converse com o momento do negócio.",
    forWhom:
      "Negócios que querem redes sociais com consistência visual, mensagem clara e ritmo sustentável.",
    problems: [
      "Publicações sem continuidade",
      "Identidade visual inconsistente",
      "Falta de planejamento editorial",
      "Conteúdo desconectado de campanhas e site",
    ],
    deliverables: [
      "Planejamento de canais e pilares de conteúdo",
      "Calendário editorial",
      "Criação de peças e legendas",
      "Direção de arte para feeds e stories",
      "Integração com campanhas e landing pages",
    ],
    process: [
      "Leitura de marca e concorrência",
      "Definição de pilares e tom de voz",
      "Sistema visual para redes",
      "Produção e publicação",
      "Acompanhamento e evolução",
    ],
    related: ["marca-e-conteudo", "video-e-motion", "marketing-e-campanhas"],
    cta: "Planejar presença",
    seo: {
      title: "Social Media e Conteúdo para Redes — SYNAPZ STUDIO",
      description:
        "Planejamento de social media, direção de arte e criação de conteúdo para marcas que precisam de presença consistente nas redes.",
    },
  },
  {
    slug: "video-e-motion",
    nucleus: "marca",
    title: "Vídeo e motion",
    shortTitle: "Vídeo e motion",
    eyebrow: "Movimento com intenção",
    summary:
      "Edição de vídeo e motion design para campanhas, redes e experiências digitais.",
    intro:
      "Criamos vídeos e motion com direção clara: o movimento deve transmitir, não apenas enfeitar. Da edição de conteúdo à animação de marca, o foco é narrativa e precisão.",
    forWhom:
      "Marcas que precisam de vídeo institucional, conteúdo para redes, motion para campanhas ou peças animadas para o digital.",
    problems: [
      "Vídeos sem direção narrativa",
      "Motion genérico ou excessivo",
      "Peças que não conversam com a identidade",
      "Produção desconectada da campanha",
    ],
    deliverables: [
      "Edição de vídeos para redes e campanhas",
      "Motion design e animações de marca",
      "Aberturas e vinhetas",
      "Peças animadas para anúncios",
      "Orientação de formato por canal",
    ],
    process: [
      "Briefing e definição de objetivo",
      "Roteiro ou storyboard quando necessário",
      "Direção visual e ritmo",
      "Produção e revisão",
      "Entrega otimizada por canal",
    ],
    related: ["marca-e-conteudo", "marketing-e-campanhas", "social-media"],
    cta: "Criar em movimento",
    seo: {
      title: "Vídeo e Motion Design — SYNAPZ STUDIO",
      description:
        "Edição de vídeos, motion design e peças animadas para campanhas, redes sociais e experiências digitais.",
    },
  },
  {
    slug: "materiais-publicitarios",
    nucleus: "marca",
    title: "Materiais publicitários",
    shortTitle: "Materiais",
    eyebrow: "Peças com direção",
    summary:
      "Materiais digitais e impressos alinhados à identidade e à campanha.",
    intro:
      "Desenvolvemos materiais publicitários com consistência de marca — do digital ao impresso — para que cada peça fortaleça a mesma direção criativa.",
    forWhom:
      "Empresas que precisam de peças promocionais, institucionais ou de campanha com qualidade e coerência visual.",
    problems: [
      "Materiais desalinhados da identidade",
      "Peças improvisadas sem sistema",
      "Inconsistência entre digital e impresso",
      "Falta de hierarquia e clareza",
    ],
    deliverables: [
      "Peças digitais para anúncios e redes",
      "Materiais institucionais",
      "Peças impressas sob demanda do projeto",
      "Kits de campanha",
      "Aplicações de identidade existentes",
    ],
    process: [
      "Briefing e inventário de necessidades",
      "Direção criativa e sistema de peças",
      "Criação e adaptação por formato",
      "Revisão e arquivos finais",
    ],
    related: ["marca-e-conteudo", "marketing-e-campanhas"],
    cta: "Produzir materiais",
    seo: {
      title: "Materiais Publicitários — SYNAPZ STUDIO",
      description:
        "Criação de materiais publicitários digitais e impressos com direção de arte e consistência de marca.",
    },
  },
  {
    slug: "marketing-e-campanhas",
    nucleus: "marketing",
    title: "Marketing e campanhas",
    shortTitle: "Campanhas",
    eyebrow: "Ideias em circulação",
    summary:
      "Estratégia, conceito criativo e execução de campanhas digitais integradas.",
    intro:
      "Campanhas na SYNAPZ conectam estratégia, conteúdo, design, vídeo, páginas e tecnologia. O objetivo é colocar uma ideia em movimento até ela encontrar as pessoas certas.",
    forWhom:
      "Negócios que precisam lançar produtos, fortalecer presença ou ativar comunicação com objetivo claro e execução integrada.",
    problems: [
      "Campanhas fragmentadas entre fornecedores",
      "Criativos sem estratégia",
      "Landing pages desconectadas da mensagem",
      "Falta de acompanhamento e otimização",
    ],
    deliverables: [
      "Estratégia e planejamento de campanha",
      "Conceito criativo e narrativa",
      "Criativos para anúncios",
      "Páginas de campanha",
      "Acompanhamento e recomendações de otimização",
    ],
    process: [
      "Diagnóstico e definição de objetivo",
      "Conceito e mensagem",
      "Produção de peças e páginas",
      "Ativação",
      "Leitura de resultados e próximos passos",
    ],
    related: ["landing-pages", "video-e-motion", "marca-e-conteudo"],
    cta: "Colocar uma ideia em movimento",
    seo: {
      title: "Marketing e Campanhas Digitais — SYNAPZ STUDIO",
      description:
        "Estratégia de marketing digital, campanhas de lançamento, criativos para anúncios e páginas de campanha com execução integrada.",
    },
  },
  {
    slug: "sites",
    nucleus: "web",
    title: "Sites institucionais",
    shortTitle: "Sites",
    eyebrow: "Presença estruturada",
    summary:
      "Sites institucionais com design autoral, conteúdo claro e performance.",
    intro:
      "Projetamos e desenvolvemos sites institucionais que apresentam a marca com clareza, organizam informação e convertem interesse em contato. Design, conteúdo e tecnologia trabalham juntos.",
    forWhom:
      "Empresas que precisam de um site institucional sofisticado, rápido, acessível e preparado para crescimento.",
    problems: [
      "Site genérico ou desatualizado",
      "Mensagem confusa",
      "Experiência fraca em mobile",
      "Dificuldade de ser encontrado em buscas",
    ],
    deliverables: [
      "Arquitetura de informação e wireframes",
      "Design de interface",
      "Desenvolvimento front-end",
      "SEO técnico e de conteúdo",
      "Formulários e integrações essenciais",
    ],
    process: [
      "Diagnóstico e definição de objetivos",
      "Estrutura e conteúdo",
      "Design e prototipagem",
      "Desenvolvimento e QA",
      "Publicação e evolução",
    ],
    related: ["landing-pages", "sistemas", "marketing-e-campanhas"],
    cta: "Criar um site",
    seo: {
      title: "Criação de Sites Institucionais — SYNAPZ STUDIO",
      description:
        "Design e desenvolvimento de sites institucionais com estratégia, performance, SEO e experiência pensada para conversão.",
    },
  },
  {
    slug: "landing-pages",
    nucleus: "web",
    title: "Landing pages",
    shortTitle: "Landing pages",
    eyebrow: "Foco em conversão",
    summary:
      "Páginas de campanha e captura com mensagem clara e caminho de conversão definido.",
    intro:
      "Landing pages da SYNAPZ são construídas para uma ação específica. Unimos copy, design e tecnologia para transformar atenção em lead, inscrição ou venda.",
    forWhom:
      "Times de marketing e negócios que precisam de páginas rápidas, claras e alinhadas a campanhas pagas ou orgânicas.",
    problems: [
      "Páginas genéricas sem foco",
      "Mensagem desalinhada do anúncio",
      "Formulários fracos ou inacessíveis",
      "Baixa velocidade de carregamento",
    ],
    deliverables: [
      "Estrutura e copy de conversão",
      "Design da página",
      "Desenvolvimento responsivo",
      "Integração de formulário ou CTA",
      "Medição básica de conversão (quando autorizado)",
    ],
    process: [
      "Objetivo e oferta",
      "Estrutura persuasiva",
      "Design e desenvolvimento",
      "Testes e publicação",
      "Ajustes pós-lançamento",
    ],
    related: ["marketing-e-campanhas", "sites", "lojas-virtuais"],
    cta: "Criar uma landing page",
    seo: {
      title: "Landing Pages de Alta Conversão — SYNAPZ STUDIO",
      description:
        "Criação de landing pages para campanhas, lançamentos e captura de leads com foco em clareza, design e conversão.",
    },
  },
  {
    slug: "lojas-virtuais",
    nucleus: "web",
    title: "Lojas virtuais",
    shortTitle: "E-commerce",
    eyebrow: "Venda com experiência",
    summary:
      "Lojas virtuais com foco em experiência de compra, identidade e operação clara.",
    intro:
      "Desenvolvemos lojas virtuais que equilibram estética, usabilidade e fluxo de compra. A marca precisa vender — e a experiência precisa facilitar isso.",
    forWhom:
      "Marcas que querem vender online com identidade própria, navegação clara e estrutura preparada para crescer.",
    problems: [
      "Loja genérica que não representa a marca",
      "Fluxo de compra confuso",
      "Catálogo mal organizado",
      "Integrações incompletas",
    ],
    deliverables: [
      "Arquitetura da loja e catálogo",
      "Design da experiência de compra",
      "Implementação da vitrine",
      "Integrações essenciais do projeto",
      "Orientação para operação inicial",
    ],
    process: [
      "Mapeamento de produtos e operação",
      "Estrutura e UX",
      "Design e desenvolvimento",
      "Testes de fluxo",
      "Publicação e suporte inicial",
    ],
    related: ["sites", "sistemas", "marketing-e-campanhas"],
    cta: "Montar uma loja",
    seo: {
      title: "Lojas Virtuais e E-commerce — SYNAPZ STUDIO",
      description:
        "Criação de lojas virtuais com design, experiência de compra e estrutura tecnológica alinhada à marca.",
    },
  },
  {
    slug: "sistemas",
    nucleus: "web",
    title: "Sistemas personalizados",
    shortTitle: "Sistemas",
    eyebrow: "Sob medida",
    summary:
      "Portais, dashboards, áreas de clientes, automações e integrações sob medida.",
    intro:
      "Quando o negócio precisa de uma solução específica, a SYNAPZ desenvolve sistemas personalizados: portais, dashboards, áreas de clientes, automações e integrações que organizam processos e melhoram a experiência.",
    forWhom:
      "Empresas que precisam de ferramentas digitais sob medida — além de um site institucional — para clientes, operação ou dados.",
    problems: [
      "Processos manuais e fragmentados",
      "Ferramentas genéricas que não cabem no fluxo",
      "Falta de área do cliente",
      "Dados espalhados sem visualização",
    ],
    deliverables: [
      "Levantamento de requisitos",
      "Arquitetura da solução",
      "Interfaces e fluxos",
      "Desenvolvimento e integrações",
      "Documentação essencial e handoff",
    ],
    process: [
      "Imersão no processo atual",
      "Definição de escopo e prioridades",
      "Prototipagem e validação",
      "Desenvolvimento iterativo",
      "Entrega, treinamento e evolução",
    ],
    related: ["sites", "lojas-virtuais", "landing-pages"],
    cta: "Desenvolver um sistema",
    seo: {
      title: "Sistemas Personalizados, Dashboards e Portais — SYNAPZ STUDIO",
      description:
        "Desenvolvimento de sistemas personalizados, portais, áreas de clientes, dashboards, automações e integrações sob medida.",
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByNucleus(nucleus: ServiceNucleus): Service[] {
  return services.filter((s) => s.nucleus === nucleus);
}
