import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(heroRef.current, {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Form animation
      gsap.fromTo(formRef.current, {
        opacity: 0,
        x: -50
      }, {
        opacity: 1,
        x: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Info animation
      gsap.fromTo(infoRef.current, {
        opacity: 0,
        x: 50
      }, {
        opacity: 1,
        x: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero" ref={heroRef}>
        <div className="contact-hero__content">
          <h1 className="contact-hero__title">Let's Create Something Amazing Together</h1>
          <p className="contact-hero__subtitle">
            Ready to transform your vision into reality? We'd love to hear about your project.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main">
        <div className="contact-main__container">
          {/* Contact Form */}
          <div className="contact-form-section" ref={formRef}>
            <div className="contact-form__header">
              <h2>Send us a Message</h2>
              <p>Tell us about your project and we'll get back to you within 24 hours.</p>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Project Type *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select project type</option>
                  <option value="Residential Design">Residential Design</option>
                  <option value="Commercial Architecture">Commercial Architecture</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Landscape Design">Landscape Design</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Project Details *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Tell us about your project, timeline, budget, and any specific requirements..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading">
                    <span className="spinner"></span>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section" ref={infoRef}>
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>We're here to help bring your vision to life. Reach out through any of these channels.</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="method-content">
                    <h4>Email</h4>
                    <a href="mailto:hello@forma.design">hello@forma.design</a>
                    <span>We respond within 24 hours</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="method-content">
                    <h4>Phone</h4>
                    <a href="tel:+15551234567">+1 (555) 123-4567</a>
                    <span>Mon-Fri, 9AM-6PM EST</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="method-content">
                    <h4>Office</h4>
                    <address>
                      123 Design Avenue<br />
                      Creative District<br />
                      New York, NY 10001
                    </address>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="method-content">
                    <h4>WhatsApp</h4>
                    <a href="https://wa.me/15551234567">+1 (555) 123-4567</a>
                    <span>Quick questions & updates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="contact-faq">
              <h3>Frequently Asked Questions</h3>
              
              <div className="faq-item">
                <h4>What's your typical project timeline?</h4>
                <p>Most residential projects take 8-12 weeks from concept to completion, while commercial projects can range from 3-6 months depending on scope.</p>
              </div>

              <div className="faq-item">
                <h4>Do you work remotely?</h4>
                <p>Yes! We work with clients worldwide. We use virtual consultations, 3D renderings, and detailed plans to ensure seamless remote collaboration.</p>
              </div>

              <div className="faq-item">
                <h4>What's included in your design packages?</h4>
                <p>Our packages include initial consultation, concept development, 3D visualizations, detailed plans, and project management support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;