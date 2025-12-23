import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      title: 'Real-Time Tracking',
      description: 'Track your bus in real-time and know exactly when it will arrive',
      icon: '📍'
    },
    {
      title: 'Contactless Payment',
      description: 'Pay your fare automatically using QR codes and digital wallet',
      icon: '💳'
    },
    {
      title: 'Route Planning',
      description: 'Find the best routes and connections for your journey',
      icon: '🗺️'
    },
    {
      title: 'Smart Coordination',
      description: 'Better coordination between drivers and passengers',
      icon: '🚌'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <nav className="navbar">
          <div className="container">
            <div className="nav-content">
              <motion.div 
                className="logo"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="logo-icon">🚌</span>
                <span className="logo-text">SMART YATRA</span>
              </motion.div>
              <motion.div 
                className="nav-links"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="btn btn-primary">Get Started</Link>
              </motion.div>
            </div>
          </div>
        </nav>

        <div className="hero-content container">
          <motion.div 
            className="hero-text"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1 className="hero-title">
              Making Nepal's<br />
              <span className="gradient-text">Public Transport</span><br />
              Smarter
            </h1>
            <p className="hero-description">
              Experience seamless bus travel with real-time tracking, contactless payments, 
              and smart route planning. Smart Yatra brings coordination to Nepal's public transport.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn btn-primary btn-large">
                Start Your Journey
              </Link>
              <button className="btn btn-outline btn-large">
                Learn More
              </button>
            </div>
          </motion.div>
          <motion.div 
            className="hero-visual"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="app-preview">
                  <div className="preview-header">
                    <span className="preview-logo">SMART YATRA</span>
                    <span className="preview-balance">₹ 20</span>
                  </div>
                  <div className="preview-map"></div>
                  <div className="preview-actions">
                    <div className="preview-btn primary">Find Bus</div>
                    <div className="preview-btn secondary">My Routes</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Why Choose Smart Yatra?</h2>
            <p className="section-description">
              Modern features designed to make public transport more accessible and efficient
            </p>
          </motion.div>

          <motion.div 
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Simple steps to transform your daily commute
            </p>
          </motion.div>

          <div className="steps">
            <motion.div 
              className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up</h3>
                <p>Create your account as a passenger or driver in seconds</p>
              </div>
            </motion.div>

            <motion.div 
              className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Find Your Bus</h3>
                <p>Search for buses going to your destination and track them in real-time</p>
              </div>
            </motion.div>

            <motion.div 
              className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Scan & Travel</h3>
                <p>Scan the QR code when boarding and again when you reach your destination</p>
              </div>
            </motion.div>

            <motion.div 
              className="step"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Auto Payment</h3>
                <p>Fare is automatically calculated and deducted from your wallet</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Transform Your Commute?</h2>
            <p>Join thousands of users already enjoying smarter public transport</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">
                Sign Up Now
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Already have an account?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">🚌</span>
                <span className="logo-text">SMART YATRA</span>
              </div>
              <p>Making Nepal's Public Transport Smarter</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">How It Works</a>
                <a href="#">Pricing</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Smart Yatra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;