import React, { forwardRef, useEffect, useState } from "react";
import "./HomeHeroSlider.css";

type Slide = {
  label: string;
  title: string;
  meta: string;
};

const SLIDES: Slide[] = [
  { label: "Latest", title: "New case study: Forma Studio", meta: "2025 · Read →" },
  { label: "News", title: "Atelier wins design award", meta: "2024 · Details →" },
  { label: "Update", title: "Shambala loft unveiled", meta: "2024 · View →" },
  { label: "Press", title: "Featured in ArchDaily", meta: "2024 · Read →" },
  { label: "Insight", title: "Designing for wellbeing", meta: "2025 · Explore →" },
];

const HomeHeroSlider = forwardRef<HTMLDivElement>((_, ref) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mh-ui-news" ref={ref}>
      <div className="hh-slider-window">
        <div
          className="hh-slider-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div className="hh-slide" key={slide.title}>
              <div className="hh-label">{slide.label}</div>
              <div className="hh-title">{slide.title}</div>
              <div className="hh-meta">{slide.meta}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hh-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`hh-dot${i === index ? " active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
});

HomeHeroSlider.displayName = "HomeHeroSlider";

export default HomeHeroSlider;
