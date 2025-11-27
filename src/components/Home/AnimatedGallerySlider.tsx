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
          y: 630,
          scale: 1,
          stagger: 0.3,
          duration: 5,
          ease: "back.out(1.7)",
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
          stagger: 0.8,
          duration: 8,
          ease: "power2.inOut",
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

    const slidesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: slidesSectionRef.current,
        start: "top top",
        end: `+=${slides.length * 800}vh`,
        pin: slidesSectionRef.current,
        scrub: 5,
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

    slides.forEach((slide, index) => {
      slidesTimeline.to(
        slide,
        {
          x: 0,
          duration: 1,
          ease: "power1.inOut",
        },
        index * 1.5
      );
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
          <div className="slide-image">
            <img src={`${publicUrl}images/l11.jpg`} alt="Modern Architecture" />
          </div>
          <div className="slide-content">
            <h2>Modern Architecture</h2>
            <p>Contemporary design meets functional living spaces that blend aesthetics with practicality. Our approach to modern architecture focuses on clean lines, open spaces, and innovative use of materials that create environments where people truly want to live and work.</p>
            <p>We believe that great architecture should respond to its surroundings while pushing the boundaries of what's possible. Every project begins with understanding the site, the climate, and most importantly, the people who will inhabit the space.</p>
            <p>From residential homes to commercial spaces, our modern architectural solutions prioritize sustainability, functionality, and timeless beauty. We integrate smart home technology, energy-efficient systems, and flexible layouts that adapt to changing needs over time.</p>
          </div>
        </div>
        <div className="slide">
          <div className="slide-image">
            <img src={`${publicUrl}images/l4.jpg`} alt="Interior Design" />
          </div>
          <div className="slide-content">
            <h2>Interior Design</h2>
            <p>Thoughtful interiors that inspire and elevate everyday experiences through careful attention to detail. Our interior design philosophy centers on creating spaces that feel both sophisticated and deeply personal.</p>
            <p>We curate every element from custom furniture and lighting to artwork and textiles, ensuring each piece contributes to a cohesive vision. Our team works closely with clients to understand their lifestyle, preferences, and functional needs.</p>
            <p>Whether it's a cozy residential living room or a dynamic office environment, we create interiors that tell stories and enhance daily life. Our designs balance comfort with style, functionality with beauty, and innovation with timeless appeal.</p>
            <p>From space planning and color consultation to custom millwork and styling, we handle every aspect of the interior design process with meticulous care and creative vision.</p>
          </div>
        </div>
        <div className="slide">
          <div className="slide-image">
            <img src={`${publicUrl}images/l5.jpg`} alt="Sustainable Spaces" />
          </div>
          <div className="slide-content">
            <h2>Sustainable Spaces</h2>
            <p>Environmentally conscious design for the future, creating spaces that respect both people and planet. Sustainability isn't just a trend for us—it's a core principle that guides every decision we make.</p>
            <p>Our sustainable design approach incorporates renewable materials, energy-efficient systems, and passive design strategies that reduce environmental impact while enhancing occupant comfort and health.</p>
            <p>We prioritize locally sourced materials, low-VOC finishes, and designs that maximize natural light and ventilation. Our projects often feature green roofs, rainwater harvesting, solar panels, and smart building systems.</p>
            <p>By designing for longevity and adaptability, we create buildings that serve communities for generations while minimizing their carbon footprint. Every sustainable choice we make contributes to a healthier planet and more resilient built environment.</p>
          </div>
        </div>
        <div className="slide">
          <div className="slide-image">
            <img src={`${publicUrl}images/l6.jpg`} alt="Residential Projects" />
          </div>
          <div className="slide-content">
            <h2>Residential Projects</h2>
            <p>Creating homes that feel uniquely yours, where every space tells your personal story. Our residential design process is deeply collaborative, ensuring that each home reflects the personality, lifestyle, and dreams of its inhabitants.</p>
            <p>From intimate urban apartments to sprawling suburban estates, we design homes that grow with families and adapt to changing needs. Our expertise spans new construction, renovations, and additions.</p>
            <p>We pay special attention to how families live today—incorporating home offices, flexible multi-use spaces, outdoor living areas, and storage solutions that keep homes organized and functional.</p>
            <p>Every residential project begins with listening. We learn about daily routines, entertaining styles, and long-term goals to create spaces that truly enhance the way our clients live. The result is a home that's not just beautiful, but perfectly suited to its inhabitants.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AnimatedGallerySlider;
