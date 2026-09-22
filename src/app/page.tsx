import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { IntegrationSection } from "@/components/sections/IntegrationSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { MethodSection } from "@/components/sections/MethodSection";
import {
  AboutTeaserSection,
  DifferentialsSection,
  ResultsSection,
} from "@/components/sections/AboutTeaserSection";
import {
  FaqSection,
  ContactCtaSection,
} from "@/components/sections/FaqSection";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <main id="conteudo-principal">
      <HeroSection />
      <ManifestoSection />
      <ServicesSection />
      <IntegrationSection />
      <ProjectsSection />
      <MethodSection />
      <AboutTeaserSection />
      <DifferentialsSection />
      <ResultsSection />
      <FaqSection />
      <ContactCtaSection />
    </main>
  );
}
