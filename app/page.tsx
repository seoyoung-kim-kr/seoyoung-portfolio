import Container from "@/src/shared/ui/Container";
import Hero from "@/src/features/home/Hero";
import HighlightsSection from "@/src/features/home/HighlightsSection";
import AboutMeSection from "@/src/features/home/AboutMeSection";
import TechStackSection from "@/src/features/home/TechStackSection";
import ExperienceSummary from "@/src/features/home/ExperienceSummary";
import ContactCTA from "@/src/features/home/ContactCTA";
import ProjectsSection from "@/src/features/projects/ProjectsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Container className="space-y-10 pb-16">
        {/* 1. Core Experience */}
        <section id="highlights" className="scroll-mt-24">
          <HighlightsSection />
        </section>

        {/* 2. About Me */}
        <section id="about" className="scroll-mt-24">
          <AboutMeSection />
        </section>

        {/* 3. Tech Stack */}
        <section id="skills" className="scroll-mt-24">
          <TechStackSection />
        </section>

        {/* 4. Featured Projects Showcase */}
        <section id="projects" className="scroll-mt-24">
          <ProjectsSection />
        </section>

        {/* 5. Career Timeline */}
        <section id="career" className="scroll-mt-24">
          <ExperienceSummary />
        </section>

        {/* 6. Contact CTA */}
        <section id="contact" className="scroll-mt-24">
          <ContactCTA />
        </section>
      </Container>
    </>
  );
}
