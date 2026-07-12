import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { FiMail, FiLock, FiBox } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Any input works for demo.');
    }
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    // Get mouse position relative to the card center
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-10 to 10 degrees max)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      // Reset position smoothly
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    }
  };

  return (
    <div className="login-3d-container">
      {/* Immersive Animated Background Elements */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>
      <div className="particles-layer"></div>

      <div className="login-content">
        <div
          className="login-glass-card"
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="login-header">
            <div className="brand-icon-3d">
              <FiBox className="icon-pulse" />
            </div>
            <h2>AssetFlow</h2>
            <p>Welcome to the Future of ERP</p>
          </div>

          {error && <div className="error-alert-3d">{error}</div>}

          <form onSubmit={handleLogin} className="login-form-3d">
            <div className="input-group-3d">
              <FiMail className="input-icon-3d" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group-3d">
              <FiLock className="input-icon-3d" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="options-3d">
              <label className="checkbox-3d">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-link-3d">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn-3d">
              <span>Secure Login</span>
              <div className="btn-glow"></div>
            </button>
          </form>

          <div className="signup-3d">
            Don't have an account? <a href="#">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
