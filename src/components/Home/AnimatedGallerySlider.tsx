import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./AnimatedGallerySlider.css";

// Register plugin
gsap.registerPlugin(ScrollTrigger);

const publicUrl = import.meta.env.BASE_URL || "/";

const AnimatedGallerySlider: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const overlayTextRef = useRef<HTMLDivElement | null>(null);
  const slidesSectionRef = useRef<HTMLElement | null>(null);

  // Animation controls (matching original AnimatedHero)
  const ANIMATION_CONTROLS = {
    galleryItemStagger: 0.12, // From original: 0.12
    overlayCharStagger: 0.05, // From original: 0.05
    overlayCharDuration: 0.4, // From original: 0.4
    overlayCharEase: "back.out(2)", // From original
    overlayStartY: 40,
  };

  // Split overlay lines into characters
  const splitOverlayToChars = () => {
    if (!sectionRef.current) return;
    const overlayLines = sectionRef.current.querySelectorAll(".overlay-line");
    overlayLines.forEach((line) => {
      const text = line.getAttribute("data-text") || "";
      line.textContent = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const span = document.createElement("span");
        span.classList.add("overlay-char");
        span.setAttribute("aria-hidden", "true");
        span.textContent = ch === " " ? "\u00A0" : ch;
        line.appendChild(span);
      }
    });
  };

  // Build gallery animations
  const buildGalleryAnimations = () => {
    if (!sectionRef.current || !galleryRef.current) return;

    const galleryItems = gsap.utils.toArray(
      sectionRef.current.querySelectorAll(".gallery-item")
    ) as HTMLElement[];

    // Timeline for gallery section
    const galleryTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=1500vh", // 15 scrolls total (much slower)
        pin: sectionRef.current,
        scrub: 3,
        invalidateOnRefresh: true,
      },
    });

    // Set initial states
    gsap.set(galleryRef.current, {
      x: 0,
      y: 0,
      position: "absolute",
      top: -50,
      left: "50%",
      transform: "translateX(-50%)",
    });

    gsap.set(sectionRef.current.querySelectorAll(".overlay-char"), {
      opacity: 0,
      y: ANIMATION_CONTROLS.overlayStartY,
    });

    // Set initial states for gallery items with offset positioning (same as GalleryOverlaySection)
    galleryItems.forEach((item, index) => {
      const offset = -70 * (index + 1); // Same offset calculation as GalleryOverlaySection
      gsap.set(item, { autoAlpha: 1, y: offset, scale: 0.98 });
    });

    // Animation sequence - 2 steps only
    galleryTimeline
      // Step 1: Gallery and items move directly to bottom position (0-7 scrolls)

      // Gallery items reveal directly in bottom position (wave-like animation)
      .to(
        galleryItems,
        {
          y: 630, // No additional movement, already positioned by gallery container
          scale: 1,
          stagger: 0.15, // Same as GalleryOverlaySection
          duration: 3.4,
          ease: "expo.inOut(3)",
        },
        1.5
      )
      // Overlay text reveals (exact same as GalleryOverlaySection)
      .fromTo(
        sectionRef.current.querySelectorAll(".overlay-char"),
        {
          opacity: 0,
          y: ANIMATION_CONTROLS.overlayStartY,
        },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONTROLS.overlayCharDuration * 3, // Same as GalleryOverlaySection
          ease: ANIMATION_CONTROLS.overlayCharEase, // Same "back.out(2)"
          stagger: ANIMATION_CONTROLS.overlayCharStagger * 3, // Same stagger
          force3D: true, // Same optimization
        },
        1.5
      )
      // Step 2: Gallery items exit screen left (7-15 scrolls)
      .to(
        galleryItems,
        {
          x: -window.innerWidth - 300,
          stagger: 0.56, // 30% faster than 0.8
          duration: 5.6, // 30% faster than 8
          ease: "power2.inOut", // Smoother exit
        },
        7
      );
    // Note: Overlay text stays visible - no fade out animation
  };

  // Build slides animations
  const buildSlidesAnimations = () => {
    if (!slidesSectionRef.current) return;

    const slides = gsap.utils.toArray(
      slidesSectionRef.current.querySelectorAll(".slide")
    ) as HTMLElement[];

    // Timeline for slides section
    const slidesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: slidesSectionRef.current,
        start: "top top",
        end: `+=${slides.length * 400}vh`, // 4 scrolls per slide (much slower)
        pin: slidesSectionRef.current,
        scrub: 3,
        invalidateOnRefresh: true,
      },
    });

    // Set initial states - slides start off-screen left
    slides.forEach((slide) => {
      gsap.set(slide, {
        x: -window.innerWidth,
        opacity: 1,
      });
    });

    // Each slide comes from left to right, much slower
    slides.forEach((slide, index) => {
      slidesTimeline.to(
        slide,
        {
          x: 0,
          duration: 6, // Much slower
          ease: "power1.inOut",
        },
        index * 4
      ); // Much slower stagger timing
    });

    // After all slides are in, continue sliding them to the right very slowly
    slides.forEach((slide, index) => {
      slidesTimeline.to(
        slide,
        {
          x: window.innerWidth,
          duration: 6, // Much slower
          ease: "power1.inOut",
        },
        slides.length * 6 + index * 4
      ); // Much slower timing
    });
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    // Split overlay text
    splitOverlayToChars();

    // Build animations
    buildGalleryAnimations();
    buildSlidesAnimations();

    // Make gallery visible
    const gallery = sectionRef.current?.querySelector(
      ".gallery"
    ) as HTMLElement;
    if (gallery) gallery.style.visibility = "visible";

    ScrollTrigger.refresh();

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const backgroundImage = `${publicUrl}images/bg.png`;

  return (
    <>
      {/* Gallery Section */}
      <section
        ref={sectionRef}
        className="gallery-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="section-container">
          {/* Overlay Text */}
          <div
            ref={overlayTextRef}
            className="section-overlay-text"
            aria-label="Live Better Feel More"
          >
            <div className="overlay-line" data-text="Live Better"></div>
            <div className="overlay-line" data-text="Feel More"></div>
          </div>

          {/* Gallery */}
          <div
            ref={galleryRef}
            className="gallery"
            style={{ visibility: "hidden" }}
          >
            <div className="gallery-item">
              <img src={`${publicUrl}images/l11.jpg`} alt="Gallery 1" />
            </div>
            <div className="gallery-item">
              <img src={`${publicUrl}images/l4.jpg`} alt="Gallery 2" />
            </div>
            <div className="gallery-item">
              <img src={`${publicUrl}images/l5.jpg`} alt="Gallery 3" />
            </div>
            <div className="gallery-item">
              <img src={`${publicUrl}images/l6.jpg`} alt="Gallery 4" />
            </div>
            <div className="gallery-item">
              <img src={`${publicUrl}images/l8.jpg`} alt="Gallery 5" />
            </div>
            <div className="gallery-item">
              <img
                src={`${publicUrl}images/pexels-asphotography-94818.jpg`}
                alt="Gallery 6"
              />
            </div>
            <div className="gallery-item">
              <img
                src={`${publicUrl}images/pexels-fotoaibe-1571460.jpg`}
                alt="Gallery 7"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Slides Section */}
      <section
        ref={slidesSectionRef}
        className="slides-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Background Text Content */}
        <div className="slides-bg-text">
          <div className="bg-text-line">Creating</div>
          <div className="bg-text-line">Spaces</div>
          <div className="bg-text-line">That</div>
          <div className="bg-text-line">Inspire</div>
        </div>

        {/* Dark Overlay */}
        <div className="slides-overlay"></div>

        {/* Slides */}
        <div className="slide">
          <img src={`${publicUrl}images/l11.jpg`} alt="Slide 1" />
        </div>
        <div className="slide">
          <img src={`${publicUrl}images/l4.jpg`} alt="Slide 2" />
        </div>
        <div className="slide">
          <img src={`${publicUrl}images/l5.jpg`} alt="Slide 3" />
        </div>
        <div className="slide">
          <img src={`${publicUrl}images/l6.jpg`} alt="Slide 4" />
        </div>
        <div className="slide">
          <img src={`${publicUrl}images/l8.jpg`} alt="Slide 5" />
        </div>
        <div className="slide">
          <img
            src={`${publicUrl}images/pexels-asphotography-94818.jpg`}
            alt="Slide 6"
          />
        </div>
        <div className="slide">
          <img
            src={`${publicUrl}images/pexels-fotoaibe-1571460.jpg`}
            alt="Slide 7"
          />
        </div>
      </section>
    </>
  );
};

export default AnimatedGallerySlider;
