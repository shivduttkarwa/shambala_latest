import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServiceHeroText.css";

gsap.registerPlugin(ScrollTrigger);

interface ServiceHeroTextProps {
  text: string;
  secondText: string;
  className?: string;
}

const ServiceHeroText: React.FC<ServiceHeroTextProps> = ({ text, secondText, className = "" }) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const chars = splitChars(heading);
    const section = heading.closest(".mm-section");
    if (!section) return;

    const config = chars.map(() => ({
      x: gsap.utils.random(-220, 220),
      y: gsap.utils.random(-140, 140),
      r: gsap.utils.random(-40, 40),
      s: gsap.utils.random(0.6, 0.9),
    }));

    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      chars,
      {
        x: (i) => config[i].x,
        y: (i) => config[i].y,
        rotation: (i) => config[i].r,
        scale: (i) => config[i].s,
        opacity: 0,
        filter: "blur(14px)",
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "expo.out",
        stagger: { each: 0.035, from: "center" },
      }
    );

    tl.to(
      heading,
      {
        "--u-scale": 1,
        duration: 0.9,
        ease: "power2.out",
      },
      "-=0.7"
    );

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: () => tl.restart(),
      onEnterBack: () => tl.restart(),
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, []);

  function splitChars(el: HTMLElement): HTMLElement[] {
    const text = el.textContent || "";
    el.textContent = "";
    const chars: HTMLElement[] = [];

    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.classList.add("char");

      if (ch === " ") {
        span.classList.add("is-space");
        span.innerHTML = "&nbsp;";
      } else {
        span.textContent = ch;
      }

      el.appendChild(span);
      chars.push(span);
    });

    return chars.filter((c) => !c.classList.contains("is-space"));
  }

  return (
    <section className={`mm-section ${className}`.trim()}>
      <h1 className="mm-heading" ref={headingRef}>
        {text}
        <br />
        {secondText}
      </h1>
    </section>
  );
};

export default ServiceHeroText;