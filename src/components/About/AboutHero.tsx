import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ASCIIGlitchText from "../shared/ASCIIGlitchText";
import TiltTextGsap from "../UI/TiltTextGsap";
import ArchScrollReveal from "./ArchScrollReveal";
import "./AboutHero.css";

const publicUrl = import.meta.env.BASE_URL;

gsap.registerPlugin(ScrollTrigger);

const AboutHero: React.FC = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* -------- Custom Cursor -------- */
    const cursor = document.querySelector(".about-cursor");
    const interactiveElements = document.querySelectorAll(
      ".about-interactive-element"
    );

    if (cursor) {
      window.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
          duration: 0.3,
          x: e.clientX,
          y: e.clientY,
          ease: "power3.out",
        });
      });

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () =>
          cursor.classList.add("about-cursor-grow")
        );
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("about-cursor-grow")
        );
      });
    }

    /* -------- Scroll Animations -------- */
    gsap.utils.toArray(".about-animate-in").forEach((elem) => {
      gsap.fromTo(
        elem as gsap.TweenTarget,
        { autoAlpha: 0, y: 60, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: elem as gsap.DOMTarget,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    /* -------- Hero Parallax on Mouse Move -------- */
    const hero = document.querySelector(".about-hero-section");
    if (hero) {
      hero.addEventListener("mousemove", (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = hero.getBoundingClientRect();
        const clientX = mouseEvent.clientX - rect.left;
        const clientY = mouseEvent.clientY - rect.top;
        const { width, height } = rect;

        const xPos = (clientX / width - 0.5) * 30;
        const yPos = (clientY / height - 0.5) * 30;

        gsap.to(".about-hero-image-container", {
          duration: 1,
          x: -xPos,
          y: -yPos,
          ease: "power3.out",
        });
        gsap.to(".about-hero-text-container", {
          duration: 1,
          x: xPos,
          y: yPos,
          ease: "power3.out",
        });
      });

      hero.addEventListener("mouseleave", () => {
        gsap.to(".about-hero-image-container, .about-hero-text-container", {
          duration: 1,
          x: 0,
          y: 0,
          ease: "elastic.out(1, 0.5)",
        });
      });
    }

    /* -------- Interactive Card Tilt Effect -------- */
    const cards = document.querySelectorAll(".about-interactive-card");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = card.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        const { width, height } = rect;

        const rotateX = gsap.utils.mapRange(0, height, -10, 10, y);
        const rotateY = gsap.utils.mapRange(0, width, 10, -10, x);

        gsap.to(card, {
          duration: 0.7,
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          duration: 1,
          rotationX: 0,
          rotationY: 0,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });
  }, []);

  return (
    <div className="about-page antialiased">
      {/* Custom Cursor */}
      <div className="about-cursor"></div>

      {/* Main Content ONLY */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="about-hero-section p-8 md:p-12 mb-20">
          <div className="about-rule-of-thirds-grid">
            {/* Image (2/3) */}
            <div className="w-full h-auto rounded-2xl overflow-hidden about-animate-in about-hero-image-container">
              <img
                src={`${publicUrl}images/hero_poster.jpg`}
                alt="Man with headphones and microphone"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `${publicUrl}images/sercard1.jpg`;
                }}
              />
            </div>

            {/* Text Content (1/3) */}
            <div className="about-animate-in about-hero-text-container">
              <TiltTextGsap
                tag="h1"
                className="text-4xl md:text-5xl font-black mb-4 leading-tight"
                style={{
                  fontFamily: '"Dream Avenue", cursive',
                  color: "var(--text, #2c2c2c)",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                FORMA
              </TiltTextGsap>
              <div
                className="mb-8"
                style={{
                  color: "rgba(44, 44, 44, 0.75)",
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "1.1rem",
                  lineHeight: "1.7",
                  fontWeight: "400",
                }}
              >
                <ASCIIGlitchText
                  text="Crafting exceptional living spaces that blend luxury with nature's harmony."
                  className="about-interactive-element"
                  duration={800}
                  spread={0.8}
                  chars="░▒▓█▄▀▌▐■!?&#$@0123456789*.,·-─~+:;=*π"
                  tag="span"
                />{" "}
                <br />
                <ASCIIGlitchText
                  text="Our vision transforms architectural dreams into sustainable realities,"
                  className="about-interactive-element"
                  duration={900}
                  spread={0.7}
                  chars="░▒▓█▄▀▌▐■!?&#$@0123456789*.,·-─~+:;=*π"
                  tag="span"
                />{" "}
                <br />
                <ASCIIGlitchText
                  text="creating homes that nurture both body and soul."
                  className="about-interactive-element"
                  duration={700}
                  spread={0.9}
                  chars="░▒▓█▄▀▌▐■!?&#$@0123456789*.,·-─~+:;=*π"
                  tag="span"
                />
              </div>
              {/* Buttons removed per request */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Card 1 */}
          <div className="about-card p-8 md:p-12 about-animate-in about-interactive-card">
            <TiltTextGsap
              tag="h2"
              className="text-6xl md:text-8xl font-black mb-4"
              style={{
                fontFamily: '"Dream Avenue", cursive',
                color: "#0f0f0f",
                letterSpacing: "0.05em",
              }}
            >
              25 + Years
            </TiltTextGsap>
            <ASCIIGlitchText
              text="Excellence in architectural design and sustainable construction. Building dreams with precision, passion, and environmental consciousness for over two decades."
              className="mb-8 about-interactive-element"
              duration={900}
              spread={0.6}
              tag="p"
            />
            <div className="flex gap-2 flex-wrap">
              <Link
                to="/projects"
                className="about-btn-red flex-1 about-interactive-element min-w-[90px] text-center"
              >
                Portfolio
              </Link>
              <Link
                to="/about"
                className="about-btn-primary flex-1 about-interactive-element min-w-[90px] text-center"
              >
                Awards
              </Link>
              <Link
                to="/blog"
                className="about-btn-primary flex-1 about-interactive-element min-w-[90px] text-center"
              >
                Stories
              </Link>
            </div>
          </div>

          {/* Card 2 (Gold) */}
          <div className="about-card about-yellow-card p-8 md:p-12 relative about-animate-in about-interactive-card">
            <div
              className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                background: "var(--text, #2c2c2c)",
                color: "var(--cream, #faf8f3)",
              }}
            >
              <i className="fas fa-home"></i>
            </div>
            <TiltTextGsap
              tag="h2"
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{
                fontFamily: '"Dream Avenue", cursive',
                color: "var(--text, #2c2c2c)",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              LUXURY & NATURE
            </TiltTextGsap>
            <ASCIIGlitchText
              text="Where modern elegance meets natural harmony. Our designs celebrate the seamless integration of contemporary living with environmental stewardship."
              className="mb-8 about-interactive-element"
              duration={850}
              spread={0.7}
              tag="p"
            />
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to="/services"
                className="px-6 py-3 font-bold transition about-interactive-element"
                style={{
                  background: "var(--text, #2c2c2c)",
                  color: "var(--cream, #faf8f3)",
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "0.9rem",
                  letterSpacing: "0.5px",
                  borderRadius: 0,
                }}
              >
                Discover More
              </Link>
              <Link
                to="/contact"
                className="font-bold group about-interactive-element"
                style={{
                  color: "var(--text, #2c2c2c)",
                  fontFamily: '"Nunito", sans-serif',
                  fontSize: "0.9rem",
                  letterSpacing: "0.5px",
                }}
              >
                Get Started
                <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Arch Scroll Reveal Section */}
      <ArchScrollReveal />
    </div>
  );
};

export default AboutHero;
