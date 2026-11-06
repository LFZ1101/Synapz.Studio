import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { IntegrationSection } from "@/components/sections/IntegrationSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { WhySection } from "@/components/sections/WhySection";
import { AboutTeaserSection } from "@/components/sections/AboutTeaserSection";
import {
  FaqSection,
  ContactCtaSection,
} from "@/components/sections/FaqSection";
import { homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata;

/** Allow admin edits (projects) to refresh the home listing after revalidatePath */
export const dynamic = "force-dynamic";

/**
 * Home journey — conversion rhythm inspired by jorgewebpro craft,
 * expressed in SYNAPZ dark/impulse identity.
 */
export default function HomePage() {
  return (
    <main id="conteudo-principal">
      <HeroSection />
      <ManifestoSection />
      <StatsSection />
      <ImpactSection />
      <ServicesSection />
      <ClientsSection />
      <IntegrationSection />
      <MethodSection />
      <ProjectsSection />
      <WhySection />
      <AboutTeaserSection />
      <FaqSection />
      <ContactCtaSection />
    </main>
  );
}
