import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./HeroLoader.css";

interface HeroLoaderProps {
  onComplete?: () => void;
}

const HeroLoader: React.FC<HeroLoaderProps> = ({ onComplete }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const hasPlayedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const curtain = curtainRef.current;
    const text1El = text1Ref.current;
    const text2El = text2Ref.current;

    if (!curtain || !text1El || !text2El) return;
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    function createCharSpans(element: HTMLElement, text: string) {
      element.innerHTML = "";
      const chars = text.split("");
      const spans: HTMLSpanElement[] = [];
      chars.forEach((ch) => {
        const span = document.createElement("span");
        if (ch === " ") {
          span.innerHTML = "&nbsp;";
        } else {
          span.textContent = ch;
        }
        element.appendChild(span);
        spans.push(span);
      });
      return spans;
    }

    const TEXT1 = "INSPIRE";
    const TEXT2 = "A TRUE LIVING";

    const text1Spans = createCharSpans(text1El, TEXT1);
    const text2Spans = createCharSpans(text2El, TEXT2);

    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Initial states
    gsap.set(curtain, { x: "-100%" });
    gsap.set([text1El, text2El], { opacity: 1 });
    gsap.set(text1Spans, { y: -vh * 0.7 });
    gsap.set(text2Spans, { y: vh * 0.7 });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onCompleteRef.current?.();
      },
    });

    tl
      // Step 1: Curtain slides in from left
      .to(curtain, {
        x: "0%",
        duration: 0.8,
        ease: "power3.inOut",
      })

      // Step 2: Both texts enter together after curtain is in
      .to(
        text1Spans,
        {
          y: -40,
          duration: 0.8,
          ease: "back.out(1.4)",
          stagger: 0.08,
        },
        "+=0.2"
      )

      .to(
        text2Spans,
        {
          y: 40,
          duration: 0.8,
          ease: "back.out(1.4)",
          stagger: 0.08,
        },
        "<"
      )

      // Step 3: Hold for a moment
      .to({}, { duration: 0.5 })

      // Step 4: Texts exit in opposite directions
      .to(text1Spans, {
        x: vw,
        duration: 0.8,
        ease: "back.in(1.4)",
        stagger: 0.08,
      })

      .to(
        text2Spans,
        {
          x: -vw,
          duration: 0.8,
          ease: "back.in(1.4)",
          stagger: 0.08,
        },
        "<"
      )

      // Step 5: Curtain slides out to right
      .to(
        curtain,
        {
          x: "100%",
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.3"
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div ref={loaderRef} className="hero-loader">
      <div ref={curtainRef} className="hero-loader-curtain"></div>

      <div className="hero-loader-text-container">
        <div className="hero-loader-backdrop"></div>
        <h1 ref={text1Ref} className="hero-loader-text hero-loader-text-1"></h1>
        <h1 ref={text2Ref} className="hero-loader-text hero-loader-text-2"></h1>
      </div>
    </div>
  );
};

export default HeroLoader;
