import React, { useEffect, useRef, Component } from "react";
import gsap from "gsap";
import "./NewHeroSection.css";
import { useNewHero } from "../../hooks/useHome";
import GlassRainButton from "../UI/GlassRainButton";

const publicUrl = import.meta.env.BASE_URL;
const posterImage = `${publicUrl}images/Petralithe_Automne.webp`;
const heroVideo = `${publicUrl}images/services-hero.mp4`;

// Error Boundary Component
class HeroErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <section className="hero-section">
          <div>Error loading hero content</div>
        </section>
      );
    }

    return this.props.children;
  }
}

const NewHeroSectionContent: React.FC = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const secondLineRef = useRef<HTMLDivElement | null>(null);
  const { heroData } = useNewHero();

  // Phrases for cycling animation
  const phrases = [
    "Excellence",
    "Innovation", 
    "Heritage",
    "Future"
  ];

  // Split characters for scatter animation
  const splitChars = (el: HTMLElement): HTMLElement[] => {
    el.textContent = "";
    const chars: HTMLElement[] = [];

    // Create container for first text
    const firstLineContainer = document.createElement("div");
    firstLineContainer.classList.add("line-container");
    
    // Split first text into characters
    [..."WE BUILD"].forEach((ch) => {
      const charSpan = document.createElement("span");
      charSpan.classList.add("char");
      charSpan.textContent = ch;
      firstLineContainer.appendChild(charSpan);
      chars.push(charSpan);
    });
    
    el.appendChild(firstLineContainer);

    return chars;
  };

  // Text cycling animation for second line
  useEffect(() => {
    const secondLine = secondLineRef.current;
    if (!secondLine) return;

    let currentIndex = 0;
    let timeoutId: number | null = null;

    function showText(index: number, isInitial: boolean = false) {
      if (!secondLine) return;
      
      const phrase = phrases[index];
      const chars = phrase.split('');
      
      secondLine.textContent = '';
      
      const charSpans: HTMLElement[] = [];
      chars.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        
        span.style.opacity = '0';
        span.style.transform = `translate(${gsap.utils.random(-220, 220)}px, ${gsap.utils.random(-140, 140)}px) rotate(${gsap.utils.random(-40, 40)}deg) scale(${gsap.utils.random(0.6, 0.9)})`;
        span.style.filter = 'blur(14px)';
        
        secondLine.appendChild(span);
        charSpans.push(span);
      });

      if (isInitial) {
        return charSpans;
      } else {
        gsap.fromTo(
          charSpans,
          {
            x: () => gsap.utils.random(-220, 220),
            y: () => gsap.utils.random(-140, 140),
            rotation: () => gsap.utils.random(-40, 40),
            scale: () => gsap.utils.random(0.6, 0.9),
            opacity: 0,
            filter: "blur(14px)",
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "expo.out",
            stagger: { each: 0.035, from: "center" },
            onComplete: () => {
              // Hold for 2 seconds, then animate out with scatter effect
              timeoutId = window.setTimeout(() => {
                gsap.to(charSpans, {
                  x: () => gsap.utils.random(-220, 220),
                  y: () => gsap.utils.random(-140, 140),
                  rotation: () => gsap.utils.random(-40, 40),
                  scale: () => gsap.utils.random(0.6, 0.9),
                  opacity: 0,
                  filter: "blur(14px)",
                  duration: 1.2,
                  ease: "expo.in",
                  stagger: { each: 0.03, from: "center" },
                  onComplete: () => {
                    currentIndex = (currentIndex + 1) % phrases.length;
                    showText(currentIndex, false);
                  }
                });
              }, 2000);
            }
          }
        );
      }
    }

    showText(0, true);

    const startCycling = () => {
      timeoutId = window.setTimeout(() => {
        currentIndex = (currentIndex + 1) % phrases.length;
        showText(currentIndex, false);
      }, 2000); 
    };

    (secondLine as any).startCycling = startCycling;

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      gsap.killTweensOf(secondLine);
    };
  }, []);

  // Hero text animation
  useEffect(() => {
    const heading = heroHeadingRef.current;
    if (!heading) return;

    const chars = splitChars(heading);
    const section = heading.closest(".hero-section");
    if (!section) return;

    const config = chars.map(() => ({
      x: gsap.utils.random(-220, 220),
      y: gsap.utils.random(-140, 140),
      r: gsap.utils.random(-40, 40),
      s: gsap.utils.random(0.6, 0.9),
    }));

    const tl = gsap.timeline({ paused: true });

    // Add 2-second delay before starting animations
    tl.to({}, { duration: 2.0 }); // 2-second delay

    tl.fromTo(
      chars,
      {
        x: (i) => config[i].x,
        y: (i) => config[i].y,
        rotation: (i) => config[i].r,
        scale: (i) => config[i].s,
        opacity: 0,
        filter: "blur(14px)",
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "expo.out",
        stagger: { each: 0.035, from: "center" },
      }
    );

    tl.to(
      heading,
      {
        "--u-scale": 1,
        duration: 0.9,
        ease: "power2.out",
      },
      "-=0.7"
    );

    // Add second line animation to main timeline
    const secondLine = secondLineRef.current;
    if (secondLine && (secondLine as any).startCycling) {
      const secondLineChars = secondLine.querySelectorAll('span');
      
      tl.fromTo(
        secondLineChars,
        {
          x: () => {
            const transform = secondLineChars[0]?.style.transform || '';
            const match = transform.match(/translate\(([^,]+)px/);
            return match ? parseFloat(match[1]) : gsap.utils.random(-220, 220);
          },
          y: () => {
            const transform = secondLineChars[0]?.style.transform || '';
            const match = transform.match(/translate\([^,]+,\s*([^)]+)px/);
            return match ? parseFloat(match[1]) : gsap.utils.random(-140, 140);
          },
          rotation: () => {
            const transform = secondLineChars[0]?.style.transform || '';
            const match = transform.match(/rotate\(([^)]+)deg/);
            return match ? parseFloat(match[1]) : gsap.utils.random(-40, 40);
          },
          scale: () => {
            const transform = secondLineChars[0]?.style.transform || '';
            const match = transform.match(/scale\(([^)]+)\)/);
            return match ? parseFloat(match[1]) : gsap.utils.random(0.6, 0.9);
          },
          opacity: 0,
          filter: "blur(14px)",
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "expo.out",
          stagger: { each: 0.035, from: "center" },
          onComplete: () => {
            (secondLine as any).startCycling();
          }
        },
        "-=1.2"
      );
    }

    // Start animation after preloader completes + additional delay to match Services hero
    setTimeout(() => {
      tl.restart();
    }, 5500); // 3.5s preloader + 2s delay = 5.5s total to match Services hero timing

    return () => {
      gsap.killTweensOf(heading);
      gsap.killTweensOf(chars);
    };
  }, []);

  return (
    <>
      <section
        ref={heroSectionRef}
        className="hero-section new-hero-section"
        id="new-hero-section"
      >
        {/* Poster image - static image that shows while video loads */}
        <div
          className="image-background video-poster"
          style={{
            backgroundImage: `url(${posterImage})`,
          }}
        />

        {/* Video - loads over the poster image */}
        <video
          className="video-background"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          preload="auto"
          onCanPlay={() => {
            // Keep poster visible for 2-3 seconds before showing video
            setTimeout(() => {
              const poster = document.querySelector(
                "#new-hero-section .video-poster"
              );
              if (poster) {
                (poster as HTMLElement).style.opacity = "0";
              }
            }, 2500); // 2.5 seconds delay
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-text">
            <h1 ref={heroHeadingRef}>
              {/* Characters will be populated by splitChars function */}
            </h1>
            <div className="hero-second-line" ref={secondLineRef}>
              {/* Text will be populated by animation */}
            </div>
          </div>

          <div className="hero-cta">
            <GlassRainButton href={heroData?.cta.link || "#about"}>
              {heroData?.cta.text || "Discover Our Story"}
            </GlassRainButton>
          </div>
        </div>
      </section>
    </>
  );
};

const NewHeroSection: React.FC = () => {
  return (
    <HeroErrorBoundary>
      <NewHeroSectionContent />
    </HeroErrorBoundary>
  );
};

export default NewHeroSection;
