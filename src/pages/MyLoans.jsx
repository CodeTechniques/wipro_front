import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";

const MyLoans = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyLoan();
  }, []);

  const loadMyLoan = async () => {
    try {
      const res = await apiFetch("/loans/my-applications/");
      if (res.exists) {
        setApplication(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!application) {
    return (
      <div style={{ maxWidth: 800, margin: "40px auto" }}>
        <h2>My Loans</h2>
        <p>You have not applied for any loan yet.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>My Loans</h2>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
          background: "#fff",
        }}
      >
        <p>
          <b>Status:</b>{" "}
          <span
            style={{
              color:
                application.status === "approved"
                  ? "#22c55e"
                  : application.status === "rejected"
                  ? "#ef4444"
                  : "#f59e0b",
            }}
          >
            {application.status.toUpperCase()}
          </span>
        </p>

        {application.message && (
          <p>
            <b>Admin Message:</b> {application.message}
          </p>
        )}

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
      </div>
    </div>
  );
};

export default MyLoans;
