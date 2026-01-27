import "./Footer.css";
import { Link } from "react-router-dom";
import logo from "../assets/wipo-logo.webp";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-brand">
          <div className="brand-logo">
             <img src={logo} alt="WIPO Group" className="navbar-logo" />
            <h3>WIPO GROUP</h3>
          </div>

          <p>
            Your trusted partner in real estate and investment since 2009.
            We simplify property growth for everyone.
          </p>

          <div className="social-icons">
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-linkedin"></i></a>
            <a href="#"><i className="bi bi-youtube"></i></a>
          </div>
        </div>

        {/* COMPANY */}
        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/properties">Properties</Link>
        </div>

        {/* LEGAL */}
        <div className="footer-links">
          <h4>Legal</h4>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/refund">Refund Policy</Link>
        </div>

        {/* QUICK CONNECT */}
        <div className="footer-connect">
          <h4>Quick Connect</h4>

          <div className="connect-item">
            <i className="bi bi-envelope"></i>
            <span>wipogroup@gmail.com</span>
          </div>

          <div className="connect-item">
            <i className="bi bi-telephone"></i>
            <span>+1 (938) 209-0088</span>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <span>© 2026 WIPO GROUP. All Rights Reserved.</span>

        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top ↑
        </button>

        <span>
  Design by <a href="https://kaizensclan.com/" target="_blank" rel="noopener noreferrer">
    Kaizens Clan
  </a>
</span>
      </div>
    </footer>
  );
}