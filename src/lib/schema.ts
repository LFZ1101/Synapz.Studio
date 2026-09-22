import { SITE } from "@/content/site";
import { absoluteUrl } from "@/lib/utils";
import type { Service } from "@/content/services";
import type { Project } from "@/content/projects";
import { faqItems } from "@/content/studio";

function sameAs() {
  return [SITE.social.instagram, SITE.social.linkedin].filter(Boolean);
}

export function organizationSchema() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: SITE.name,
    legalName: SITE.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/logo-principal.png"),
    image: absoluteUrl("/og/share.jpg"),
    description: SITE.positioning,
    slogan: SITE.concept,
    foundingDate: undefined,
    areaServed: SITE.contact.areaServed,
    founder: {
      "@type": "Person",
      name: SITE.founder.name,
      jobTitle: SITE.founder.role,
    },
    knowsAbout: [
      "Marketing digital",
      "Design",
      "Desenvolvimento web",
      "Social media",
      "Campanhas digitais",
      "Sistemas personalizados",
    ],
  };

  if (SITE.contact.email) data.email = SITE.contact.email;
  if (SITE.contact.phone) data.telephone = SITE.contact.phone;
  const profiles = sameAs();
  if (profiles.length) data.sameAs = profiles;

  return data;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
  };
}

export function webPageSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    inLanguage: SITE.language,
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    areaServed: SITE.contact.areaServed,
    url: absoluteUrl(`/servicos/${service.slug}`),
  };
}

export function creativeWorkSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary,
    dateCreated: String(project.year),
    dateModified: project.updatedAt,
    creator: {
      "@type": "Organization",
      name: SITE.name,
    },
    url: absoluteUrl(`/projetos/${project.slug}`),
    image: absoluteUrl(project.cover),
    about: project.segment,
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function personSchema() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.founder.name,
    jobTitle: SITE.founder.role,
    worksFor: {
      "@type": "Organization",
      name: SITE.name,
    },
  };
  if (SITE.founder.location) data.homeLocation = SITE.founder.location;
  const socials = Object.values(SITE.founder.socials).filter(Boolean);
  if (socials.length) data.sameAs = socials;
  return data;
}
