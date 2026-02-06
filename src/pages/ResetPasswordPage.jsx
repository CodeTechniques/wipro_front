import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiFetch } from '../api/api';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect back
      toast.error('Session expired. Please start over.');
      setTimeout(() => navigate('/forgot-password'), 1500);
    }
  }, [location, navigate]);

  useEffect(() => {
    // Calculate password strength
    const strength = calculatePasswordStrength(formData.newPassword);
    setPasswordStrength(strength);
  }, [formData.newPassword]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength) => {
    if (strength < 40) return '#e74c3c';
    if (strength < 70) return '#f39c12';
    return '#27ae60';
  };

  const getStrengthText = (strength) => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      toast.error('New password is required');
      return false;
    }

    if (!formData.confirmPassword) {
      toast.error('Please confirm your password');
      return false;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (passwordStrength < 40) {
      toast.error('Please choose a stronger password');
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
    
    try {
      const response = await apiFetch('/auth/forgot-password/reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          new_password: formData.newPassword 
        }),
      });

      if (response.message) {
        toast.success('Password reset successfully!');
        // Navigate to login page
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error?.detail || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">
              Create a new password for <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter new password"
                disabled={loading}
                required
              />
              
              {formData.newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength}%`,
                        backgroundColor: getStrengthColor(passwordStrength)
                      }}
                    ></div>
                  </div>
                  <span 
                    className="strength-text"
                    style={{ color: getStrengthColor(passwordStrength) }}
                  >
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
              )}
              
              {/* <ul className="password-requirements">
                <li className={formData.newPassword.length >= 8 ? 'met' : ''}>
                  At least 8 characters long
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                  Contains uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'met' : ''}>
                  Contains lowercase letter
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'met' : ''}>
                  Contains number
                </li>
                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'met' : ''}>
                  Contains special character
                </li>
              </ul> */}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm new password"
                disabled={loading}
                required
              />
              
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="form-error">Passwords do not match</p>
              )}
              
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <p className="form-success">Passwords match ✓</p>
              )}
            </div>

            <button 
              type="submit" 
              className="form-button"
              disabled={loading || !formData.newPassword || !formData.confirmPassword}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="auth-switch">
            Remember your password? <button
              onClick={() => navigate('/login')}
              className="back-button"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7f7f7;
          z-index: 1;
          width: 100%;
          min-height: 100vh;
        }

        .auth-container {
          background: #fff;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          margin: 1rem;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-title {
          color: #333;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .auth-subtitle {
          color: #666;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 500;
          color: #555;
          font-size: 0.9rem;
        }

        .required {
          color: #e74c3c;
        }

        .form-input {
          padding: 1rem;
          border: 2px solid #e1e1e1;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e1e1e1;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .strength-text {
          font-size: 0.8rem;
          font-weight: 500;
          min-width: 60px;
        }

        .password-requirements {
          list-style: none;
          margin: 0.5rem 0 0 0;
          padding: 0;
          font-size: 0.8rem;
        }

        .password-requirements li {
          color: #999;
          margin-bottom: 0.25rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .password-requirements li:before {
          content: '✗';
          position: absolute;
          left: 0;
          color: #e74c3c;
        }

        .password-requirements li.met {
          color: #27ae60;
        }

        .password-requirements li.met:before {
          content: '✓';
          color: #27ae60;
        }

        .form-error {
          font-size: 0.8rem;
          color: #e74c3c;
          margin-top: 0.25rem;
        }

        .form-success {
          font-size: 0.8rem;
          color: #27ae60;
          margin-top: 0.25rem;
        }

        .form-button {
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 56px;
        }

        .form-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .form-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-left-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .auth-switch {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e1e1e1;
          color: #666;
        }

        .back-button {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 500;
          cursor: pointer;
          font-size: inherit;
          padding: 0;
          text-decoration: underline;
        }

        .back-button:hover {
          color: #764ba2;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .auth-container {
            padding: 2rem;
            margin: 0.5rem;
            max-width: 90%;
          }

          .auth-title {
            font-size: 1.75rem;
          }

          .password-strength {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .strength-text {
            min-width: auto;
          }
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 1.5rem;
            max-width: 95%;
          }

          .auth-title {
            font-size: 1.5rem;
          }

          .form-button {
            font-size: 1rem;
            padding: 0.875rem;
          }
        }

        @media (prefers-color-scheme: dark) {
          .auth-page {
            background: #f7f7f7;
          }

          .auth-container {
            background: #fff;
          }

          .auth-title {
            color: #000;
          }

          .auth-subtitle {
            color: #555;
          }

          .form-label {
            color: #555;
          }

          .form-input {
            background: #fff;
            border-color: #4d4d4d;
            color: #555;
          }

          .form-input:focus {
            border-color: #667eea;
          }

          .password-requirements li {
            color: #aaa;
          }

          .strength-bar {
            background: #4d4d4d;
          }
        }
      `}</style>
    </>
  );
};

export default ResetPasswordPage;