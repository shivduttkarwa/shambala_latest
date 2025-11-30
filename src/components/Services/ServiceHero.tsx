// ServiceHero.tsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ServicePage.css";
import ScrollDownButton from "../UI/ScrollDownButton";
import ServiceHeroText from "./ServiceHeroText";

const publicUrl = import.meta.env.BASE_URL;

const ServiceHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // Scope GSAP to this hero only
    const ctx = gsap.context(() => {
      // Entry animation for hero – NO scale (to avoid shrink / flicker)
      gsap.fromTo(
        ".ser-page-hero-grid",
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
        }
      );
    }, heroEl);

    // Parallax mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const xPos = (e.clientX - rect.left) / rect.width - 0.5;
      const yPos = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(".ser-page-hero-image-container", {
        duration: 1,
        x: -xPos * 30,
        y: -yPos * 30,
        ease: "power3.out",
      });

      gsap.to(".ser-page-hero-text-container", {
        duration: 1,
        x: xPos * 30,
        y: yPos * 30,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(
        [".ser-page-hero-image-container", ".ser-page-hero-text-container"],
        {
          duration: 1,
          x: 0,
          y: 0,
          ease: "elastic.out(1, 0.5)",
        }
      );
    };

    heroEl.addEventListener("mousemove", handleMouseMove);
    heroEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heroEl.removeEventListener("mousemove", handleMouseMove);
      heroEl.removeEventListener("mouseleave", handleMouseLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section className="ser-page-hero-wrapper">
      <section
        className="ser-page-hero-section"
        ref={heroRef}
      >
        <div className="ser-page-hero-grid">
          {/* Image (2/3) */}
          <div className="ser-page-hero-image-container">
            <img
              src={`${publicUrl}images/l2.jpg`}
              alt="Architectural service showcase"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `${publicUrl}images/l1.jpg`;
              }}
            />
          </div>

          {/* Text Content (1/3) */}
          <div className="ser-page-hero-text-container">
            <div className="ser-page-hero-velocity">
              <ServiceHeroText text={"Building"} secondText={"Dreams"} />
            </div>
            {/* Optional descriptive copy - keep if you want more text in hero
            <p>
              Tailored residential and development services—from feasibility and
              planning to interiors and aftercare—delivered by Forma&apos;s
              integrated team.
            </p>
            */}
          </div>
        </div>

        <ScrollDownButton targetId="services-content" />
      </section>
    </section>
  );
};

export default ServiceHero;
