import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ClinicalResearchPage.css";

const ClinicalResearchPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  const handleEnroll = () => {
    navigate("/payment/clinical-research");
  };

  const course = {
    title: "Clinical Research Excellence Program",
    subtitle:
      "Master Clinical Trials, Regulatory Affairs, and Real-World Research Methodology",
    description:
      "Learn the science, strategy, and operations behind global clinical trials. This program empowers you to design, manage, and analyze clinical studies with full regulatory and ethical compliance.",
    duration: "6 Months",
    level: "Advanced",
    price: "₹45,999",
    originalPrice: "₹59,999",
    discount: "23% off",
    rating: "4.8",
    students: "1250+",
    features: [
      {
        icon: "🎯",
        title: "Industry-Aligned",
        description:
          "Curriculum designed with top pharmaceutical companies",
      },
      {
        icon: "👨‍🏫",
        title: "Expert Mentors",
        description: "Learn from industry leaders with 15+ years experience",
      },
      {
        icon: "💼",
        title: "Career Support",
        description: "100% placement assistance with top CROs",
      },
      {
        icon: "🌍",
        title: "Global Recognition",
        description: "Certificate recognized internationally",
      },
    ],
    stats: [
      { number: "98%", label: "Placement Rate" },
      { number: "50+", label: "Hiring Partners" },
      { number: "1200+", label: "Alumni Network" },
      { number: "₹8L", label: "Average CTC" },
    ],
    curriculum: [
      "Clinical Trial Design & Protocol Development",
      "Regulatory Affairs & Good Clinical Practice",
      "Pharmacovigilance & Drug Safety Monitoring",
      "Clinical Data Management & Biostatistics",
      "Ethical Guidelines & Patient Safety",
      "Capstone Project & Industry Internship",
    ],
    instructor: {
      name: "Dr. Priya Sharma",
      title: "Ex-Director, Apollo Hospitals | 15+ Years Experience",
      bio: "Led 120+ international clinical trials and trained 2000+ professionals in clinical research methodology.",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    },
    companies: ["Novartis", "Pfizer", "IQVIA", "Syneos Health", "Parexel", "Apollo"],
  };

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
            <div className="stat-pill">
              <span className="stat-icon">⭐</span>
              <span>{course.rating}/5 Rating</span>
            </div>
            <div className="stat-pill">
              <span className="stat-icon">👥</span>
              <span>{course.students} Enrolled</span>
            </div>
            <div className="stat-pill">
              <span className="stat-icon">📅</span>
              <span>{course.duration}</span>
            </div>
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
              <span className="btn-icon">🚀</span>
              Enroll Now & Start Learning
            </button>
            <button className="cta-button secondary">
              <span className="btn-icon">📋</span>
              Download Brochure
            </button>
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
            <div
              key={index}
              className={`feature-item animate-up delay-${index}`}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="stats-banner">
        <div className="stats-container">
          {course.stats.map((stat, index) => (
            <div
              key={index}
              className={`stat-item animate-up delay-${index}`}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="curriculum-section">
        <div className="section-header">
          <h2>What You'll Master</h2>
          <p>Comprehensive 6-month curriculum with hands-on projects</p>
        </div>
        <div className="curriculum-list">
          {course.curriculum.map((item, index) => (
            <div key={index} className="curriculum-item animate-left delay-${index}">
              <div className="item-number">0{index + 1}</div>
              <div className="item-content">
                <h3>{item}</h3>
                <div className="progress-line"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTRUCTOR SECTION */}
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

      {/* HIRING COMPANIES */}
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
            <span className="btn-icon">🎓</span>
            Enroll Now at {course.price}
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
