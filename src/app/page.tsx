import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
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
 * Home narrative (simplified):
 * 1. What we do (Hero)
 * 2. Why it matters (Manifesto)
 * 3. What we offer (Services)
 * 4. How it connects (Integration)
 * 5. How we work (Method)
 * 6. Proof / portfolio (Projects)
 * 7. Who we are (About)
 * 8. Objections (FAQ)
 * 9. Action (Contact)
 */
export default function HomePage() {
  return (
    <main id="conteudo-principal">
      <HeroSection />
      <ManifestoSection />
      <ServicesSection />
      <IntegrationSection />
      <MethodSection />
      <ProjectsSection />
      <AboutTeaserSection />
      <FaqSection />
      <ContactCtaSection />
    </main>
  );
}
