import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./StepSlider.css";

type Slide = {
  image: string;
  counter: string;
  title: string;
  highlight?: string;
  text: string;
};

const slidesData: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=1000&fit=crop",
    counter: "1 – 6",
    title: "Heartwarming and Cosy",
    highlight: "Nurseries",
    text: "Let your children be surrounded by care and attention. Our kindergarten teachers are both compassionate and highly skilled. With learning games and pure fun, your little ones will have it all!",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1000&fit=crop",
    counter: "2 – 6",
    title: "Creative Learning",
    highlight: "Environments",
    text: "Our spaces are designed to inspire creativity and curiosity. Every corner is a new adventure waiting to be discovered by your children.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&h=1000&fit=crop",
    counter: "3 – 6",
    title: "Outdoor Play",
    highlight: "Adventures",
    text: "Fresh air and outdoor activities are essential for development. Our safe outdoor spaces encourage exploration and physical activity.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=1000&fit=crop",
    counter: "4 – 6",
    title: "Healthy Meals",
    highlight: "Daily",
    text: "Nutrition matters! We provide balanced, delicious meals prepared with love and care, catering to all dietary requirements.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=800&h=1000&fit=crop",
    counter: "5 – 6",
    title: "Music and",
    highlight: "Arts",
    text: "Express yourself! Our music and arts programs help children discover their talents and build confidence through creative expression.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1000&fit=crop",
    counter: "6 – 6",
    title: "Safe and",
    highlight: "Secure",
    text: "Your peace of mind is our priority. Our facilities are equipped with modern security systems and our staff are trained in child safety.",
  },
];

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const StepSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);

  const slides = useMemo(() => slidesData, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const slider = sliderRef.current;
    const track = trackRef.current;
    const dotsContainer = dotsRef.current;
    if (!slider || !track || !dotsContainer) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLDivElement>(".step-slider__card")
    );
    const dots = Array.from(
      dotsContainer.querySelectorAll<HTMLDivElement>(
        ".step-slider__progress-dot"
      )
    );
    const totalCards = cards.length;

    const applyState = (totalProgress: number) => {
      cards.forEach((card, index) => {
        if (index === 0) {
          const stackPosition = totalProgress * 2;
          card.style.transform = `
            translateZ(-${stackPosition * 100}px)
            rotateX(-${stackPosition * 5}deg)
            scale(${1 - stackPosition * 0.025})
          `;
          card.style.opacity = (1 - clamp(totalProgress / 2, 0, 1)).toString();
          card.style.zIndex = "100";
        } else {
          const shiftedIndex = index - 1;
          const cardStart = shiftedIndex;
          const cardEnd = shiftedIndex + 1;

          let cardProgress =
            (totalProgress - cardStart) / (cardEnd - cardStart);
          cardProgress = clamp(cardProgress, 0, 1);

          if (totalProgress < cardStart) {
            const waitDistance = (cardStart - totalProgress) * 5;
            card.style.transform = `
              translateY(${100 + waitDistance}vh)
              rotateX(-12deg)
              scale(${0.85 - waitDistance * 0.01})
            `;
            card.style.opacity = "0";
            card.style.zIndex = `${index}`;
          } else if (totalProgress >= cardStart && totalProgress < cardEnd) {
            const yProgress = 1 - cardProgress;
            const rotation = -12 + cardProgress * 12;
            const scale = 0.85 + cardProgress * 0.15;

            card.style.transform = `
              translateY(${yProgress * 100}vh)
              rotateX(${rotation}deg)
              scale(${scale})
            `;
            card.style.opacity = "1";
            card.style.zIndex = `${100 + index}`;
          } else {
            const stackPosition = (totalProgress - cardEnd) * 2;
            card.style.transform = `
              translateZ(-${stackPosition * 200}px)
              rotateX(-${stackPosition * 10}deg)
              scale(${1 - stackPosition * 0.05})
            `;
            card.style.opacity =
              index === totalCards - 1
                ? "1"
                : (1 - clamp((totalProgress - index) / 2, 0, 1)).toString();
            card.style.zIndex = `${100 + index}`;
          }
        }
      });

      const activeIndex = Math.floor(totalProgress);
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIndex);
      });
    };

    // initial positioning
    cards.forEach((card, index) => {
      if (index === 0) {
        card.style.transform = "translateY(0) rotateX(0deg) scale(1)";
        card.style.opacity = "1";
        card.style.zIndex = "100";
      } else {
        const waitDistance = (index - 1) * 5;
        card.style.transform = `
          translateY(${100 + waitDistance}vh)
          rotateX(-12deg)
          scale(${0.85 - waitDistance * 0.01})
        `;
        card.style.opacity = "0";
        card.style.zIndex = `${index}`;
      }
    });

    const trigger = ScrollTrigger.create({
      trigger: slider,
      start: "top top",
      end: () => `+=${window.innerHeight * (slides.length + 0.5)}`,
      scrub: true,
      pin: slider,
      anticipatePin: 1,
      onUpdate: (self) => {
        const adjustedTotal = self.progress * totalCards;
        applyState(adjustedTotal);
      },
    });

    trigger.refresh();
    applyState(0);

    return () => {
      trigger.kill();
    };
  }, [slides]);

  const sliderHeight = 100; // vh, pin handles duration

  return (
    <div className="step-slider-section">
      <div
        className="step-slider"
        ref={sliderRef}
        style={{ height: `${sliderHeight}vh` }}
      >
        <div className="step-slider__container">
          <div className="step-slider__track" ref={trackRef}>
            {slides.map((slide, index) => (
              <div
                key={slide.image}
                className="step-slider__card"
                data-index={index}
              >
                <div className="step-slider__card-image">
                  <img src={slide.image} alt={slide.highlight || slide.title} />
                </div>
                <div className="step-slider__card-content">
                  <p className="step-slider__counter">{slide.counter}</p>
                  <h3 className="step-slider__title">
                    {slide.title} <br />
                    <i>{slide.highlight}</i>
                  </h3>
                  <p className="step-slider__text">{slide.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="step-slider__progress" ref={dotsRef}>
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`step-slider__progress-dot ${
                  idx === 0 ? "is-active" : ""
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSlider;
