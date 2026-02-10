import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiFetch } from '../api/api';

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 2 minutes timer
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect back
      toast.error('Email not found. Please try again.');
      setTimeout(() => navigate('/forgot-password'), 1500);
    }
  }, [location, navigate]);

  useEffect(() => {
    // Timer countdown
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, ''); // Only allow numbers
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (pastedData.length === 6) {
      const pastedOtp = pastedData.split('');
      setOtp(pastedOtp);
      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiFetch('/auth/forgot-password/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          otp: otpString 
        }),
      });

      if (response.message) {
        toast.success('OTP verified successfully!');
        // Navigate to reset password page
        setTimeout(() => {
          navigate('/reset-password', { 
            state: { 
              email: email.trim(),
              otp: otpString 
            } 
          });
        }, 1500);
      } else {
        toast.error(response.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error?.error || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setCanResend(false);
    setTimer(120);
    
    try {
      const response = await apiFetch('/auth/forgot-password/send-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.message) {
        toast.success(`New OTP sent to ${email}`);
      } else {
        toast.error(response.error || 'Failed to resend OTP.');
        setCanResend(true);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error?.detail || 'Network error. Please try again.');
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h2 className="auth-title">Verify OTP</h2>
            <p className="auth-subtitle">
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>
            <p className="auth-subtitle" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              OTP expires in: <span className={`timer ${timer < 30 ? 'expiring' : ''}`}>
                {formatTime(timer)}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                Enter 6-digit OTP <span className="required">*</span>
              </label>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="otp-input"
                    disabled={loading}
                    autoFocus={index === 0}
                    required
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="form-button"
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          {/* <div className="resend-section">
            <p>
              Didn't receive OTP?{' '}
              <button
                onClick={handleResendOTP}
                className="resend-button"
                disabled={!canResend || loading}
              >
                {canResend ? 'Resend OTP' : `Resend in ${formatTime(timer)}`}
              </button>
            </p>
          </div> */}

          <div className="auth-switch">
            <button
              onClick={() => navigate('/forgot-password')}
              className="back-button"
            >
              ← Use different email
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

        .timer {
          font-weight: bold;
          color: #27ae60;
        }

        .timer.expiring {
          color: #e74c3c;
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
          text-align: center;
          margin-bottom: 1rem;
        }

        .required {
          color: #e74c3c;
        }

        .otp-container {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin: 1rem 0;
        }

        .otp-input {
          width: 50px;
          height: 60px;
          border: 2px solid #e1e1e1;
          border-radius: 10px;
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          transition: all 0.3s ease;
          background: white;
        }

        .otp-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .otp-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
          opacity: 0.7;
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

        .resend-section {
          text-align: center;
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
          color: #666;
        }

        .resend-button {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .resend-button:hover:not(:disabled) {
          color: #764ba2;
        }

        .resend-button:disabled {
          color: #999;
          cursor: not-allowed;
          text-decoration: none;
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
          font-size: 0.9rem;
          padding: 0.5rem;
        }

        .back-button:hover {
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

          .otp-container {
            gap: 0.5rem;
          }

          .otp-input {
            width: 45px;
            height: 55px;
            font-size: 1.25rem;
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

          .otp-input {
            width: 40px;
            height: 50px;
            font-size: 1.125rem;
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

          .otp-input {
            background: #3d3d3d;
            border-color: #4d4d4d;
            color: #555;
          }

          .otp-input:focus {
            border-color: #667eea;
          }

          .resend-section {
            background: #3d3d3d;
            color: #ccc;
          }
        }
      `}</style>
    </>
  );
};

export default VerifyOTPPage;