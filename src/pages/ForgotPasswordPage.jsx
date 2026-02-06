import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiFetch } from '../api/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiFetch('/auth/forgot-password/send-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.message) {
        toast.success(`OTP sent successfully to ${email}`);
        // Navigate to verify OTP page with email
        setTimeout(() => {
          navigate('/varify-otp', { state: { email: email.trim() } });
        }, 1500);
      } else {
        toast.error(response.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
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
            <h2 className="auth-title">Forgot Password</h2>
            <p className="auth-subtitle">
              Enter your email address to receive a password reset OTP
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your registered email"
                disabled={loading}
                required
              />
              <p className="form-help">
                We'll send a 6-digit OTP to this email
              </p>
            </div>

            <button 
              type="submit" 
              className="form-button"
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>

          <div className="auth-switch">
            Remember your password? <Link to="/login">Sign In</Link>
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
          color: #000;
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
          background: #fff;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .form-help {
          font-size: 0.8rem;
          color: #666;
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

        .auth-switch a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-switch a:hover {
          text-decoration: underline;
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
        }
      `}</style>
    </>
  );
};

export default ForgotPasswordPage;