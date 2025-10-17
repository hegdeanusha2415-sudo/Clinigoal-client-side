// src/pages/Contact.js
import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <header className="contact-header">
        <div className="container">
          <h1>Contact Us</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Contact Info Section */}
      <section className="contact-info container">
        <h2>Reach Out to Us</h2>
        <p>If you have any questions or inquiries, we’re here to help! Here’s how you can contact us:</p>

        <div className="info-cards">
          <div className="info-card">
            <h3>Address</h3>
            <p>123 Blue Street, Cityville, Country</p>
          </div>
          <div className="info-card">
            <h3>Phone</h3>
            <p>+91 123 456 7890</p>
          </div>
          <div className="info-card">
            <h3>Email</h3>
            <p>info@yourcompany.com</p>
          </div>
          <div className="info-card">
            <h3>Working Hours</h3>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
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

      {/* Footer */}
      <footer className="contact-footer">
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

export default Contact;
