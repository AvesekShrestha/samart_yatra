import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Auth.css';

const SignupOptions = () => {
  const options = [
    {
      role: 'driver',
      title: 'Sign Up as a Driver',
      description: 'Start driving and managing routes with Smart Yatra',
      icon: '🚌',
      path: '/signup/driver',
      color: '#0E7AFE'
    },
    {
      role: 'passenger',
      title: 'Sign Up as a Passenger',
      description: 'Travel smarter with real-time tracking and easy payments',
      icon: '👤',
      path: '/signup/passenger',
      color: '#10B981'
    }
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div 
          className="signup-options"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">🚌</span>
              <span className="logo-text">SMART YATRA</span>
            </Link>
            <h2 className="auth-title">Sign Up As</h2>
            <p className="auth-subtitle">Choose your role to get started</p>
          </div>

          <div className="options-grid">
            {options.map((option, index) => (
              <motion.div
                key={option.role}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link to={option.path} className="option-card">
                  <div 
                    className="option-icon" 
                    style={{ background: `${option.color}15`, color: option.color }}
                  >
                    {option.icon}
                  </div>
                  <h3 className="option-title">{option.title}</h3>
                  <p className="option-description">{option.description}</p>
                  <div className="option-arrow" style={{ color: option.color }}>
                    →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Login</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupOptions;