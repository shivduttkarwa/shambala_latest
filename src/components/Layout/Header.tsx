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
  const publicUrl = import.meta.env.BASE_URL || "/";
  
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
      // Timeline: curtain (1.2s) + text1 (0.8s + pause 0.5s + exit 0.8s) + text2 (0.8s + pause 0.5s + exit 0.8s) + video expand (1.5s) = ~7.9s
      gsap.to(headerRef.current, {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 8.2
      });
    } else {
      // On other pages, header is immediately visible
      gsap.set(headerRef.current, { y: 0 });
    }
  }, [location.pathname, publicUrl]);

  return (
    <div 
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: window.innerWidth <= 768 ? '0.544rem 0.4rem' : '0.8rem 1.6rem',
        background: 'transparent'
      }}>
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
        
        <img 
          src="/images/forma_logo.png"
          alt="FORMA"
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            left: window.innerWidth <= 768 ? 'calc(0.4rem - 55px)' : 'calc(1.6rem - 50px)',
            top: '50%',
            transform: window.innerWidth <= 768 ? 'translateY(-50%) scale(1.7)' : 'translateY(-50%) scale(2)',
            transformOrigin: 'left center',
            height: '80px',
            width: 'auto',
            filter: 'brightness(0) invert(1)',
            cursor: 'pointer'
          }}
        />
        
        {/* Spacer to maintain flexbox layout */}
        <div style={{ width: '160px' }}></div>
        
        <OverLayMenu />
      </div>
    </div>
  );
};

export default Header;
