// src/components/OverlayMenu.tsx
import React, { useEffect } from "react";
import gsap from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
import "./overlayMenu.css";

gsap.registerPlugin(CSSRulePlugin);

const OverlayMenu: React.FC = () => {
  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    const path = document.querySelector(
      ".overlay svg path"
    ) as SVGPathElement | null;

    let spanBefore: CSSRule | null = null;

    // CSSRulePlugin (safe try/catch)
    try {
      spanBefore = CSSRulePlugin.getRule("#hamburger .line-2");
      if (spanBefore) {
        gsap.set(spanBefore, { background: "#000" });
      }
    } catch (e) {
      console.warn("CSSRulePlugin not available:", e);
    }

    // Initial menu state - hidden by default
    gsap.set(".menu", { visibility: "hidden" });

    const revealMenuItems = () => {
      if (!path) return;

      // Optimized paths for full screen coverage with pronounced curve
      const start = "M0 700S100 100 500 100s400 600 1000 700V0H0Z";
      const end = "M0 1000S100 1000 500 1000s500 1000 1000 1000V0H0Z";
      const power2 = "power2.inout";

      const isMobile = window.innerWidth <= 768;

      tl.to("#hamburger", {
        duration: 1.25,
        marginTop: "-5px",
        x: isMobile ? -20 : -40,
        y: isMobile ? 20 : 40,
        ease: power2,
      })
        // Change hamburger line colors to white
        .to(
          "#hamburger .line",
          {
            duration: 1,
            background: "#fff",
            ease: power2,
          },
          "<"
        );

      // Change pseudo element color (CSSRulePlugin)
      if (spanBefore) {
        tl.to(
          spanBefore,
          {
            duration: 1,
            background: "#fff",
            ease: power2,
          },
          "<"
        );
      }

      // Animate button outline circles
      tl.to(
        ".btn .btn-outline",
        {
          duration: 1.25,
          x: isMobile ? -20 : -40,
          y: isMobile ? 20 : 40,
          width: isMobile ? "80px" : "140px",
          height: isMobile ? "80px" : "140px",
          border: "1px solid #e2e2dc",
          ease: power2,
        },
        "<"
      );

      // SVG Background Animation
      tl.to(
        path,
        {
          duration: 0.8,
          attr: { d: start },
          ease: power2,
        },
        "<"
      ).to(
        path,
        {
          duration: 0.8,
          attr: { d: end },
          ease: power2,
        },
        "-=0.5"
      );

      // Menu appears AFTER background completes
      tl.to(
        ".menu",
        {
          duration: 0.5,
          visibility: "visible",
        },
        "-=0.4"
      );

      // Primary menu items
      tl.to(
        ".primary-menu .menu-item>a",
        {
          duration: 0.4,
          top: 0,
          ease: "power3.in",
          stagger: {
            amount: 0.3,
          },
        },
        "-=0.6"
      )
        // Secondary menu background image
        .to(
          ".secondary-menu-bg",
          {
            duration: 0.3,
            top: 0,
            ease: "power3.in",
          },
          "-=0.2"
        )
        // First contact button
        .to(
          ".contact-btn",
          {
            duration: 0.2,
            top: 0,
            ease: "power3.in",
          },
          "-=0.1"
        )
        // Second contact button
        .to(
          ".email-btn",
          {
            duration: 0.2,
            top: 0,
            ease: "power3.in",
          },
          "+=0.02"
        )
        // Social section
        .to(
          ".menu-item .social-content",
          {
            duration: 0.2,
            top: 0,
            ease: "power3.in",
          },
          "+=0.02"
        )
        // Footer section
        .to(
          ".menu-item .footer-content",
          {
            duration: 0.2,
            top: 0,
            ease: "power3.in",
          },
          "+=0.02"
        )
        .reverse(); // start in reversed (closed) state
    };

    // Build timeline
    revealMenuItems();

    const hamburger = document.getElementById("hamburger");
    const toggleBtn = document.getElementById("toggle-btn");

    const handleToggle = (e: Event) => {
      e.preventDefault();
      if (!hamburger) return;

      hamburger.classList.toggle("active");
      const isReversed = !tl.reversed();
      tl.reversed(isReversed);

      if (isReversed) {
        // Menu closing
        document.body.style.overflow = "";
        document.body.classList.remove("menu-open");
      } else {
        // Menu opening
        document.body.style.overflow = "hidden";
        document.body.classList.add("menu-open");
      }
    };

    toggleBtn?.addEventListener("click", handleToggle);
    toggleBtn?.addEventListener("touchend", handleToggle);

    // Menu link click behaviour (close + scroll)
    const menuLinks =
      document.querySelectorAll<HTMLAnchorElement>(".menu-item a");

    const handleMenuLinkClick = (e: Event) => {
      e.preventDefault();
      const link = e.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute("href") || "";

      if (hamburger && hamburger.classList.contains("active")) {
        hamburger.classList.remove("active");
        tl.reverse();
        document.body.style.overflow = "";
        document.body.classList.remove("menu-open");
      }

      // Wait for menu close animation to complete
      setTimeout(() => {
        if (href.startsWith("#")) {
          const targetSection = document.querySelector(
            href
          ) as HTMLElement | null;
          if (targetSection) {
            const scrollInstance = (window as any).scroll;
            if (scrollInstance) {
              // locomotive scroll instance if present
              scrollInstance.scrollTo(targetSection);
            } else {
              // native smooth scroll
              targetSection.scrollIntoView({ behavior: "smooth" });
            }
          }
        } else if (href && href !== "#") {
          window.location.href = href;
        }
      }, 800);
    };

    menuLinks.forEach((link) =>
      link.addEventListener("click", handleMenuLinkClick)
    );

    // Cleanup
    return () => {
      toggleBtn?.removeEventListener("click", handleToggle);
      toggleBtn?.removeEventListener("touchend", handleToggle);
      menuLinks.forEach((link) =>
        link.removeEventListener("click", handleMenuLinkClick)
      );
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <div id="toggle-btn" className="btn">
        <div className="btn-outline btn-outline-1"></div>
        <div className="btn-outline btn-outline-2"></div>
        <div id="hamburger">
          <span className="line line-1"></span>
          <span className="line line-2"></span>
        </div>
      </div>

      {/* SVG Overlay */}
      <div className="overlay">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0 2S175 1 500 1s500 1 500 1V0H0Z"></path>
        </svg>
      </div>

      {/* Full Screen Menu */}
      <div className="menu">
        {/* Primary navigation items */}
        <div className="primary-menu">
          <div className="menu-container">
            <div className="wrapper">
              <div className="menu-item modern-menu-item menu-item-home">
                <div className="menu-line"></div>
                <a href="#hero">
                  <span className="menu-number">00.</span>
                  <div className="menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="menu-text">HOME</span>
                </a>
                <div className="menu-item-revealer"></div>
              </div>

              <div className="menu-item modern-menu-item menu-item-services">
                <div className="menu-line"></div>
                <a href="#services">
                  <span className="menu-number">01.</span>
                  <div className="menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="menu-text">SERVICES</span>
                </a>
                <div className="menu-item-revealer"></div>
              </div>

              <div className="menu-item modern-menu-item menu-item-work">
                <div className="menu-line"></div>
                <a href="#work">
                  <span className="menu-number">02.</span>
                  <div className="menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="menu-text">WORK</span>
                </a>
                <div className="menu-item-revealer"></div>
              </div>

              <div className="menu-item modern-menu-item menu-item-testimonials">
                <div className="menu-line"></div>
                <a href="#testimonials">
                  <span className="menu-number">03.</span>
                  <div className="menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="menu-text">TESTIMONIALS</span>
                </a>
                <div className="menu-item-revealer"></div>
              </div>

              <div className="menu-item modern-menu-item menu-item-about">
                <div className="menu-line"></div>
                <a href="#about">
                  <span className="menu-number">04.</span>
                  <div className="menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="menu-text">ABOUT</span>
                </a>
                <div className="menu-item-revealer"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary menu */}
        <div className="secondary-menu">
          <div className="secondary-menu-bg"></div>
          <div className="menu-container">
            {/* Contact Section */}
            <div className="contact-section">
              <div className="menu-item secondary-menu-item">
                <a href="#contact" className="premium-btn contact-btn">
                  Contact Me
                </a>
                <div className="menu-item-revealer"></div>
              </div>

              <div className="menu-item secondary-menu-item">
                <a
                  href="mailto:shivduttkarwa@gmail.com"
                  className="premium-btn email-btn"
                >
                  Send Email
                </a>
                <div className="menu-item-revealer"></div>
              </div>
            </div>

            {/* Social media */}
            <div className="menu-item social-menu-item">
              <div className="social-content">
                <div className="social-grid">
                  <a href="#" className="social-card instagram">
                    <i className="fab fa-instagram" />
                  </a>
                  <a href="#" className="social-card linkedin">
                    <i className="fab fa-linkedin-in" />
                  </a>
                  <a href="#" className="social-card github">
                    <i className="fab fa-github" />
                  </a>
                  <a href="#" className="social-card twitter">
                    <i className="fab fa-twitter" />
                  </a>
                </div>
              </div>
              <div className="menu-item-revealer"></div>
            </div>

            {/* Footer */}
            <div className="menu-item footer-menu-item">
              <div className="footer-content">
                <div className="footer-links">
                  <a href="#" className="footer-link">
                    Privacy
                  </a>
                  <a href="#" className="footer-link">
                    Terms
                  </a>
                  <a href="#" className="footer-link">
                    Cookies
                  </a>
                </div>
                <div className="copyright">
                  <p>© 2025 Shivdutt Karwa. All rights reserved.</p>
                </div>
              </div>
              <div className="menu-item-revealer"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverlayMenu;
