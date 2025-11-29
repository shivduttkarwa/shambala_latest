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
      leftHeading: "Contact Forma Studio",
      leftDesc:
        "FORMA is a small architecture studio working across homes, hospitality and thoughtful commercial spaces.\n\nUse this page to begin a calm, clear conversation about your project.",
      leftLink: "About the studio",
      rightHeading: "Start a new enquiry",
      rightDesc:
        "Share where your project is, what type of space it is (home, hospitality, workspace) and the kind of atmosphere you’d like to create.",
    },
    {
      leftBg: "#181818",
      rightBg:
        "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1600",
      leftHeading: "For homeowners",
      leftDesc:
        "Renovations, extensions and new builds. We consider light, volume, landscape and joinery so your home feels quietly resolved rather than over-designed.",
      leftLink: "Share your home brief",
      rightHeading: "What to include",
      rightDesc:
        "• Suburb / site location\n• Existing drawings or photos (if available)\n• Rough budget range\n• Ideal start and completion dates",
    },
    {
      leftBg:
        "https://images.pexels.com/photos/3237819/pexels-photo-3237819.jpeg?auto=compress&cs=tinysrgb&w=1600",
      rightBg: "#191919",
      leftHeading: "For brands & developers",
      leftDesc:
        "We work on boutique hospitality, multi-res and commercial projects where architecture, interiors and brand need to align in a quiet, confident way.",
      leftLink: "Discuss a collaboration",
      rightHeading: "Project outlines",
      rightDesc:
        "• Site address and program (rooms, uses)\n• Brand or operator, if confirmed\n• Target opening date\n• Any planning constraints to be aware of",
    },
    {
      leftBg: "#101010",
      rightBg:
        "https://images.pexels.com/photos/981781/pexels-photo-981781.jpeg?auto=compress&cs=tinysrgb&w=1600",
      leftHeading: "How we begin",
      leftDesc:
        "Most projects begin with a short, no-pressure call and, where possible, a site visit. From there we outline a clear fee proposal and staged process.",
      leftLink: "Download process overview",
      rightHeading: "What happens next",
      rightDesc:
        "• We review your enquiry and any material you send\n• We respond within one business day\n• We propose a call or meeting and a simple pathway forward",
    },
    {
      leftBg:
        "https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg?auto=compress&cs=tinysrgb&w=1600",
      rightBg: "#181818",
      leftHeading: "Studio contact details",
      leftDesc:
        "Prefer to reach out directly? You can email, call or meet us by appointment in Melbourne or Sydney.",
      leftLink: "Email the studio",
      rightHeading: "Forma Studio — Contact",
      rightDesc:
        "Email · studio@forma.archi\nPhone · +61 (0)3 9000 0000\n\nMelbourne Studio\nLevel 3, 150 Gertrude Street\nFitzroy, VIC 3065\n\nSydney Studio\nSuite 02, 44 Kippax Street\nSurry Hills, NSW 2010",
    },
  ];

  // MOBILE: 4 plain contact slides for Forma + form below
  const mobileSlides = [
    {
      heading: "Tell us about your project",
      label: "Contact Forma",
      desc: "Share a few lines about your home, site or idea — where it is, who it’s for and what you’d like it to become with Forma.",
    },
    {
      heading: "Scope & budget",
      label: "Project scope",
      desc: "Is this a renovation, extension, new build or hospitality space? Include a rough budget range and any timing constraints you already know.",
    },
    {
      heading: "How to reach you",
      label: "Details",
      desc: "Add your name, email, phone and any links to plans or inspiration boards so we can respond with something genuinely tailored.",
    },
    {
      heading: "What happens next",
      label: "Next step",
      desc: "We review your note, then suggest a short call or meeting and outline a clear, simple path to move forward with Forma Studio.",
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 900px)").matches;

    // Helper: GSAP reveal for desktop slide
    const animateDesktopSlide = (index: number) => {
      const page = container.querySelector(
        `.skew-page-${index + 1}`
      ) as HTMLDivElement | null;
      if (!page) return;
      const elems = page.querySelectorAll(
        ".skew-page__heading, .skew-page__description, .skew-page__link"
      );
      gsap.fromTo(
        elems,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
        }
      );
    };

    // Helper: GSAP reveal for mobile slide
    const animateMobileSlide = (index: number) => {
      const mobileEl = container.querySelector(
        ".skew-mobile"
      ) as HTMLDivElement | null;
      if (!mobileEl) return;
      const slides = mobileEl.querySelectorAll(
        ".skew-mobile__slide"
      ) as NodeListOf<HTMLDivElement>;
      const slide = slides[index];
      if (!slide) return;
      const elems = slide.querySelectorAll(
        ".skew-mobile__label, .skew-mobile__heading, .skew-mobile__desc"
      );
      gsap.fromTo(
        elems,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }
      );
    };

    if (isMobile) {
      // -------- MOBILE: GSAP ScrollTrigger that pins only the mobile slider --------
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

      gsap.set(inner, { yPercent: 0 });

      const tl = gsap.to(inner, {
        yPercent: -100 * (total - 1),
        ease: "none",
        paused: true,
      });

      let currentMobile = 0;
      animateMobileSlide(0);

      const st = ScrollTrigger.create({
        trigger: mobileEl,
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
          const raw = self.progress * (total - 1);
          const index = Math.round(raw);
          if (index !== currentMobile) {
            currentMobile = index;
            animateMobileSlide(currentMobile);
          }
        },
      });

      return () => {
        st.kill();
        tl.kill();
      };
    }

    // -------- DESKTOP: skewed slider behaviour (wheel + arrows) --------
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
      animateDesktopSlide(current);
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
    animateDesktopSlide(0);

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
          width: 100%;
          background: #111;
          font-family: "Open Sans", Helvetica, Arial, sans-serif;
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
          padding: 0 24%;
          color: #fff;
          transform: skewX(18deg);
          transition: transform 1s, opacity 1s;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          text-align: center;
        }

        /* Dark overlay over all backgrounds for legibility */
        .skew-page__content {
          position: relative;
        }

        .skew-page__content::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.7),
              rgba(0, 0, 0, 0.9)
            );
          mix-blend-mode: normal;
          z-index: 0;
        }

        .skew-page__content > * {
          position: relative;
          z-index: 1;
        }

        .skew-page__half--left .skew-page__content {
          padding-left: 24%;
          padding-right: 24%;
          transform-origin: 100% 0;
        }

        .skew-page__half--right .skew-page__content {
          padding-left: 24%;
          padding-right: 24%;
          transform-origin: 0 100%;
        }

        .skew-page.skew-inactive .skew-page__content {
          opacity: 0.45;
          transform: skewX(18deg) scale(0.95);
        }

        .skew-page__heading {
          margin-bottom: 18px;
          text-transform: uppercase;
          font-size: 34px;
          text-align: center;
          letter-spacing: 0.18em;
        }

        .skew-page__description {
          font-size: 18px;
          text-align: center;
          max-width: 30rem;
          line-height: 1.8;
          white-space: pre-line;
        }

        .skew-page__link {
          color: #f2c265;
          margin-top: 1.75rem;
          text-decoration: none;
          font-size: 0.9rem;
          letter-spacing: 0.12em;
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

        /* CONTACT FORM (mobile only in this component – desktop form can be separate page section if you want) */
        .skew-mobile__form-block {
          padding: 2.4rem 1.9rem 3rem;
          background: #0c0c0c;
          color: #f5f5f5;
        }

        .skew-mobile__form-heading {
          font-size: 1.8rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          margin-bottom: 1.4rem;
        }

        .skew-mobile__form-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .skew-mobile__field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .skew-mobile__label {
          font-size: 0.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .skew-mobile__input,
        .skew-mobile__textarea,
        .skew-mobile__select {
          background: #161616;
          border: 1px solid #333;
          border-radius: 4px;
          padding: 0.65rem 0.75rem;
          font-size: 0.95rem;
          color: #f5f5f5;
          outline: none;
        }

        .skew-mobile__textarea {
          min-height: 110px;
          resize: vertical;
        }

        .skew-mobile__input:focus,
        .skew-mobile__textarea:focus,
        .skew-mobile__select:focus {
          border-color: #f2c265;
        }

        .skew-mobile__submit {
          margin-top: 0.8rem;
          padding: 0.85rem 1.4rem;
          border-radius: 999px;
          border: none;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          background: #f2c265;
          color: #111;
          cursor: pointer;
        }

        .skew-mobile__submit:hover {
          opacity: 0.9;
        }

        .skew-mobile__meta {
          margin-top: 1.75rem;
          font-size: 0.9rem;
          line-height: 1.7;
          opacity: 0.85;
        }

        @media (min-width: 901px) {
          .skew-container {
            height: 100vh;
            overflow: hidden;
          }
        }

        @media (max-width: 900px) {
          .skew-container {
            height: auto;
            overflow: visible;
          }

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
            padding: 3.1rem 1.9rem 2.4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }

          .skew-mobile__label {
            font-size: 0.8rem;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            opacity: 0.6;
            margin-bottom: 1rem;
          }

          .skew-mobile__heading {
            font-size: 2rem;
            line-height: 1.25;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            margin-bottom: 1.1rem;
          }

          .skew-mobile__desc {
            font-size: 1.05rem;
            line-height: 1.8;
            max-width: 24rem;
            opacity: 0.94;
          }

          .skew-hint {
            right: 14px;
            bottom: 14px;
            font-size: 0.68rem;
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
                    <a href="#contact-form" className="skew-page__link">
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

      {/* MOBILE: contact-focused ScrollTrigger slider + form */}
      <div className="skew-mobile">
        <div className="skew-mobile__inner">
          {mobileSlides.map((slide, index) => (
            <div key={index} className="skew-mobile__slide">
              <div className="skew-mobile__label">
                {slide.label} · 0{index + 1}/0{mobileSlides.length}
              </div>
              <h2 className="skew-mobile__heading">{slide.heading}</h2>
              <p className="skew-mobile__desc">{slide.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE contact form + contact details (shows after slider finishes pinning) */}
      <div id="contact-form" className="skew-mobile__form-block">
        <h2 className="skew-mobile__form-heading">Contact Forma</h2>
        <div className="skew-mobile__form-grid">
          <div className="skew-mobile__field">
            <label className="skew-mobile__label">Name</label>
            <input
              className="skew-mobile__input"
              type="text"
              placeholder="Your name"
            />
          </div>
          <div className="skew-mobile__field">
            <label className="skew-mobile__label">Email</label>
            <input
              className="skew-mobile__input"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="skew-mobile__field">
            <label className="skew-mobile__label">Project type</label>
            <select className="skew-mobile__select" defaultValue="">
              <option value="" disabled>
                Select one
              </option>
              <option>New home</option>
              <option>Renovation / extension</option>
              <option>Hospitality</option>
              <option>Workspace</option>
              <option>Multi-residential</option>
              <option>Other</option>
            </select>
          </div>
          <div className="skew-mobile__field">
            <label className="skew-mobile__label">
              Approx. budget (optional)
            </label>
            <input
              className="skew-mobile__input"
              type="text"
              placeholder="e.g. $600k–$900k"
            />
          </div>
          <div className="skew-mobile__field">
            <label className="skew-mobile__label">Project notes</label>
            <textarea
              className="skew-mobile__textarea"
              placeholder="Where is your site? What would you like this space to become?"
            />
          </div>
        </div>
        <button className="skew-mobile__submit" type="button">
          Send enquiry
        </button>

        <div className="skew-mobile__meta">
          Forma Studio · Melbourne & Sydney
          <br />
          studio@forma.archi · +61 (0)3 9000 0000
          <br />
          Mon–Fri · 9am–5pm AEST
        </div>
      </div>

      <div className="skew-hint">Scroll / Swipe</div>
    </div>
  );
};

export default SkewedSlider;
