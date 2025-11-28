import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./FeaturedProperties.css";
import GlassButton from "../UI/GlassButton";

const publicUrl = import.meta.env.BASE_URL;

interface PropertySlide {
  id: number;
  category: string;
  title: string;
  leftImage: string;
  rightImage: string;
  tabletImage: string;
  subtitle: string;
  description: string;
  link: string;
}

const defaultProperties: PropertySlide[] = [
  {
    id: 1,
    category: "",
    title: '"WHERE VISION\nMEETS\nDREAMS"',
    leftImage: `${publicUrl}images/l4.jpg`,
    rightImage: `${publicUrl}images/zz.jpg`,
    tabletImage: `${publicUrl}images/zz.jpg`,
    subtitle: "Creating exceptional living spaces",
    description:
      "Building tomorrow's homes today.\n\nOur vision is to transform how Australians live by creating homes that harmonize with nature, embrace sustainability, and foster community connections. Every Shambala home is designed to enhance your lifestyle while respecting the environment.",
    link: "#",
  },
  {
    id: 2,
    category: "",
    title: '"SUSTAINABLE\nDESIGN\nTOMORROW"',
    leftImage: `${publicUrl}images/pexels-asphotography-94818.jpg`,
    rightImage: `${publicUrl}images/pexels-fotoaibe-1571460.jpg`,
    tabletImage: `${publicUrl}images/pexels-fotoaibe-1571460.jpg`,
    subtitle: "Sustainable design philosophy",
    description:
      "Innovation meets responsibility.\n\nWe believe in building homes that give back to the environment. Our sustainable design philosophy incorporates renewable materials, energy-efficient systems, and water conservation technologies to create homes that care for our planet.",
    link: "#",
  },
  {
    id: 3,
    category: "",
    title: '"COMMUNITY\nCENTERED\nLIVING"',
    leftImage: `${publicUrl}images/pexels-expect-best-79873-323780.jpg`,
    rightImage: `${publicUrl}images/pr1.jpg`,
    tabletImage: `${publicUrl}images/pr1.jpg`,
    subtitle: "Community-centered approach",
    description:
      "Building connections, not just homes.\n\nOur vision extends beyond individual homes to creating vibrant communities. We design neighborhoods that encourage interaction, promote wellbeing, and foster lasting relationships between residents and their environment.",
    link: "#",
  },
  {
    id: 4,
    category: "",
    title: '"EXCELLENCE\nIN EVERY\nDETAIL"',
    leftImage: `${publicUrl}images/pexels-jvdm-1457842.jpg`,
    rightImage: `${publicUrl}images/pr2.jpg`,
    tabletImage: `${publicUrl}images/pr2.jpg`,
    subtitle: "Excellence in craftsmanship",
    description:
      "Where quality meets artistry.\n\nOur commitment to excellence drives everything we do. From initial concept to final handover, we maintain the highest standards of craftsmanship, ensuring every Shambala home is a testament to quality, durability, and timeless design.",
    link: "#",
  },
];

interface FeaturedPropertiesProps {
  properties?: PropertySlide[];
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties = defaultProperties,
}) => {
  const swiperRef = useRef<any>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const dragBtnRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [showDragBtn, setShowDragBtn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInSection, setIsInSection] = useState(false);
  const [isOverNavButton, setIsOverNavButton] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const dragStartXRef = useRef<number | null>(null);
  const updateDragPosition = (x: number, y: number) => {
    if (!dragBtnRef.current) return;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      if (dragBtnRef.current) {
        dragBtnRef.current.style.left = `${x}px`;
        dragBtnRef.current.style.top = `${y - 15}px`;
      }
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isDesktop = () => window.innerWidth >= 1024;

    const updateDragPosition = (x: number, y: number) => {
      if (!dragBtnRef.current) return;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        if (dragBtnRef.current) {
          dragBtnRef.current.style.left = `${x}px`;
          dragBtnRef.current.style.top = `${y - 15}px`;
        }
      });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (!isDesktop()) return;
      setIsInSection(true);
      setShowDragBtn(true);
      document.body.style.cursor = "none";
      const rect = section.getBoundingClientRect();
      const initialX = e.clientX || rect.left + rect.width / 2;
      const initialY = e.clientY || rect.top + rect.height / 2;
      updateDragPosition(initialX, initialY);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsInSection(false);
        setShowDragBtn(false);
        setIsDragging(false);
        document.body.style.cursor = "default";
        section.classList.remove("show-cursor");
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isInSection) {
        const rect = section.getBoundingClientRect();
        const { clientX, clientY } = e;
        if (
          clientX < rect.left ||
          clientX > rect.right ||
          clientY < rect.top ||
          clientY > rect.bottom
        ) {
          setIsInSection(false);
          setShowDragBtn(false);
          setIsDragging(false);
          document.body.style.cursor = "default";
          section.classList.remove("show-cursor");
        }
      }
    };

    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.cursor = "default";
    };
  }, [isInSection]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isInSection && !isOverNavButton) {
        setDragPosition({ x: e.clientX, y: e.clientY });
        const section = sectionRef.current;
        if (section) {
          section.classList.remove("show-cursor");
        }
        updateDragPosition(e.clientX, e.clientY);

        const dragBtnCenterX = e.clientX;
        const dragBtnCenterY = e.clientY - 15;
        const padding = 10;

        const buttonElements = document.querySelectorAll(
          ".fp-swiper-button-next, .fp-swiper-button-prev"
        );
        let overButton = false;

        buttonElements.forEach((button) => {
          const rect = button.getBoundingClientRect();
          if (
            dragBtnCenterX >= rect.left - padding &&
            dragBtnCenterX <= rect.right + padding &&
            dragBtnCenterY >= rect.top - padding &&
            dragBtnCenterY <= rect.bottom + padding
          ) {
            overButton = true;
          }
        });

        if (overButton && showDragBtn) {
          setShowDragBtn(false);
          const sliderElement = sectionRef.current;
          if (sliderElement) {
            sliderElement.classList.add("show-cursor");
          }
        } else if (!overButton && !showDragBtn) {
          setShowDragBtn(true);
          const sliderElement = sectionRef.current;
          if (sliderElement) {
            sliderElement.classList.remove("show-cursor");
          }
        }
      }
    };

    if (isInSection && !isOverNavButton) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isInSection, isOverNavButton, showDragBtn]);

  useEffect(() => {
    const handleButtonEnter = () => {
      setIsOverNavButton(true);
      setShowDragBtn(false);
      document.body.style.cursor = "pointer";
    };

    const handleButtonLeave = () => {
      setIsOverNavButton(false);
      if (isInSection) {
        setShowDragBtn(true);
        document.body.style.cursor = "none";
      } else {
        document.body.style.cursor = "default";
      }
    };

    const nextButton = document.querySelector(".fp-swiper-button-next");
    const prevButton = document.querySelector(".fp-swiper-button-prev");

    if (nextButton) {
      nextButton.addEventListener("mouseenter", handleButtonEnter);
      nextButton.addEventListener("mouseleave", handleButtonLeave);
    }
    if (prevButton) {
      prevButton.addEventListener("mouseenter", handleButtonEnter);
      prevButton.addEventListener("mouseleave", handleButtonLeave);
    }

    return () => {
      if (nextButton) {
        nextButton.removeEventListener("mouseenter", handleButtonEnter);
        nextButton.removeEventListener("mouseleave", handleButtonLeave);
      }
      if (prevButton) {
        prevButton.removeEventListener("mouseenter", handleButtonEnter);
        prevButton.removeEventListener("mouseleave", handleButtonLeave);
      }
    };
  }, [isInSection]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    dragStartXRef.current = null;
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !swiperRef.current) return;
    const deltaX = e.movementX;
    if (Math.abs(deltaX) > 2) {
      const swiperInstance = swiperRef.current.swiper || swiperRef.current;
      if (deltaX > 0) {
        swiperInstance?.slidePrev?.();
      } else {
        swiperInstance?.slideNext?.();
      }
    }
    setDragPosition({ x: e.clientX, y: e.clientY });
    updateDragPosition(e.clientX, e.clientY);
  };

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
    <section id="fp-home_accommodation" ref={sectionRef}>
      {/* Navigation buttons positioned to overlay exactly where they were */}
      <div className="fp-left-navigation">
        <button className="fp-nav-btn fp-swiper-button-prev">
          <div className="fp-btn-outline fp-btn-outline-1"></div>
          <div className="fp-btn-outline fp-btn-outline-2"></div>
          <div className="fp-arrow-container">
            <svg
              width="30"
              height="12"
              viewBox="0 0 30 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30 6H1M1 6L6 1M1 6L6 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
        <button className="fp-nav-btn fp-swiper-button-next">
          <div className="fp-btn-outline fp-btn-outline-1"></div>
          <div className="fp-btn-outline fp-btn-outline-2"></div>
          <div className="fp-arrow-container">
            <svg
              width="30"
              height="12"
              viewBox="0 0 30 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 6H29M29 6L24 1M29 6L24 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>

      <div className="fp-accommodation_swipe">
        <Swiper
          ref={swiperRef}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          speed={1000}
          navigation={{
            nextEl: ".fp-swiper-button-next",
            prevEl: ".fp-swiper-button-prev",
          }}
          className="fp-swiper swiper"
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id} className="fp-swiper-slide">
              <div className="fp-left">
                {property.category && <p>{property.category}</p>}
                <h2>{property.title}</h2>
                <div className="fp-image">
                  <img src={property.leftImage} alt={property.subtitle} />
                  <img
                    className="fp-image-tablet"
                    src={property.tabletImage}
                    alt={property.subtitle}
                  />
                </div>
              </div>
              <div className="fp-right">
                <div className="fp-image">
                  <img src={property.rightImage} alt={property.subtitle} />
                </div>
                <div className="fp-content-wrapper">
                  <h4>{property.subtitle}</h4>
                  <div className="fp-text">
                    <p>{property.description}</p>
                  </div>
                  <GlassButton href={property.link}>Discover</GlassButton>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showDragBtn && (
        <div
          ref={dragBtnRef}
          className={`fp-drag-btn ${isDragging ? "fp-dragging" : ""}`}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onDragStart={(e) => e.preventDefault()}
        >
          DRAG
        </div>
      )}
    </section>
  );
};

export default FeaturedProperties;
