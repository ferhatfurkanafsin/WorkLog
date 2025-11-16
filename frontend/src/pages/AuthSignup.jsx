import { useState } from 'react';
import './AuthSignup.css';

/**
 * AuthSignup Page Component
 * Multi-auth signup with Google, Facebook, and Email
 * Includes referral system and airdrop eligibility
 *
 * Props:
 * - onSignupSuccess: Callback function after successful signup
 * - referralCode: Pre-filled referral code from URL
 */
function AuthSignup({ onSignupSuccess = () => {}, referralCode = '' }) {
  const [authMode, setAuthMode] = useState('email'); // 'email', 'google', 'facebook'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: referralCode,
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setMessage('Please agree to the terms and conditions');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referralCode: formData.referralCode,
          authProvider: 'email'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account created successfully! You are eligible for airdrop.');
        setMessageType('success');
        setTimeout(() => {
          onSignupSuccess(data);
        }, 2000);
      } else {
        setMessage(data.error || 'Signup failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    // In production, integrate with Google OAuth
    setMessage('Google Sign-In coming soon!');
    setMessageType('info');

    // Example OAuth flow:
    // const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=${window.location.origin}/auth/callback&response_type=code&scope=email profile`;
    // window.location.href = googleAuthUrl;
  };

  const handleFacebookSignup = () => {
    // In production, integrate with Facebook OAuth
    setMessage('Facebook Sign-In coming soon!');
    setMessageType('info');

    // Example OAuth flow:
    // FB.login((response) => { ... }, {scope: 'public_profile,email'});
  };

  return (
    <div className="auth-signup-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Your Account</h1>
          <p>Join us and get your airdrop tokens!</p>
        </div>

        {/* Social Auth Buttons */}
        <div className="social-auth-buttons">
          <button
            className="social-auth-btn google"
            onClick={handleGoogleSignup}
          >
            <span className="social-icon">🔵</span>
            <span>Continue with Google</span>
          </button>

          <button
            className="social-auth-btn facebook"
            onClick={handleFacebookSignup}
          >
            <span className="social-icon">📘</span>
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Email Signup Form */}
        <form onSubmit={handleEmailSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Create a password"
              className="auth-input"
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your password"
              className="auth-input"
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="referralCode">Referral Code (Optional)</label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              placeholder="Enter referral code if you have one"
              className="auth-input"
            />
            {formData.referralCode && (
              <p className="referral-bonus-info">
                🎁 You'll receive bonus tokens with this referral code!
              </p>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              <span>I agree to the <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a></span>
            </label>
          </div>

          {message && (
            <div className={`auth-message ${messageType}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>

        {/* Airdrop Info */}
        <div className="airdrop-info">
          <h3>🎉 Welcome Bonus</h3>
          <p>Sign up now and receive airdrop tokens! Plus, invite friends and earn rewards from their purchases.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthSignup;
