import { useState } from "react";
import "../styles/investment.css";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

const USD_RATE = 89; // 1 USD = 89 INR

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(50000); // INR base
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const ROI = 0.154;
  const yearlyYield = Math.round(amount * ROI);
  const monthlyPayout = Math.round(yearlyYield / 12);

  const formatAmount = (value) => {
    if (currency === "INR") {
      return `₹${value.toLocaleString("en-IN")}`;
    }
    return `$${(value / USD_RATE).toFixed(2)}`;
  };

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
            <h3 className="amount">{formatAmount(amount)}</h3>
          </div>

          {/* SLIDER (still INR internally) */}
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
  {currency === "INR" ? (
    <>
      <span>50K</span>
      <span>10L</span>
      <span>20L</span>
    </>
  ) : (
    <>
      <span>$562</span>
      <span>$11.2K</span>
      <span>$22.4K</span>
    </>
  )}
</div>

          </div>

          {/* PAYOUTS */}
          <div className="payout-row">
            <div className="payout dark">
              <span>MONTHLY PAYOUT</span>
              <h4>{formatAmount(monthlyPayout)}</h4>
            </div>

            <div className="payout green">
              <span>TOTAL YIELD (1YR)</span>
              <h4>{formatAmount(yearlyYield)}</h4>
            </div>
          </div>

          {/* RISK */}
          <div className="risk-row">
            <span>Security: Asset-Backed</span>
            <span className="risk">Risk: Low</span>
          </div>

          {/* BUTTON */}
          <button
            className="invest-btn"
            onClick={() => navigate("/committees")}
          >
            Invest Now <i className="bi bi-arrow-right"></i>
          </button>

          {currency !== "INR" && (
            <small style={{ color: "#6b7280", marginTop: 10, display: "block" }}>
              * Values shown in USD (calculations based on INR)
            </small>
          )}

        </div>
      </div>
    </section>
  );
}