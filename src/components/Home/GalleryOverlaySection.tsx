import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./GalleryOverlaySection.css";

// Register plugin
gsap.registerPlugin(ScrollTrigger);

const publicUrl = import.meta.env.BASE_URL || "/";

const GalleryOverlaySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const overlayTextRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Animation controls extracted from AnimatedHero
  const ANIMATION_CONTROLS = {
    galleryItemStagger: 0.12,
    galleryItemDuration: 0.45,
    galleryItemOffset: -70,
    galleryStartDelay: 0.15,
    overlayCharStagger: 0.05,
    overlayCharDuration: 0.4,
    overlayCharEase: "back.out(2)",
    overlayStartY: 40,
  };

  // Split overlay lines into characters (extracted from AnimatedHero)
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

  // Calculate gallery transform for bottom of image
  const calculateGalleryTransform = () => {
    if (!galleryRef.current || !sectionRef.current) return { translateX: 0, translateY: 0 };

    const galleryRect = galleryRef.current.getBoundingClientRect();
    const sectionRect = sectionRef.current.getBoundingClientRect();
    
    const galleryCenterX = galleryRect.left + galleryRect.width / 2;
    const targetCenterX = window.innerWidth / 2;
    
    // Position at bottom of the image section (with some padding)
    const targetBottomY = sectionRect.bottom - 80; // 80px from bottom
    const galleryBottomY = galleryRect.top + galleryRect.height;
    
    const translateX = targetCenterX - galleryCenterX;
    const translateY = targetBottomY - galleryBottomY;
    
    return { translateX, translateY };
  };

  // Build animations (extracted and modified from AnimatedHero)
  const buildTimelines = () => {
    if (!sectionRef.current || !galleryRef.current) return;

    // Clear existing timeline
    if (timelineRef.current) {
      timelineRef.current.scrollTrigger?.kill();
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Reset all elements to their initial states
    gsap.set(galleryRef.current, { clearProps: "all" });
    gsap.set(sectionRef.current.querySelectorAll(".gallery-item"), {
      clearProps: "all",
    });
    gsap.set(sectionRef.current.querySelectorAll(".overlay-char"), {
      clearProps: "all",
    });

    const galleryTransform = calculateGalleryTransform();

    // Get gallery items (limit to 3 on mobile)
    const allGalleryItems = gsap.utils.toArray(
      sectionRef.current.querySelectorAll(".gallery-item")
    ) as HTMLElement[];
    const isMobileView = window.matchMedia("(max-width: 768px)").matches;
    const galleryItems = isMobileView
      ? allGalleryItems.slice(0, 3)
      : allGalleryItems;

    // Main timeline with ScrollTrigger - pin section with smooth scrub
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: sectionRef.current,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => {
          // Ensure visibility is managed correctly during scroll
          const gallery = sectionRef.current?.querySelector(
            ".gallery"
          ) as HTMLElement;
          if (gallery && gallery.style.visibility !== "visible") {
            gallery.style.visibility = "visible";
          }
        },
        onComplete: () => {
          // Ensure pin is released when animation completes
          ScrollTrigger.refresh();
        },
      },
    });

    // Set initial states for ALL elements before animation
    // Reset gallery to initial position (top center)
    gsap.set(galleryRef.current, {
      x: 0,
      y: 0,
      position: "absolute",
      top: -50,
      left: "50%",
      transform: "translateX(-50%)",
    });

    // Set initial states for overlay characters
    gsap.set(sectionRef.current.querySelectorAll(".overlay-char"), {
      opacity: 0,
      y: ANIMATION_CONTROLS.overlayStartY,
    });

    const animationTimeline = timelineRef.current;

    // Gallery animation to bottom of image - smooth scroll-driven
    animationTimeline
      .to(
        galleryRef.current,
        {
          x: galleryTransform.translateX,
          y: galleryTransform.translateY,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        galleryItems,
        {
          y: 0,
          scale: 1,
          stagger: ANIMATION_CONTROLS.overlayCharStagger,
          duration: ANIMATION_CONTROLS.overlayCharDuration,
          ease: ANIMATION_CONTROLS.overlayCharEase,
        },
        0.2
      )
      .fromTo(
        sectionRef.current.querySelectorAll(".overlay-char"),
        {
          opacity: 0,
          y: ANIMATION_CONTROLS.overlayStartY,
        },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONTROLS.overlayCharDuration,
          ease: ANIMATION_CONTROLS.overlayCharEase,
          stagger: ANIMATION_CONTROLS.overlayCharStagger,
          force3D: true,
        },
        0.2
      );

    // Set initial states for gallery items with offset positioning
    galleryItems.forEach((item, index) => {
      const offset = ANIMATION_CONTROLS.galleryItemOffset * (index + 1);
      gsap.set(item, { autoAlpha: 1, y: offset, scale: 0.98 });
    });
  };

  // Wait for gallery images to load (extracted from AnimatedHero)
  const waitForGalleryImages = () => {
    if (!sectionRef.current) return Promise.resolve();
    const images = gsap.utils.toArray(
      sectionRef.current.querySelectorAll(".gallery img")
    ) as HTMLImageElement[];
    return Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve());
          img.addEventListener("error", () => resolve());
        });
      })
    );
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    // Split overlay text into characters
    splitOverlayToChars();

    // Add hover effects to gallery items
    const allGalleryItems = gsap.utils.toArray(
      sectionRef.current.querySelectorAll(".gallery-item")
    ) as HTMLElement[];
    allGalleryItems.forEach((item) => {
      item.addEventListener("pointerenter", () => {
        gsap.to(item, { scale: 1.08, duration: 0.3, ease: "power3.out" });
      });
      item.addEventListener("pointerleave", () => {
        gsap.to(item, { scale: 1, duration: 0.25, ease: "power3.out" });
      });
    });

    // Initialize animations after images load
    waitForGalleryImages()
      .then(() => {
        buildTimelines();
        const gallery = sectionRef.current?.querySelector(
          ".gallery"
        ) as HTMLElement;
        if (gallery) gallery.style.visibility = "visible";
        ScrollTrigger.refresh();
      })
      .catch(() => {
        buildTimelines();
        const gallery = sectionRef.current?.querySelector(
          ".gallery"
        ) as HTMLElement;
        if (gallery) gallery.style.visibility = "visible";
        ScrollTrigger.refresh();
      });

    // Resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
        buildTimelines();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Clean up animations
      if (timelineRef.current) {
        timelineRef.current.scrollTrigger?.kill();
        timelineRef.current.kill();
      }
    };
  }, []);

  const backgroundImage = `${publicUrl}images/bg.png`;

  return (
    <section
      ref={sectionRef}
      className="gallery-overlay-section"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
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
          <div className="gallery-item">
            <img
              src={`${publicUrl}images/pexels-jvdm-1457842.jpg`}
              alt="Gallery 8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryOverlaySection;