// ServicesPage.tsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServicePage.css";
import { FormaServices } from "./FormaServices";
import { ProcessSection } from "./ProcessSection";
import ScrollDownButton from "../UI/ScrollDownButton";
import ServiceHeroText from "./ServiceHeroText";

gsap.registerPlugin(ScrollTrigger);

const ServicesPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // PIN THE FULL-WIDTH IMAGE WHILE PROCESS + TESTIMONIALS SCROLL OVER
    const pinEl = document.querySelector(".ser-image-pin");
    const endEl = document.querySelector(".ser-testimonials-section");
    let pinTrigger: ScrollTrigger | undefined;
    if (pinEl && endEl) {
      pinTrigger = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        endTrigger: endEl,
        end: "bottom top",
        pin: pinEl,
        pinSpacing: false,
        anticipatePin: 1,
      });
    }

    // REVEAL ANIMATIONS FOR HERO + CARDS (.ser-animate-in)
    gsap.utils.toArray(".ser-animate-in").forEach((elem: any) => {
      gsap.fromTo(
        elem,
        { autoAlpha: 0, y: 60, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });


    // HERO PARALLAX MOUSE MOVE + CARD TILT
    const hero = heroRef.current;
    if (hero) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
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
        gsap.to([".ser-page-hero-image-container", ".ser-page-hero-text-container"], {
          duration: 1,
          x: 0,
          y: 0,
          ease: "elastic.out(1, 0.5)",
        });
      };

      hero.addEventListener("mousemove", handleMouseMove);
      hero.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        hero.removeEventListener("mousemove", handleMouseMove);
        hero.removeEventListener("mouseleave", handleMouseLeave);
      };
    }

    return () => {
      pinTrigger?.kill();
    };
  }, []);

  useEffect(() => {
    // CARD TILT ANIMATIONS
    const cards = cardsRef.current;

    const handleCardMouseMove = (e: MouseEvent, card: HTMLDivElement) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const { width, height } = rect;

      const rotateX = gsap.utils.mapRange(0, height, -10, 10)(y);
      const rotateY = gsap.utils.mapRange(0, width, 10, -10)(x);

      gsap.to(card, {
        duration: 0.7,
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        ease: "power2.out",
      });
    };

    const handleCardMouseLeave = (card: HTMLDivElement) => {
      gsap.to(card, {
        duration: 1,
        rotationX: 0,
        rotationY: 0,
        ease: "elastic.out(1, 0.5)",
      });
    };

    cards.forEach((card) => {
      if (card) {
        const mouseMoveHandler = (e: MouseEvent) =>
          handleCardMouseMove(e, card);
        const mouseLeaveHandler = () => handleCardMouseLeave(card);

        card.addEventListener("mousemove", mouseMoveHandler);
        card.addEventListener("mouseleave", mouseLeaveHandler);

        return () => {
          card.removeEventListener("mousemove", mouseMoveHandler);
          card.removeEventListener("mouseleave", mouseLeaveHandler);
        };
      }
    });
  }, []);

  const addToCardsRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div className="ser-services-page">
      {/* FULL-BLEED, FULL-SCREEN HERO */}
      <section className="ser-page-hero-wrapper">
        <section className="ser-page-hero-section ser-animate-in" ref={heroRef}>
          <div className="ser-page-hero-grid">
            {/* Image (2/3) */}
            <div className="ser-page-hero-image-container">
              <img
                src="/images/l2.jpg"
                alt="Architectural service showcase"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/images/l1.jpg";
                }}
              />
            </div>
            {/* Text Content (1/3) */}
            <div className="ser-page-hero-text-container">
              <div className="ser-page-hero-velocity">
                <ServiceHeroText 
                  text={"Building"} 
                  secondText={"Dreams"}
                />
              </div>
            </div>
          </div>

          <ScrollDownButton targetId="services-content" />
        </section>
      </section>

      <FormaServices />

      <ProcessSection />

      {/* TESTIMONIALS SECTION */}
      <section className="ser-testimonials-section">
        <div className="ser-testimonials-header">
          <h2 className="ser-serif">What our clients say</h2>
          <p>
            Real stories from real people who've transformed their spaces with Forma's thoughtful design approach.
          </p>
          <a href="#" className="ser-btn-outline">
            ↗ VIEW ALL PROJECTS
          </a>
        </div>

        <div className="ser-features-grid">
          {/* Testimonial 1 */}
          <div
            className="ser-card ser-animate-in ser-interactive-card"
            ref={addToCardsRef}
          >
            <h3 className="ser-text-4xl ser-serif">
              "Absolutely <span style={{ color: "var(--ser-color-gold)" }}>exceptional</span> work"
            </h3>
            <p className="ser-mb-8 ser-text-gray-300">
              "Forma completely transformed our home. Every detail was considered, from the natural light flow to the choice of materials. Our space now feels calm, functional, and truly reflects who we are as a family."
            </p>
            <div className="ser-testimonial-author">
              <strong>Sarah & Michael Chen</strong><br />
              <small style={{ color: "var(--ser-color-tertiary-brown)" }}>Modern Family Home, Melbourne</small>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div
            className="ser-card ser-yellow-card ser-animate-in ser-interactive-card"
            ref={addToCardsRef}
          >
            <div className="ser-card-plus-icon">★</div>
            <h3 className="ser-text-4xl ser-serif">
              Beyond our<br />
              expectations
            </h3>
            <p className="ser-mb-8 ser-text-gray-800">
              "The team at Forma didn't just design our office space—they understood our brand and created an environment where creativity flows naturally. Our clients are always impressed."
            </p>
            <div className="ser-testimonial-author">
              <strong>James Rodriguez</strong><br />
              <small style={{ color: "var(--ser-color-tertiary-brown)" }}>Creative Studio, Sydney</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
