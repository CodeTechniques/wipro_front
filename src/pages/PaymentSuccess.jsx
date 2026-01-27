import { useParams, Link } from "react-router-dom";

export default function PaymentSuccess() {
  const { planId } = useParams();

  return (
    <div className="success-container">
      <h2>✅ Payment Successful</h2>

      <div className="tag completed">COMPLETED</div>

      <p>Your payment has been completed successfully.</p>
      <p><strong>Plan ID:</strong> {planId}</p>

      <Link to="/buyer-dashboard">Go to Buyer Dashboard</Link>
    </div>
  );
}
