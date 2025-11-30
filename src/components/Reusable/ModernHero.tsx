import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import GlassRainButton from "../UI/GlassRainButton";
import HomeHeroSlider from "../Home/HomeHeroSlider";

const publicUrl = import.meta.env.BASE_URL || "/";
const heroVideo = publicUrl.endsWith("/") 
  ? `${publicUrl}images/home_hero.mp4`
  : `${publicUrl}/images/home_hero.mp4`;

const ModernHero = () => {
  const curtainRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const scatterWordRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const subtitleDynamicRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const heroVideo = heroVideoRef.current;
    const videoEl = videoElRef.current;
    const text1El = text1Ref.current;
    const text2El = text2Ref.current;
    const scatterWordEl = scatterWordRef.current;
    const subtitleEl = subtitleRef.current;
    const subtitleDynamicEl = subtitleDynamicRef.current;
    const ctaEl = ctaRef.current;
    const newsEl = newsRef.current;
    const hero = heroRef.current;

    if (
      !curtain ||
      !heroVideo ||
      !videoEl ||
      !text1El ||
      !text2El ||
      !scatterWordEl ||
      !subtitleEl ||
      !subtitleDynamicEl ||
      !ctaEl ||
      !newsEl ||
      !hero
    )
      return;

    function createCharSpans(
      element: HTMLElement,
      text: string,
      extraClass?: string
    ) {
      element.innerHTML = "";
      const chars = text.split("");
      const spans: HTMLSpanElement[] = [];
      chars.forEach((ch) => {
        const span = document.createElement("span");
        if (ch === " ") {
          span.innerHTML = "&nbsp;";
        } else {
          span.textContent = ch;
        }
        if (extraClass) span.classList.add(extraClass);
        element.appendChild(span);
        spans.push(span);
      });
      return spans;
    }

    const TEXT1 = "INSPIRE";
    const TEXT2 = "A TRUE LIVING";
    const SCATTER_TEXT = "CREATE";

    const text1Spans = createCharSpans(text1El, TEXT1, "mh-text1-letter");
    const text2Spans = createCharSpans(text2El, TEXT2, "mh-text2-letter");
    const scatterSpans = createCharSpans(
      scatterWordEl,
      SCATTER_TEXT,
      "mh-scatter-letter"
    );

    const changingWords = ["ARCHITECTURAL", "IMMERSIVE", "SUSTAINABLE", "BESPOKE"];

    function animateSubtitleWord(index: number) {
      if (!subtitleDynamicEl) return;

      const text = changingWords[index];
      subtitleDynamicEl.innerHTML = "";
      const chars = text.split("");
      const spans: HTMLSpanElement[] = [];

      chars.forEach((ch) => {
        const span = document.createElement("span");
        span.textContent = ch;
        subtitleDynamicEl.appendChild(span);
        spans.push(span);
      });

      gsap.fromTo(
        spans,
        { opacity: 0, y: 20, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.08,
          duration: 1.1,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(spans, {
              opacity: 0,
              y: -20,
              filter: "blur(10px)",
              stagger: 0.08,
              delay: 1.8,
              duration: 0.9,
              ease: "power2.in",
              onComplete: () => {
                const nextIndex = (index + 1) % changingWords.length;
                animateSubtitleWord(nextIndex);
              },
            });
          },
        }
      );
    }

    gsap.set(scatterWordEl, { xPercent: -50, left: "50%", top: "50%" });

    // Wait for next frame to ensure proper dimensions
    const calculatePositions = () => {
      const heroRect = hero.getBoundingClientRect();
      const vw = heroRect.width;
      const vh = heroRect.height;

      // Use window dimensions for more reliable detection
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Fallback to window dimensions if hero dimensions seem incorrect
      const finalVw = vw > 0 ? vw : windowWidth;
      const finalVh = vh > 0 ? vh : windowHeight;

      let sizeLabel: string;
      if (windowWidth < 576) {
        sizeLabel = "small";
      } else if (windowWidth < 992) {
        sizeLabel = "medium";
      } else if (windowWidth < 1440) {
        sizeLabel = "large";
      } else {
        sizeLabel = "xlarge";
      }

      let logoTargetX: number, logoTargetY: number, assembleY: number;
      let ctaTargetX: number, ctaTargetY: number;
      let newsTargetX: number, newsTargetY: number;

      if (sizeLabel === "small") {
        logoTargetX = -finalVw / 2 + 70;
        logoTargetY = -finalVh / 2 + 25;
        assembleY = -110;
        ctaTargetX = 0;
        ctaTargetY = finalVh / 2 - 70;
        newsTargetX = finalVw / 2 - 115;
        newsTargetY = finalVh / 2 - 80;
      } else if (sizeLabel === "medium") {
        logoTargetX = -finalVw / 2 + 70;
        logoTargetY = -finalVh / 2 + 25;
        assembleY = -110;
        ctaTargetX = -finalVw / 2 + 150;
        ctaTargetY = finalVh / 2 - 90;
        newsTargetX = finalVw / 2 - 140;
        newsTargetY = finalVh / 2 - 100;
      } else {
        logoTargetX = -finalVw / 2 + 110;
        logoTargetY = -finalVh / 2 + 35;
        assembleY = -220;
        ctaTargetX = -finalVw / 2 + 170;
        ctaTargetY = finalVh / 2 - 100;
        newsTargetX = finalVw / 2 - 160;
        newsTargetY = finalVh / 2 - 110;
      }

      return {
        logoTargetX,
        logoTargetY,
        assembleY,
        ctaTargetX,
        ctaTargetY,
        newsTargetX,
        newsTargetY,
        sizeLabel,
        finalVw,
        finalVh,
      };
    };

    const positions = calculatePositions();

    const MAX_CONTAINER_WIDTH = 800;
    const MAX_CONTAINER_HEIGHT = 600;

    let scaleFactor: number, heightFraction: number;
    switch (positions.sizeLabel) {
      case "small":
        scaleFactor = 0.7;
        heightFraction = 0.85;
        break;
      case "medium":
        scaleFactor = 0.9;
        heightFraction = 0.75;
        break;
      case "large":
        scaleFactor = 1.2;
        heightFraction = 0.7;
        break;
      case "xlarge":
      default:
        scaleFactor = 1.4;
        heightFraction = 0.7;
        break;
    }

    const containerWidth = Math.min(
      MAX_CONTAINER_WIDTH * scaleFactor,
      positions.finalVw * 0.9
    );
    const containerHeight = Math.min(
      MAX_CONTAINER_HEIGHT * scaleFactor,
      positions.finalVh * heightFraction
    );

    let initialScale: number,
      marginX: number,
      marginY: number,
      minDistance: number;
    if (positions.sizeLabel === "small") {
      initialScale = 1.1;
      marginX = 40;
      marginY = 50;
      minDistance = 80;
    } else if (positions.sizeLabel === "medium") {
      initialScale = 1.3;
      marginX = 60;
      marginY = 70;
      minDistance = 100;
    } else {
      initialScale = 1.5;
      marginX = 70;
      marginY = 80;
      minDistance = 130;
    }

    const halfW = containerWidth / 2 - marginX;
    const halfH = containerHeight / 2 - marginY;

    function generateNonOverlappingPositions(
      count: number,
      halfW: number,
      halfH: number,
      minDist: number
    ) {
      const positions: { x: number; y: number }[] = [];
      const maxAttempts = 2000;
      let attempts = 0;
      const minDistSq = minDist * minDist;

      while (positions.length < count && attempts < maxAttempts) {
        attempts++;
        const x = (Math.random() * 2 - 1) * halfW;
        const y = (Math.random() * 2 - 1) * halfH;

        let ok = true;
        for (let p of positions) {
          const dx = x - p.x;
          const dy = y - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < minDistSq) {
            ok = false;
            break;
          }
        }

        if (ok) positions.push({ x, y });
      }

      while (positions.length < count) {
        const x = (Math.random() * 2 - 1) * halfW;
        const y = (Math.random() * 2 - 1) * halfH;
        positions.push({ x, y });
      }

      return positions;
    }

    const scatterPositions = generateNonOverlappingPositions(
      scatterSpans.length,
      halfW,
      halfH,
      minDistance
    );

    gsap.set([text1El, text2El], { opacity: 0 });
    gsap.set(scatterSpans, { x: 0, y: 0, opacity: 0, scale: 1 });

    videoEl.pause();
    videoEl.currentTime = 0;

    gsap.set(ctaEl, { x: positions.ctaTargetX, y: positions.ctaTargetY + 80 });
    gsap.set(newsEl, {
      x: positions.newsTargetX + 120,
      y: positions.newsTargetY,
    });

    const TEXT1_ENTRANCE_DURATION = 0.8;
    const TEXT1_EXIT_DURATION = 0.8;
    const TEXT2_ENTRANCE_DURATION = 0.8;
    const TEXT2_EXIT_DURATION = 0.8;
    const VIDEO_EXPAND_DURATION = 1.5;
    const SCATTER_FADE_DURATION = 0.4;
    const SCATTER_ASSEMBLE_DURATION = 1.5;
    const SUBTITLE_DELAY_AFTER_ASSEMBLY = 0.02;

    const tl = gsap.timeline();

    // Set initial positions with increased gap
    gsap.set(text1El, { y: -40 }); // INSPIRE 40px above center
    gsap.set(text2El, { y: 40 });  // A TRUE LIVING 40px below center
    
    // Both texts enter simultaneously - INSPIRE from top, A TRUE LIVING from bottom
    tl.fromTo(
        text1Spans,
        { y: -positions.finalVh * 0.7 },
        {
          y: -40, // Stay 40px above center
          duration: TEXT1_ENTRANCE_DURATION,
          ease: "back.out(1.4)",
          stagger: 0.08,
          onStart: () => {
            gsap.set(text1El, { opacity: 1 });
          },
        },
        0
      )
      .fromTo(
        text2Spans,
        { y: positions.finalVh * 0.7 },
        {
          y: 40, // Stay 40px below center
          duration: TEXT2_ENTRANCE_DURATION,
          ease: "back.out(1.4)",
          stagger: 0.08,
          onStart: () => {
            gsap.set(text2El, { opacity: 1 });
          },
        },
        0
      )
      .to(text1Spans, { y: -40, duration: 0.15 })
      .to(text2Spans, { y: 40, duration: 0.15 }, "<")
      // Texts exit in opposite directions - text1 to right, text2 to left
      .to(
        text1Spans,
        {
          x: positions.finalVw,
          duration: TEXT1_EXIT_DURATION,
          ease: "back.out(1.4)",
          stagger: 0.08,
        },
        "+=0.5"
      )
      .to(
        text2Spans,
        {
          x: -positions.finalVw,
          duration: TEXT2_EXIT_DURATION,
          ease: "back.out(1.4)",
          stagger: 0.08,
        },
        "<"
      )
      .to(
        heroVideo,
        {
          scale: 1,
          opacity: 1,
          duration: VIDEO_EXPAND_DURATION,
          ease: "power3.out",
          onStart: () => {
            videoEl.currentTime = 0;
            videoEl.play();
          },
        },
        "-=0.3"
      )
      .set(
        scatterSpans,
        {
          x: (i: number) => scatterPositions[i].x,
          y: (i: number) => scatterPositions[i].y,
          scale: initialScale,
          opacity: 0,
        },
        "videoScatter"
      )
      .to(
        scatterSpans,
        {
          opacity: 1,
          duration: SCATTER_FADE_DURATION,
          stagger: 0.05,
        },
        "videoScatter"
      )
      .to(
        scatterSpans,
        {
          x: 0,
          y: positions.assembleY,
          rotation: 0,
          scale: 1,
          duration: SCATTER_ASSEMBLE_DURATION,
          stagger: 0.08,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.5"
      )
      .set(
        scatterSpans,
        {
          opacity: 1,
        },
        "postAssemble"
      )
      .add("postAssemble")
      .to(
        ctaEl,
        {
          x: positions.ctaTargetX,
          y: positions.ctaTargetY,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "postAssemble-=0"
      )
      .to(
        newsEl,
        {
          x: positions.newsTargetX,
          y: positions.newsTargetY,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "postAssemble+=0"
      )
      .to(
        subtitleEl,
        {
          opacity: 1,
          y: -10,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            animateSubtitleWord(0);
          },
        },
        "postAssemble+=" + SUBTITLE_DELAY_AFTER_ASSEMBLY
      );
  }, []);

  return (
    <div className="mh-hero" ref={heroRef}>
      <style>{`
        .mh-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          overflow: hidden;
          background-color: #171717;
        }


        .mh-curtain {
          position: absolute;
          inset: 0;
          background-color: #47614d;
          z-index: 40;
          transform: translateX(-100%);
        }

        .mh-text-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          overflow: visible; /* avoid clipping scatter letters (Firefox positioning) */
          pointer-events: none;
        }

        .mh-hero-text {
          position: absolute;
          font-size: 7rem;
          font-weight: 400;
          color: white;
          letter-spacing: -0.04em;
          white-space: nowrap;
        }

        .mh-hero-text span {
          display: inline-block;
        }
        
        .mh-text2-letter {
          margin-right: 0.05em;
        }

        .mh-hero-text {
          font-weight: 300;
        }

        .mh-scatter-word {
          position: absolute;
          text-transform: uppercase;
          font-size: 16rem;
          font-weight: 300;
          text-align: center;
        }

        .mh-scatter-letter {
          display: inline-block;
          position: relative;
          color: #ffffff;
        }

        .mh-subtitle {
          position: absolute;
          top: 60%;
          left: 50%;
          transform: translateX(-85%);
          color: #ffffff;
          font-size: 2.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          opacity: 0;
        }

        .mh-subtitle-static {
          white-space: nowrap;
        }

        .mh-subtitle-dynamic span {
          display: inline-block;
        }

        .mh-hero-video {
          position: absolute;
          inset: 0;
          z-index: 45;
          transform: scale(0);
          transform-origin: left bottom;
          opacity: 0;
          overflow: hidden;
        }

        .mh-hero-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mh-image-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.35);
        }


        .mh-ui-cta {
          position: absolute;
          z-index: 60;
          pointer-events: auto;
          opacity: 0;
        }

        .mh-ui-cta .glass-rain-btn {
          all: unset;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          border-left: none;
          border-right: none;
          border-radius: 0px;
          text-transform: uppercase;
          font-size: 0.96rem;
          letter-spacing: 0.16em;
          text-decoration: none;
          color: #ffffff;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
          font-family: "Nunito", sans-serif;
          box-sizing: border-box;
        }

        .mh-ui-cta .glass-rain-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .mh-ui-news {
          position: absolute;
          z-index: 60;
          pointer-events: auto;
          opacity: 0;
        }

        .mh-ui-news-card {
          min-width: 220px;
          max-width: 260px;
          padding: 0.9rem 1rem;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.4);
          color: #e5e7eb;
        }

        .mh-ui-news-label {
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 0.35rem;
        }

        .mh-ui-news-title {
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .mh-ui-news-meta {
          font-size: 0.75rem;
          opacity: 0.8;
          display: flex;
          justify-content: space-between;
          margin-top: 0.35rem;
        }

        @media (max-width: 575.98px) {
          .mh-hero-text,
          .mh-scatter-word {
            font-size: 3rem;
            letter-spacing: 3px;
          }
          .mh-scatter-word {
            font-size: 3.4rem;
            letter-spacing: 3px;
            white-space: nowrap;
          }

          .mh-subtitle {
            font-size: 1.615rem;
            letter-spacing: 0.12em;
            top: calc(50% - 10px);
            left: calc(50% - 5px);
            white-space: nowrap;
          }

          .mh-ui-menu {
            font-size: 1.55rem;
            letter-spacing: 0.18em;
            color: #ffffff;
          }


          .mh-ui-news-card {
            min-width: 190px;
            max-width: 210px;
          }

          .mh-ui-news {
            display: none;
          }

          .mh-ui-cta .glass-rain-btn {
            padding: 1.125rem 1.75rem;
            font-size: 0.86rem;
          }
        }

        @media (min-width: 576px) and (max-width: 991.98px) {
          .mh-hero-text,
          .mh-scatter-word {
            font-size: 4.5rem;
          }

          .mh-subtitle {
            font-size: 1.1rem;
            letter-spacing: 0.2em;
            top: 63%;
          }

          .mh-ui-menu {
            font-size: 0.8rem;
          }
        }

        @media (min-width: 992px) and (max-width: 1439.98px) {
          .mh-hero-text {
            font-size: 15rem;
          }
          .mh-scatter-word {
            font-size: 10rem;
          }

          .mh-subtitle {
            font-size: 1.98rem;
            letter-spacing: 0.22em;
            top: calc(50% - 60px);
            left: calc(50% - 30px);
          }
        }

        @media (min-width: 1440px) {
          .mh-hero-text,
          .mh-scatter-word {
            font-size: 7rem;
          }

          .mh-subtitle {
            font-size: 2.20rem;
            letter-spacing: 0.26em;
            top: calc(57% - 70px);
            left: calc(50% - 30px);
          }
        }
      `}</style>

      <div className="mh-curtain" ref={curtainRef}></div>

      <div className="mh-text-container">
        <h1 className="mh-hero-text" ref={text1Ref}></h1>
        <h1 className="mh-hero-text" ref={text2Ref}></h1>
        <h1 className="mh-scatter-word" ref={scatterWordRef}></h1>

        <div className="mh-subtitle" ref={subtitleRef}>
          <span className="mh-subtitle-static">Something </span>
          <span className="mh-subtitle-dynamic" ref={subtitleDynamicRef}></span>
        </div>

        <div className="mh-ui-cta" ref={ctaRef}>
          <GlassRainButton>Start a Project</GlassRainButton>
        </div>

        <HomeHeroSlider ref={newsRef} />
      </div>

      <div className="mh-hero-video" ref={heroVideoRef}>
        <video ref={videoElRef} src={heroVideo} muted loop playsInline />
        <div className="mh-image-overlay"></div>
      </div>
    </div>
  );
};

// Memoized so React doesn't rerender and wipe the GSAP-managed DOM nodes
export default memo(ModernHero);
