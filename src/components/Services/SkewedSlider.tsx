import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SkewedSlider: React.FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // DESKTOP: full-bleed skewed contact storytelling for Forma (architecture studio)
  const pages = [
    {
      leftBg:
        "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600",
      rightBg: "#141414",
      leftHeading: "Forma Studio",
      leftDesc:
        "We design calm, precise architecture for homes and hospitality spaces that feel effortless to live in.",
      leftLink: "View studio profile",
      rightHeading: "Contact Forma",
      rightDesc:
        "Use this page to tell us about your site, your timeline and the kind of space you want to create.",
    },
    {
      leftBg: "#181818",
      rightBg:
        "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1600",
      leftHeading: "Residential Projects",
      leftDesc:
        "Renovations, extensions and new builds — we shape light, volume and material to support the way you live.",
      leftLink: "Share your home brief",
      rightHeading: "For homeowners",
      rightDesc:
        "Tell us where your property is, who lives there and how you’d like your days to feel in the finished space.",
    },
    {
      leftBg:
        "https://images.pexels.com/photos/3237819/pexels-photo-3237819.jpeg?auto=compress&cs=tinysrgb&w=1600",
      rightBg: "#191919",
      leftHeading: "Commercial & Hospitality",
      leftDesc:
        "From lobbies and cafes to boutique stays, we design spaces that quietly communicate your brand.",
      leftLink: "Discuss a collaboration",
      rightHeading: "For brands & developers",
      rightDesc:
        "Share your site, program, budget range and opening date so we can respond with a clear way to move forward.",
    },
    {
      leftBg: "#101010",
      rightBg:
        "https://images.pexels.com/photos/981781/pexels-photo-981781.jpeg?auto=compress&cs=tinysrgb&w=1600",
      leftHeading: "How we begin",
      leftDesc:
        "A short call, a site walk-through or a screenshare over your plans — whatever feels easiest for you.",
      leftLink: "Download our process guide",
      rightHeading: "What to prepare",
      rightDesc:
        "Any existing drawings, survey, inspiration images and rough budget. Perfect information is not required.",
    },
    {
      leftBg:
        "https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg?auto=compress&cs=tinysrgb&w=1600",
      rightBg: "#181818",
      leftHeading: "Ready to talk?",
      leftDesc:
        "Email studio@forma.archi or use the form below. We respond within one business day with a considered next step.",
      leftLink: "Email the studio",
      rightHeading: "Studio details",
      rightDesc:
        "FORMA ARCHITECTURE · Melbourne & Sydney\nstudio@forma.archi · +61 (0)3 9000 0000",
    },
  ];

  // MOBILE: 4 plain contact slides for Forma
  const mobileSlides = [
    {
      heading: "Tell us about your project",
      label: "Contact Forma",
      desc: "Share a few lines about your home, site or idea — where it is, who it’s for and what you’d like it to become.",
    },
    {
      heading: "How you’d like to work",
      label: "Process",
      desc: "Do you prefer a slow, considered process or a tight timeline? Let us know your budget range and ideal completion date.",
    },
    {
      heading: "Best way to reach you",
      label: "Details",
      desc: "Add your name, email, phone and any links to plans or inspiration boards so we can reply with something genuinely useful.",
    },
    {
      heading: "What happens next",
      label: "Next step",
      desc: "We’ll review your note, then suggest a short call or meeting and outline a clear, simple path to move forward with Forma.",
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
      // -------- MOBILE: GSAP ScrollTrigger that pins entire section and scrolls 4 text slides --------
      const mobileEl = container.querySelector(
        ".skew-mobile"
      ) as HTMLDivElement | null;
      const inner = mobileEl?.querySelector(
        ".skew-mobile__inner"
      ) as HTMLDivElement | null;
      const slides = mobileEl?.querySelectorAll(
        ".skew-mobile__slide"
      ) as NodeListOf<HTMLDivElement> | null;

      if (!mobileEl || !inner || !slides || slides.length === 0) return;

      const total = slides.length;

      // stack slides vertically; inner will be moved with yPercent
      gsap.set(inner, { yPercent: 0 });

      const tl = gsap.to(inner, {
        yPercent: -100 * (total - 1),
        ease: "none",
        paused: true,
      });

      const st = ScrollTrigger.create({
        trigger: container, // pin the whole contact section
        start: "top top",
        end: () => "+=" + window.innerHeight * (total - 1),
        pin: true,
        scrub: 0.7,
        snap: {
          snapTo: (value) => {
            const index = Math.round(value * (total - 1));
            return index / (total - 1);
          },
          duration: 0.25,
          ease: "power1.out",
        },
        onUpdate: (self) => {
          tl.progress(self.progress);
        },
      });

      return () => {
        st.kill();
        tl.kill();
      };
    }

    // -------- DESKTOP: original skewed slider behaviour (wheel + arrows) --------
    const pageElements = Array.from(
      container.querySelectorAll<HTMLDivElement>(".skew-page")
    );

    let current = 0;
    const animTime = 1000;
    let isAnimating = false;

    function setClasses() {
      pageElements.forEach((page, index) => {
        page.classList.remove("skew-active", "skew-inactive");
        if (index === current) {
          page.classList.add("skew-active");
        } else if (index < current) {
          page.classList.add("skew-inactive");
        }
      });
    }

    function paginate() {
      isAnimating = true;
      setClasses();
      window.setTimeout(() => {
        isAnimating = false;
      }, animTime);
    }

    function navigateDown() {
      if (isAnimating || current === pageElements.length - 1) return;
      current++;
      paginate();
    }

    function navigateUp() {
      if (isAnimating || current === 0) return;
      current--;
      paginate();
    }

    const sliderInView = () => {
      const rect = container.getBoundingClientRect();
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      return rect.top >= -1 && rect.bottom <= viewportH + 1;
    };

    const wheelHandler = (e: WheelEvent) => {
      if (!sliderInView()) return;

      if (isAnimating) {
        e.preventDefault();
        return;
      }

      const goingDown = e.deltaY > 0;
      const atFirst = current === 0;
      const atLast = current === pageElements.length - 1;

      if (goingDown && !atLast) {
        e.preventDefault();
        navigateDown();
      } else if (!goingDown && !atFirst) {
        e.preventDefault();
        navigateUp();
      }
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (!sliderInView()) return;
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      const atFirst = current === 0;
      const atLast = current === pageElements.length - 1;

      if (e.key === "ArrowDown" && !atLast) {
        e.preventDefault();
        navigateDown();
      } else if (e.key === "ArrowUp" && !atFirst) {
        e.preventDefault();
        navigateUp();
      }
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("keydown", keyHandler);

    setClasses();

    return () => {
      container.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  const isImage = (bg: string) => bg.startsWith("http");

  return (
    <div ref={containerRef} className={`skew-container ${className}`}>
      <style>{`
        .skew-container {
          position: relative;
          height: 100vh;
          width: 100%;
          background: #111;
          font-family: "Open Sans", Helvetica, Arial, sans-serif;
          overflow: hidden;
        }

        /* ---------- DESKTOP SKEWED CONTACT STORY ---------- */
        .skew-pages {
          position: relative;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .skew-page {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }

        .skew-page__half {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100vh;
          transition: transform 1s;
        }

        .skew-page__half--left {
          left: 0;
          transform: translate3d(-32.4vh, 100%, 0);
        }

        .skew-page__half--right {
          left: 50%;
          transform: translate3d(32.4vh, -100%, 0);
        }

        .skew-page.skew-active .skew-page__half {
          transform: translate3d(0, 0, 0);
        }

        .skew-page__skewed {
          overflow: hidden;
          position: absolute;
          top: 0;
          width: 140%;
          height: 100%;
          transform: skewX(-18deg);
          background: #000;
        }

        .skew-page__half--left .skew-page__skewed {
          left: -40%;
        }

        .skew-page__half--right .skew-page__skewed {
          right: -40%;
        }

        .skew-page__content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-flow: column wrap;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          padding: 0 30%;
          color: #fff;
          transform: skewX(18deg);
          transition: transform 1s, opacity 1s;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          text-align: center;
        }

        .skew-page__half--left .skew-page__content {
          padding-left: 30%;
          padding-right: 30%;
          transform-origin: 100% 0;
        }

        .skew-page__half--right .skew-page__content {
          padding-left: 30%;
          padding-right: 30%;
          transform-origin: 0 100%;
        }

        .skew-page.skew-inactive .skew-page__content {
          opacity: 0.5;
          transform: skewX(18deg) scale(0.95);
        }

        .skew-page__heading {
          margin-bottom: 15px;
          text-transform: uppercase;
          font-size: 25px;
          text-align: center;
          letter-spacing: 0.14em;
        }

        .skew-page__description {
          font-size: 18px;
          text-align: center;
          max-width: 28rem;
          line-height: 1.6;
          white-space: pre-line;
        }

        .skew-page__link {
          color: #f2c265;
          margin-top: 1.5rem;
          text-decoration: none;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .skew-hint {
          position: absolute;
          right: 20px;
          bottom: 20px;
          color: #aaa;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          pointer-events: none;
        }

        /* ---------- MOBILE CONTACT SLIDER (GSAP + ScrollTrigger) ---------- */
        .skew-mobile {
          display: none;
        }

        @media (max-width: 900px) {
          .skew-container {
            height: 100vh; /* important for pinning, avoids weird blank space */
            overflow: hidden;
          }

          /* Hide desktop skew on mobile; we use dedicated mobile slider */
          .skew-pages {
            display: none;
          }

          .skew-mobile {
            display: block;
            position: relative;
            height: 100vh;
            background: #111111;
            color: #f5f5f5;
            overflow: hidden;
          }

          .skew-mobile__inner {
            position: relative;
            width: 100%;
          }

          .skew-mobile__slide {
            min-height: 100vh;
            padding: 2.75rem 1.75rem 2.25rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }

          .skew-mobile__label {
            font-size: 0.7rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            opacity: 0.55;
            margin-bottom: 0.9rem;
          }

          .skew-mobile__heading {
            font-size: 1.6rem;
            line-height: 1.2;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            margin-bottom: 1rem;
          }

          .skew-mobile__desc {
            font-size: 0.98rem;
            line-height: 1.7;
            max-width: 22rem;
            opacity: 0.9;
          }

          .skew-hint {
            right: 14px;
            bottom: 14px;
            font-size: 0.65rem;
          }
        }
      `}</style>

      {/* DESKTOP: skewed contact storytelling for Forma */}
      <div className="skew-pages">
        {pages.map((page, index) => (
          <div
            key={index}
            className={`skew-page skew-page-${index + 1} ${
              index === 0 ? "skew-active" : ""
            }`}
          >
            <div className="skew-page__half skew-page__half--left">
              <div className="skew-page__skewed">
                <div
                  className="skew-page__content"
                  style={
                    isImage(page.leftBg)
                      ? { backgroundImage: `url(${page.leftBg})` }
                      : { backgroundColor: page.leftBg }
                  }
                >
                  <h2 className="skew-page__heading">{page.leftHeading}</h2>
                  <p className="skew-page__description">{page.leftDesc}</p>
                  {page.leftLink && (
                    <a href="#" className="skew-page__link">
                      {page.leftLink}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="skew-page__half skew-page__half--right">
              <div className="skew-page__skewed">
                <div
                  className="skew-page__content"
                  style={
                    isImage(page.rightBg)
                      ? { backgroundImage: `url(${page.rightBg})` }
                      : { backgroundColor: page.rightBg }
                  }
                >
                  <h2 className="skew-page__heading">{page.rightHeading}</h2>
                  <p className="skew-page__description">{page.rightDesc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE: contact-focused ScrollTrigger slider */}
      <div className="skew-mobile">
        <div className="skew-mobile__inner">
          {mobileSlides.map((slide, index) => (
            <div key={index} className="skew-mobile__slide">
              <div className="skew-mobile__label">
                {slide.label} · 0{index + 1}/04
              </div>
              <h2 className="skew-mobile__heading">{slide.heading}</h2>
              <p className="skew-mobile__desc">{slide.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="skew-hint">Scroll / Swipe</div>
    </div>
  );
};

export default SkewedSlider;
