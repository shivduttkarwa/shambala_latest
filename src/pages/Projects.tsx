import React from "react";
import ProjectsHero from "../components/Projects/ProjectsHero";

import ProjectsSlider from "../components/Projects/ProjectsSlider";

import ProjectModernSlider from "@/components/Projects/ProjectModernSlider";
import ProjectsShowcase from "../components/Projects/ProjectsShowcase";
import GridGallery from "@/components/Reusable/GridGallery";
import StepSlider from "@/components/Reusable/StepSlider";

const Projects: React.FC = () => {
  return (
    <>
      <ProjectsHero />
      <ProjectsSlider />
      <ProjectsShowcase />
      <ProjectModernSlider />
      <GridGallery />
      <StepSlider />
    </>
  );
};

export default Projects;
