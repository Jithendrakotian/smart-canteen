import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer/Footer";
import "./Landing.css";

function Landing() {
  const { currentUser, userProfile } = useAuth();
  const dashLink = userProfile?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  const features = [
    { icon: "🛒", title: "Easy Ordering", desc: "Browse menu and add items to cart in seconds" },
    { icon: "⏰", title: "Skip the Queue", desc: "Pre-order and pick up without waiting" },
    { icon: "💳", title: "Secure Payment", desc: "Multiple payment options with simulation" },
    { icon: "📦", title: "Track Orders", desc: "Real-time status updates for your order" },
    { icon: "🤖", title: "AI Suggestions", desc: "Smart food recommendations based on your history" },
    { icon: "📊", title: "Budget Tracker", desc: "Track your canteen spending monthly" },
  ];

  const testimonials = [
    { name: "Riya Sharma", dept: "CSE 3rd Year", text: "No more standing in long queues! SmartCanteen is a game changer.", avatar: "R" },
    { name: "Arjun Mehta", dept: "ECE 2nd Year", text: "I love how I can pre-order during my break and just pick up. Super fast!", avatar: "A" },
    { name: "Priya Nair", dept: "MBA 1st Year", text: "The budget tracker helped me manage my monthly canteen expenses.", avatar: "P" },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🎓 Made for College Students</div>
          <h1 className="hero-title">
            Pre-Order Food.<br />
            <span className="hero-accent">Skip the Queue.</span>
          </h1>
          <p className="hero-subtitle">
            Order from your college canteen in advance. Get your meal hot and fresh
            without wasting time in lines.
          </p>
          <div className="hero-actions">
            {currentUser ? (
              <Link to={dashLink} className="btn-hero-primary">
                Go to Dashboard <i className="fas fa-arrow-right"></i>
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-hero-primary">
                  Get Started Free <i className="fas fa-arrow-right"></i>
                </Link>
                <Link to="/login" className="btn-hero-secondary">
                  Login
                </Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">30+</span>
              <span className="stat-label">Menu Items</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">5 min</span>
              <span className="stat-label">Avg. Wait</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-phone-mockup">
            <div className="phone-screen">
              <div className="phone-header">
                <span>🍽️ Smart Canteen</span>
              </div>
              <div className="phone-menu">
                {["🍛 Veg Thali - ₹60", "🍔 Burger - ₹45", "☕ Coffee - ₹20", "🥗 Salad - ₹35"].map((item, i) => (
                  <div key={i} className="phone-menu-item">{item}</div>
                ))}
              </div>
              <div className="phone-cart-btn">View Cart 🛒</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-heading">Why SmartCanteen?</h2>
          <p className="section-subheading">Everything you need to simplify your canteen experience</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-heading">How It Works</h2>
          <div className="steps-container">
            {[
              { step: "1", icon: "🔐", title: "Sign Up", desc: "Create your student account in under a minute" },
              { step: "2", icon: "🍱", title: "Browse Menu", desc: "Explore today's canteen menu and add items" },
              { step: "3", icon: "💳", title: "Pay & Order", desc: "Make secure payment and confirm your order" },
              { step: "4", icon: "🏃", title: "Pick Up", desc: "Your food is ready! Just walk in and collect" },
            ].map((s, i) => (
              <div key={i} className="step-item">
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h5 className="step-title">{s.title}</h5>
                <p className="step-desc">{s.desc}</p>
                {i < 3 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-heading">What Students Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-dept">{t.dept}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to order smarter?</h2>
          <p className="cta-subtitle">Join hundreds of students already using SmartCanteen</p>
          {!currentUser && (
            <Link to="/signup" className="btn-cta">
              Start Free Today <i className="fas fa-rocket"></i>
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
