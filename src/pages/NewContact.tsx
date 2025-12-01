import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassButton from "../components/UI/GlassButton";

gsap.registerPlugin(ScrollTrigger);

const NewContact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: ""
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations - similar to blog detail page
      const heroTitle = heroRef.current?.querySelector(".nc-hero-title") as HTMLElement;
      const heroSubtitle = heroRef.current?.querySelector(".nc-hero-subtitle") as HTMLElement;
      const heroMeta = heroRef.current?.querySelector(".nc-hero-meta") as HTMLElement;

      if (heroTitle) {
        gsap.fromTo(heroTitle,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        );
      }

      if (heroSubtitle) {
        gsap.fromTo(heroSubtitle,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.3 }
        );
      }

      if (heroMeta) {
        gsap.fromTo(heroMeta,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5 }
        );
      }

      // Content sections animations
      const contentSections = containerRef.current?.querySelectorAll(".nc-content-section");
      contentSections?.forEach((section, index) => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.2,
            scrollTrigger: {
              trigger: section,
              start: "top 80%"
            }
          }
        );
      });

      // Form fields animation
      const formFields = formRef.current?.querySelectorAll(".nc-form-field");
      formFields?.forEach((field, index) => {
        gsap.fromTo(field,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 70%"
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div ref={containerRef} className="nc-container">
      <style>{`
        .nc-container {
          background: #f7f4ef;
          color: #0b0d10;
          font-family: 'nunito', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Hero Section - Blog Detail Style */
        .nc-hero {
          position: relative;
          height: 70vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .nc-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(8,10,14,0.85) 0%, rgba(8,10,14,0.75) 45%, rgba(8,10,14,0.9) 100%);
          z-index: 1;
        }

        .nc-hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          max-width: 800px;
          padding: 0 2rem;
        }

        .nc-hero-title {
          font-family: "nunito", cursive;
          font-size: clamp(3rem, 8vw, 5rem);
          line-height: 1.1;
          letter-spacing: 0.02em;
          margin: 0 0 2rem;
          color: #ffffff;
          font-weight: 300;
        }

        .nc-hero-subtitle {
          font-size: clamp(1.1rem, 3vw, 1.4rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 2rem;
        }

        .nc-hero-meta {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .nc-hero-meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Content Grid Layout - Blog Detail Style */
        .nc-content-grid {
          display: grid;
          grid-template-columns: 4fr 6fr;
          gap: 4rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }

        .nc-content-left {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .nc-content-right {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        /* Content Sections - Blog Detail Style */
        .nc-content-section {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);
        }

        .nc-section-title {
          font-family: "nunito", cursive;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          color: #0b0d10;
          margin: 0 0 1.5rem;
          font-weight: 300;
          line-height: 1.2;
        }

        .nc-section-subtitle {
          font-size: 1.1rem;
          color: #2f3545;
          margin: 0 0 2rem;
          line-height: 1.6;
        }

        /* Contact Info Cards */
        .nc-contact-grid {
          display: grid;
          gap: 2rem;
        }

        .nc-contact-card {
          padding: 2rem;
          background: rgba(102, 126, 234, 0.05);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .nc-contact-card:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-4px);
        }

        .nc-contact-card-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #0b0d10;
          margin: 0 0 1rem;
        }

        .nc-contact-card-info {
          font-size: 1rem;
          color: #2f3545;
          line-height: 1.6;
          margin: 0;
        }

        .nc-contact-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nc-contact-link:hover {
          color: #764ba2;
        }

        /* Form Styles - Blog Detail Style */
        .nc-form-grid {
          display: grid;
          gap: 1.5rem;
        }

        .nc-form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .nc-form-field {
          display: flex;
          flex-direction: column;
        }

        .nc-form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0b0d10;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nc-form-input,
        .nc-form-textarea,
        .nc-form-select {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          padding: 1rem 1.2rem;
          font-size: 1rem;
          color: #0b0d10;
          outline: none;
          transition: all 0.3s ease;
          font-family: 'nunito', sans-serif;
        }

        .nc-form-input::placeholder,
        .nc-form-textarea::placeholder {
          color: rgba(11, 13, 16, 0.4);
        }

        .nc-form-input:focus,
        .nc-form-textarea:focus,
        .nc-form-select:focus {
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .nc-form-textarea {
          resize: vertical;
          min-height: 150px;
        }

        .nc-form-submit {
          margin-top: 2rem;
          text-align: center;
        }

        /* Map Section */
        .nc-map-wrapper {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);
          height: 400px;
          position: relative;
        }

        .nc-map-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 1.1rem;
          text-align: center;
          padding: 2rem;
        }

        /* Navigation Buttons */
        .nc-nav-buttons {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 100;
          display: flex;
          gap: 1rem;
        }

        .nc-nav-button {
          background: rgba(255, 255, 255, 0.9);
          color: #0b0d10;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nc-nav-button:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .nc-nav-button.contact-us {
          background: rgba(102, 126, 234, 0.9);
          color: #ffffff;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        .nc-nav-button.contact-us:hover {
          background: rgba(102, 126, 234, 1);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .nc-content-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding: 4rem 1.5rem;
          }
          
          .nc-form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .nc-hero {
            min-height: 60vh;
          }
          
          .nc-hero-title {
            font-size: clamp(2.5rem, 10vw, 3.5rem);
          }
          
          .nc-content-section {
            padding: 2rem;
          }
          
          .nc-map-wrapper {
            height: 300px;
          }
          
          .nc-nav-buttons {
            position: static;
            margin: 2rem;
            justify-content: center;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="nc-hero" ref={heroRef}>
        <div className="nc-hero-content">
          <h1 className="nc-hero-title">Get in Touch</h1>
          <p className="nc-hero-subtitle">
            Ready to transform your architectural vision into reality? Let's start a conversation about your dream project.
          </p>
          <div className="nc-hero-meta">
            <div className="nc-hero-meta-item">
              <span>📍 Melbourne & Sydney</span>
            </div>
            <div className="nc-hero-meta-item">
              <span>📧 studio@forma.archi</span>
            </div>
            <div className="nc-hero-meta-item">
              <span>📞 Mon–Fri 9am–5pm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Button */}
      <div className="nc-nav-buttons">
        <GlassButton href="/">← Back to Home</GlassButton>
      </div>

      {/* Main Content Grid */}
      <div className="nc-content-grid">
        {/* Left Column */}
        <div className="nc-content-left">
          {/* Contact Information */}
          <div className="nc-content-section">
            <h2 className="nc-section-title">Our Studios</h2>
            <p className="nc-section-subtitle">
              Visit us in Melbourne or Sydney, or reach out anytime through our digital channels
            </p>
            
            <div className="nc-contact-grid">
              <div className="nc-contact-card">
                <h3 className="nc-contact-card-title">Melbourne Studio</h3>
                <p className="nc-contact-card-info">
                  Level 3, 150 Gertrude Street<br />
                  Fitzroy, VIC 3065<br />
                  <a href="tel:+61390000000" className="nc-contact-link">+61 (0)3 9000 0000</a>
                </p>
              </div>
              
              <div className="nc-contact-card">
                <h3 className="nc-contact-card-title">Sydney Studio</h3>
                <p className="nc-contact-card-info">
                  Suite 02, 44 Kippax Street<br />
                  Surry Hills, NSW 2010<br />
                  <a href="tel:+61290000000" className="nc-contact-link">+61 (0)2 9000 0000</a>
                </p>
              </div>
              
              <div className="nc-contact-card">
                <h3 className="nc-contact-card-title">Email</h3>
                <p className="nc-contact-card-info">
                  <a href="mailto:studio@forma.archi" className="nc-contact-link">studio@forma.archi</a><br />
                  <a href="mailto:projects@forma.archi" className="nc-contact-link">projects@forma.archi</a><br />
                  Mon–Fri · 9am–5pm AEST
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="nc-content-section">
            <h2 className="nc-section-title">Find Us</h2>
            <p className="nc-section-subtitle">
              Visit our studios in Melbourne and Sydney to discuss your project in person
            </p>
            
            <div className="nc-map-wrapper">
              <div className="nc-map-placeholder">
                <div>
                  <h3>Interactive Map</h3>
                  <p>Map integration showing both studio locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="nc-content-right">
          <div className="nc-content-section" ref={formRef}>
            <h2 className="nc-section-title">Start Your Project</h2>
            <p className="nc-section-subtitle">
              Tell us about your vision and we'll help bring it to life with our architectural expertise
            </p>
            
            <form className="nc-form-grid" onSubmit={handleSubmit}>
              <div className="nc-form-row">
                <div className="nc-form-field">
                  <label className="nc-form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="nc-form-input"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="nc-form-field">
                  <label className="nc-form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="nc-form-input"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="nc-form-row">
                <div className="nc-form-field">
                  <label className="nc-form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="nc-form-input"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="nc-form-field">
                  <label className="nc-form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="nc-form-input"
                    placeholder="+61 000 000 000"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="nc-form-row">
                <div className="nc-form-field">
                  <label className="nc-form-label">Project Type</label>
                  <select name="projectType" className="nc-form-select" value={formData.projectType} onChange={handleInputChange} required>
                    <option value="">Select a project type</option>
                    <option value="new-home">New Home</option>
                    <option value="renovation">Renovation / Extension</option>
                    <option value="commercial">Commercial</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="multi-residential">Multi-Residential</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="nc-form-field">
                  <label className="nc-form-label">Budget Range</label>
                  <select name="budget" className="nc-form-select" value={formData.budget} onChange={handleInputChange}>
                    <option value="">Select budget range</option>
                    <option value="under-300k">Under $300k</option>
                    <option value="300k-600k">$300k - $600k</option>
                    <option value="600k-1m">$600k - $1M</option>
                    <option value="1m-2m">$1M - $2M</option>
                    <option value="over-2m">Over $2M</option>
                  </select>
                </div>
              </div>
              
              <div className="nc-form-field">
                <label className="nc-form-label">Project Details</label>
                <textarea
                  name="message"
                  className="nc-form-textarea"
                  placeholder="Tell us about your project vision, timeline, and any specific requirements..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="nc-form-submit">
                <GlassButton href="#" style={{
                  background: 'rgba(128, 128, 128, 0.9)',
                  color: '#ffffff',
                  border: '1px solid rgba(128, 128, 128, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  Send Message
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContact;
