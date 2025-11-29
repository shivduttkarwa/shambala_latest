import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ProjectDetailProps {
  heroImage?: string;
  title?: string;
  subtitle?: string;
  category?: string;
  backLink?: string;
  fullImage?: string;
  processImages?: string[];
  galleryImages?: string[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  heroImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop",
  title = "Modern Architecture Studio",
  subtitle = "Building Dreams from Foundation to Finish",
  category = "Brand Identity / 2024",
  backLink = "/projects",
  fullImage,
  processImages = [],
  galleryImages = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseUrl = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  const normalize = (src?: string) => {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;
    return `${baseUrl}${src.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Function to split title text into characters
      const splitTitleChars = (el: HTMLElement | null) => {
        if (!el) return [];
        if (el.querySelector(".pd-title-char")) {
          return Array.from(el.querySelectorAll(".pd-title-char"));
        }

        const text = el.textContent || "";
        el.textContent = "";

        const chars: HTMLElement[] = [];
        [...text].forEach((char) => {
          const span = document.createElement("span");
          const isSpace = char === " ";
          span.className = `pd-title-char${isSpace ? " pd-title-space" : ""}`;
          span.textContent = isSpace ? "\u00a0" : char;
          el.appendChild(span);
          chars.push(span);
        });
        return chars;
      };

      // Animate ALL images with clip-path
      const imageElements =
        containerRef.current?.querySelectorAll(".pd-animate-image");
      imageElements?.forEach((imgContainer) => {
        gsap.to(imgContainer, {
          clipPath: "inset(0% 0 0 0)",
          ease: "power3.out",
          duration: 1.2,
          scrollTrigger: {
            trigger: imgContainer,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Animate gallery images with clip-path
      const galleryElements = containerRef.current?.querySelectorAll(
        ".pd-animate-gallery"
      );
      galleryElements?.forEach((imgContainer) => {
        gsap.to(imgContainer, {
          clipPath: "inset(0% 0 0 0)",
          ease: "power3.out",
          duration: 1.2,
          scrollTrigger: {
            trigger: imgContainer,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Animate content sections with timeline
      const contentElements = containerRef.current?.querySelectorAll(
        ".pd-animate-content"
      );
      contentElements?.forEach((content) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: content,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        // Find title within content
        const title = content.querySelector(".pd-animate-title") as HTMLElement;
        if (title) {
          const charEls = splitTitleChars(title);
          if (charEls.length) {
            gsap.set(title, { perspective: 600 });
            gsap.set(charEls, {
              opacity: 0,
              rotateX: 80,
              yPercent: 40,
              transformOrigin: "50% 100%",
            });

            tl.to(charEls, {
              opacity: 1,
              rotateX: 0,
              yPercent: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: {
                each: 0.02,
                from: "edges",
              },
            });
          }
        }

        // Animate paragraphs and other content
        const paragraphs = content.querySelectorAll(
          "p, .pd-category, .pd-meta-item"
        );
        if (paragraphs.length) {
          tl.fromTo(
            paragraphs,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.1,
            },
            "-=0.7"
          );
        }
      });

      // Animate feedback section
      const feedbackElements = containerRef.current?.querySelectorAll(
        ".pd-animate-feedback"
      );
      feedbackElements?.forEach((feedback) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: feedback,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        const category = feedback.querySelector(".pd-category");
        const blockquote = feedback.querySelector("blockquote");
        const clientInfo = feedback.querySelector(".pd-client-info");

        if (category) {
          tl.fromTo(
            category,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
          );
        }

        if (blockquote) {
          tl.fromTo(
            blockquote,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.3"
          );
        }

        if (clientInfo) {
          tl.fromTo(
            clientInfo,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
            "-=0.3"
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const defaultProcessImgs = [
    "https://images.unsplash.com/photo-1542744095-291d1f67b221?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
  ];
  const defaultGalleryImgs = [
    "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=600&fit=crop",
  ];
  const processImgs = processImages.length ? processImages : defaultProcessImgs;
  const procImg1 = normalize(processImgs[0]) || defaultProcessImgs[0];
  const procImg2 = normalize(processImgs[1]) || defaultProcessImgs[1];

  const galleryImgsRaw = galleryImages.length ? galleryImages : defaultGalleryImgs;
  const galleryImgs = galleryImgsRaw.map(
    (src, idx) => normalize(src) || defaultGalleryImgs[idx % defaultGalleryImgs.length]
  );

  const heroFullImage = normalize(fullImage) || galleryImgs[0] || normalize(heroImage);

  return (
    <div ref={containerRef} className="pd-wrapper">
      <style>{`
        .pd-wrapper * {
          box-sizing: border-box;
        }

        .pd-wrapper {
          font-family: 'Nunito', sans-serif;
          background: #ffffff;
          color: #000000;
          line-height: 1.6;
        }

        .pd-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .pd-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .pd-hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .pd-hero-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
          z-index: 1;
        }

        .pd-hero-background img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pd-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          padding: 2rem;
        }

        .pd-hero-back-btn {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          z-index: 3;
          color: white;
          text-decoration: none;
          font-size: 1.05rem;
          padding: 0.9rem 1.8rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .pd-hero-back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .pd-category {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
        }

        .pd-hero h1 {
          font-size: 5.4rem;
          font-weight: 300;
          font-family: 'Dream Avenue', cursive;
          letter-spacing: -0.025em;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .pd-hero-subtitle {
          font-size: 1.8rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
          opacity: 0.9;
        }

        .pd-hero p {
          font-size: 1.35rem;
          opacity: 0.8;
          max-width: 600px;
          margin: 0 auto;
        }

        .pd-hero-image {
          display: none;
        }

        .pd-overview {
          padding: 5rem 0;
        }

        .pd-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
        }

        .pd-wrapper h2 {
          font-size: 2.4rem;
          font-weight: 300;
          letter-spacing: -0.025em;
          margin-bottom: 1.5rem;
        }

        .pd-text-content p {
          color: #374151;
          line-height: 1.8;
          margin-bottom: 1rem;
          font-size: 1.35rem;
        }

        .pd-project-meta {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .pd-meta-item {
          display: flex;
          flex-direction: column;
        }

        .pd-meta-label {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .pd-meta-value {
          font-size: 1.35rem;
        }

        .pd-full-image {
          padding: 3rem 0;
        }

        .pd-image-wrapper {
          overflow: hidden;
          border-radius: 2px;
          clip-path: inset(0% 0 0 0);
        }

        .pd-image-wrapper img {
          width: 100%;
          height: 80vh;
          object-fit: cover;
          display: block;
        }

        .pd-design-process {
          padding: 5rem 0;
        }

        .pd-process-intro {
          margin-bottom: 4rem;
          max-width: 48rem;
        }

        .pd-process-intro p,
        .pd-gallery-intro p,
        .pd-results-intro p {
          font-size: 1.35rem;
          line-height: 1.8;
          color: #374151;
        }

        .pd-image-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .pd-image-grid-2 img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
        }

        .pd-feedback {
          background: #f9fafb;
          padding: 5rem 0;
        }

        .pd-feedback-content {
          max-width: 56rem;
          margin: 0 auto;
          text-align: center;
        }

        .pd-wrapper blockquote {
          font-size: 2.4rem;
          font-weight: 300;
          line-height: 1.6;
          letter-spacing: -0.025em;
          margin: 2rem 0;
        }

        .pd-client-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .pd-client-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #d1d5db;
        }

        .pd-client-details {
          text-align: left;
        }

        .pd-client-name {
          font-weight: 500;
        }

        .pd-client-title {
          font-size: 1.05rem;
          color: #6b7280;
        }

        .pd-gallery {
          padding: 5rem 0;
        }

        .pd-gallery-intro {
          margin-bottom: 4rem;
          max-width: 48rem;
        }

        .pd-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .pd-gallery-item {
          overflow: hidden;
          border-radius: 2px;
          clip-path: inset(0% 0 0 0);
        }

        .pd-gallery-item img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
          transition: transform 0.7s ease;
        }

        .pd-gallery-item:hover img {
          transform: scale(1.05);
        }

        .pd-gallery-item.pd-wide {
          grid-column: span 2;
        }

        .pd-results {
          padding: 5rem 0;
        }

        .pd-results-intro {
          margin-bottom: 4rem;
        }

        .pd-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
        }

        .pd-stat-item {
          text-align: center;
        }

        .pd-stat-number {
          font-size: 3.6rem;
          font-weight: 300;
          margin-bottom: 1rem;
        }

        .pd-stat-label {
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b7280;
        }

        .pd-footer {
          border-top: 1px solid #e5e7eb;
          margin-top: 5rem;
        }

        .pd-footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3rem 0;
        }

        .pd-footer-text {
          font-size: 1.05rem;
          color: #6b7280;
        }

        .pd-social-links {
          display: flex;
          gap: 1.5rem;
        }

        .pd-social-links a {
          text-decoration: none;
          color: #6b7280;
          font-size: 1.05rem;
          transition: color 0.3s;
          cursor: pointer;
        }

        .pd-social-links a:hover {
          color: #000000;
        }

        .pd-title-char {
          display: inline-block;
          transform-origin: 50% 100%;
        }

        .pd-title-space {
          width: 0.25em;
        }

        @media (max-width: 768px) {
          .pd-hero h1 {
            font-size: 2.5rem;
          }

          .pd-hero-subtitle {
            font-size: 1.35rem;
          }

          .pd-hero-back-btn {
            top: 1rem;
            left: 1rem;
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }

          .pd-grid-2,
          .pd-image-grid-2,
          .pd-gallery-grid,
          .pd-stats-grid {
            grid-template-columns: 1fr;
          }

          .pd-gallery-item.pd-wide {
            grid-column: span 1;
          }

          .pd-hero-image img,
          .pd-image-wrapper img,
          .pd-image-grid-2 img,
          .pd-gallery-item img {
            height: 300px;
          }

          .pd-wrapper blockquote {
            font-size: 1.5rem;
          }

          .pd-nav {
            gap: 1rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="pd-hero">
        <div className="pd-hero-background">
          <img src={heroImage} alt={title} />
        </div>
        <Link to={backLink} className="pd-hero-back-btn">
          ← Back to All Projects
        </Link>
        <div className="pd-hero-content pd-animate-content">
          <div className="pd-category">{category}</div>
          <h1 className="pd-animate-title">{title}</h1>
          <p className="pd-hero-subtitle">{subtitle}</p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="pd-overview">
        <div className="pd-container">
          <div className="pd-grid-2">
            <div className="pd-text-content pd-animate-content">
              <h2 className="pd-animate-title">Project Overview</h2>
              <p>
                The client approached us with a vision to redefine their brand
                identity to reflect their commitment to sustainable and
                innovative architectural solutions. Our goal was to create a
                visual language that embodies clarity, precision, and timeless
                elegance.
              </p>
              <p>
                Through extensive research and collaboration, we developed a
                comprehensive brand system that includes logo design,
                typography, color palette, and digital guidelines that work
                seamlessly across all touchpoints.
              </p>
            </div>
            <div className="pd-project-meta pd-animate-content">
              <div className="pd-meta-item">
                <div className="pd-meta-label">Client</div>
                <div className="pd-meta-value">Apex Architecture Studio</div>
              </div>
              <div className="pd-meta-item">
                <div className="pd-meta-label">Services</div>
                <div className="pd-meta-value">
                  Brand Identity, Digital Design, Art Direction
                </div>
              </div>
              <div className="pd-meta-item">
                <div className="pd-meta-label">Timeline</div>
                <div className="pd-meta-value">6 Months</div>
              </div>
              <div className="pd-meta-item">
                <div className="pd-meta-label">Year</div>
                <div className="pd-meta-value">2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Image */}
      <section className="pd-full-image">
        <div className="pd-container">
          <div className="pd-image-wrapper pd-animate-image">
            <img
              src={heroFullImage}
              alt="Project detail"
            />
          </div>
        </div>
      </section>

      {/* Design Process */}
      <section className="pd-design-process">
        <div className="pd-container">
          <div className="pd-process-intro pd-animate-content">
            <h2 className="pd-animate-title">Design Process</h2>
            <p>
              Our approach began with understanding the essence of architectural
              design—the interplay of space, light, and form. We translated
              these principles into a brand identity that feels both
              contemporary and enduring.
            </p>
          </div>
          <div className="pd-image-grid-2">
            <div className="pd-image-wrapper pd-animate-image">
              <img
                src={procImg1}
                alt="Design process 1"
              />
            </div>
            <div className="pd-image-wrapper pd-animate-image">
              <img
                src={procImg2}
                alt="Design process 2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Client Feedback */}
      <section className="pd-feedback">
        <div className="pd-container">
          <div className="pd-feedback-content pd-animate-feedback">
            <div className="pd-category">Client Feedback</div>
            <blockquote>
              "The team delivered beyond our expectations. The new brand
              identity perfectly captures our vision and has elevated our
              presence in the industry."
            </blockquote>
            <div className="pd-client-info">
              <div className="pd-client-avatar"></div>
              <div className="pd-client-details">
                <div className="pd-client-name">Sarah Mitchell</div>
                <div className="pd-client-title">
                  Founder, Apex Architecture
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pd-gallery">
        <div className="pd-container">
          <div className="pd-gallery-intro pd-animate-content">
            <h2 className="pd-animate-title">Gallery</h2>
            <p>
              A collection of key deliverables showcasing the versatility and
              cohesiveness of the brand system across various applications.
            </p>
          </div>
          <div className="pd-gallery-grid">
            {galleryImgs.slice(0, 5).map((src, idx) => (
              <div
                key={src + idx}
                className={`pd-gallery-item pd-animate-gallery ${
                  idx === 3 ? "pd-wide" : ""
                }`}
              >
                <img src={src} alt={`Gallery ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pd-results">
        <div className="pd-container">
          <div className="pd-results-intro pd-animate-content">
            <h2 className="pd-animate-title">Results & Impact</h2>
          </div>
          <div className="pd-stats-grid">
            <div className="pd-stat-item pd-animate-content">
              <div className="pd-stat-number">150%</div>
              <div className="pd-stat-label">Brand Recognition Increase</div>
            </div>
            <div className="pd-stat-item pd-animate-content">
              <div className="pd-stat-number">3x</div>
              <div className="pd-stat-label">Client Inquiries Growth</div>
            </div>
            <div className="pd-stat-item pd-animate-content">
              <div className="pd-stat-number">95%</div>
              <div className="pd-stat-label">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pd-footer">
        <div className="pd-container">
          <div className="pd-footer-content">
            <div className="pd-footer-text">© 2024 All rights reserved</div>
            <div className="pd-social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectDetail;
