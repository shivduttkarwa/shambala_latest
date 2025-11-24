// ServicesPage.tsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServicePage.css";

gsap.registerPlugin(ScrollTrigger);

const ServicesPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // PIN THE FULL-WIDTH IMAGE WHILE PROCESS + TESTIMONIALS SCROLL OVER
    ScrollTrigger.create({
      trigger: ".ser-image-pin",
      start: "top top",
      endTrigger: ".ser-testimonials-section",
      end: "bottom top",
      pin: ".ser-image-pin",
      pinSpacing: false,
      anticipatePin: 1,
    });

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

    // PROCESS STEP ANIMATIONS
    document.querySelectorAll(".ser-process-step").forEach((step) => {
      const imgContainer = step.querySelector(".ser-step-image-container");
      const num = step.querySelector(".ser-step-number");
      const title = step.querySelector(".ser-step-title");
      const subtitle = step.querySelector(".ser-step-subtitle");
      const desc = step.querySelector(".ser-step-desc");
      const outcome = step.querySelector(".ser-outcome-box");

      if (imgContainer) {
        gsap.to(imgContainer, {
          clipPath: "inset(0% 0 0 0)",
          ease: "power3.out",
          duration: 1.2,
          scrollTrigger: {
            trigger: step,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: step,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      if (num) {
        tl.fromTo(
          num,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
      }

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );
      }

      if (subtitle) {
        tl.fromTo(
          subtitle,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.3"
        );
      }

      if (desc) {
        tl.fromTo(
          desc,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        );
      }

      if (outcome) {
        tl.fromTo(
          outcome,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.2"
        );
      }
    });

    // HERO PARALLAX MOUSE MOVE + CARD TILT
    const hero = heroRef.current;
    if (hero) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        const xPos = (e.clientX - rect.left) / rect.width - 0.5;
        const yPos = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(".ser-hero-image-container", {
          duration: 1,
          x: -xPos * 30,
          y: -yPos * 30,
          ease: "power3.out",
        });
        gsap.to(".ser-hero-text-container", {
          duration: 1,
          x: xPos * 30,
          y: yPos * 30,
          ease: "power3.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to([".ser-hero-image-container", ".ser-hero-text-container"], {
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
      <section className="ser-hero-wrapper">
        <section className="ser-hero-section ser-animate-in" ref={heroRef}>
          <div className="ser-rule-of-thirds-grid">
            {/* Image (2/3) */}
            <div className="ser-hero-image-container">
              <img
                src="https://agrifarmug.com/wp-content/uploads/2025/07/IMG_0442.jpg"
                alt="Man with headphones and microphone"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/800x600/222222/FFFFFF?text=Image";
                }}
              />
            </div>
            {/* Text Content (1/3) */}
            <div className="ser-hero-text-container">
              <h1 className="ser-hero-title">
                We Are <span className="ser-text-yellow-400">Digitotally</span>{" "}
                Here
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="ser-hero-buttons">
                <button className="ser-btn-primary">About Us</button>
                <button className="ser-btn-red">Our Services</button>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* PINNED FULL-WIDTH IMAGE */}
      <section className="ser-image-pin">
        <div className="ser-image-pin-bg"></div>
      </section>

      {/* OUR PROCESS */}
      <section className="ser-process-section">
        <h2 className="ser-process-title ser-serif">Our Process</h2>

        {/* Step 01 */}
        <div className="ser-process-step" data-step="1">
          <div className="ser-step-image-wrap">
            <div className="ser-step-image-container">
              <img
                className="ser-step-image"
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=1000&fit=crop"
                alt="Writing notes"
              />
            </div>
          </div>
          <div className="ser-step-content">
            <div className="ser-step-number ser-serif">01</div>
            <h3 className="ser-step-title ser-serif">
              We understand your needs.
            </h3>
            <div className="ser-step-subtitle">
              BUILDING STRATEGY AROUND YOUR PERSONAL GOALS
            </div>
            <p className="ser-step-desc">
              Before we make any recommendations, we take the time to understand
              your current financial position and where you'd like to be in the
              years ahead. Together, we map out your goals, priorities, and
              comfort levels so every step forward is grounded in your reality.
            </p>
            <div className="ser-outcome-box">
              <div className="ser-outcome-label">OUTCOME</div>
              <p className="ser-outcome-text">
                A clear foundation that ensures every decision is aligned with
                your goals and long-term vision.
              </p>
            </div>
          </div>
        </div>

        {/* Step 02 */}
        <div className="ser-process-step ser-reverse" data-step="2">
          <div className="ser-step-image-wrap">
            <div className="ser-step-image-container">
              <img
                className="ser-step-image"
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1000&fit=crop"
                alt="Calculator"
              />
            </div>
          </div>
          <div className="ser-step-content">
            <div className="ser-step-number ser-serif">02</div>
            <h3 className="ser-step-title ser-serif">We plan a strategy.</h3>
            <div className="ser-step-subtitle">
              TURNING YOUR AMBITIONS INTO A ROADMAP
            </div>
            <p className="ser-step-desc">
              With your goals in mind, we create a tailored investment strategy
              designed to fit your circumstances. Every recommendation is based
              on clarity and long-term thinking, so we make choices that
              directly benefit your unique situation.
            </p>
            <div className="ser-outcome-box">
              <div className="ser-outcome-label">OUTCOME</div>
              <p className="ser-outcome-text">
                A structured, personalised plan that aligns property
                opportunities with your financial objectives.
              </p>
            </div>
          </div>
        </div>

        {/* Step 03 */}
        <div className="ser-process-step" data-step="3">
          <div className="ser-step-image-wrap">
            <div className="ser-step-image-container">
              <img
                className="ser-step-image"
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=1000&fit=crop"
                alt="Presentation"
              />
            </div>
          </div>
          <div className="ser-step-content">
            <div className="ser-step-number ser-serif">03</div>
            <h3 className="ser-step-title ser-serif">We present a solution.</h3>
            <div className="ser-step-subtitle">
              TAILORING AN APPROACH TO MATCH YOUR NEEDS
            </div>
            <p className="ser-step-desc">
              With your strategy in place, we present the property and finance
              opportunities that bring it to life. Every recommendation is
              chosen to align with your circumstances and aspirations, ensuring
              the path forward feels clear and achievable.
            </p>
            <div className="ser-outcome-box">
              <div className="ser-outcome-label">OUTCOME</div>
              <p className="ser-outcome-text">
                A customised solution designed for long-term success, not
                one-size-fits-all advice.
              </p>
            </div>
          </div>
        </div>

        {/* Step 04 */}
        <div className="ser-process-step ser-reverse" data-step="4">
          <div className="ser-step-image-wrap">
            <div className="ser-step-image-container">
              <img
                className="ser-step-image"
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1000&fit=crop"
                alt="Houses"
              />
            </div>
          </div>
          <div className="ser-step-content">
            <div className="ser-step-number ser-serif">04</div>
            <h3 className="ser-step-title ser-serif">We source properties.</h3>
            <div className="ser-step-subtitle">
              FINDING THE RIGHT INVESTMENTS FOR YOU
            </div>
            <p className="ser-step-desc">
              Our team searches the market to identify properties that align
              with your identified plan. We focus on quality builds, strong
              locations, and long-term growth potential—ensuring every option
              supports your financial future.
            </p>
            <div className="ser-outcome-box">
              <div className="ser-outcome-label">OUTCOME</div>
              <p className="ser-outcome-text">
                Carefully selected properties that match your strategy and give
                you confidence in every purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Step 05 */}
        <div className="ser-process-step" data-step="5">
          <div className="ser-step-image-wrap">
            <div className="ser-step-image-container">
              <img
                className="ser-step-image"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=1000&fit=crop"
                alt="Review"
              />
            </div>
          </div>
          <div className="ser-step-content">
            <div className="ser-step-number ser-serif">05</div>
            <h3 className="ser-step-title ser-serif">We manage and review.</h3>
            <div className="ser-step-subtitle">
              SUPPORT THAT CONTINUES BEYOND THE PURCHASE
            </div>
            <p className="ser-step-desc">
              Securing a property is just the beginning. We stay by your side
              with ongoing support—from tenant management to regular six-month
              strategy reviews—so your investments stay aligned with your goals
              and adapt as life and markets change.
            </p>
            <div className="ser-outcome-box">
              <div className="ser-outcome-label">OUTCOME</div>
              <p className="ser-outcome-text">
                Long-term guidance that keeps your portfolio performing and your
                goals on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS HEADER + THEMED FEATURE CARDS */}
      <section className="ser-testimonials-section">
        <div className="ser-testimonials-header">
          <h2 className="ser-serif">Real people, lasting outcomes.</h2>
          <p>
            With our support, clients have secured properties, grown portfolios,
            and moved closer to the financial freedom they once thought was out
            of reach.
          </p>
          <a href="#" className="ser-btn-outline">
            ↗ START YOUR JOURNEY
          </a>
        </div>

        <div className="ser-features-grid">
          {/* Card 1 */}
          <div
            className="ser-card ser-animate-in ser-interactive-card"
            ref={addToCardsRef}
          >
            <h2 className="ser-text-6xl">
              <span style={{ color: "var(--ser-color-gold)" }}>60</span> - 30
            </h2>
            <p className="ser-mb-8 ser-text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis.
            </p>
            <div className="ser-flex ser-gap-2">
              <button
                className="ser-btn-red ser-interactive-element"
                style={{ flex: "1 1 30%" }}
              >
                One
              </button>
              <button
                className="ser-btn-primary ser-interactive-element"
                style={{ flex: "1 1 30%" }}
              >
                Two
              </button>
              <button
                className="ser-btn-primary ser-interactive-element"
                style={{ flex: "1 1 30%" }}
              >
                Three
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="ser-card ser-yellow-card ser-animate-in ser-interactive-card"
            ref={addToCardsRef}
          >
            <div className="ser-card-plus-icon">+</div>
            <h2 className="ser-text-4xl">
              BLACK &<br />
              BOLD
            </h2>
            <p className="ser-mb-8 ser-text-gray-800">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis.
            </p>
            <div className="ser-flex ser-items-center ser-gap-4">
              <button className="ser-btn-action ser-interactive-element">
                Action Here
              </button>
              <a href="#" className="ser-font-bold ser-interactive-element">
                Follow Through →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
