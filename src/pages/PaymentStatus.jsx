import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function PaymentStatus() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    apiFetch(`/payment-status/${paymentId}/`)
      .then(setPayment)
      .catch(console.error);
  }, [paymentId]);

  if (!payment) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      helping
      {payment.status === "approved" && (
        <>
          <h2 style={{ color: "green" }}>✅ Payment Successful</h2>
          <p>₹{payment.amount} added to your investment</p>
        </>
      )}

      {payment.status === "rejected" && (
        <>
          <h2 style={{ color: "red" }}>❌ Payment Failed</h2>
          <p>{payment.admin_note || "Payment rejected by admin"}</p>
        </>
      )}

      {payment.status === "pending" && (
        <>
          <h2 style={{ color: "#2563eb" }}>⏳ Payment Pending</h2>
          <p>Admin verification in progress</p>
        </>
      )}
    </div>
  );
}
