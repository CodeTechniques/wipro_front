import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../styles/navbar.css";
import logo from "../assets/wipo-logo.webp";
import { apiFetch } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [duePayments, setDuePayments] = useState([]);
  const [showDuePopup, setShowDuePopup] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");
  const { currency, toggleCurrency } = useCurrency();

  useEffect(() => {
    if (isLoggedIn) {
      apiFetch("/auth/profile-details/")
        .then(setProfile)
        .catch(() => {});
    }
  }, [isLoggedIn]);

  // Check for due payments if user is authenticated
  useEffect(() => {
    if (isLoggedIn) {
      checkDuePayments();
    }
  }, [isLoggedIn]);

  const checkDuePayments = async () => {
    try {
      const res = await apiFetch("/my-due-payments/");

      if (res.has_due) {
        setDuePayments(res.dues);
        setShowDuePopup(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`
    : "JD";

  const logout = async () => {
    try {
      await apiFetch("/auth/logout/", {
        method: "POST",
        body: JSON.stringify({
          refresh: localStorage.getItem("refresh_token"),
        }),
      });
    } catch (e) {
      // even if token expired, continue logout
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const handlePayNow = async (userCommitteeId) => {
    setProcessingPayment(true);
    
    try {
      // First attempt to pay using wallet
      const response = await apiFetch(`/pay-due/${userCommitteeId}/`, {
        method: "POST",
      });

      // If successful, close popup and show success message
      setShowDuePopup(false);
      alert("Payment successful! Your dues have been cleared.");
      
    } catch (error) {
      console.log("Payment error:", error);
      
      // Check if error is due to insufficient balance
      if (error.error === "Insufficient wallet balance" || 
          error?.detail === "Insufficient wallet balance" ||
          error?.message === "Insufficient wallet balance") {
        
        // Close the due popup
        setShowDuePopup(false);
        
        // Navigate to payment page with due payment info
        navigate("/pay", { 
          state: { 
            duePayment: duePayments.find(d => d.user_committee_id === userCommitteeId),
            fromDuePopup: true
          } 
        });
      } else {
        // Handle other errors
        alert(error.error || error.detail || "Payment failed. Please try again.");
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar-pill">

          {/* LEFT */}
          <div className="navbar-left">
            <img src={logo} alt="WIPO Group" className="navbar-logo" />
          </div>

          {/* CENTER */}
          <ul className="navbar-links desktop-only">
            <li><NavLink to="/home">Home</NavLink></li>
            <li><NavLink to="/aboutUs">About</NavLink></li>
            <li><NavLink to="/">Properties</NavLink></li>
            <li><NavLink to="/committees">Committees</NavLink></li>
            <li><NavLink to="/investment">Gold&Bond</NavLink></li>
            <li><NavLink to="/referral">Refer & Earn</NavLink></li>
            <li><NavLink to="/contactUs">Contact</NavLink></li>
          </ul>

          {/* RIGHT */}
          <div className="navbar-right" ref={dropdownRef}>
            <button onClick={toggleCurrency} className="currency-btn">
              {currency === "INR" ? "₹" : "$"}
            </button>

            {isLoggedIn ? (
              <>
                {/* AVATAR + DROPDOWN */}
                <div
                  className="navbar-user"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="user-avatar">
                    {profile?.profile_pic ? (
                      <img src={profile.profile_pic} alt="Profile" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  <i
                    className={`bi bi-chevron-down dropdown-arrow ${
                      dropdownOpen ? "open" : ""
                    }`}
                  ></i>
                </div>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <NavLink to="/profile" onClick={() => setDropdownOpen(false)}>
                      <i className="bi bi-person"></i> Profile
                    </NavLink>

                    <NavLink to="/wallet" onClick={() => setDropdownOpen(false)}>
                      <i className="bi bi-wallet2"></i> Wallet
                    </NavLink>

                    <NavLink to="/profile-kyc" onClick={() => setDropdownOpen(false)}>
                      <i className="bi bi-shield-check"></i> KYC Verification
                    </NavLink>

                    <button className="logout-btn" onClick={logout}>
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* AUTH BUTTONS */
              <div className="auth-actions">
                <NavLink to="/login" className="login-link">
                  Log in
                </NavLink>

                <NavLink to="/register" className="get-started-btn">
                  Get Started
                </NavLink>
              </div>
            )}

            {/* MOBILE */}
            <button
              className={`hamburger mobile-only ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <NavLink onClick={() => setMenuOpen(false)} to="/home">Home</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/aboutUs">About</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/properties">Properties</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/committees">Committees</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/investment">Gold&Bond</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/wallet">Wallet</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/referral">Refer & Earn</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/contactUs">Contact</NavLink>
      </div>

      {/* DUE PAYMENTS POPUP */}
      {showDuePopup && (
        <div className="due-popup-overlay">
          <div className="due-popup">
            <div className="due-popup-header">
              <h3>
                <i className="bi bi-exclamation-triangle-fill"></i> 
                Payment Due
              </h3>
              <button 
                className="due-popup-close" 
                onClick={() => setShowDuePopup(false)}
                disabled={processingPayment}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="due-popup-content">
              <p className="due-popup-message">
                You have {duePayments.length} pending payment{duePayments.length > 1 ? 's' : ''}
              </p>

              {duePayments.map((d, index) => (
                <div key={d.user_committee_id || index} className="due-item">
                  <div className="due-item-details">
                    <h4>{d.committee_name}</h4>
                    <div className="due-item-row">
                      <span>Amount:</span>
                      <strong>₹{d.amount}</strong>
                    </div>
                    <div className="due-item-row">
                      <span>Type:</span>
                      <span className="due-plan-type">{d.plan_type}</span>
                    </div>
                  </div>
                  
                  <button
                    className="due-pay-btn"
                    onClick={() => handlePayNow(d.user_committee_id)}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <i className="bi bi-hourglass-split"></i> Processing...
                      </>
                    ) : (
                      <>
                        Pay Now <i className="bi bi-arrow-right"></i>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="due-popup-footer">
              <button 
                className="due-later-btn" 
                onClick={() => setShowDuePopup(false)}
                disabled={processingPayment}
              >
                Remind Me Later
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .due-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .due-popup {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 450px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .due-popup-header {
          padding: 20px 24px;
          background: #fee2e2;
          border-bottom: 1px solid #fecaca;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .due-popup-header h3 {
          margin: 0;
          color: #991b1b;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .due-popup-header h3 i {
          color: #dc2626;
          font-size: 24px;
        }

        .due-popup-close {
          background: transparent;
          border: none;
          color: #991b1b;
          font-size: 20px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .due-popup-close:hover:not(:disabled) {
          background: rgba(153, 27, 27, 0.1);
          transform: scale(1.1);
        }

        .due-popup-close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .due-popup-content {
          padding: 20px 24px;
        }

        .due-popup-message {
          color: #374151;
          margin-bottom: 16px;
          font-size: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .due-item {
          background: #f9fafb;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .due-item:hover {
          border-color: #dc2626;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
        }

        .due-item-details h4 {
          margin: 0 0 12px 0;
          color: #1e293b;
          font-size: 16px;
          font-weight: 600;
        }

        .due-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .due-item-row span:first-child {
          color: #64748b;
        }

        .due-item-row strong {
          color: #dc2626;
          font-size: 16px;
        }

        .due-plan-type {
          background: #e6f7e6;
          color: #16a34a;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .due-pay-btn {
          width: 100%;
          margin-top: 12px;
          padding: 10px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .due-pay-btn:hover:not(:disabled) {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .due-pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .due-pay-btn i {
          font-size: 16px;
        }

        .due-popup-footer {
          padding: 16px 24px 24px;
          border-top: 1px solid #e5e7eb;
        }

        .due-later-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .due-later-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .due-later-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .due-popup {
            width: 95%;
            max-height: 90vh;
          }

          .due-popup-header {
            padding: 16px 20px;
          }

          .due-popup-content {
            padding: 16px 20px;
          }

          .due-popup-footer {
            padding: 16px 20px 20px;
          }
        }
      `}</style>
    </>
  );
}