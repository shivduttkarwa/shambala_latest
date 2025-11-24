import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Parallax,
  Navigation,
  Pagination,
  Keyboard,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/parallax";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./ProjectModernSlider.css";

const publicUrl = import.meta.env.BASE_URL;

interface SlideData {
  id: number;
  image: string;
  tag?: string;
  title: string;
  description: string;
  buttonText: string;
}

const ProjectModernSlider: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const sliderSectionRef = useRef<HTMLElement>(null);
  const dragBtnRef = useRef<HTMLDivElement>(null);
  const [isInSection, setIsInSection] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showDragBtn, setShowDragBtn] = useState(false);
  const [isOverNavButton, setIsOverNavButton] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const slidesData: SlideData[] = [
    {
      id: 1,
      image: `${publicUrl}images/l1.jpg`,
      tag: "ARCHITECTURAL DESIGN",
      title: "VISION",
      description:
        "Transform your vision into architectural excellence with our comprehensive design services. From conceptual sketches to detailed blueprints, we create spaces that blend functionality with aesthetic appeal.",
      buttonText: "Explore Projects",
    },
    {
      id: 2,
      image: `${publicUrl}images/l2.jpg`,
      tag: "CONSTRUCTION EXCELLENCE",
      title: "BUILDING",
      description:
        "Experience superior craftsmanship with our comprehensive construction services. From foundation to finish, we execute every project with precision, using premium materials and advanced techniques.",
      buttonText: "View Portfolio",
    },
    {
      id: 3,
      image: `${publicUrl}images/l3.jpg`,
      tag: "INTERIOR DESIGN",
      title: "LIVING",
      description:
        "Discover the potential of your interior spaces with our expert design services. Let's create a home that truly reflects your unique lifestyle and personality.",
      buttonText: "See Designs",
    },
  ];

  // Smooth cursor following with requestAnimationFrame
  const updateDragButtonPosition = (x: number, y: number) => {
    if (!dragBtnRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (dragBtnRef.current) {
        dragBtnRef.current.style.left = `${x}px`;
        dragBtnRef.current.style.top = `${y + 80}px`; // Position below cursor
      }
    });
  };

  // Handle mouse enter/leave for drag button
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsInSection(true);
      if (!isOverNavButton) {
        setShowDragBtn(true);
        document.body.style.cursor = "none"; // Hide cursor completely
      }
    };

    const handleMouseLeave = () => {
      setIsInSection(false);
      setShowDragBtn(false);
      document.body.style.cursor = "default"; // Restore cursor
    };

    const section = sliderSectionRef.current;
    if (section) {
      section.addEventListener("mouseenter", handleMouseEnter);
      section.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (section) {
        section.removeEventListener("mouseenter", handleMouseEnter);
        section.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.cursor = "default"; // Ensure cursor is restored
    };
  }, [isOverNavButton]);

  // Handle mouse move for drag button position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isInSection && !isOverNavButton) {
        setDragPosition({ x: e.clientX, y: e.clientY });
        updateDragButtonPosition(e.clientX, e.clientY);
      }
    };

    if (isInSection && !isOverNavButton) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isInSection, isOverNavButton]);

  // Check if mouse is over navigation buttons
  useEffect(() => {
    const handleNavButtonEnter = () => {
      setIsOverNavButton(true);
      setShowDragBtn(false);
      document.body.style.cursor = "pointer"; // Show pointer for nav buttons
    };

    const handleNavButtonLeave = () => {
      setIsOverNavButton(false);
      if (isInSection) {
        setShowDragBtn(true);
        document.body.style.cursor = "none"; // Hide cursor again
      } else {
        document.body.style.cursor = "default"; // Restore cursor
      }
    };

    const nextButton = document.querySelector(".pms-swiper-button-next");
    const prevButton = document.querySelector(".pms-swiper-button-prev");

    if (nextButton) {
      nextButton.addEventListener("mouseenter", handleNavButtonEnter);
      nextButton.addEventListener("mouseleave", handleNavButtonLeave);
    }
    if (prevButton) {
      prevButton.addEventListener("mouseenter", handleNavButtonEnter);
      prevButton.addEventListener("mouseleave", handleNavButtonLeave);
    }

    return () => {
      if (nextButton) {
        nextButton.removeEventListener("mouseenter", handleNavButtonEnter);
        nextButton.removeEventListener("mouseleave", handleNavButtonLeave);
      }
      if (prevButton) {
        prevButton.removeEventListener("mouseenter", handleNavButtonEnter);
        prevButton.removeEventListener("mouseleave", handleNavButtonLeave);
      }
    };
  }, [isInSection]);

  // Drag functionality
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    // Stop autoplay when dragging starts
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !swiperRef.current) return;

    const deltaX = e.movementX;
    if (Math.abs(deltaX) > 2) {
      if (deltaX > 0) {
        swiperRef.current.slidePrev();
      } else {
        swiperRef.current.slideNext();
      }
    }

    // Update position during drag
    setDragPosition({ x: e.clientX, y: e.clientY });
    updateDragButtonPosition(e.clientX, e.clientY);
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    // Restart autoplay after a delay if not in section
    setTimeout(() => {
      if (swiperRef.current && !isInSection) {
        swiperRef.current.autoplay.start();
      }
    }, 2000);
  };

  // Global mouse event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return (
    <section className="pms-creative-fullpage--slider" ref={sliderSectionRef}>
      <div className="pms-banner-horizental">
        <Swiper
          modules={[Autoplay, Parallax, Navigation, Pagination, Keyboard]}
          speed={1600}
          parallax={true}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".pms-swiper-button-next",
            prevEl: ".pms-swiper-button-prev",
          }}
          pagination={{
            el: ".pms-swiper-pagination",
            type: "progressbar",
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          loop={true}
          className="pms-swiper-container-h"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={() => {
            if (isInSection && !isOverNavButton) {
              setShowDragBtn(true);
            }
          }}
        >
          {slidesData.map((slide) => (
            <SwiperSlide key={slide.id} className="pms-swiper-slide">
              <div className="pms-slider-inner" data-swiper-parallax="100">
                <img
                  src={slide.image}
                  alt="full_screen-image"
                  className="pms-slide-image"
                />
                <div className="pms-swiper-content" data-swiper-parallax="2000">
                  <div className="pms-title-area">
                    {slide.tag && <p className="pms-tag">{slide.tag}</p>}
                    <a href="#" className="pms-title">
                      {slide.title}
                    </a>
                  </div>
                  <p className="pms-disc">{slide.description}</p>
                  <div className="pms-creative-btn--wrap">
                    <a
                      className="pms-creative-slide--btn"
                      role="button"
                      href="#0"
                    >
                      <div className="pms-creative-btn--circle">
                        <div className="pms-circle">
                          <div className="pms-circle-fill"></div>
                          <svg
                            viewBox="0 0 50 50"
                            xmlns="http://www.w3.org/2000/svg"
                            className="pms-circle-outline"
                          >
                            <circle cx="25" cy="25" r="23"></circle>
                          </svg>
                          <div className="pms-circle-icon">
                            <svg
                              viewBox="0 0 12 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="pms-icon-arrow"
                            >
                              <path d="M0 5.65612V4.30388L8.41874 4.31842L5.05997 0.95965L5.99054 0L10.9923 4.97273L6.00508 9.96L5.07451 9.00035L8.43328 5.64158L0 5.65612Z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="pms-creative-btn--label">
                        <div className="pms-creative-btn__text">
                          {slide.buttonText}
                        </div>
                        <div className="pms-creative-btn__border"></div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="pms-swiper-button-wrapper pms-creative-button--wrapper">
            <div
              className="pms-swiper-button-next"
              tabIndex={0}
              role="button"
              aria-label="Next slide"
            ></div>
            <div
              className="pms-swiper-button-prev"
              tabIndex={0}
              role="button"
              aria-label="Previous slide"
            ></div>
          </div>

          <div className="pms-slider-pagination-area">
            <h5 className="pms-slide-range pms-one">01</h5>
            <div className="pms-swiper-pagination pms-swiper-pagination-progressbar pms-swiper-pagination-horizontal"></div>
            <h5 className="pms-slide-range pms-three">03</h5>
          </div>
        </Swiper>
      </div>

      {/* Drag Button */}
      {showDragBtn && (
        <div
          ref={dragBtnRef}
          className={`pms-drag-btn ${isDragging ? "pms-dragging" : ""}`}
          onMouseDown={handleDragStart}
        >
          DRAG
        </div>
      )}
    </section>
  );
};

export default ProjectModernSlider;
