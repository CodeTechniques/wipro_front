import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

const LoanRejected = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const res = await apiFetch("/loans/my-application/");
    setMessage(res.message || "Your loan request was rejected.");
  };

  return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
      <h2 style={{ color: "#ef4444" }}>❌ Loan Rejected</h2>
      <p>{message}</p>
    </div>
  );
};

export default LoanRejected;
