import React from "react";
import ModernHero from "../components/Reusable/ModernHero";
import {
  EssenceSection,
  PortfolioShowcase,
  FeaturedProperties,
  BenefitsSection,
} from "../components/Home";
import OurVisionSection from "../components/Home/OurVisionSection";
import CTASection from "../components/Home/CTASection";
import ServicesSection from "../components/Home/ServicesSection";
import BlogSection from "../components/Home/BlogSection";
import ProjectModernSlider from "../components/Projects/ProjectModernSlider";
import BodyRenderer from "../components/BodyRenderer";
import { useHome } from "../hooks/useHome";
import { SiteSettings } from "../services/api";

interface HomePageProps {
  settings: SiteSettings | null;
}

const HomePage: React.FC<HomePageProps> = ({ settings: _ }) => {
  const { bodyBlocks } = useHome();

  console.log("HomePage bodyBlocks:", bodyBlocks);

  return (
    <>
      <div id="hero">
        <ModernHero />
      </div>
      <EssenceSection />
      <div id="services">
        <ServicesSection />
      </div>
      <ProjectModernSlider />
      <BenefitsSection sectionTitle="Get in touch to" />
      <div id="projects">
        <PortfolioShowcase />
      </div>

      <div id="vision">
        <OurVisionSection />
      </div>

      <FeaturedProperties />

      <BlogSection />

      <BodyRenderer blocks={bodyBlocks} />

      <div id="contact">
        <CTASection />
      </div>
    </>
  );
};

export default HomePage;
