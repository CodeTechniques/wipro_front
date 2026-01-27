import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import "./group-payment.css";

export default function GroupPayment({ planId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    apiFetch(`/properties/plans/${planId}/payable/`)
      .then(setData)
      .catch(err => alert(err.detail || "Not allowed"))
      .finally(() => setLoading(false));
  }, [planId]);

  const handlePay = async () => {
    setPaying(true);
    try {
      await apiFetch(`/properties/plans/${planId}/pay/`, {
        method: "POST",
        body: JSON.stringify({
          payer_name: "Demo User",
          payer_phone: "9999999999",
          note: "Group payment",
        }),
      });
      alert("Payment successful");
      window.location.reload();
    } catch (err) {
      alert(err.detail || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <p>Loading payment details...</p>;
  if (!data?.allowed) return <p>You are not allowed to pay.</p>;

  const progress =
    (data.confirmed_count / data.group_size) * 100;

  return (
    <div className="group-pay-container">
      <h2>Group Purchase</h2>

      <div className="summary">
        <p><strong>Group Size:</strong> {data.group_size}</p>
        <p><strong>Total Payable:</strong> ₹{data.total_payable}</p>
        <p><strong>Your Amount:</strong> ₹{data.your_payable}</p>
      </div>

      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <small>
          {data.confirmed_count} / {data.group_size} paid
        </small>
      </div>

      <button
        disabled={paying}
        className="pay-btn"
        onClick={handlePay}
      >
        {paying ? "Processing..." : `Pay ₹${data.your_payable}`}
      </button>

      <small className="note">{data.note}</small>
    </div>
  );
}
