import Container from "@/src/components/Container";
import Hero from "@/src/components/Hero";
import AboutMeSection from "@/src/components/AboutMeSection";
import TechStackSection from "@/src/components/TechStackSection";
import FeaturedPosts from "@/src/components/FeaturedPosts";
import ExperienceSummary from "@/src/components/ExperienceSummary";
import ContactCTA from "@/src/components/ContactCTA";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <Container className="space-y-10 pb-16">
        {/* 1. About Me */}
        <section id="about" className="scroll-mt-24">
          <AboutMeSection />
        </section>

        {/* 2. Tech Stack */}
        <section id="skills" className="scroll-mt-24">
          <TechStackSection />
        </section>

        {/* 3. Featured Projects Showcase */}
        <section id="projects" className="scroll-mt-24">
          <FeaturedPosts />
        </section>

        {/* 4. Career Timeline */}
        <section id="career" className="scroll-mt-24">
          <ExperienceSummary />
        </section>

        {/* 5. Contact CTA */}
        <section id="contact" className="scroll-mt-24">
          <ContactCTA />
        </section>
      </Container>
    </>
  );
}
