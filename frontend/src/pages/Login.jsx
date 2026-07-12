import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { FiMail, FiLock } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Any non-empty input works for this demo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-logo">AssetFlow</div>
        <div className="welcome-text">
          <h1>Manage your enterprise assets effectively.</h1>
          <p>Streamline asset tracking, booking, and maintenance all in one secure platform.</p>
        </div>
        <div className="illustration-wrapper">
          <div className="abstract-illustration"></div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Please enter your credentials to access your account.</p>
          
          {error && <div className="error-alert">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <FiMail className="input-icon" />
                <input 
                  type="email" 
                  placeholder="admin@assetflow.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" className="btn btn-primary login-btn">
              Login to Dashboard
            </button>
            
            <div className="signup-link">
              Don't have an account? <a href="#">Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
