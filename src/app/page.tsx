import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { IntegrationSection } from "@/components/sections/IntegrationSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { AboutTeaserSection } from "@/components/sections/AboutTeaserSection";
import {
  FaqSection,
  ContactCtaSection,
} from "@/components/sections/FaqSection";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata;

/**
 * Home narrative:
 * Hero → Manifesto → Serviços → Clientes → Integração → Método →
 * Projetos → Sobre → FAQ → Contato
 */
export default function HomePage() {
  return (
    <main id="conteudo-principal">
      <HeroSection />
      <ManifestoSection />
      <ServicesSection />
      <ClientsSection />
      <IntegrationSection />
      <MethodSection />
      <ProjectsSection />
      <AboutTeaserSection />
      <FaqSection />
      <ContactCtaSection />
    </main>
  );
}
