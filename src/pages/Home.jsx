import "../styles/main.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { container, item } from "../api/animations"
import InvestmentCalculator from "../components/InvestmentCalculator";


function Stat({ value, suffix = "", label, duration = 5000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <div className="stat-item">
      <h3>
        {count}
        {suffix}
      </h3>
      <p>{label}</p>
    </div>
  );
}


/* Smooth infinite motion config */
const smoothFloat = {
  animate: {
    y: [0, -12, 0],
  },
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

const smoothFloatSlow = {
  animate: {
    y: [0, 10, 0],
  },
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};



const Servicecontainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.15,
    },
  },
};


const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  return (
    <div className="home-page">
      {/* HERO SECTION */}


      


 <section className="hero">

       {/* LEFT BOX – +24.8% */}
      <motion.div
        className="floating-stat left"
        {...smoothFloat}
      >
        <div className="stat-value">+24.8%</div>
        <div className="stat-label">QUARTERLY GROWTH</div>
      </motion.div>

      {/* RIGHT BOX – SECURITY */}
      <motion.div
        className="floating-security right"
        {...smoothFloatSlow}
      >
        <i className="bi bi-shield-check"></i>
        <span>Bank-Grade Security</span>
      </motion.div>

      {/* MAIN CONTENT */}
      <motion.div
        className="hero-content"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span className="hero-pill" variants={item}>
          <i className="bi bi-people-fill"></i> 10K+ Active Investors
        </motion.span>

        <motion.h1 className="hero-title" variants={item}>
          Invest Smarter. <br />
          <span>Own WIPO Group.</span>
        </motion.h1>

        <motion.p className="hero-subtitle" variants={item}>
          Modern real estate investment for everyone. <br />
          Secure your future with blockchain-backed assets.
        </motion.p>

        <motion.div className="hero-actions" variants={item}>
          <a className="hero-btn primary">Buy Property</a>
          <a className="hero-btn secondary">Join Committee</a>
        </motion.div>
      </motion.div>

    </section>


      {/* FEATURES */}
      <section className="services-section">

      {/* HEADER */}
      <motion.div
        className="services-header"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.span className="services-pill" variants={fadeUp}>
          WIPO PREMIUM SERVICES
        </motion.span>

        <motion.h2 className="services-title" variants={fadeUp}>
          Experience the <br />
          <span>Future of Wealth</span>
        </motion.h2>
      </motion.div>

      {/* CARDS */}
      <motion.div
        className="services-grid"
        variants={Servicecontainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.div className="service-card" variants={fadeUp}>
          <div className="service-icon">
            <i className="bi bi-house"></i>
          </div>
          <h3>Property Buy</h3>
          <p>
            Verified listings with secure smart-contract processing.
          </p>
          <span className="service-tag">WIPO ECOSYSTEM</span>

        </motion.div>

        <motion.div className="service-card" variants={fadeUp}>
          <div className="service-icon">
            <i className="bi bi-building"></i>
          </div>
          <h3>Property Sell</h3>
          <p>
            Reach global buyers with our high-speed marketing engine.
          </p>
          <span className="service-tag">WIPO ECOSYSTEM</span>

        </motion.div>

        <motion.div className="service-card" variants={fadeUp}>
          <div className="service-icon">
            <i className="bi bi-person"></i>
          </div>
          <h3>Committees</h3>
          <p>
            Guaranteed high-yield investment groups for community growth.
          </p>
          <span className="service-tag">WIPO ECOSYSTEM</span>

        </motion.div>

        <motion.div className="service-card" variants={fadeUp}>
          <div className="service-icon">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <h3>Loans</h3>
          <p>
            Leverage your assets for instant, low-interest liquidity.
          </p>
          <span className="service-tag">WIPO ECOSYSTEM</span>

        </motion.div>
      </motion.div>

    </section>

    <InvestmentCalculator />


<section className="how-it-works">
  <div className="how-container">

    <h2 className="how-title">How It Works</h2>
    <p className="how-subtitle">
      Start your investment journey in just a few simple steps
    </p>

    <div className="how-steps">

      <div className="how-step">
        <div className="step-circle">1</div>
        <h3>Create Account</h3>
        <p>
          Sign up and complete your KYC verification to get started
        </p>
      </div>

      <div className="how-step">
        <div className="step-circle">2</div>
        <h3>Choose Investment</h3>
        <p>
          Browse properties or join committee investments that match your goals
        </p>
      </div>

      <div className="how-step">
        <div className="step-circle">3</div>
        <h3>Start Earning</h3>
        <p>
          Track your investments and watch your wealth grow
        </p>
      </div>

    </div>
  </div>
</section>



<section className="stats-section">
      <div className="stats-container">

        <Stat value={10000} suffix="+" label="Active Investors" />
        <Stat value={500} suffix="Cr+" label="Properties Listed" />
        <Stat value={98} suffix="%" label="Customer Satisfaction" />
        <Stat value={15} suffix="+" label="Years Experience" />

      </div>
    </section>


    <section className="why-choose">
  <div className="why-container">

    <h2 className="why-title">Why Choose WIPO Group</h2>
    <p className="why-subtitle">
      We provide secure, transparent, and profitable investment opportunities
    </p>

    <div className="why-grid">

      <div className="why-card">
        <div className="why-icon">
          <i className="bi bi-shield-check"></i>
        </div>
        <h3>100% Secure</h3>
        <p>
          Your investments are protected with bank-grade security and insurance
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">
          <i className="bi bi-bar-chart-line"></i>
        </div>
        <h3>Transparent</h3>
        <p>
          Complete visibility into all transactions and property details
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">
          <i className="bi bi-patch-check"></i>
        </div>
        <h3>Trusted</h3>
        <p>
          15+ years of excellence with thousands of satisfied investors
        </p>
      </div>

    </div>
  </div>
</section>


      {/* CTA */}
     {/* FINAL CTA */}
<section className="final-cta-section">
  <div className="final-cta-box">

    {/* pill */}
    <span className="final-cta-pill">SECURE ECOSYSTEM</span>

    {/* heading */}
    <h2 className="final-cta-title">
      Ready to Start Your <br />
      <span>Investment Journey?</span>
    </h2>

    {/* subtitle */}
    <p className="final-cta-subtitle">
      Join thousands of successful investors who trust <strong>WIPO GROUP</strong>{" "}
      for their property and investment needs.
    </p>

    {/* actions */}
    <div className="final-cta-actions">
      <a href="/signup" className="final-cta-btn primary">
        Create Free Account <i className="bi bi-arrow-right"></i>
      </a>

      <a href="/contact" className="final-cta-btn secondary">
        Contact Us
      </a>
    </div>

  </div>
</section>




    </div>
  );
}
