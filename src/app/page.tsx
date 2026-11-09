import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { MethodSection } from "@/components/sections/MethodSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
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
 * Home: understand the studio → see work → choose a service →
 * understand the method → proof → about → FAQ → contact.
 */
export default function HomePage() {
  return (
    <main id="conteudo-principal">
      <HeroSection />
      <ManifestoSection />
      <ProjectsSection />
      <ServicesSection />
      <MethodSection />
      <ClientsSection />
      <AboutTeaserSection />
      <FaqSection />
      <ContactCtaSection />
    </main>
  );
}
