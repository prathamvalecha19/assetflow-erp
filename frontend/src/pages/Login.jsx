import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { FiArrowRight, FiShield, FiCpu, FiTrendingUp } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="erp-login-wrapper">

      {/* LEFT PANEL - Premium Visual Section */}
      <div className="erp-login-left">
        <div className="erp-grid-bg"></div>
        <div className="erp-glow"></div>

        <div className="left-content-wrapper">
          <div className="erp-brand-logo">
            <div className="logo-box">AF</div>
            <span>AssetFlow</span>
          </div>

          <div className="left-hero-text">
            <h1>Enterprise Asset Management. <br /> <span>Reimagined.</span></h1>
            <p>A unified platform to track, allocate, and maintain your resources with complete transparency.</p>
          </div>

          <div className="feature-list">
            <div className="feature-item fade-in-delay-1">
              <div className="feat-icon"><FiCpu /></div>
              <div>
                <h3>Smart Tracking</h3>
                <p>Real-time visibility across all locations.</p>
              </div>
            </div>
            <div className="feature-item fade-in-delay-2">
              <div className="feat-icon"><FiShield /></div>
              <div>
                <h3>Secure Booking</h3>
                <p>Role-based authentication & auditing.</p>
              </div>
            </div>
            <div className="feature-item fade-in-delay-3">
              <div className="feat-icon"><FiTrendingUp /></div>
              <div>
                <h3>Predictive Maintenance</h3>
                <p>Reduce downtime with proactive alerts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Minimalist Form */}
      <div className="erp-login-right">
        <div className="login-form-container fade-up-form">
          <div className="mobile-logo">
            <div className="logo-box">AF</div>
          </div>

          <div className="form-head">
            <h2>Welcome back</h2>
            <p>Please enter your credentials to access your dashboard.</p>
          </div>

          {error && <div className="erp-error-msg">{error}</div>}

          <form onSubmit={handleLogin} className="erp-form">

            <div className="floating-input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="email">Email address</label>
              <div className="focus-bg"></div>
            </div>

            <div className="floating-input-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="password">Password</label>
              <div className="focus-bg"></div>
            </div>

            <div className="form-actions">
              <label className="checkbox-wrap">
                <input type="checkbox" />
                <span className="chk-box"></span>
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className={`erp-submit-btn ${isLoading ? 'btn-loading' : ''}`} disabled={isLoading}>
              <span>{isLoading ? 'Authenticating...' : 'Sign in'}</span>
              {!isLoading && <FiArrowRight className="btn-arrow" />}
              {isLoading && <div className="btn-spinner"></div>}
            </button>
          </form>

          <p className="signup-text">
            Don't have an account? <a href="#">Request access</a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
