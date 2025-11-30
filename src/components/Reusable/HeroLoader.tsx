import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./HeroLoader.css";

interface HeroLoaderProps {
  onComplete?: () => void;
}

/**
 * Curtain + hero text loader inspired by test.html.desabled.
 * Plays once on mount, then unmounts and signals completion.
 */
const HeroLoader: React.FC<HeroLoaderProps> = ({ onComplete }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const curtain = curtainRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    if (!curtain || !text1 || !text2) return;

    const fallback = window.setTimeout(() => {
      setVisible(false);
      onCompleteRef.current?.();
    }, 5000);

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        setVisible(false);
        onCompleteRef.current?.();
        clearTimeout(fallback);
      },
    });

    gsap.set([text1, text2], { opacity: 0, y: "120vh" });
    gsap.set(curtain, { yPercent: 100 });

    const textSequence = (el: HTMLElement, startLabel: number | string) => {
      tl.fromTo(
        el,
        { y: "120vh", opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        startLabel
      ).to(el, {
        y: "-120vh",
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power2.in",
      });
    };

    tl.to(curtain, { yPercent: 0, duration: 1.4, ease: "power2.inOut" })
      .add(() => {
        gsap.to(text1.querySelectorAll("span"), {
          opacity: 1,
          stagger: 0.05,
          duration: 0.2,
        });
      }, "-=0.6");

    // split text into spans
    const split = (el: HTMLElement) => {
      const txt = el.textContent || "";
      el.textContent = "";
      const spans = txt.split("").map((ch, idx) => {
        const s = document.createElement("span");
        s.textContent = ch === " " ? "\u00a0" : ch;
        el.appendChild(s);
        return s;
      });
      return spans;
    };
    split(text1);
    split(text2);

    textSequence(text1, "-=0.4");
    textSequence(text2, ">-0.2");

    tl.to(
      curtain,
      { yPercent: -100, duration: 1.1, ease: "power3.inOut" },
      "-=0.5"
    );

    return () => {
      tl.kill();
      clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={loaderRef} className="hero-loader">
      <div ref={curtainRef} className="hero-loader-curtain"></div>
      <div className="hero-loader-text-container">
        <div className="hero-loader-backdrop"></div>
        <h1 ref={text1Ref} className="hero-loader-text hero-loader-text-1">
          INSPIRE
        </h1>
        <h1 ref={text2Ref} className="hero-loader-text hero-loader-text-2">
          A TRUE LIVING
        </h1>
      </div>
    </div>
  );
};

export default HeroLoader;
