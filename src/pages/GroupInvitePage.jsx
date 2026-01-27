import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useState } from "react";

export default function GroupInvitePage() {
  const { inviteId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const respond = async (action) => {
    if (!inviteId) {
      alert("Invalid invite link");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await apiFetch(
        `/properties/group-payment-invites/${inviteId}/respond/`,
        {
          method: "POST",
          body: JSON.stringify({ action }),
        }
      );

      if (res.redirect) {
        navigate(res.redirect);
        return;
      }

      setMessage(res.message || "Done");
    } catch (err) {
      setMessage(err.error || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
      <h2>Group Payment Invite</h2>

      {message && (
        <p style={{ color: "red", marginBottom: 20 }}>{message}</p>
      )}

      <button
        style={{
          width: "100%",
          padding: "14px",
          fontSize: 16,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 12,
        }}
        disabled={loading}
        onClick={() => respond("accept")}
      >
        {loading ? "Processing..." : "Accept & Pay"}
      </button>

      <button
        style={{
          width: "100%",
          padding: "14px",
          fontSize: 16,
          background: "#e5e7eb",
          color: "#111",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
        disabled={loading}
        onClick={() => respond("reject")}
      >
        Reject
      </button>
    </div>
  );
}
