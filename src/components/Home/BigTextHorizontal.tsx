import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./BigTextHorizontal.css";

gsap.registerPlugin(ScrollTrigger);

const BigTextHorizontal: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const cardsSectionRef = useRef<HTMLElement | null>(null);
  const cardsWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const heroSection = heroSectionRef.current;
      const cardsSectionEl = cardsSectionRef.current;
      const cardsContainerEl = cardsContainerRef.current;
      const cardsWrapperEl = cardsWrapperRef.current;

      if (
        !heroSection ||
        !cardsSectionEl ||
        !cardsContainerEl ||
        !cardsWrapperEl
      ) {
        return;
      }

      // Hero text fade out animation
      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: "center center",
            end: "+=650",
            scrub: 0.5,
            pin: true,
            pinSpacing: false,
          },
        })
        .to(".bth-hero-title", {
          scale: 0.2,
          y: -200,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(
          ".bth-hero-subtitle",
          {
            scale: 0.3,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          0.1
        );

      // Cards setup
      const cards = Array.from(cardsContainerEl.querySelectorAll(".bth-card"));
      if (!cards.length) return;

      // Calculate total width with proper spacing
      let totalWidth = 0;
      cards.forEach((card) => {
        totalWidth += (card as HTMLElement).offsetWidth + 32;
      });

      // Calculate offset to center first and last card
      const cardWidth = (cards[0] as HTMLElement).offsetWidth;
      const viewportCenter = window.innerWidth / 2;
      const cardCenter = cardWidth / 2;

      // Start position: first card centered
      const startOffset = viewportCenter - cardCenter;

      // End position: last card centered
      const scrollDistance = totalWidth - cardWidth - startOffset;

      // Set initial position to center first card
      gsap.set(cardsContainerEl, {
        x: startOffset,
        left: 0,
      });

      // Cards fade in as we approach the cards section
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsSectionEl,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.5,
          },
        }
      );

      // Horizontal scroll animation
      gsap.to(cardsContainerEl, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: cardsSectionEl,
          start: "top top",
          end: () => `+=${scrollDistance * 2}`,
          scrub: 0.5,
          pin: cardsWrapperEl,
        },
      });

      return () => {
        ScrollTrigger.refresh();
      };
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const cards = [
    {
      id: 1,
      number: "01",
      title: "Design Excellence",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      number: "02",
      title: "Strategic Thinking",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      number: "03",
      title: "Team Collaboration",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    },
    {
      id: 4,
      number: "04",
      title: "Innovation",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    },
    {
      id: 5,
      number: "05",
      title: "Results Driven",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
    },
  ];

  return (
    <div className="bth-root">
      {/* Hero Text Section */}
      <section className="bth-hero-section" ref={heroSectionRef}>
        <div className="bth-hero-content">
          <h1 className="bth-hero-title">
            EXPLORE OUR
            <br />
            SERVICES
          </h1>
        </div>
      </section>

      {/* Horizontal Scroll Cards Section */}
      <section className="bth-cards-section" ref={cardsSectionRef}>
        <div className="bth-cards-wrapper" ref={cardsWrapperRef}>
          <div className="bth-cards-container" ref={cardsContainerRef}>
            {cards.map((card) => (
              <div className="bth-card" key={card.id}>
                <div className="bth-card-inner">
                  <div className="bth-card-image">
                    <img src={card.image} alt={card.title} />
                  </div>
                <div className="bth-card-content">
                  <div className="bth-card-number">{card.number}</div>
                  <h3>{card.title}</h3>
                  <a href="#" className="bth-card-link">
                    Explore More
                      <svg className="bth-icon" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BigTextHorizontal;
