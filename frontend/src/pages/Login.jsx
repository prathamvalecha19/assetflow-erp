import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { FiArrowRight } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Slight artificial delay to show aesthetic loading animation
    setTimeout(() => {
      if (login(email, password)) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-login-container">
      {/* Gentle ambient background gradients */}
      <div className="min-ambient-1"></div>
      <div className="min-ambient-2"></div>

      <div className="min-login-card fade-up">
        <div className="min-login-header">
          <div className="min-logo">AF</div>
          <h2>Sign in</h2>
          <p>Continue to AssetFlow</p>
        </div>

        {error && <div className="min-error">{error}</div>}

        <form onSubmit={handleLogin} className="min-form">
          <div className="min-input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="min-focus-border"></span>
          </div>

          <div className="min-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="min-focus-border"></span>
          </div>

          <div className="min-options">
            <label className="min-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="min-forgot">Forgot?</a>
          </div>

          <button type="submit" className={`min-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            {!isLoading && <FiArrowRight className="min-btn-icon" />}
            {isLoading && <div className="min-spinner"></div>}
          </button>
        </form>

        <div className="min-footer">
          Don't have an account? <a href="#">Create one</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
