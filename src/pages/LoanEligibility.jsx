import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

const LoanEligibility = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await apiFetch("/loans/dashboard/");
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto" }}>
      <div className="card">
        <h3>Check Your Loan Eligibility</h3>

        {/* INPUT ROW */}
        <div className="grid">
          <div>
            <label>Monthly Investment Amount</label>
            <input value={data.monthly_investment} disabled />
          </div>
          <div>
            <label>Months Completed</label>
            <input value={data.months_completed} disabled />
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          <div>
            <p>TOTAL INVESTED</p>
            <h2>₹{data.total_invested}</h2>
          </div>

          <div className="highlight">
            <p>ELIGIBLE LOAN AMOUNT</p>
            <h2>₹{data.eligible_loan_amount}</h2>
          </div>

          <div>
            <p>EMI (12 MONTHS)</p>
            <h2>₹{data.emi_12_months}</h2>
          </div>
        </div>

        {/* MESSAGE */}
        <div className={`alert ${data.eligible ? "success" : "error"}`}>
          {data.message}
        </div>

        {/* ACTION */}
        {data.eligible && (
          <div className="actions">
            <button className="primary">Apply for Loan</button>
            <button className="secondary">Learn More</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanEligibility;
