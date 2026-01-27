import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";

const LoanApplicationStatus = () => {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const res = await apiFetch("/loans/my-applications/");
      if (!res.exists) {
        setStatus("none");
      } else {
        setStatus(res.status);
        setMessage(res.message || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
      {status === "pending" && (
        <>
          <h2 style={{ color: "#f59e0b" }}>⏳ Application Submitted</h2>
          <p>Your loan application has been sent successfully.</p>
          <p>Please wait until the owner responds.</p>
        </>
      )}

      {status === "approved" && (
        <>
          <h2 style={{ color: "#22c55e" }}>✅ Loan Approved</h2>
          <p>Your loan has been approved by the admin.</p>
          <p>You will receive the amount very soon.</p>
          <button onClick={() => navigate("/loan-details")}>
            View Loan Details
          </button>
        </>
      )}

      {status === "rejected" && (
        <>
          <h2 style={{ color: "#ef4444" }}>❌ Loan Rejected</h2>
          <p>{message || "Your loan request was rejected by the admin."}</p>
        </>
      )}

      {status === "none" && <p>No loan application found.</p>}
    </div>
  );
};

export default LoanApplicationStatus;
