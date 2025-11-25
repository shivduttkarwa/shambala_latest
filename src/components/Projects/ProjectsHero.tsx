import React, { useEffect, useRef } from "react";
import FullWidthImage from "../Reusable/FullWidthImage";
import ChangingText from "../UI/ChangingText";
import ScrollDownButton from "../UI/ScrollDownButton";
import gsap from "gsap";
import "./ProjectsHero.css";

const publicUrl = import.meta.env.BASE_URL;

const qualityTexts = ["EXCELLENCE", "ASSURANCE", "TRUST"];

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
        span.textContent = ch;
        span.style.display = "inline-block";
        element.appendChild(span);
        spans.push(span);
      });

      gsap.fromTo(
        spans,
        { opacity: 0, y: 20, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    };

    if (heroTitleRef.current) animateText(heroTitleRef.current, 0.04);
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.35, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <FullWidthImage
      imageUrl={`${publicUrl}images/hero_poster.jpg`}
      videoUrl={`${publicUrl}images/projects-hero.webm`}
      posterUrl={`${publicUrl}images/hero_poster.jpg`}
    >
      <div className="pr-hero-shell">
        <div className="pr-hero-body">
          <p className="pr-hero-kicker">Projects Portfolio</p>
          <h1 ref={heroTitleRef} className="pr-hero-title">
            Spaces that feel crafted, trusted, and built to last.
          </h1>
          <p ref={subtitleRef} className="pr-hero-subtitle">
            We blend craftsmanship, technical rigor, and transparent delivery so
            every project earns confidence on day one and keeps it for years.
          </p>
          <div className="pr-hero-dynamic">
            <span className="pr-hero-dynamic-label">Known for</span>
            <div className="pr-hero-dynamic-text">
              <ChangingText texts={qualityTexts} />
            </div>
          </div>
        </div>
      </div>
      <ScrollDownButton targetId="projects-slider" />
    </FullWidthImage>
  );
};

export default ProjectsHero;
