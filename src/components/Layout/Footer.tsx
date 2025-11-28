import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Footer.css";
import { SiteSettings } from "../../services/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  settings: SiteSettings | null;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const publicUrl = import.meta.env.BASE_URL;
  const navigate = useNavigate();
  const footerRef = useRef<HTMLElement>(null);
  const brandTextRef = useRef<HTMLHeadingElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);

  // Footer animations
  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate top section elements - only if in viewport
      const topSection = topSectionRef.current;
      if (topSection) {
        const brandBox = topSection.querySelector(".footer-brand-box");
        const linksSection = topSection.querySelector(".footer-links-section");
        const contactSection = topSection.querySelector(
          ".footer-contact-section"
        );
        const followSection = topSection.querySelector(
          ".footer-follow-us-section"
        );

        // Ensure elements are visible by default, animate only when scrolling into view
        gsap.set([brandBox, linksSection, contactSection, followSection], {
          opacity: 1,
          y: 0,
        });

        gsap.from([brandBox, linksSection, contactSection, followSection], {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: topSection,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        });

        // Animate individual links within sections
        const allLinks = topSection.querySelectorAll(
          ".footer-link, .social-link, .footer-contact-item"
        );

        gsap.set(allLinks, { opacity: 1, x: 0 });

        gsap.from(allLinks, {
          x: -20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: topSection,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }

      // Large brand text animation
      const letters = brandTextRef.current?.querySelectorAll(".footer-letter");
      if (letters && letters.length > 0) {
        const isMobile = window.innerWidth <= 768;
        
        // On mobile, use simpler animation
        if (isMobile) {
          gsap.set(letters, { yPercent: 0 });
          gsap.from(letters, {
            yPercent: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: brandTextRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        } else {
          // Desktop version with full animation
          const colors = [
            "#ff6b6b", // Coral Red (F)
            "#4ecdc4", // Turquoise (O)
            "#ffe66d", // Sunny Yellow (R)
            "#a8e6cf", // Mint Green (M)
            "#ff8b94", // Pink (A)
          ];

          // Set initial position (hidden below)
          gsap.set(letters, { yPercent: 100 });

        ScrollTrigger.create({
          trigger: brandTextRef.current,
          start: "top 90%",
          end: "bottom 10%",
          onEnter: () => {
            // Slide up animation
            gsap.to(letters, {
              yPercent: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: "back.out(2.7)",
              onComplete: () => {
                // Color flash animation after slide up completes
                letters.forEach((letter, index) => {
                  gsap.to(letter, {
                    color: colors[index],
                    duration: 0.3,
                    delay: index * 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                      gsap.set(letter, { clearProps: "color" });
                    },
                  });
                });
              },
            });
          },
          onLeave: () => {
            // Slide down animation when leaving
            gsap.to(letters, {
              yPercent: 100,
              duration: 0.4,
              stagger: 0.03,
              ease: "power2.in",
            });
          },
          onEnterBack: () => {
            // Slide up animation when coming back
            gsap.to(letters, {
              yPercent: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: "back.out(2.7)",
              onComplete: () => {
                // Color flash animation
                letters.forEach((letter, index) => {
                  gsap.to(letter, {
                    color: colors[index],
                    duration: 0.3,
                    delay: index * 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                      gsap.set(letter, { clearProps: "color" });
                    },
                  });
                });
              },
            });
          },
          onLeaveBack: () => {
            // Slide down animation when scrolling back up past footer
            gsap.to(letters, {
              yPercent: 100,
              duration: 0.4,
              stagger: 0.03,
              ease: "power2.in",
            });
          },
        });
        }
      }
    }, footerRef);

    return () => {
      ctx.revert();
    };
  }, []);
  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-top-section" ref={topSectionRef}>
          {/* Brand Box */}
          <div className="footer-brand-box" style={{ overflow: 'visible', position: 'relative', paddingTop: '80px' }}>
            <img 
              src="/images/forma_logo.png"
              alt="FORMA"
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                position: 'absolute',
                top: window.innerWidth <= 768 ? '-80px' : '-65px',
                left: window.innerWidth <= 768 ? '50%' : 'calc(50% - 50px)',
                transform: 'translateX(-50%) scale(2.4)',
                transformOrigin: 'center top',
                height: '80px',
                width: 'auto',
                zIndex: 10,
                cursor: 'pointer'
              }}
            />
            <p className="footer-brand-description">
              Creating architectural masterpieces that blend vision with
              craftsmanship, transforming dreams into extraordinary living
              spaces across Australia.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-section">
            <h3 className="footer-section-title">Explore</h3>
            <div className="footer-links">
              <Link to="/house-designs" className="footer-link">
                <span className="link-arrow">→</span>
                Portfolio
              </Link>
              <Link to="/projects" className="footer-link">
                <span className="link-arrow">→</span>
                Projects
              </Link>
              <Link to="/services" className="footer-link">
                <span className="link-arrow">→</span>
                Services
              </Link>
              <Link to="/about" className="footer-link">
                <span className="link-arrow">→</span>
                About
              </Link>
              <Link to="/contact" className="footer-link">
                <span className="link-arrow">→</span>
                Inquire
              </Link>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footer-contact-section">
            <h3 className="footer-section-title">Get in Touch</h3>
            <div className="footer-contact-info">
              <div className="contact-item">
                <div className="contact-label">Visit Us</div>
                {settings?.contact?.address ? (
                  <div
                    className="footer-contact-item"
                    dangerouslySetInnerHTML={{
                      __html: settings.contact.address.replace(/\n/g, "<br/>"),
                    }}
                  />
                ) : (
                  <div className="footer-contact-item">
                    123 Garden Street
                    <br />
                    Melbourne, VIC 3000
                  </div>
                )}
              </div>

              <div className="contact-item">
                <div className="contact-label">Call Us</div>
                <a
                  href={`tel:${settings?.contact?.phone || "+61312345678"}`}
                  className="footer-contact-item"
                >
                  {settings?.contact?.phone || "+61 3 1234 5678"}
                </a>
              </div>

              <div className="contact-item">
                <div className="contact-label">Email Us</div>
                <a
                  href={`mailto:${
                    settings?.contact?.email || "info@shambalahomes.com"
                  }`}
                  className="footer-contact-item"
                >
                  {settings?.contact?.email?.toUpperCase() ||
                    "INFO@SHAMBALAHOMES.COM"}
                </a>
              </div>
            </div>

            <div className="footer-legal">
              <Link to="/privacy-policy" className="footer-link legal-link">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="footer-link legal-link">
                Terms & Conditions
              </Link>
              <span className="footer-copyright">
                © 2025 FORMA. All rights reserved.
              </span>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="footer-follow-us-section">
            <h3 className="footer-section-title">Follow Us</h3>
            <div className="footer-follow-links">
              <a
                href={settings?.social?.instagram || "https://instagram.com"}
                className="follow-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href={settings?.social?.facebook || "https://facebook.com"}
                className="follow-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href={settings?.social?.linkedin || "https://linkedin.com"}
                className="follow-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href={settings?.social?.youtube || "https://youtube.com"}
                className="follow-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Large Brand Name at Bottom */}
        <div className="footer-brand-large">
          <h1 className="footer-brand-text" ref={brandTextRef}>
            <div className="footer-mask">
              <span className="footer-letter">F</span>
            </div>
            <div className="footer-mask">
              <span className="footer-letter">O</span>
            </div>
            <div className="footer-mask">
              <span className="footer-letter">R</span>
            </div>
            <div className="footer-mask">
              <span className="footer-letter">M</span>
            </div>
            <div className="footer-mask">
              <span className="footer-letter">A</span>
            </div>
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
