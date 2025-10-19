import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ClinicalResearchPage.css";

const ClinicalResearchPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [course, setCourse] = useState(null); // 🔄 will come from API

  const API_BASE_URL = "http://localhost:5000"; // ✅ local backend

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);

    // Fetch course details from backend
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/courses/clinical-research`);
        setCourse(res.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourse();
  }, []);

  const handleEnroll = () => {
    navigate("/payment/clinical-research");
  };

  if (!course) {
    return <div className="loading">Loading course details...</div>;
  }

  return (
    <div className={`clinical-page ${isVisible ? "visible" : ""}`}>
      {/* HERO SECTION */}
      <section className="clinical-hero">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="hero-badge">🏆 Most Enrolled Program</div>
          <h1 className="hero-main-title">
            Become a Certified
            <span className="gradient-text"> Clinical Research</span>
            Professional
          </h1>
          <p className="hero-subtitle">{course.subtitle}</p>

          <div className="hero-stats">
            <div className="stat-pill">⭐ {course.rating}/5 Rating</div>
            <div className="stat-pill">👥 {course.students} Enrolled</div>
            <div className="stat-pill">📅 {course.duration}</div>
          </div>

          <div className="pricing-section">
            <div className="price-tag">
              <span className="current-price">{course.price}</span>
              <span className="original-price">{course.originalPrice}</span>
              <span className="discount-badge">{course.discount}</span>
            </div>
            <p className="price-note">No-cost EMI available • Money-back guarantee</p>
          </div>

          <div className="hero-actions">
            <button className="cta-button primary" onClick={handleEnroll}>
              🚀 Enroll Now & Start Learning
            </button>
            <button className="cta-button secondary">📋 Download Brochure</button>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why This Program Stands Out</h2>
          <p>Comprehensive training designed for real-world success</p>
        </div>
        <div className="features-grid">
          {course.features.map((feature, index) => (
            <div key={index} className={`feature-item animate-up delay-${index}`}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-banner">
        <div className="stats-container">
          {course.stats.map((stat, index) => (
            <div key={index} className="stat-item animate-up delay-${index}">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="curriculum-section">
        <div className="section-header">
          <h2>What You'll Master</h2>
          <p>Comprehensive curriculum with hands-on projects</p>
        </div>
        <div className="curriculum-list">
          {course.curriculum.map((item, index) => (
            <div key={index} className={`curriculum-item animate-left delay-${index}`}>
              <div className="item-number">0{index + 1}</div>
              <div className="item-content">
                <h3>{item}</h3>
                <div className="progress-line"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="instructor-section">
        <div className="instructor-container animate-up">
          <div className="instructor-image">
            <img src={course.instructor.image} alt={course.instructor.name} />
            <div className="experience-badge">
              <span>15+ Years</span>
            </div>
          </div>
          <div className="instructor-details">
            <h2>Learn from Industry Expert</h2>
            <h3>{course.instructor.name}</h3>
            <p className="instructor-title">{course.instructor.title}</p>
            <p className="instructor-bio">{course.instructor.bio}</p>
            <div className="instructor-highlights">
              <div className="highlight">📊 120+ Clinical Trials</div>
              <div className="highlight">👨‍🎓 2000+ Professionals Trained</div>
              <div className="highlight">🏆 Industry Award Winner</div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES */}
      <section className="companies-section">
        <h3>Our Alumni Work At</h3>
        <div className="companies-grid">
          {course.companies.map((company, index) => (
            <div key={index} className="company-logo animate-up delay-${index}">
              {company}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="cta-container animate-up">
          <h2>Start Your Clinical Research Career Today</h2>
          <p>Join thousands of successful professionals in the healthcare industry</p>
          <div className="cta-features">
            <div className="feature">✅ 6-Month Intensive Program</div>
            <div className="feature">✅ 1:1 Mentorship Sessions</div>
            <div className="feature">✅ Placement Assistance</div>
            <div className="feature">✅ Lifetime Access</div>
          </div>
          <button className="cta-button large" onClick={handleEnroll}>
            🎓 Enroll Now at {course.price}
            <span className="original-price">{course.originalPrice}</span>
          </button>
          <p className="cta-note">Limited seats available • Next batch starting soon</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="clinical-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>💙 Clinigoal Academy</h3>
            <p>Transforming healthcare education through innovative learning programs</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Programs</h4>
              <Link to="/clinical-research">Clinical Research</Link>
              <Link to="/pharmacovigilance">Pharmacovigilance</Link>
              <Link to="/medical-coding">Medical Coding</Link>
              <Link to="/bioinformatics">Bioinformatics</Link>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
            </div>
            <div className="link-group">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Clinigoal Academy. Empowering future healthcare leaders.</p>
        </div>
      </footer>
    </div>
  );
};

export default ClinicalResearchPage;
