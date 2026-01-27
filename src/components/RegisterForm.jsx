import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';
import './auth.css'
import { useEffect } from "react";


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (ref) {
    // store referral code temporarily
    localStorage.setItem("referral_code", ref);
  }
}, []);


  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
  };

  const hideAlert = () => {
    setAlert({ show: false, message: '', type: 'info' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Hide alert when user starts typing
    if (alert.show) {
      hideAlert();
    }
  };

  const validateForm = () => {
    // Username validation
    if (!formData.username.trim()) {
      showAlert('Username is required', 'error');
      return false;
    }
    if (formData.username.length < 3) {
      showAlert('Username must be at least 3 characters long', 'error');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      showAlert('Username can only contain letters, numbers, and underscores', 'error');
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      showAlert('Email is required', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('Please enter a valid email address', 'error');
      return false;
    }

    // Password validation
    if (!formData.password) {
      showAlert('Password is required', 'error');
      return false;
    }
    if (formData.password.length < 8) {
      showAlert('Password must be at least 8 characters long', 'error');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      showAlert('Password must contain at least one uppercase letter, one lowercase letter, and one number', 'error');
      return false;
    }

    // Password confirmation
    if (!formData.password_confirm) {
      showAlert('Please confirm your password', 'error');
      return false;
    }
    if (formData.password !== formData.password_confirm) {
      showAlert("Passwords don't match", 'error');
      return false;
    }

    // Name validation (optional but if provided, should be valid)
    if (formData.first_name && formData.first_name.length < 2) {
      showAlert('First name must be at least 2 characters long', 'error');
      return false;
    }
    if (formData.last_name && formData.last_name.length < 2) {
      showAlert('Last name must be at least 2 characters long', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    showAlert('Creating your account...', 'info');

    try {
      const result = await register(formData);
      
      if (result.success) {
        showAlert('✅ Account created successfully! Redirecting to dashboard...', 'success');
        setTimeout(() => {
          navigate('/profile-kyc');
        }, 2000);
      } else {
        showAlert(result.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showAlert('Network error. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: 'Enter password', color: '#ccc' };

    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ];

    strength = checks.filter(check => check).length;

    if (strength <= 2) return { strength: strength * 20, text: 'Weak', color: '#e74c3c' };
    if (strength <= 3) return { strength: strength * 20, text: 'Fair', color: '#f39c12' };
    if (strength <= 4) return { strength: strength * 20, text: 'Good', color: '#f1c40f' };
    return { strength: 100, text: 'Strong', color: '#27ae60' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-container register-container">
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us and get started today</p>
      </div>
      
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
          autoClose={alert.type !== 'error'}
          duration={4000}
        />
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-input"
              placeholder="John"
              disabled={loading}
              autoComplete="given-name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="form-input"
              placeholder="Doe"
              disabled={loading}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username <span className="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            placeholder="johndoe123"
            disabled={loading}
            required
            autoComplete="username"
          />
          <small className="form-help">Letters, numbers, and underscores only. Min 3 characters.</small>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="john@example.com"
            disabled={loading}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Create a strong password"
            disabled={loading}
            required
            autoComplete="new-password"
          />
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${passwordStrength.strength}%`, 
                    backgroundColor: passwordStrength.color 
                  }}
                ></div>
              </div>
              <span className="strength-text" style={{ color: passwordStrength.color }}>
                {passwordStrength.text}
              </span>
            </div>
          )}
          <small className="form-help">Min 8 characters with uppercase, lowercase, and numbers.</small>
        </div>

        <div className="form-group">
          <label htmlFor="password_confirm" className="form-label">
            Confirm Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password_confirm"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            className={`form-input ${
              formData.password_confirm && formData.password !== formData.password_confirm 
                ? 'form-input-error' 
                : formData.password_confirm && formData.password === formData.password_confirm 
                  ? 'form-input-success' 
                  : ''
            }`}
            placeholder="Confirm your password"
            disabled={loading}
            required
            autoComplete="new-password"
          />
          {formData.password_confirm && formData.password !== formData.password_confirm && (
            <small className="form-error">Passwords don't match</small>
          )}
          {formData.password_confirm && formData.password === formData.password_confirm && (
            <small className="form-success">✓ Passwords match</small>
          )}
        </div>

        <button 
          type="submit" 
          className="form-button"
          disabled={loading || !formData.username || !formData.email || !formData.password || !formData.password_confirm}
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              Creating Account...
            </>
          ) : (
            '🎉 Create Account'
          )}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? <Link to="/login">Sign in here</Link>
      </div>

      <div className="registration-info">
      
      </div>
    </div>
  );
};

export default RegisterForm;