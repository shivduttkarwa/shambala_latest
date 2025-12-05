// FormaServices.tsx
import { FC, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FormaServices.css";
import TiltTextGsap from "../UI/TiltTextGsap";
import GlassButton from "../UI/GlassButton";

gsap.registerPlugin(ScrollTrigger);

type ServiceSlide = {
  title: string;
  metaType: string;
  metaScope: string;
  description: string;
  shortDescription: string;
  image: string;
};

const imageBase = (import.meta.env.BASE_URL || "/").endsWith("/")
  ? import.meta.env.BASE_URL || "/"
  : `${import.meta.env.BASE_URL}/`;

// 🔧 GLOBAL KNOBS – TUNE THESE
const FS_ANIM_CONFIG = {
  desktop: {
    scrollLengthPercent: 320, // total scroll for whole section
    shrinkEnd: 0.35, // progress where image finishes shrinking (0–1)
    slidesStart: 0.45, // progress where slide changes begin (0–1)
    scrub: 0.08, // closer to 0 = tightly follows scroll
    snapDuration: 0.35, // time for snapping between slides
  },
  mobile: {
    scrollLengthPercent: 260,
    scrub: 0.12,
    snapDuration: 0.3,
  },
  images: {
    offset: 100, // xPercent slide distance between slides
    scaleDelta: 0.04, // how much they scale during the transition
    opacityDelta: 0.4, // how much opacity change during transition
  },
};

const serviceSlides: ServiceSlide[] = [
  {
    title: "Build a new house",
    metaType: "RESIDENTIAL",
    metaScope: "NEW BUILD",
    description:
      "From blank site to front door keys, we handle planning, structure and finishes so your home feels tailored, calm and effortless from day one. We coordinate engineering, council approvals, and trades so you can focus on the vision, not the paperwork. Daylighting, thermal comfort, durable finishes and smart storage are mapped from the start, keeping everything cohesive now and intuitive years from now.",
    shortDescription:
      "From blank site to front door keys, we handle planning, structure and finishes so your home feels tailored, calm and effortless from day one.",
    image: `${imageBase}images/1.jpg`,
  },
  {
    title: "Upgrade your house",
    metaType: "RESIDENTIAL",
    metaScope: "RENOVATION & ADDITIONS",
    description:
      "Open up dark rooms, add light, storage and flow. We rework layouts, extensions and finishes so your home feels fresh and modern without losing its character. Structural changes, joinery, and phased construction are choreographed so circulation feels intuitive, materials last, and every update respects the original soul of the home.",
    shortDescription:
      "Open up dark rooms, add light, storage and flow. We rework layouts, extensions and finishes so your home feels fresh and modern.",
    image: `${imageBase}images/5.jpg`,
  },
  {
    title: "Build a commercial place",
    metaType: "COMMERCIAL",
    metaScope: "WORKPLACE & RETAIL",
    description:
      "Studios, showrooms and boutique offices designed to feel refined, practical and on-brand – spaces your clients remember and your team enjoys. We align spatial strategy with brand storytelling, integrating lighting, acoustics, wayfinding and custom millwork so circulation, technology, and finishes all support the work and the experience.",
    shortDescription:
      "Studios, showrooms and boutique offices designed to feel refined, practical and on-brand – spaces your clients remember and your team enjoys.",
    image: `${imageBase}images/10.jpg`,
  },
  {
    title: "Downsize your place",
    metaType: "LIFESTYLE",
    metaScope: "SMART DOWNSIZING",
    description:
      "Thoughtful layouts, warm materiality and clever storage so you can live with less, not compromise more. We prioritize adaptability, daylight, and tactile finishes so compact spaces feel serene and organized. Multipurpose furniture and discreet storage keep rooms open, calm, and connected while you simplify.",
    shortDescription:
      "Thoughtful layouts, warm materiality and clever storage so you can live with less, not compromise more.",
    image: `${imageBase}images/11.jpg`,
  },
];

export const FormaServices: FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);

      const fsImageCover = q(".fs-image-cover")[0] as
        | HTMLDivElement
        | undefined;
      const fsImageCoverInner = q(".fs-image-cover-inner")[0] as
        | HTMLDivElement
        | undefined;
      const fsLeft = q(".fs-left")[0] as HTMLDivElement | undefined;
      const fsKicker = q(".fs-kicker")[0] as HTMLElement | undefined;
      const fsTitle = q(".fs-title")[0] as HTMLElement | undefined;
      const fsMetaType = q(".fs-meta-type")[0] as HTMLElement | undefined;
      const fsMetaScope = q(".fs-meta-scope")[0] as HTMLElement | undefined;
      const fsDesc = q(".fs-description")[0] as HTMLElement | undefined;
      const fsMetaEl = q(".fs-meta")[0] as HTMLElement | undefined;
      const fsCounterCurrent = q(".fs-counter-current")[0] as
        | HTMLElement
        | undefined;
      const fsImageCounter = q(".fs-image-counter")[0] as
        | HTMLElement
        | undefined;
      const fsImageCurrentText = q(".fs-image-current-text")[0] as
        | HTMLElement
        | undefined;
      const imgCurrentEl = q(".fs-image-current")[0] as
        | HTMLImageElement
        | undefined;
      const imgNextEl = q(".fs-image-next")[0] as HTMLImageElement | undefined;
      const fsSection = q(".fs-section")[0] as HTMLElement | undefined;
      const fsInner = q(".fs-inner")[0] as HTMLElement | undefined;

      if (
        !fsImageCover ||
        !fsImageCoverInner ||
        !fsLeft ||
        !fsKicker ||
        !fsTitle ||
        !fsMetaType ||
        !fsMetaScope ||
        !fsDesc ||
        !fsMetaEl ||
        !fsCounterCurrent ||
        !fsImageCounter ||
        !fsImageCurrentText ||
        !imgCurrentEl ||
        !imgNextEl ||
        !fsSection ||
        !fsInner
      ) {
        return;
      }

      // keep transforms simple & GPU friendly
      gsap.set(fsImageCoverInner, {
        transformStyle: "preserve-3d",
      });
      gsap.set([imgCurrentEl, imgNextEl], {
        willChange: "transform, opacity",
      });

      let fsTextIndex = 0; // which slide text is currently active
      let fsLastTransitionIndex = -1; // which slide pair is currently used for image transition
      let fsContentVisible = false;

      const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

      const setTextInstant = (index: number) => {
        const slide = serviceSlides[index];
        if (!slide) return;

        fsTitle.textContent = slide.title;
        fsMetaType.textContent = slide.metaType;
        fsMetaScope.textContent = slide.metaScope;
        fsDesc.textContent =
          typeof window !== "undefined" && window.innerWidth >= 1600
            ? slide.description
            : slide.shortDescription;

        const idxText = pad2(index + 1);
        fsCounterCurrent.textContent = idxText;
        fsImageCurrentText.textContent = idxText;
      };

      const animateTextSlide = (
        index: number,
        direction: "forward" | "backward"
      ) => {
        const slide = serviceSlides[index];
        if (!slide) return;

        const textEls = [fsKicker, fsTitle, fsMetaEl, fsDesc];
        const outX = direction === "forward" ? -20 : 20;
        const inFromX = direction === "forward" ? 20 : -20;

        gsap.to(textEls, {
          x: outX,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            setTextInstant(index);
            gsap.fromTo(
              textEls,
              { x: inFromX, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                stagger: 0.05,
              }
            );
          },
        });
      };

      // Swiper-style horizontal slide transition between current and next image
      const applySwiperTransition = (localT: number) => {
        const t = Math.min(Math.max(localT, 0), 1);
        const { offset, scaleDelta, opacityDelta } = FS_ANIM_CONFIG.images;

        // current slides left
        gsap.set(imgCurrentEl, {
          xPercent: -offset * t, // 0 -> -100
          scale: 1 - scaleDelta * t, // 1 -> ~0.96
          opacity: 1 - opacityDelta * 0.5 * t, // 1 -> ~0.8
        });

        // next slides in from right
        gsap.set(imgNextEl, {
          xPercent: offset - offset * t, // 100 -> 0
          scale: 1 - scaleDelta * (1 - t), // ~0.96 -> 1
          opacity: 1 - opacityDelta * (1 - t), // ~0.6 -> 1
        });
      };

      // initial content & images
      setTextInstant(0);
      imgCurrentEl.setAttribute("src", serviceSlides[0].image);
      if (serviceSlides[1]) {
        imgNextEl.setAttribute("src", serviceSlides[1].image);
      }

      const resetImagesToBase = () => {
        const { offset, scaleDelta, opacityDelta } = FS_ANIM_CONFIG.images;

        // current on screen, next waiting to the right
        gsap.set(imgCurrentEl, {
          xPercent: 0,
          scale: 1,
          opacity: 1,
        });

        gsap.set(imgNextEl, {
          xPercent: offset,
          scale: 1 - scaleDelta,
          opacity: 1 - opacityDelta,
        });
      };

      resetImagesToBase();

      const lastIndex = serviceSlides.length - 1;
      const transitionsCount = lastIndex; // number of "gaps" between slides

      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const cfg = FS_ANIM_CONFIG.desktop;
          const textEls = [
            fsKicker,
            fsTitle,
            fsMetaEl,
            fsDesc,
            fsCounterCurrent,
          ];

          ScrollTrigger.create({
            trigger: fsSection,
            start: "top top",
            end: "+=" + cfg.scrollLengthPercent + "%",
            scrub: cfg.scrub,
            pin: fsInner,
            anticipatePin: 1,
            snap: {
              snapTo: (value) => {
                if (transitionsCount <= 0) return value;

                // no snapping before slidesStart
                if (value <= cfg.slidesStart) return value;

                const region =
                  (value - cfg.slidesStart) / (1 - cfg.slidesStart); // 0..1
                const snappedIndex = Math.round(region * transitionsCount); // 0..lastIndex
                const snappedRegion = snappedIndex / transitionsCount; // 0..1

                return cfg.slidesStart + snappedRegion * (1 - cfg.slidesStart);
              },
              duration: cfg.snapDuration,
              ease: "power2.inOut",
            },
            onUpdate: (self) => {
              const p = self.progress;
              const { shrinkEnd, slidesStart } = cfg;

              // --- 1) IMAGE SHRINK (full bleed -> right half) LINEAR with scroll ---
              if (p <= shrinkEnd) {
                const tNorm = Math.min(Math.max(p / shrinkEnd, 0), 1); // 0..1

                // Linear interpolation tied directly to scroll progress
                const width = gsap.utils.interpolate(100, 50, tNorm);
                const left = gsap.utils.interpolate(0, 50, tNorm);

                gsap.set(fsImageCover, {
                  width: `${width}%`,
                  left: `${left}%`,
                });
              } else {
                // lock cleanly once finished
                gsap.set(fsImageCover, {
                  width: "50%",
                  left: "50%",
                });
              }

              // --- 2) CONTENT VISIBILITY ---
              if (p > shrinkEnd + 0.02 && !fsContentVisible) {
                fsContentVisible = true;

                gsap.set(textEls, { y: 30, opacity: 0 });

                gsap.set(fsLeft, {
                  opacity: 1,
                  backgroundColor: "#ffffff",
                });

                gsap.to(textEls, {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: "power3.out",
                  stagger: 0.06,
                });

                gsap.to(fsImageCounter, {
                  opacity: 1,
                  duration: 0.45,
                  ease: "power2.out",
                });
              }

              if (p <= shrinkEnd && fsContentVisible) {
                fsContentVisible = false;

                gsap.set(fsLeft, {
                  opacity: 0,
                  backgroundColor: "transparent",
                });

                gsap.set(textEls, {
                  y: 20,
                  opacity: 0,
                });

                gsap.set(fsImageCounter, {
                  opacity: 0,
                });
              }

              // --- 3) RESET STATE UNTIL slidesStart ---
              if (p <= slidesStart) {
                fsTextIndex = 0;
                fsLastTransitionIndex = -1;
                imgCurrentEl.setAttribute("src", serviceSlides[0].image);
                if (serviceSlides[1]) {
                  imgNextEl.setAttribute("src", serviceSlides[1].image);
                }
                resetImagesToBase();
                return;
              }

              // --- 4) SLIDE TRANSITIONS AFTER slidesStart ---
              if (transitionsCount <= 0) return;

              const region = (p - slidesStart) / (1 - slidesStart); // 0..1
              const clampedRegion = Math.min(Math.max(region, 0), 1);

              const slideProgress = clampedRegion * transitionsCount; // 0..lastIndex

              const pairIndex = Math.floor(slideProgress); // which pair
              const localT = slideProgress - pairIndex; // 0..1 inside pair

              const currentIndex = pairIndex;
              const nextIndex = Math.min(pairIndex + 1, lastIndex);

              if (pairIndex !== fsLastTransitionIndex) {
                fsLastTransitionIndex = pairIndex;
                imgCurrentEl.setAttribute(
                  "src",
                  serviceSlides[currentIndex].image
                );
                imgNextEl.setAttribute("src", serviceSlides[nextIndex].image);
                resetImagesToBase();
              }

              // Swiper-style image motion
              applySwiperTransition(localT);

              // active text slide = rounded position across slides
              const activeIndex = Math.min(
                Math.max(Math.round(slideProgress), 0),
                lastIndex
              );

              if (activeIndex !== fsTextIndex) {
                const direction =
                  activeIndex > fsTextIndex ? "forward" : "backward";
                fsTextIndex = activeIndex;
                animateTextSlide(activeIndex, direction);
              }
            },
          });
        },

        "(max-width: 1023px)": () => {
          const cfg = FS_ANIM_CONFIG.mobile;

          fsContentVisible = true;
          fsTextIndex = 0;
          fsLastTransitionIndex = -1;

          ScrollTrigger.create({
            trigger: fsSection,
            start: "top top",
            end: "+=" + cfg.scrollLengthPercent + "%",
            scrub: cfg.scrub,
            pin: fsInner,
            anticipatePin: 1,
            snap: {
              snapTo: (value) => {
                if (transitionsCount <= 0) return value;
                const snappedIndex = Math.round(value * transitionsCount); // 0..lastIndex
                return snappedIndex / transitionsCount;
              },
              duration: cfg.snapDuration,
              ease: "power1.inOut",
            },
            onUpdate: (self) => {
              const p = self.progress;
              if (transitionsCount <= 0) return;

              const clamped = Math.min(Math.max(p, 0), 1);
              const slideProgress = clamped * transitionsCount; // 0..lastIndex

              const pairIndex = Math.floor(slideProgress);
              const localT = slideProgress - pairIndex;

              const currentIndex = pairIndex;
              const nextIndex = Math.min(pairIndex + 1, lastIndex);

              if (pairIndex !== fsLastTransitionIndex) {
                fsLastTransitionIndex = pairIndex;
                imgCurrentEl.setAttribute(
                  "src",
                  serviceSlides[currentIndex].image
                );
                imgNextEl.setAttribute("src", serviceSlides[nextIndex].image);
                resetImagesToBase();
              }

              gsap.set(fsImageCover, {
                width: "100%",
                left: "0%",
              });

              applySwiperTransition(localT);

              const activeIndex = Math.min(
                Math.max(Math.round(slideProgress), 0),
                lastIndex
              );

              if (activeIndex !== fsTextIndex) {
                const direction =
                  activeIndex > fsTextIndex ? "forward" : "backward";
                fsTextIndex = activeIndex;
                animateTextSlide(activeIndex, direction);
              }
            },
          });
        },
      });
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const first = serviceSlides[0];

  return (
    <div className="forma-services" id="services-content" ref={rootRef}>
      <div className="fs-heading">
        <TiltTextGsap
          tag="h2"
          startTrigger="top 80%"
          endTrigger="bottom -10%"
          className="section-title fs-heading-title tilt-text-heading"
        >
          Services
        </TiltTextGsap>
      </div>
      <div className="fs-section">
        <div className="fs-inner">
          <div className="fs-layout">
            <div className="fs-left">
              <div>
                <div className="fs-kicker">FORMA SERVICES</div>

                <div className="fs-title">{first.title}</div>

                <div className="fs-meta">
                  <span className="fs-meta-type">{first.metaType}</span>
                  <div className="fs-dot" />
                  <span className="fs-meta-scope">{first.metaScope}</span>
                </div>

                <div className="fs-description">
                  {typeof window !== "undefined" && window.innerWidth >= 1600
                    ? `${first.description} Every brief becomes a bespoke journey—more light, better flow, layered textures, and tailored joinery that quietly elevates daily life.`
                    : `${first.shortDescription} Every brief becomes a bespoke journey.`}
                </div>
              </div>

              <div>
                <div className="fs-cta">
                  <GlassButton href="/services">View All Services</GlassButton>
                </div>
                <div className="fs-counter">
                  <span className="fs-counter-current">01</span> /{" "}
                  {serviceSlides.length.toString().padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="fs-right-placeholder" />
          </div>

          <div className="fs-image-cover">
            <div className="fs-image-cover-inner">
              <img
                className="fs-image fs-image-current"
                src={first.image}
                alt={first.title}
              />
              <img
                className="fs-image fs-image-next"
                src={serviceSlides[1].image}
                alt={serviceSlides[1].title}
              />
            </div>

            <div className="fs-image-counter">
              <span className="fs-image-current-text">01</span> /{" "}
              {serviceSlides.length.toString().padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
