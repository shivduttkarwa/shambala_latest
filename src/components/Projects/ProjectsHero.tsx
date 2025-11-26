import React, { useEffect, useRef } from "react";
import FullWidthImage from "../Reusable/FullWidthImage";
import ScrollDownButton from "../UI/ScrollDownButton";
import gsap from "gsap";
import "./ProjectsHero.css";

const publicUrl = import.meta.env.BASE_URL;

const ProjectsHero: React.FC = () => {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const animateText = (element: HTMLElement, stagger = 0.05) => {
      const chars = element.textContent?.split("") || [];
      element.innerHTML = "";
      const spans: HTMLElement[] = [];
      chars.forEach((ch) => {
        const span = document.createElement("span");
        if (ch === " ") {
          span.innerHTML = "&nbsp;";
        } else {
          span.textContent = ch;
        }
        span.style.display = "inline-block";
        element.appendChild(span);
        spans.push(span);
      });

      gsap.fromTo(
        spans,
        { opacity: 0, y: 50, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger,
          duration: 1.2,
          ease: "back.out(1.4)",
          delay: 0.5
        }
      );
    };

    if (heroTitleRef.current) animateText(heroTitleRef.current, 0.08);
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="pr-hero-container">
      <div className="pr-hero-bg">
        <video
          className="pr-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src={`${publicUrl}images/projects-hero.webm`}
            type="video/webm"
          />
          <source src={`${publicUrl}images/home_hero.mp4`} type="video/mp4" />
        </video>
        <div className="pr-hero-overlay" />
      </div>

      <div className="pr-hero-content">
        <h1 ref={heroTitleRef} className="pr-hero-title">
          PROJECTS
        </h1>
        <p ref={subtitleRef} className="pr-hero-subtitle">
          Architectural excellence through timeless design
        </p>
      </div>
      <ScrollDownButton targetId="projects-slider" />
    </div>
  );
};

export default ProjectsHero;
