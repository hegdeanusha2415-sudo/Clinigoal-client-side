// src/pages/About.js
import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="container">
          <h1>About Us</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h2>Delivering Excellence, Every Step of the Way</h2>
          <p>
            We create solutions that empower businesses and individuals to achieve their goals.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Team */}
      <section className="about-cards container">
        <div className="card">
          <h3>Our Mission</h3>
          <p>
            To provide the highest quality services with integrity, professionalism, and dedication.
          </p>
        </div>
        <div className="card">
          <h3>Our Vision</h3>
          <p>
            To be a leader in our industry, driving innovation and making a positive impact worldwide.
          </p>
        </div>
        <div className="card">
          <h3>Our Team</h3>
          <p>
            A talented group of professionals committed to excellence and client satisfaction.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <p>&copy; 2025 Your Company Name. All rights reserved.</p>
          <div className="social-links">
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
            <a href="#">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
