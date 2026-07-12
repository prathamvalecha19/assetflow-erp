import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/auth';
import { FiArrowRight } from 'react-icons/fi';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await register(email, name, password);
      if (res === true) {
        // Automatically log them in after registration
        await login(email, password);
        navigate('/dashboard');
      } else {
        setError(res.error || 'Registration failed.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred during authentication.');
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

          <div className="lottie-animation-wrapper fade-in-delay-1" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <DotLottieReact
              src="https://lottie.host/07d38957-a2d1-41c1-b042-55e186e853ad/mYbzSD8O6U.lottie"
              loop
              autoplay
              style={{ width: '100%', maxWidth: '650px', transform: 'scale(1.2)' }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Minimalist Form */}
      <div className="erp-login-right">
        <div className="login-form-container fade-up-form">
          <div className="mobile-logo">
            <div className="logo-box">AF</div>
          </div>

          <div className="form-head" style={{ textAlign: 'center' }}>
            <div className="fly-container">
              <DotLottieReact
                src="https://lottie.host/167b5c5f-54e9-48eb-978e-b3c49b148419/boKjddndNp.lottie"
                loop
                autoplay
                className="plane-animation"
                style={{ width: '250px', height: '250px' }}
              />
            </div>
            <h2>Create an account</h2>
            <p>Join AssetFlow and manage your resources effortlessly.</p>
          </div>

          {error && <div className="erp-error-msg">{error}</div>}

          <form onSubmit={handleSignup} className="erp-form">
            <div className="floating-input-group">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="name">Username</label>
              <div className="focus-bg"></div>
            </div>


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
              <span>{isLoading ? 'Creating account...' : 'Sign up'}</span>
              {!isLoading && <FiArrowRight className="btn-arrow" />}
              {isLoading && <div className="btn-spinner"></div>}
            </button>
          </form>

          <p className="signup-text">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;
