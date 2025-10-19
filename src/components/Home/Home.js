import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css"; 

function HomePage() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const navigate = useNavigate();
  const searchBoxRef = useRef(null);
  const loginButtonRef = useRef(null);
  const adminDropdownRef = useRef(null);

  // --- Logic Functions ---

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearchActive(false);
    } else {
      // Simple search logic based on program titles
      const results = programs.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearchActive(true);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== "") {
      setIsSearchActive(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding search results to allow clicking on them
    setTimeout(() => {
      setIsSearchActive(false);
      setSearchResults([]);
    }, 200);
  };

  const handleCourseSelect = (program) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchActive(false);
    // Navigate to course detail page
    navigate(`/program/${program.id}`, { 
      state: { 
        program: program 
      } 
    });
  };
  
  const clearSearchAndNavigate = (path) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchActive(false);
    navigate(path);
  };

  // FIXED: Correct navigation paths
  const handleAdminLogin = () => {
    console.log("Navigating to admin login...");
    setShowAdminDropdown(false);
    navigate("/login/admin"); // ✅ Fixed path
  };

  const handleUserLogin = () => {
    console.log("Navigating to user login...");
    setShowAdminDropdown(false);
    navigate("/login/user"); // ✅ Correct path
  };

  const handleFacultyLogin = () => {
    console.log("Navigating to faculty login...");
    setShowAdminDropdown(false);
    // Since faculty login route doesn't exist, navigate to user login
    navigate("/login/user"); // ✅ Fallback path
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginButtonRef.current && !loginButtonRef.current.contains(event.target) &&
          adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Stats Animation Effect (Runs once on mount)
  useEffect(() => {
    // Page load fade-in effect (matches your CSS @keyframes pageLoad)
    setIsVisible(true); 

    const finalStats = [15600, 96, 4200, 4.8];
    const duration = 2000; // 2 seconds

    const startAnimation = (index, finalValue, intervalTime) => {
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        let currentValue = progress * finalValue;
        
        setAnimatedStats(prev => {
          const newStats = [...prev];
          // Round appropriately for each stat type
          newStats[index] = index === 3 ? parseFloat(currentValue.toFixed(1)) : Math.floor(currentValue);
          return newStats;
        });

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
            // Ensure the final value is exactly the target
            setAnimatedStats(prev => {
                const newStats = [...prev];
                newStats[index] = finalValue;
                return newStats;
            });
        }
      };
      requestAnimationFrame(step);
    };

    // Start all animations
    finalStats.forEach((value, index) => {
        // Delay the animation slightly after page load (100ms)
        setTimeout(() => startAnimation(index, value, 10), 100); 
    });

  }, []);

  // --- Data Arrays ---

  const programTabs = [
    { id: "all", name: "All Programs", icon: "🌐" },
    { id: "research", name: "Research", icon: "🔍" },
    { id: "tech", name: "Technology", icon: "💻" },
    { id: "clinical", name: "Clinical", icon: "🏥" },
    { id: "management", name: "Management", icon: "📊" },
  ];

  const programs = [
    { 
      id: 1, 
      title: "Clinical Research Excellence", 
      description: "Master clinical trials, regulatory affairs, and research methodology.", 
      category: "research", 
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      duration: "6 months",
      level: "Advanced"
    },
    { 
      id: 2, 
      title: "Bioinformatics & Genomics", 
      description: "Advanced computational biology, sequence analysis, and genomic data interpretation.", 
      category: "tech", 
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      duration: "8 months",
      level: "Intermediate"
    },
    
    { 
      id: 4, 
      title: "Medical Coding Specialist", 
      description: "Comprehensive training in medical billing, coding systems, and healthcare compliance.", 
      category: "clinical", 
      image: "https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg",
      duration: "4 months",
      level: "Beginner"
    },
    { 
      id: 5, 
      title: "Pharmacovigilance Science", 
      description: "Drug safety monitoring, adverse event reporting, and regulatory compliance.", 
      category: "research", 
      image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg",
      duration: "7 months",
      level: "Intermediate"
    },
    
  ];

  const filteredPrograms =
    activeTab === "all"
      ? programs
      : programs.filter((p) => p.category === activeTab);

  const milestones = [
    { icon: "🚀", number: `${Math.floor(animatedStats[0]).toLocaleString()}+`, text: "Careers Launched" },
    { icon: "📈", number: `${Math.floor(animatedStats[1])}%`, text: "Completion Rate" },
    { icon: "💼", number: `${Math.floor(animatedStats[2]).toLocaleString()}+`, text: "Job Placements" },
    { icon: "⭐", number: animatedStats[3].toFixed(1), text: "Average Rating" },
  ];

  const values = [
    { icon: "🎯", title: "Industry-Focused", desc: "Programs designed with real-world projects and mentorship." },
    { icon: "📚", title: "Expert Faculty", desc: "Learn from industry leaders and experienced professionals." },
    { icon: "💡", title: "Hands-on Learning", desc: "Practical assignments, labs, and case studies." },
    { icon: "🌐", title: "Global Recognition", desc: "Certificates recognized by companies worldwide." },
  ];

  const steps = [
    { icon: "1️⃣", title: "Choose Program", desc: "Select courses aligned to your career goals." },
    { icon: "2️⃣", title: "Learn & Practice", desc: "Complete interactive lessons, assignments, and labs." },
    { icon: "3️⃣", title: "Get Certified", desc: "Receive globally recognized certification." },
    { icon: "4️⃣", title: "Launch Career", desc: "Apply skills to real-world jobs and projects." },
  ];

  const testimonials = [
    { name: "Dr. Anita Sharma", role: "Clinical Researcher", text: "Clinigoal transformed my career. The courses are practical and industry-oriented.", image: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Rohit Verma", role: "Data Analyst", text: "Healthcare Data Analytics program helped me land my dream job.", image: "https://randomuser.me/api/portraits/men/52.jpg" },
    { name: "Priya Singh", role: "Project Manager", text: "The mentorship and hands-on projects are excellent.", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  ];

  const blogs = [
    { id: 1, title: "Top 5 Healthcare Trends in 2025", snippet: "Explore the emerging technologies reshaping healthcare and research.", link: "#" },
    { id: 2, title: "Career Guide for Clinical Research", snippet: "Step-by-step roadmap to excel in clinical trials and research.", link: "#" },
    { id: 3, title: "Data Analytics in Healthcare", snippet: "How analytics is transforming patient care and hospital operations.", link: "#" },
  ];

  const partners = [
    { id: 1, logo: "https://images.pexels.com/photos/11035474/pexels-photo-11035474.jpeg" },
    { id: 2, logo: "https://images.pexels.com/photos/7188826/pexels-photo-7188826.jpeg" },
    { id: 3, logo: "https://images.pexels.com/photos/5553670/pexels-photo-5553670.jpeg" },
    { id: 4, logo: "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg" },
  ];

  const faqs = [
    { q: "Are the courses self-paced?", a: "Yes, you can learn at your own pace with lifetime access." },
    { q: "Do I get a certificate?", a: "Absolutely! All completed courses come with a verified certificate." },
    { q: "Is mentorship available?", a: "Yes, industry mentors guide you throughout your learning journey." },
  ];

  return (
    <div className={`home-page ${isVisible ? "visible" : ""}`}>

      {/* Clean Professional Header */}
      <header className="clean-header">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <span className="logo-icon">🩺</span>
            <span className="logo-text">Clinigoal</span>
          </div>

          {/* Navigation */}
          <nav className="main-nav">
            <div className="nav-item">
              <a href="#" onClick={() => toggleDropdown("about")}>About</a>
              {activeDropdown === "about" && (
                <div className="dropdown">
                  
                </div>
              )}
            </div>

            <div className="nav-item">
              <a href="#" onClick={() => toggleDropdown("courses")}>Courses</a>
              {activeDropdown === "courses" && (
                <div className="dropdown">
                  {programs.slice(0, 4).map(p => (
                     <Link key={p.id} to={`/program/${p.id}`} onClick={() => setActiveDropdown(null)}>{p.title}</Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* These items are hidden by CSS but maintained in structure */}
            
            <div className="nav-item">
              <a href="#" onClick={() => toggleDropdown("resources")}>Contact</a>
              
                
            </div>
            
          </nav>

          {/* Search & Actions */}
          <div className="header-actions">
            <div 
              className={`search-box ${isSearchActive ? 'search-active' : ''}`}
              ref={searchBoxRef}
            >
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="search-input"
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((program) => (
                    <div
                      key={program.id}
                      className="search-result"
                      onClick={() => handleCourseSelect(program)}
                    >
                      <div className="search-result-title">{program.title}</div>
                      <div className="search-result-category">{program.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="auth-buttons">
              <div className="auth-trigger">
                <button 
                  ref={loginButtonRef}
                  className="login-btn" 
                  onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                >
                  Sign In
                </button>
                {showAdminDropdown && (
                  <div className="auth-dropdown" ref={adminDropdownRef}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAdminLogin();
                      }}
                    >
                      Admin Login
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUserLogin();
                      }}
                    >
                      User Login
                    </button>
                    
                  </div>
                )}
              </div>
              <button className="cta-btn">Start Learning</button>
            </div>
          </div>
        </div>
      </header>
    
      {/* Hero Section */}
      <section className="hero-pattern">
        <div className="hero-bg-slideshow">
          <div className="slide slide1"></div>
          <div className="slide slide2"></div>
          <div className="slide slide3"></div>
        </div>
        <div className="hero-pattern-content">
          <h1 className="typewriter-text">CLINIGOAL</h1>
          <p className="fade-in-text">Industry-leading programs in clinical research, health tech, and analytics, delivered by experts.</p>
          <div className="hero-buttons-pattern">
            <button className="btn-float" onClick={() => navigate('/programs')}>Explore Programs</button>
            <button className="btn-glow">Watch Overview</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-pattern">
        {milestones.map((s, i) => (
          <div key={i} className="stat-card-pattern">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <div className="stat-number">{s.number}</div>
              <div className="stat-text">{s.text}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="values-pattern">
        <h2>Why Choose Clinigoal?</h2>
        <div className="values-grid-pattern">
          {values.map((v, i) => (
            <div key={i} className="value-card-pattern">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Tabs */}
      <section className="programs-pattern">
        <h2>Explore Our Programs</h2>
        <div className="tabs-pattern">
          {programTabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn-pattern ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >{tab.icon} {tab.name}</button>
          ))}
        </div>
        <div className="grid-pattern">
          {filteredPrograms.map(p => (
            <div key={p.id} className="program-card-pattern">
              <img src={p.image} alt={p.title}/>
              <div className="program-content-pattern">
                <div className="program-meta">
                  <span className="program-duration">{p.duration}</span>
                  <span className="program-level">{p.level}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="steps-pattern">
        <h2>Your Path to Success</h2>
        <div className="steps-grid-pattern">
          {steps.map((s,i) => (
            <div key={i} className="step-card-pattern">
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-pattern">
        <h2>What Our Students Say</h2>
        <div className="testimonials-grid-pattern">
          {testimonials.map((t,i) => (
            <div key={i} className="testimonial-card-pattern">
              <img src={t.image} alt={t.name} />
              <p>"{t.text}"</p>
              <h4>{t.name}</h4>
              <span>{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Blogs */}
      <section className="blogs-pattern">
        <h2>Latest Insights & News</h2>
        <div className="blogs-grid-pattern">
          {blogs.map(b => (
            <div key={b.id} className="blog-card-pattern">
              <h3>{b.title}</h3>
              <p>{b.snippet}</p>
              
            </div>
          ))}
        </div>
      </section>
      
      {/* Partners */}
      <section className="partners-pattern">
        <h2>Trusted by Industry Leaders</h2>
        <div className="partners-grid-pattern">
          {partners.map(p => (
            <img key={p.id} src={p.logo} alt="Partner Logo" />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-pattern">
        <h2>Quick Answers</h2>
        <div className="faq-grid-pattern">
          {faqs.map((f,i) => (
            <div key={i} className="faq-card-pattern">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-pattern">
        <h2>Stay Updated</h2>
        <p>Get the latest updates on new courses, industry trends, and career opportunities.</p>
        <div className="newsletter-form-pattern">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-pattern">
        <div className="footer-container-pattern">
          {/* Logo & Description */}
          <div className="footer-column">
            <div className="footer-logo">
              <span className="logo-icon">🩺</span>
              <span className="logo-text">Clinigoal</span>
            </div>
            <p>Empowering careers in clinical research and health tech education worldwide.</p>
            <div className="footer-contact">
              <p>📧 info@clinigoal.com</p>
              <p>📞 +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/programs">All Programs</a></li>
              <li><a href="/research">Clinical Research</a></li>
              <li><a href="/bioinformatics">Bioinformatics</a></li>
              <li><a href="/medical-coding">Medical Coding</a></li>
              <li><a href="/pharmacovigilance">Pharmacovigilance</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/team">Our Team</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/refund">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-pattern">
          <div>© 2025 Clinigoal. All rights reserved.</div>
          <div className="social-icons">
            <a href="#"><i className="fab fa-linkedin"></i> LinkedIn</a>
            <a href="#"><i className="fab fa-twitter"></i> Twitter</a>
            <a href="#"><i className="fab fa-youtube"></i> YouTube</a>
            <a href="#"><i className="fab fa-instagram"></i> Instagram</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default HomePage;