import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import "./ElasticText.css";

interface ElasticTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  fontSize?: string;
  fontWeight?: number;
  fontStretch?: number;
  color?: string;
  autoAnimate?: boolean;
  elasticDropOff?: number;
  maxYOffset?: number;
  onAnimationReady?: (animateFunction: () => void) => void;
}

const ElasticText: React.FC<ElasticTextProps> = ({
  children,
  className = "",
  style = {},
  fontSize = "6vw",
  fontWeight = 600,
  fontStretch = 130,
  color = "#444444",
  autoAnimate = true,
  elasticDropOff = 0.8,
  maxYOffset = 40,
  onAnimationReady,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const animationStateRef = useRef({
    isMouseDown: false,
    mouseInitialY: 0,
    mouseFinalY: 0,
    distY: 0,
    charIndexSelected: 0,
    charH: 0,
    dragFactor: 0,
  });

  useEffect(() => {
    if (!textRef.current) return;

    const weightInit = fontWeight;
    const weightTarget = 400;
    const weightDiff = weightInit - weightTarget;
    const stretchInit = fontStretch;
    const stretchTarget = 90;
    const stretchDiff = stretchInit - stretchTarget;

    // Split text into character spans
    const splitText = () => {
      if (!textRef.current) return;
      
      const text = children;
      textRef.current.innerHTML = "";
      charsRef.current = [];

      text.split("").forEach((ch) => {
        const span = document.createElement("span");
        span.classList.add("elastic-char");
        span.textContent = ch === " " ? "\u00A0" : ch;
        textRef.current!.appendChild(span);
        charsRef.current.push(span);
      });
    };

    const animInText = () => {
      if (charsRef.current.length === 0) return;

      const elem = charsRef.current[0];
      const rect = elem.getBoundingClientRect();
      animationStateRef.current.charH = rect.height || 60;

      const resetAndAnimate = () => {
        // Reset characters to initial state
        gsap.set(charsRef.current, {
          transformOrigin: "center bottom",
          y: () => -1 * (rect.y + animationStateRef.current.charH + 300),
          fontWeight: weightTarget,
          fontStretch: `${stretchTarget}%`,
        });

        // Animate in
        gsap.to(charsRef.current, {
          y: 0,
          fontWeight: weightInit,
          fontStretch: `${stretchInit}%`,
          ease: "elastic(0.2, 0.1)",
          duration: 1.3,
          stagger: {
            each: 0.04,
            from: "random",
          },
        });
      };

      // Set initial position - always start with characters hidden above
      gsap.set(charsRef.current, {
        transformOrigin: "center bottom",
        y: () => -1 * (rect.y + animationStateRef.current.charH + 300),
        fontWeight: weightTarget,
        fontStretch: `${stretchTarget}%`,
      });

      if (autoAnimate) {
        setTimeout(resetAndAnimate, 300);
      }

      if (onAnimationReady) {
        onAnimationReady(resetAndAnimate);
      }

      initEvents();
    };

    const calcDist = () => {
      const maxDrag = animationStateRef.current.charH || 60;
      animationStateRef.current.distY = animationStateRef.current.mouseInitialY - animationStateRef.current.mouseFinalY;
      animationStateRef.current.dragFactor = animationStateRef.current.distY / maxDrag;

      if (animationStateRef.current.dragFactor > 1) animationStateRef.current.dragFactor = 1;
      if (animationStateRef.current.dragFactor < -0.5) animationStateRef.current.dragFactor = -0.5;
    };

    const calcFracDispersion = (index: number) => {
      const dispersion =
        1 - Math.abs(index - animationStateRef.current.charIndexSelected) / (charsRef.current.length * elasticDropOff);
      return dispersion * animationStateRef.current.dragFactor;
    };

    const setFontDragDimensions = () => {
      gsap.to(charsRef.current, {
        y: (index) => {
          const fracDispersion = calcFracDispersion(index);
          return fracDispersion * -maxYOffset;
        },
        fontWeight: (index) => {
          const fracDispersion = calcFracDispersion(index);
          return weightInit - fracDispersion * weightDiff;
        },
        fontStretch: (index) => {
          const fracDispersion = calcFracDispersion(index);
          return `${stretchInit - fracDispersion * stretchDiff}%`;
        },
        ease: "power3.out",
        duration: 0.4,
      });
    };

    const snapBackText = () => {
      gsap.to(charsRef.current, {
        y: 0,
        fontWeight: weightInit,
        fontStretch: `${stretchInit}%`,
        ease: "elastic(0.4, 0.15)",
        duration: 1,
        stagger: {
          each: 0.02,
          from: animationStateRef.current.charIndexSelected,
        },
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (animationStateRef.current.isMouseDown) {
        animationStateRef.current.mouseFinalY = e.clientY;
        animationStateRef.current.isMouseDown = false;
        snapBackText();
        document.body.classList.remove("elastic-grab");
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (animationStateRef.current.isMouseDown) {
        animationStateRef.current.mouseFinalY = e.clientY;
        calcDist();
        setFontDragDimensions();
      }
    };

    const handleMouseLeave = () => {
      if (animationStateRef.current.isMouseDown) {
        snapBackText();
        animationStateRef.current.isMouseDown = false;
        document.body.classList.remove("elastic-grab");
      }
    };

    const initEvents = () => {
      document.body.addEventListener("mouseup", handleMouseUp);
      document.body.addEventListener("mousemove", handleMouseMove);
      document.body.addEventListener("mouseleave", handleMouseLeave);

      charsRef.current.forEach((char, index) => {
        char.addEventListener("mousedown", function (e) {
          animationStateRef.current.mouseInitialY = e.clientY;
          animationStateRef.current.charIndexSelected = index;
          animationStateRef.current.isMouseDown = true;
          document.body.classList.add("elastic-grab");
        });
      });
    };

    // Initialize
    splitText();
    animInText();

    // Cleanup
    return () => {
      document.body.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.classList.remove("elastic-grab");
    };
  }, [children, fontWeight, fontStretch, autoAnimate, elasticDropOff, maxYOffset]);

  return (
    <div
      ref={textRef}
      className={`elastic-text ${className}`}
      style={{
        fontSize,
        fontWeight,
        fontStretch: `${fontStretch}%`,
        color,
        ...style,
      }}
    />
  );
};

export default ElasticText;