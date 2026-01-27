import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";

const LoanDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState(null);


  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await apiFetch("/loans/dashboard-data/");
      setLoans(res); // ✅ backend returns list
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  checkApplicationStatus();
}, []);

const loadApplicationStatus = async () => {
  try {
    const res = await apiFetch("/loans/my-application/");
    if (res.exists) {
      setApplicationStatus(res.status); // pending | approved | rejected
    }
  } catch (err) {
    console.error(err);
  }
};


const checkApplicationStatus = async () => {
  try {
    const res = await apiFetch("/loans/my-application/");
    if (res.exists) {
      if (res.status === "approved") {
        navigate("/loan-approved");
      } else if (res.status === "rejected") {
        navigate("/loan-rejected");
      }
    }
  } catch (err) {
    console.error(err);
  }
};


  const applyLoan = async (loanId) => {
  try {
    await apiFetch("/loans/apply/", {
      method: "POST",
      body: JSON.stringify({ loan_id: loanId }),
    });
    navigate("/loan-application-status");
  } catch (err) {
    alert(err.error || "Failed to apply");
  }
};

  if (loading) return <p>Loading...</p>;
  if (loans.length === 0) return <p>No loan created by admin.</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto" }}>
      <div className="card">
        <h3>Available Loans</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginTop: 20,
          }}
        >
          {loans.map((loan) => (
            <div key={loan.id} className="loan-box">
              <p><b>Loan Amount</b></p>
              <h2>₹{loan.principal_amount}</h2>

              <p>Interest: {loan.interest_percent}%</p>
              <p>Duration: {loan.duration_months} months</p>
              <p><b>EMI:</b> ₹{loan.emi_amount}</p>

              {applicationStatus === "approved" ? (
  <button
    style={{
      marginTop: 15,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: 8,
      cursor: "pointer",
    }}
    onClick={() => navigate("/loan-details")}
  >
    View Details
  </button>
) : applicationStatus === "pending" ? (
  <button
    style={{
      marginTop: 15,
      background: "#9ca3af",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: 8,
    }}
    disabled
  >
    Application Pending
  </button>
) : (
  <button
    style={{
      marginTop: 15,
      background: "#22c55e",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: 8,
      cursor: "pointer",
    }}
    onClick={() => applyLoan(loan.id)}
  >
    Apply Now
  </button>
)}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanDashboard;
