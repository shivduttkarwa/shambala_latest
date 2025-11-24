import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProjectDetails.css";
import GlassButton from "../UI/GlassButton";
import FullWidthImage from "../Reusable/FullWidthImage";
import HeroTextAnimation from "../UI/HeroTextAnimation";

gsap.registerPlugin(ScrollTrigger);

const publicUrl = import.meta.env.BASE_URL;

interface ServiceDetailsProps {
  service?: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    features: Array<{
      title: string;
      description: string;
      image: string;
    }>;
    process: Array<{
      step: number;
      title: string;
      description: string;
      image: string;
    }>;
    testimonial?: {
      quote: string;
      author: string;
      project: string;
    };
    gallery: string[];
    ctaTitle: string;
    ctaDescription: string;
  };
}

const defaultService = {
  id: "new-home-construction",
  title: "New Home Construction",
  subtitle: "Building Dreams from Foundation to Finish",
  description:
    "Transform your vision into reality with our comprehensive new home construction projects. From initial design consultation to final walkthrough, we craft bespoke homes that reflect your lifestyle, values, and aspirations.",
  heroImage: `${publicUrl}images/l1.jpg`,
  features: [
    {
      title: "Custom Design Process",
      description:
        "Work with our expert architects and designers to create a home that's uniquely yours. Every detail is carefully planned to optimize space, light, and functionality.",
      image: `${publicUrl}images/sm1.jpg`,
    },
    {
      title: "Premium Materials",
      description:
        "We source only the finest materials and finishes, ensuring your home not only looks beautiful but stands the test of time with minimal maintenance.",
      image: `${publicUrl}images/sm2.jpg`,
    },
    {
      title: "Smart Home Integration",
      description:
        "Future-proof your home with cutting-edge smart technology seamlessly integrated into the design for comfort, security, and energy efficiency.",
      image: `${publicUrl}images/sm3.jpg`,
    },
  ],
  process: [
    {
      step: 1,
      title: "Design & Planning",
      description:
        "Collaborative design sessions to understand your needs, site analysis, and detailed architectural planning with 3D visualizations.",
      image: `${publicUrl}images/sm4.jpg`,
    },
    {
      step: 2,
      title: "Foundation & Structure",
      description:
        "Precision excavation, foundation work, and structural framing using premium materials and advanced construction techniques.",
      image: `${publicUrl}images/sm5.jpg`,
    },
    {
      step: 3,
      title: "Finishing & Details",
      description:
        "Interior and exterior finishing work, including custom millwork, premium fixtures, and final styling touches.",
      image: `${publicUrl}images/sm1.jpg`,
    },
  ],
  testimonial: {
    quote:
      "Working with Shambala Homes was an extraordinary experience. They didn't just build our house; they created our dream home with attention to every detail we could have imagined.",
    author: "Sarah & Michael Thompson",
    project: "Custom Family Home, Toorak",
  },
  gallery: [
    `${publicUrl}images/l2.jpg`,
    `${publicUrl}images/l3.jpg`,
    `${publicUrl}images/l4.jpg`,
    `${publicUrl}images/l5.jpg`,
  ],
  ctaTitle: "Ready to Build Your Dream Home?",
  ctaDescription:
    "Let's discuss your vision and create something extraordinary together. Our team is ready to guide you through every step of the process.",
};

const ProjectDetails: React.FC<ServiceDetailsProps> = ({
  service = defaultService,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger animate feature cards
      gsap.from(".pr-project-detail-feature", {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".pr-project-detail-features",
          start: "top 70%",
        },
      });

      // Process steps animation
      gsap.from(".pr-project-detail-process-step", {
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".pr-project-detail-process",
          start: "top 70%",
        },
      });

      // Gallery images parallax
      gsap.utils
        .toArray<Element>(".pr-project-detail-gallery-image")
        .forEach((img, index) => {
          gsap.to(img, {
            yPercent: -20 * (index % 2 === 0 ? 1 : -1),
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pr-project-detail-container" ref={containerRef}>
      {/* Hero Section */}
      <section className="pr-project-detail-hero">
        <FullWidthImage imageUrl={service.heroImage}>
          <div className="pr-project-detail-hero-content">
            <HeroTextAnimation
              title={service.title}
              subtitle={service.subtitle}
              className="pr-project-detail-hero-animation"
            />
            <Link to="/projects" className="pr-project-detail-hero-btn">
              ← Back to All Projects
            </Link>
          </div>
        </FullWidthImage>
      </section>

      {/* Introduction */}
      <section className="pr-project-detail-intro">
        <div className="pr-project-detail-intro-container">
          <h2 className="pr-project-detail-intro-title">
            Excellence in Every Detail
          </h2>
          <p className="pr-project-detail-intro-description">
            {service.description}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="pr-project-detail-features">
        <div className="pr-project-detail-features-container">
          <h2 className="pr-project-detail-section-title">
            What Sets Us Apart
          </h2>
          <div className="pr-project-detail-features-grid">
            {service.features.map((feature, index) => (
              <div key={index} className="pr-project-detail-feature">
                <div className="pr-project-detail-feature-image">
                  <img src={feature.image} alt={feature.title} />
                </div>
                <div className="pr-project-detail-feature-content">
                  <h3 className="pr-project-detail-feature-title">
                    {feature.title}
                  </h3>
                  <p className="pr-project-detail-feature-description">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="pr-project-detail-process">
        <div className="pr-project-detail-process-container">
          <h2 className="pr-project-detail-section-title">
            Our Proven Process
          </h2>
          <div className="pr-project-detail-process-steps">
            {service.process.map((step, index) => (
              <div key={index} className="pr-project-detail-process-step">
                <div className="pr-project-detail-process-step-number">
                  {step.step}
                </div>
                <div className="pr-project-detail-process-step-image">
                  <img src={step.image} alt={step.title} />
                </div>
                <div className="pr-project-detail-process-step-content">
                  <h3 className="pr-project-detail-process-step-title">
                    {step.title}
                  </h3>
                  <p className="pr-project-detail-process-step-description">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {service.testimonial && (
        <section className="pr-project-detail-testimonial">
          <div className="pr-project-detail-testimonial-container">
            <blockquote className="pr-project-detail-testimonial-quote">
              "{service.testimonial.quote}"
            </blockquote>
            <cite className="pr-project-detail-testimonial-author">
              <strong>{service.testimonial.author}</strong>
              <span>{service.testimonial.project}</span>
            </cite>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="pr-project-detail-gallery">
        <div className="pr-project-detail-gallery-container">
          <h2 className="pr-project-detail-section-title">Recent Projects</h2>
          <div className="pr-project-detail-gallery-grid">
            {service.gallery.map((image, index) => (
              <div key={index} className="pr-project-detail-gallery-item">
                <img
                  src={image}
                  alt={`Project ${index + 1}`}
                  className="pr-project-detail-gallery-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pr-project-detail-cta">
        <div className="pr-project-detail-cta-container">
          <div className="pr-project-detail-cta-content">
            <h2 className="pr-project-detail-cta-title">{service.ctaTitle}</h2>
            <p className="pr-project-detail-cta-description">
              {service.ctaDescription}
            </p>
            <div className="pr-project-detail-cta-buttons">
              <GlassButton href="/#contact">Get Started</GlassButton>
              <GlassButton href="tel:+61400000000">Call Us Now</GlassButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
