import React from "react";
import AboutHero from "../components/About/AboutHero";
import NewHeroSection from "../components/Home/NewHeroSection";

const About: React.FC = () => {
  return (
    <>
      <NewHeroSection />
      <AboutHero />
    </>
  );
};

export default About;
