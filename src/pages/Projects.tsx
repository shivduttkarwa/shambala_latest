import React from "react";
import ProjectsHero from "../components/Projects/ProjectsHero";

import ProjectsSlider from "../components/Projects/ProjectsSlider";

import ProjectModernSlider from "@/components/Projects/ProjectModernSlider";
import ProjectsShowcase from "../components/Projects/ProjectsShowcase";
import GridGallery from "@/components/Reusable/GridGallery";
import StepSlider from "@/components/Reusable/StepSlider";
import AnimatedGallerySlider from "../components/Home/AnimatedGallerySlider";

const Projects: React.FC = () => {
  return (
    <>
      <ProjectsHero />
      <ProjectsSlider />
      <ProjectsShowcase />
      <ProjectModernSlider />
      <AnimatedGallerySlider />
    </>
  );
};

export default Projects;
