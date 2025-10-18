// src/pages/Contact.js
import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent successfully.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* ---------- Header ---------- */}
      <header className="contact-header">
        <div className="container">
          <h1>Contact Us</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/courses">Courses</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* ---------- Contact Info Section ---------- */}
      <section className="contact-info container">
        <h2>Reach Out to Us</h2>
        <p>
          Whether you have a question about our courses, need technical support,
          or want to collaborate, our team is here to help you. Get in touch
          using any of the options below.
        </p>

        <div className="info-cards">
          <div className="info-card">
            <h3>Head Office</h3>
            <p>Clinigoal Learning Pvt. Ltd.</p>
            <p>123 Blue Street, Cityville, Karnataka, India - 560001</p>
          </div>

          <div className="info-card">
            <h3>Phone</h3>
            <p>📞 +91 98765 43210</p>
            <p>📞 +91 91234 56789</p>
          </div>

          <div className="info-card">
            <h3>Email</h3>
            <p>📧 support@clinigoal.com</p>
            <p>📧 admissions@clinigoal.com</p>
          </div>

          <div className="info-card">
            <h3>Working Hours</h3>
            <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
            <p>Saturday: 10:00 AM – 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </section>

      {/* ---------- Department Contact Section ---------- */}
      <section className="departments container">
        <h2>Department Contacts</h2>
        <div className="departments-grid">
          <div className="dept-card">
            <h3>Admissions Department</h3>
            <p>
              For course enrollments, eligibility, or academic queries, contact
              our admissions team.
            </p>
            <p>Email: admissions@clinigoal.com</p>
          </div>

          <div className="dept-card">
            <h3>Technical Support</h3>
            <p>
              Facing issues accessing your course or profile? Our support team
              is available 24/7.
            </p>
            <p>Email: support@clinigoal.com</p>
          </div>

          <div className="dept-card">
            <h3>Corporate Partnerships</h3>
            <p>
              For collaborations, internships, and institutional tie-ups,
              contact our corporate relations team.
            </p>
            <p>Email: partnerships@clinigoal.com</p>
          </div>
        </div>
      </section>

      {/* ---------- Contact Form Section ---------- */}
      <section className="contact-section container">
        <h2>Send Us a Message</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* ---------- Map Section ---------- */}
      <section className="map-section container">
        <h2>Our Location</h2>
        <div className="map-container">
          <iframe
            title="Clinigoal Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.553888922066!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z12.9716!4d77.5946"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* ---------- FAQ Section ---------- */}
      <section className="faq-section container">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h4>How do I enroll in a course?</h4>
            <p>
              You can enroll directly through our website by visiting the
              Courses page and selecting the course you’re interested in.
            </p>
          </div>
          <div className="faq-item">
            <h4>Can I get a certificate after completing a course?</h4>
            <p>
              Yes, once you complete a course and pass the final assessment,
              you’ll receive a verified certificate of completion.
            </p>
          </div>
          <div className="faq-item">
            <h4>Do you offer group or institutional discounts?</h4>
            <p>
              Yes, we offer special pricing for teams and educational
              institutions. Contact our partnerships team for more info.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="contact-footer">
        <div className="container footer-flex">
          <div className="footer-left">
            <h3>Clinigoal</h3>
            <p>
              Empowering healthcare professionals through innovative online
              learning. Our goal is to make quality education accessible to
              everyone, everywhere.
            </p>
          </div>

          <div className="footer-center">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-right">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Clinigoal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
