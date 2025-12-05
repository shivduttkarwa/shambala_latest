import React, { FormEvent } from "react";
import "./ContactUsPage.css";

const publicUrl = import.meta.env.BASE_URL || "/";
const getImagePath = (imageName: string) =>
  publicUrl.endsWith("/")
    ? `${publicUrl}images/${imageName}`
    : `${publicUrl}/images/${imageName}`;

const ContactUsPage: React.FC = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // hook this up to your backend / email service later
    console.log("Contact form submitted");
  };

  return (
    <div className="cup-page">
      {/* HERO */}
      <section
        className="cup-hero"
        style={{
          backgroundImage: `url(${getImagePath("bg.png")})`,
        }}
      >
        <div className="cup-hero-overlay" />
        <div className="cup-hero-content">
          <p className="cup-hero-kicker">Contact</p>
          <h1 className="cup-hero-title">Get In Touch</h1>
          <p className="cup-hero-subtitle">
            Share your ideas, ask a question, or simply say hello. We&rsquo;re
            here to listen.
          </p>
        </div>
      </section>

      {/* MAIN CONTACT SECTION */}
      <section className="cup-main">
        <div className="cup-inner">
          <div className="cup-info-wrapper">
            {/* LEFT – FORM */}
            <form className="cup-form" onSubmit={handleSubmit}>
              <div className="cup-input-wrapper">
                <input
                  placeholder="Your Name"
                  className="cup-contact-header"
                  required
                  autoComplete="off"
                  type="text"
                  name="name"
                />
                <div className="cup-underline" />
              </div>

              <div className="cup-input-wrapper">
                <input
                  placeholder="Your Email"
                  className="cup-contact-header"
                  required
                  autoComplete="off"
                  type="email"
                  name="email"
                />
                <div className="cup-underline" />
              </div>

              <div className="cup-input-wrapper">
                <input
                  placeholder="Your Company"
                  className="cup-contact-header"
                  required
                  autoComplete="off"
                  type="text"
                  name="company"
                />
                <div className="cup-underline" />
              </div>

              <div className="cup-input-wrapper">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  className="cup-contact-header cup-contact-textarea"
                  required
                />
                <div className="cup-underline" />
              </div>

              {/* Animated-style submit button + line */}
              <div className="cup-button-area">
                <div className="cup-behind-line" />
                <div className="cup-button-wrapper">
                  <button
                    className="cup-submit-button"
                    type="submit"
                    tabIndex={0}
                  >
                    <div className="cup-submit-inner">
                      <p className="cup-p-button">SUBMIT</p>
                    </div>
                  </button>
                </div>
              </div>
            </form>

            {/* RIGHT – CONTACT INFO */}
            <div className="cup-info-column">
              <h3 className="cup-info-title">Contact Info</h3>
              <ul className="cup-info-list">
                <li>
                  <strong>Email:</strong> reception@serviceplusaquatics.com
                </li>
                <li>
                  <strong>Email:</strong>{" "}
                  makeaconnection@serviceplusaquatics.com
                </li>
                <li>
                  <strong>Phone:</strong> +1 (905) 569-7899
                </li>
              </ul>

              <div className="cup-arrow">
                <svg viewBox="0 0 36.41 36.41" className="cup-arrow-icon">
                  <path d="M18.21,0a18.21,18.21,0,1,0,18.2,18.21A18.22,18.22,0,0,0,18.21,0Zm0,.71A17.5,17.5,0,1,1,.71,18.21,17.53,17.53,0,0,1,18.21.71Zm0,9a.34.34,0,0,0-.36.35V25.51l-4.68-4.67a.35.35,0,0,0-.49.49L18,26.62a.33.33,0,0,0,.25.1.32.32,0,0,0,.25-.1l5.28-5.28a.33.33,0,0,0,0-.5.34.34,0,0,0-.49,0l-4.68,4.68V10a.34.34,0,0,0-.36-.35Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARALLAX-STYLE STATIC BG SECTION */}
      <section
        className="cup-parallax"
        style={{
          backgroundImage: `url(${getImagePath("pexels-heyho-7746563.jpg")})`,
        }}
      >
        <div className="cup-parallax-overlay" />
        <div className="cup-parallax-content">
          <div className="cup-parallax-top">
            <h2>Where Clear Water Meets Peace of Mind.</h2>
          </div>

          <div className="cup-parallax-bottom">
            <p>
              From residential pools to large commercial facilities, we design,
              maintain, and revive aquatic spaces so they feel effortless, safe,
              and welcoming every single day.
            </p>
            <button className="cup-parallax-cta">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="cup-map-section">
        <div className="cup-inner">
          <div className="cup-map-header">
            <h2>Find Us</h2>
            <p>
              Drop by, or schedule a visit in advance. We&rsquo;re happy to walk
              you through everything.
            </p>
          </div>

          <div className="cup-map-wrapper">
            {/* Replace src with real embed URL */}
            <iframe
              title="Location map"
              src="https://www.google.com/maps/embed?pb="
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
