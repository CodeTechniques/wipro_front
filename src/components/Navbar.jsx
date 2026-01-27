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
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");
  const { currency, toggleCurrency } = useCurrency();


  useEffect(() => {
    apiFetch("/auth/profile-details/")
      .then(setProfile)
      .catch(() => {});
  }, []);

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
            <li><NavLink to="/">Properties</NavLink></li>
            {/* <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li> */}
            <li><NavLink to="/committees">Committees</NavLink></li>
            
            <li><NavLink to="/referral">Refer & Earn</NavLink></li>
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
        <NavLink onClick={() => setMenuOpen(false)} to="/properties">Properties</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/about">About</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/contact">Contact</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/committees">Committees</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/wallet">Wallet</NavLink>
        <NavLink onClick={() => setMenuOpen(false)} to="/referral">Refer & Earn</NavLink>
      </div>
    </>
  );
}
