import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import OverLayMenu from "./OverLayMenu";
import { SiteSettings } from "../../services/api";

interface HeaderProps {
  settings: SiteSettings | null;
}

const Header: React.FC<HeaderProps> = ({ settings }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerBgRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const publicUrl = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  const logoSrc = `${publicUrl}images/forma_logo.png`;
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      
      if (headerRef.current) {
        if (isScrollingUp && currentScrollY > 100) {
          // Show header when scrolling up
          gsap.to(headerRef.current, {
            y: 0,
            duration: 0.4,
            ease: "power3.out"
          });
          // Show background
          if (headerBgRef.current) {
            gsap.to(headerBgRef.current, {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        } else if (currentScrollY > 200) {
          // Hide header when scrolling down (after 200px)
          gsap.to(headerRef.current, {
            y: "-100%",
            duration: 0.4,
            ease: "power3.out"
          });
        }
        
        // Hide background when at top
        if (currentScrollY <= 100 && headerBgRef.current) {
          gsap.to(headerBgRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    // Only animate on homepage
    if (location.pathname === "/" || location.pathname === publicUrl) {
      // Header starts hidden above viewport, slides down after hero video expands
      // New timing: texts (simultaneous) + video expand (1.5s) = ~3.5s total
      gsap.to(headerRef.current, {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 4.0 // Slide in after video expands
      });
    } else {
      // On other pages, header is immediately visible
      gsap.set(headerRef.current, { y: 0 });
    }
  }, [location.pathname, publicUrl]);

  return (
    <header 
      ref={headerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        transform: 'translateY(-100%)',
        transition: 'none'
      }}
    >
      {/* Background that appears on scroll up */}
      <div 
        ref={headerBgRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          opacity: 0,
          zIndex: -1
        }}
      />
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        height: '84px'
      }}>
        {/* Logo - Left Side */}
        <div 
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <img 
            src={logoSrc}
            alt="FORMA"
            style={{
              height: '80px',
              width: 'auto',
              filter: 'brightness(0) invert(1)',
              transform: 'scale(2)',
              transformOrigin: 'left center'
            }}
          />
        </div>
        
        {/* Hamburger Menu - Right Side */}
        <div>
          <style>
            {`
              #toggle-btn.olm-btn {
                transform: scale(0.72) translateY(-60px) !important;
              }
            `}
          </style>
          <OverLayMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
