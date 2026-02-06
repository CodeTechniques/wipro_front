import React from "react";
import { 
  Target, 
  Users, 
  ShieldCheck, 
  Buildings,
  ArrowRight,
  Sparkle,
  TrendUp
} from "phosphor-react";

const AboutWipo = () => {
  return (
    <div className="about-wipo-container">
      {/* Main Hero Section */}
      <section className="about-hero-section">
        {/* Decorative Background Elements */}
        <div className="about-bg-decorations">
          <div className="about-bg-blob about-bg-blob-1"></div>
          <div className="about-bg-blob about-bg-blob-2"></div>
          <div className="about-bg-blob about-bg-blob-3"></div>
        </div>

        <div className="about-container">
          <div className="about-grid">
            
            {/* Left Content */}
            <div className="about-left-content">
              <div className="about-badge">
                <Sparkle size={16} weight="fill" />
                LEADING PROP-TECH ECOSYSTEM
              </div>

              <h1 className="about-main-heading">
                Invest in{" "}
                <span className="about-highlight-wrapper">
                  <span className="about-highlight-text">
                    Real Assets
                  </span>
                  <span className="about-highlight-underline"></span>
                </span>
                <span className="about-dot">.</span>
              </h1>

              <div className="about-description">
                <p className="about-desc-bold">
                  Real estate investing as simple as buying a stock.
                </p>
                <p className="about-desc-regular">
                  Experience the power of fractional ownership. We bring you premium, 
                  high-yield assets that were previously reserved for institutional giants.
                </p>
              </div>

              <div className="about-cta-buttons">
                <a href="/contactUs" className="about-btn about-btn-primary">
                  Start Investing
                  <ArrowRight size={22} weight="bold" />
                </a>
                
                <a href="/properties" className="about-btn about-btn-secondary">
                  Explore Properties
                </a>
              </div>

              {/* Quick Stats */}
              <div className="about-quick-stats">
                <div className="about-stat-item">
                  <div className="about-stat-value">₹50Cr+</div>
                  <p className="about-stat-label">Assets Value</p>
                </div>
                <div className="about-stat-divider"></div>
                <div className="about-stat-item">
                  <div className="about-stat-value about-stat-value-accent">8-12%</div>
                  <p className="about-stat-label">Annual Returns</p>
                </div>
              </div>
            </div>

            {/* Right Card - Why WIPO */}
            <div className="about-why-card-wrapper">
              <div className="about-why-glow"></div>
              
              <div className="about-why-card">
                <div className="about-why-header">
                  <div className="about-why-icon">
                    <TrendUp size={24} weight="bold" />
                  </div>
                  <h2 className="about-why-title">Why WIPO?</h2>
                </div>

                <ul className="about-why-list">
                  {[
                    "Fractional ownership in Grade-A properties",
                    "Transparent legal and RERA documentation",
                    "Monthly rental yields and appreciation",
                    "End-to-end asset management"
                  ].map((item, index) => (
                    <li key={index} className="about-why-item">
                      <div className="about-why-check">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="about-why-text">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="about-why-corner-accent"></div>
              </div>
            </div>
          </div>

          {/* Trust Metrics Section */}
          <div className="about-metrics-section">
            <div className="about-metrics-header">
              <h2 className="about-metrics-title">Trusted by Thousands</h2>
              <p className="about-metrics-subtitle">
                Join a growing community of smart investors building wealth through real estate
              </p>
            </div>

            <div className="about-metrics-grid">
              {/* Transparency Card */}
              <div className="about-metric-card about-metric-card-1">
                <div className="about-metric-bg"></div>
                
                <div className="about-metric-content">
                  <div className="about-metric-icon about-metric-icon-1">
                    <Target size={32} weight="duotone" />
                  </div>
                  
                  <div className="about-metric-value-wrapper">
                    <h3 className="about-metric-value">100%</h3>
                    <div className="about-metric-line about-metric-line-1"></div>
                  </div>
                  
                  <p className="about-metric-label about-metric-label-1">Transparency</p>
                </div>
              </div>

              {/* Community Card */}
              <div className="about-metric-card about-metric-card-2">
                <div className="about-metric-bg"></div>
                
                <div className="about-metric-content">
                  <div className="about-metric-icon about-metric-icon-2">
                    <Users size={32} weight="duotone" />
                  </div>
                  
                  <div className="about-metric-value-wrapper">
                    <h3 className="about-metric-value">12K+</h3>
                    <div className="about-metric-line about-metric-line-2"></div>
                  </div>
                  
                  <p className="about-metric-label about-metric-label-2">Active Community</p>
                </div>
              </div>

              {/* Security Card - Featured */}
              <div className="about-metric-card about-metric-card-featured">
                <div className="about-metric-bg"></div>
                
                <div className="about-metric-content">
                  <div className="about-metric-icon about-metric-icon-featured">
                    <ShieldCheck size={32} weight="duotone" />
                  </div>
                  
                  <div className="about-metric-value-wrapper">
                    <h3 className="about-metric-value about-metric-value-white">Secure</h3>
                    <div className="about-metric-line about-metric-line-white"></div>
                  </div>
                  
                  <p className="about-metric-label about-metric-label-white">Bank-Grade Security</p>
                </div>

                <div className="about-metric-shine"></div>
              </div>

              {/* Assets Card */}
              <div className="about-metric-card about-metric-card-4">
                <div className="about-metric-bg"></div>
                
                <div className="about-metric-content">
                  <div className="about-metric-icon about-metric-icon-4">
                    <Buildings size={32} weight="duotone" />
                  </div>
                  
                  <div className="about-metric-value-wrapper">
                    <h3 className="about-metric-value">500+</h3>
                    <div className="about-metric-line about-metric-line-4"></div>
                  </div>
                  
                  <p className="about-metric-label about-metric-label-4">Managed Assets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scoped CSS Styles */}
      <style jsx>{`
        .about-wipo-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .about-hero-section {
          position: relative;
          overflow: hidden;
          background: linear-gradient(to bottom right, #f8fafc, #f0fdf4, #ffffff);
        }

        .about-bg-decorations {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .about-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }

        .about-bg-blob-1 {
          top: -160px;
          right: -160px;
          width: 384px;
          height: 384px;
          background: rgba(16, 185, 129, 0.15);
        }

        .about-bg-blob-2 {
          top: 240px;
          left: -128px;
          width: 320px;
          height: 320px;
          background: rgba(59, 130, 246, 0.15);
        }

        .about-bg-blob-3 {
          bottom: 80px;
          right: 33.333%;
          width: 256px;
          height: 256px;
          background: rgba(16, 185, 129, 0.08);
        }

        .about-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 16px;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 768px) {
          .about-container {
            padding: 128px 16px;
          }
        }

        .about-grid {
          display: grid;
          gap: 64px;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 80px;
          }
        }

        .about-left-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .about-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(to right, #10b981, #14b8a6);
          color: white;
          padding: 10px 24px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          width: fit-content;
          animation: fadeUp 0.6s ease-out forwards;
        }

        .about-main-heading {
          font-size: 48px;
          font-weight: 900;
          line-height: 1.1;
          animation: fadeUp 0.6s ease-out 0.1s forwards;
          opacity: 0;
        }

        @media (min-width: 768px) {
          .about-main-heading {
            font-size: 60px;
          }
        }

        @media (min-width: 1024px) {
          .about-main-heading {
            font-size: 72px;
          }
        }

        .about-highlight-wrapper {
          position: relative;
          display: inline-block;
        }

        .about-highlight-text {
          position: relative;
          z-index: 10;
          background: linear-gradient(to right, #059669, #14b8a6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .about-highlight-underline {
          position: absolute;
          bottom: 8px;
          left: 0;
          width: 100%;
          height: 16px;
          background: rgba(16, 185, 129, 0.3);
          z-index: 0;
        }

        .about-dot {
          color: #059669;
        }

        .about-description {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeUp 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .about-desc-bold {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        @media (min-width: 768px) {
          .about-desc-bold {
            font-size: 24px;
          }
        }

        .about-desc-regular {
          font-size: 18px;
          color: #475569;
          line-height: 1.75;
          max-width: 42rem;
          margin: 0;
        }

        .about-cta-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          animation: fadeUp 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }

        .about-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 18px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .about-btn-primary {
          background: linear-gradient(to right, #059669, #14b8a6);
          color: white;
        }

        .about-btn-primary:hover {
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.4);
          transform: scale(1.05);
        }

        .about-btn-primary svg {
          transition: transform 0.3s;
        }

        .about-btn-primary:hover svg {
          transform: translateX(4px);
        }

        .about-btn-secondary {
          background: white;
          color: #334155;
          border: 2px solid #e2e8f0;
        }

        .about-btn-secondary:hover {
          border-color: #10b981;
          color: #059669;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .about-quick-stats {
          display: flex;
          gap: 32px;
          padding-top: 16px;
          animation: fadeUp 0.6s ease-out 0.4s forwards;
          opacity: 0;
        }

        .about-stat-item {
          display: flex;
          flex-direction: column;
        }

        .about-stat-value {
          font-size: 30px;
          font-weight: 900;
          color: #0f172a;
        }

        .about-stat-value-accent {
          color: #059669;
        }

        .about-stat-label {
          font-size: 14px;
          color: #475569;
          font-weight: 600;
          margin-top: 4px;
          margin-bottom: 0;
        }

        .about-stat-divider {
          width: 1px;
          background: #e2e8f0;
        }

        .about-why-card-wrapper {
          position: relative;
          animation: slideIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .about-why-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom right, #10b981, #14b8a6);
          border-radius: 24px;
          filter: blur(40px);
          opacity: 0.2;
        }

        .about-why-card {
          position: relative;
          background: linear-gradient(to bottom right, #0f172a, #1e293b, #064e3b);
          border-radius: 24px;
          padding: 40px;
          color: white;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        @media (min-width: 768px) {
          .about-why-card {
            padding: 48px;
          }
        }

        .about-why-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .about-why-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: linear-gradient(to bottom right, #34d399, #14b8a6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .about-why-title {
          font-size: 30px;
          font-weight: 900;
          margin: 0;
        }

        @media (min-width: 768px) {
          .about-why-title {
            font-size: 36px;
          }
        }

        .about-why-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .about-why-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .about-why-check {
          width: 28px;
          height: 28px;
          border-radius: 12px;
          background: linear-gradient(to bottom right, #34d399, #14b8a6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          color: white;
          transition: transform 0.3s;
        }

        .about-why-item:hover .about-why-check {
          transform: scale(1.1);
        }

        .about-why-text {
          color: #f1f5f9;
          line-height: 1.75;
          font-size: 18px;
          font-weight: 500;
        }

        .about-why-corner-accent {
          position: absolute;
          top: 0;
          right: 0;
          width: 128px;
          height: 128px;
          background: linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), transparent);
          border-top-right-radius: 24px;
          border-bottom-left-radius: 100px;
        }

        .about-metrics-section {
          margin-top: 96px;
        }

        @media (min-width: 768px) {
          .about-metrics-section {
            margin-top: 128px;
          }
        }

        .about-metrics-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .about-metrics-title {
          font-size: 36px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 16px;
        }

        @media (min-width: 768px) {
          .about-metrics-title {
            font-size: 48px;
          }
        }

        .about-metrics-subtitle {
          font-size: 18px;
          color: #475569;
          max-width: 42rem;
          margin: 0 auto;
        }

        .about-metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 640px) {
          .about-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .about-metrics-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .about-metric-card {
          position: relative;
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.5s;
          border: 2px solid transparent;
        }

        .about-metric-card:hover {
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          transform: translateY(-8px);
        }

        .about-metric-card-1:hover {
          border-color: #10b981;
        }

        .about-metric-card-2:hover {
          border-color: #3b82f6;
        }

        .about-metric-card-4:hover {
          border-color: #a855f7;
        }

        .about-metric-card-featured {
          background: linear-gradient(to bottom right, #059669, #14b8a6);
          border: 2px solid #10b981;
        }

        @media (min-width: 1024px) {
          .about-metric-card-featured {
            transform: translateY(-16px);
          }
        }

        .about-metric-bg {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .about-metric-card-1:hover .about-metric-bg {
          background: linear-gradient(to bottom right, #f0fdf4, transparent);
          opacity: 1;
        }

        .about-metric-card-2:hover .about-metric-bg {
          background: linear-gradient(to bottom right, #eff6ff, transparent);
          opacity: 1;
        }

        .about-metric-card-4:hover .about-metric-bg {
          background: linear-gradient(to bottom right, #faf5ff, transparent);
          opacity: 1;
        }

        .about-metric-card-featured:hover .about-metric-bg {
          background: rgba(255, 255, 255, 0.1);
          opacity: 1;
        }

        .about-metric-content {
          position: relative;
        }

        .about-metric-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.3s;
        }

        .about-metric-card:hover .about-metric-icon {
          transform: scale(1.1);
        }

        .about-metric-icon-1 {
          background: linear-gradient(to bottom right, #d1fae5, #a7f3d0);
          color: #059669;
        }

        .about-metric-icon-2 {
          background: linear-gradient(to bottom right, #dbeafe, #bfdbfe);
          color: #2563eb;
        }

        .about-metric-icon-featured {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
        }

        .about-metric-icon-4 {
          background: linear-gradient(to bottom right, #f3e8ff, #e9d5ff);
          color: #9333ea;
        }

        .about-metric-value-wrapper {
          margin-bottom: 12px;
        }

        .about-metric-value {
          font-size: 48px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 4px;
          margin-top: 0;
        }

        @media (min-width: 768px) {
          .about-metric-value {
            font-size: 60px;
          }
        }

        .about-metric-value-white {
          color: white;
        }

        .about-metric-line {
          width: 64px;
          height: 6px;
          border-radius: 9999px;
        }

        .about-metric-line-1 {
          background: linear-gradient(to right, #10b981, #14b8a6);
        }

        .about-metric-line-2 {
          background: linear-gradient(to right, #3b82f6, #06b6d4);
        }

        .about-metric-line-white {
          background: rgba(255, 255, 255, 0.6);
        }

        .about-metric-line-4 {
          background: linear-gradient(to right, #a855f7, #ec4899);
        }

        .about-metric-label {
          color: #059669;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0;
        }

        .about-metric-label-1 {
          color: #059669;
        }

        .about-metric-label-2 {
          color: #2563eb;
        }

        .about-metric-label-white {
          color: #d1fae5;
        }

        .about-metric-label-4 {
          color: #9333ea;
        }

        .about-metric-shine {
          position: absolute;
          top: 0;
          right: 0;
          width: 96px;
          height: 96px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          filter: blur(40px);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AboutWipo;