import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';
import './auth.css'


const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to visit before login
  const from = location.state?.from?.pathname || '/home';

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
    if (!formData.username.trim()) {
      showAlert('Username is required', 'error');
      return false;
    }
    if (!formData.password) {
      showAlert('Password is required', 'error');
      return false;
    }
    if (formData.username.length < 3) {
      showAlert('Username must be at least 3 characters', 'error');
      return false;
    }
    if (formData.password.length < 6) {
      showAlert('Password must be at least 6 characters', 'error');
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
    showAlert('Signing in...', 'info');

    try {
      const result = await login(formData);
      
      if (result.success) {
        showAlert('✅ Login successful! Redirecting...', 'success');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        showAlert(result.message || 'Login failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Network error. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
      <div className="auth-header">
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">Sign in to your account</p>
      </div>
      
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
          autoClose={alert.type !== 'error'}
          duration={3000}
        />
      )}

      <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="Enter your username"
            disabled={loading}
            required
            autoComplete="username"
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
            placeholder="Enter your password"
            disabled={loading}
            required
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className="form-button"
          disabled={loading || !formData.username || !formData.password}
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              Signing in...
            </>
          ) : (
            '🚀 Sign In'
          )}
        </button>
      </form>

      <div className="auth-switch">
        Don't have an account? <Link to="/register">Create one here</Link>
      </div>

      {/* Demo credentials for testing */}
      <div className="demo-info">
        <p><strong>Demo:</strong> Create a new account or use existing credentials</p>
      </div>
      </div>
    </div>
  );
};

export default LoginForm;