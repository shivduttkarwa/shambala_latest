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
      ".olm-overlay svg path"
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
    gsap.set(".olm-menu", { visibility: "hidden" });

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
        ".olm-btn .olm-btn-outline",
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
        ".olm-menu",
        {
          duration: 0.5,
          visibility: "visible",
        },
        "-=0.4"
      );

      // Primary menu items
      tl.to(
        ".olm-primary-menu .olm-menu-item>a",
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
          ".olm-secondary-menu-bg",
          {
            duration: 0.3,
            top: 0,
            ease: "power3.in",
          },
          "-=0.2"
        )
        // First contact button
        .to(
          ".olm-contact-btn",
          {
            duration: 0.2,
            top: 0,
            ease: "power3.in",
          },
          "-=0.1"
        )
        // Second contact button
        .to(
          ".olm-email-btn",
          {
            duration: 0.2,
            top: 0,
            ease: "power3.in",
          },
          "+=0.02"
        )
        // Social section
        .to(
          ".olm-menu-item .olm-social-content",
          {
            duration: 0.2,
            top: 0,
            ease: "power3.in",
          },
          "+=0.02"
        )
        // Footer section
        .to(
          ".olm-menu-item .olm-footer-content",
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
      document.querySelectorAll<HTMLAnchorElement>(".olm-menu-item a");

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
      <div id="toggle-btn" className="olm-btn">
        <div className="olm-btn-outline olm-btn-outline-1"></div>
        <div className="olm-btn-outline olm-btn-outline-2"></div>
        <div id="hamburger">
          <span className="line line-1"></span>
          <span className="line line-2"></span>
        </div>
      </div>

      {/* SVG Overlay */}
      <div className="olm-overlay">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0 2S175 1 500 1s500 1 500 1V0H0Z"></path>
        </svg>
      </div>

      {/* Full Screen Menu */}
      <div className="olm-menu">
        {/* Primary navigation items */}
        <div className="olm-primary-menu">
          <div className="olm-menu-container">
            <div className="olm-wrapper">
              {/* 1 - HOME */}
              <div className="olm-menu-item olm-modern-menu-item olm-menu-item-home">
                <div className="olm-menu-line"></div>
                <a href="#hero">
                  <span className="olm-menu-number">00.</span>
                  <div className="olm-menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="olm-arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="olm-arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="olm-menu-text">HOME</span>
                </a>
                <div className="olm-menu-item-revealer"></div>
              </div>

              {/* 2 - Services */}
              <div className="olm-menu-item olm-modern-menu-item olm-menu-item-services">
                <div className="olm-menu-line"></div>
                <a href="#services">
                  <span className="olm-menu-number">01.</span>
                  <div className="olm-menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="olm-arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="olm-arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="olm-menu-text">Services</span>
                </a>
                <div className="olm-menu-item-revealer"></div>
              </div>

              {/* 3 - Projects */}
              <div className="olm-menu-item olm-modern-menu-item olm-menu-item-projects">
                <div className="olm-menu-line"></div>
                <a href="#projects">
                  <span className="olm-menu-number">02.</span>
                  <div className="olm-menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="olm-arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="olm-arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="olm-menu-text">Projects</span>
                </a>
                <div className="olm-menu-item-revealer"></div>
              </div>

              {/* 4 - About Us */}
              <div className="olm-menu-item olm-modern-menu-item olm-menu-item-about">
                <div className="olm-menu-line"></div>
                <a href="#about">
                  <span className="olm-menu-number">03.</span>
                  <div className="olm-menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="olm-arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="olm-arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="olm-menu-text">About Us</span>
                </a>
                <div className="olm-menu-item-revealer"></div>
              </div>

              {/* 5 - Contact Us */}
              <div className="olm-menu-item olm-modern-menu-item olm-menu-item-contact">
                <div className="olm-menu-line"></div>
                <a href="#contact">
                  <span className="olm-menu-number">04.</span>
                  <div className="olm-menu-arrow">
                    <svg width="40" height="25" viewBox="0 0 40 25">
                      <path
                        className="olm-arrow-line"
                        d="M2 25 L2 5 L25 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <polygon
                        className="olm-arrow-tip"
                        points="25,1 37,5 25,9"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="olm-menu-text">Contact Us</span>
                </a>
                <div className="olm-menu-item-revealer"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary menu */}
        <div className="olm-secondary-menu">
          <div className="olm-secondary-menu-bg"></div>
          <div className="olm-menu-container">
            {/* Contact Section */}
            <div className="olm-contact-section">
              <div className="olm-menu-item olm-secondary-menu-item">
                <a href="#contact" className="olm-premium-btn olm-contact-btn">
                  Contact Me
                </a>
                <div className="olm-menu-item-revealer"></div>
              </div>

              <div className="olm-menu-item olm-secondary-menu-item">
                <a
                  href="mailto:shivduttkarwa@gmail.com"
                  className="olm-premium-btn olm-email-btn"
                >
                  Send Email
                </a>
                <div className="olm-menu-item-revealer"></div>
              </div>
            </div>

            {/* Social media */}
            <div className="olm-menu-item olm-social-menu-item">
              <div className="olm-social-content">
                <div className="olm-social-grid">
                  <a href="#" className="olm-social-card olm-instagram">
                    <i className="fab fa-instagram" />
                  </a>
                  <a href="#" className="olm-social-card olm-linkedin">
                    <i className="fab fa-linkedin-in" />
                  </a>
                  <a href="#" className="olm-social-card olm-github">
                    <i className="fab fa-github" />
                  </a>
                  <a href="#" className="olm-social-card olm-twitter">
                    <i className="fab fa-twitter" />
                  </a>
                </div>
              </div>
              <div className="olm-menu-item-revealer"></div>
            </div>

            {/* Footer */}
            <div className="olm-menu-item olm-footer-menu-item">
              <div className="olm-footer-content">
                <div className="olm-footer-links">
                  <a href="#" className="olm-footer-link">
                    Privacy
                  </a>
                  <a href="#" className="olm-footer-link">
                    Terms
                  </a>
                  <a href="#" className="olm-footer-link">
                    Cookies
                  </a>
                </div>
                <div className="olm-copyright">
                  <p>© 2025 FORMA. All rights reserved.</p>
                </div>
              </div>
              <div className="olm-menu-item-revealer"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverlayMenu;
