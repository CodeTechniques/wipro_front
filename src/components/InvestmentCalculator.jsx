import { useState } from "react";
import "../styles/investment.css";

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(50000);

  const ROI = 0.154;
  const yearlyYield = Math.round(amount * ROI);
  const monthlyPayout = Math.round(yearlyYield / 12);

  return (
    <section className="investment-section">
      <div className="investment-container">

        {/* LEFT */}
        <div className="investment-left">
  <span className="investment-pill">
    <i className="bi bi-activity"></i>
    REAL-TIME GROWTH
  </span>

  <h2 className="investment-heading">
    Invest in <br />
    <span>Your Future</span>
  </h2>

  <p className="investment-desc">
    Join Wipo's premium asset-backed committees.
    Use the calculator to visualize your passive income.
  </p>

  <div className="investment-badges">
    <div className="info-badge">
      <strong>15.4%</strong>
      <span>Target ROI</span>
    </div>

    <div className="info-badge highlight">
      <strong>Fixed</strong>
      <span>Payouts</span>
    </div>
  </div>
</div>


        {/* RIGHT */}
      <div className="investment-card tilt-card">

          {/* AMOUNT */}
          <div className="amount-header">
            <span className="label">INVESTMENT AMOUNT</span>
            <h3 className="amount">₹{amount.toLocaleString()}</h3>
          </div>

          {/* SLIDER */}
          <div className="slider-wrap">
            <input
              type="range"
              min="50000"
              max="2000000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="investment-slider"
            />

            <div className="slider-labels">
              <span>50K</span>
              <span>10L</span>
              <span>20L</span>
            </div>
          </div>

          {/* PAYOUTS */}
          <div className="payout-row">
            <div className="payout dark">
              <span>MONTHLY PAYOUT</span>
              <h4>₹{monthlyPayout.toLocaleString()}</h4>
            </div>

            <div className="payout green">
              <span>TOTAL YIELD (1YR)</span>
              <h4>₹{yearlyYield.toLocaleString()}</h4>
            </div>
          </div>

          {/* RISK */}
          <div className="risk-row">
            <span>Security: Asset-Backed</span>
            <span className="risk">Risk: Low</span>
          </div>

          {/* BUTTON */}
          <button className="invest-btn">
            Invest Now <i className="bi bi-arrow-right"></i>
          </button>

        </div>


      </div>
    </section>
  );
}
