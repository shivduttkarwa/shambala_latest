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

      // 3D context so rotateX + z look like a curved reel
      gsap.set(fsImageCover, {
        perspective: 1200,
      });
      gsap.set(fsImageCoverInner, {
        transformStyle: "preserve-3d",
      });
      gsap.set([imgCurrentEl, imgNextEl], {
        transformStyle: "preserve-3d",
      });

      let fsTextIndex = 0;
      let fsLastTransitionIndex = -1;
      let fsContentVisible = false;

      const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

      const setTextInstant = (index: number) => {
        const slide = serviceSlides[index];
        if (!slide) return;

        fsTitle.textContent = slide.title;
        fsMetaType.textContent = slide.metaType;
        fsMetaScope.textContent = slide.metaScope;
        fsDesc.textContent =
          window.innerWidth >= 1600
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
        const outY = direction === "forward" ? -20 : 20;
        const inFromY = direction === "forward" ? 20 : -20;

        gsap.to(textEls, {
          y: outY,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            setTextInstant(index);
            gsap.fromTo(
              textEls,
              { y: inFromY, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                stagger: 0.04,
              }
            );
          },
        });
      };

      // Curved film-reel style slide transition (reduced gap)
      const applyCurvedReel = (localT: number) => {
        const t = Math.min(Math.max(localT, 0), 1);

        const travel = 100; // how far they move (gap between images)
        const tilt = 40; // rotateX degrees
        const depth = -5; // z shift

        // Current image: move up, tilt away a bit
        gsap.set(imgCurrentEl, {
          yPercent: -travel * t, // 0 -> -70
          rotateX: tilt * t, // 0 -> 35deg
          z: -depth * t, // 0 -> -80
          scale: 1 - 0.04 * t, // 1 -> 0.96 (subtle)
          transformOrigin: "50% 100%",
          opacity: 1,
        });

        // Next image: comes from below, un-bends into place
        gsap.set(imgNextEl, {
          yPercent: travel - travel * t, // 70 -> 0
          rotateX: -tilt + tilt * t, // -35deg -> 0deg
          z: -depth + depth * t, // -80 -> 0
          scale: 0.96 + 0.04 * t, // 0.96 -> 1
          transformOrigin: "50% 0%",
          opacity: 1,
        });
      };

      // initial content & images
      setTextInstant(0);
      imgCurrentEl.setAttribute("src", serviceSlides[0].image);
      if (serviceSlides[1]) {
        imgNextEl.setAttribute("src", serviceSlides[1].image);
      }

      // Base/resting state
      const resetImagesToBase = () => {
        const travel = 70;
        const tilt = 35;
        const depth = 80;

        gsap.set(imgCurrentEl, {
          yPercent: 0,
          rotateX: 0,
          z: 0,
          scale: 1,
          opacity: 1,
          transformOrigin: "50% 100%",
        });

        gsap.set(imgNextEl, {
          yPercent: travel, // 70 below
          rotateX: -tilt, // pre-bent a bit
          z: -depth,
          scale: 0.96,
          opacity: 1,
          transformOrigin: "50% 0%",
        });
      };

      resetImagesToBase();

      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const textEls = [fsKicker, fsTitle, fsMetaEl, fsDesc, fsCounterCurrent];

          const shrinkEnd = 0.15;
          const slidesStart = 0.3;
          const transitionsCount = serviceSlides.length - 1;

          ScrollTrigger.create({
            trigger: fsSection,
            start: "top top",
            end: "+=650%",
            scrub: true,
            pin: fsInner,
            snap: {
              snapTo: (value) => {
                if (transitionsCount <= 0) return value;

                // No snap before slidesStart (intro zone)
                if (value <= slidesStart) return value;

                // Map [slidesStart, 1] -> [0, transitionsCount]
                const slideRegion = (value - slidesStart) / (1 - slidesStart);
                const rawIndex = slideRegion * transitionsCount;
                const nearestIndex = Math.round(rawIndex); // 0..transitionsCount

                const snappedRegion = nearestIndex / transitionsCount;
                return slidesStart + snappedRegion * (1 - slidesStart);
              },
              duration: 0.5,
              ease: "power2.inOut",
            },
            onUpdate: (self) => {
              const p = self.progress;

              // --- 1) IMAGE SHRINK (0 → shrinkEnd) ---
              if (p <= shrinkEnd) {
                const tSplit = Math.min(Math.max(p / shrinkEnd, 0), 1);
                const width = 100 - 50 * tSplit;
                const left = 0 + 50 * tSplit;

                gsap.set(fsImageCover, {
                  width: `${width}%`,
                  left: `${left}%`,
                });
              } else {
                // lock at half-width once shrink finished
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
                  duration: 0.65,
                  ease: "power3.out",
                  stagger: 0.06,
                });

                gsap.to(fsImageCounter, {
                  opacity: 1,
                  duration: 0.5,
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
                return; // no transitions yet
              }

              // --- 4) SLIDE TRANSITIONS AFTER slidesStart ---
              const remaining = (p - slidesStart) / (1 - slidesStart);
              const clamped = Math.min(Math.max(remaining, 0), 1);

              if (transitionsCount <= 0) return;

              if (clamped >= 0.999) {
                const lastIndex = serviceSlides.length - 1;
                imgCurrentEl.setAttribute(
                  "src",
                  serviceSlides[lastIndex].image
                );
                resetImagesToBase();

                if (fsTextIndex !== lastIndex) {
                  const direction =
                    lastIndex > fsTextIndex ? "forward" : "backward";
                  fsTextIndex = lastIndex;
                  animateTextSlide(lastIndex, direction);
                }
                return;
              }

              const slideProgress = clamped * transitionsCount;
              const transitionIndex = Math.floor(slideProgress);
              const localT = slideProgress - transitionIndex;

              const currentIndex = transitionIndex;
              const nextIndex = transitionIndex + 1;

              if (transitionIndex !== fsLastTransitionIndex) {
                fsLastTransitionIndex = transitionIndex;
                imgCurrentEl.setAttribute(
                  "src",
                  serviceSlides[currentIndex].image
                );
                imgNextEl.setAttribute("src", serviceSlides[nextIndex].image);
              }

              applyCurvedReel(localT);

              const dominantIndex = localT < 0.5 ? currentIndex : nextIndex;

              if (dominantIndex !== fsTextIndex) {
                const direction =
                  dominantIndex > fsTextIndex ? "forward" : "backward";
                fsTextIndex = dominantIndex;
                animateTextSlide(dominantIndex, direction);
              }
            },
          });
        },

        "(max-width: 1023px)": () => {
          fsContentVisible = true;
          fsTextIndex = 0;
          fsLastTransitionIndex = -1;

          const transitionsCount = serviceSlides.length - 1;

          ScrollTrigger.create({
            trigger: fsSection,
            start: "top top",
            end: "+=300%",
            scrub: true,
            pin: fsInner,
            snap: {
              snapTo: (value) => {
                if (transitionsCount <= 0) return value;

                const rawIndex = value * transitionsCount;
                const nearestIndex = Math.round(rawIndex); // 0..transitionsCount
                return nearestIndex / transitionsCount;
              },
              duration: 0.5,
              ease: "power1.inOut",
            },
            onUpdate: (self) => {
              const p = self.progress;
              const clamped = Math.min(Math.max(p, 0), 1);

              if (transitionsCount <= 0) return;

              if (clamped >= 0.999) {
                const lastIndex = serviceSlides.length - 1;
                imgCurrentEl.setAttribute(
                  "src",
                  serviceSlides[lastIndex].image
                );
                resetImagesToBase();

                if (fsTextIndex !== lastIndex) {
                  const direction =
                    lastIndex > fsTextIndex ? "forward" : "backward";
                  fsTextIndex = lastIndex;
                  animateTextSlide(lastIndex, direction);
                }
                return;
              }

              const slideProgress = clamped * transitionsCount;
              const transitionIndex = Math.floor(slideProgress);
              const localT = slideProgress - transitionIndex;

              const currentIndex = transitionIndex;
              const nextIndex = transitionIndex + 1;

              if (transitionIndex !== fsLastTransitionIndex) {
                fsLastTransitionIndex = transitionIndex;
                imgCurrentEl.setAttribute(
                  "src",
                  serviceSlides[currentIndex].image
                );
                imgNextEl.setAttribute("src", serviceSlides[nextIndex].image);
              }

              gsap.set(fsImageCover, {
                width: "100%",
                left: "0%",
              });

              applyCurvedReel(localT);

              const dominantIndex = localT < 0.5 ? currentIndex : nextIndex;

              if (dominantIndex !== fsTextIndex) {
                const direction =
                  dominantIndex > fsTextIndex ? "forward" : "backward";
                fsTextIndex = dominantIndex;
                animateTextSlide(dominantIndex, direction);
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
                  {window.innerWidth >= 1600
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
