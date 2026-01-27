import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function BuyerDashboard() {
  const [requested, setRequested] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      apiFetch("/properties/interests/mine/"),
      apiFetch("/properties/transactions/my/"),
    ])
      .then(([interestData, txData]) => {
        const interests = interestData.results || interestData;

        setRequested(interests.filter(i => i.status === "requested"));
        setAccepted(interests.filter(i => i.status === "accepted"));
        setCompleted(txData.results || txData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const proceedToPayment = (planId) => {
    navigate(`/payment/${planId}`);
  };

  const isPlanCompleted = (plan) => {
    if (!plan) return false;

    if (plan.mode === "single") {
      return plan.confirmed_count === 1;
    }

    return (
      plan.confirmed_count === plan.group_size &&
      String(plan.confirmed_total) === String(plan.total_payable)
    );
  };

  const hasUserPaid = (plan, userId) => {
    if (!plan?.contributions) return false;

    return plan.contributions.some(
      c => c.payer === userId && c.status === "confirmed"
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="buyer-container">
      <h2>Buyer Dashboard</h2>

      {/* ================= REQUESTED ================= */}
      <section>
        <h3>My Requests</h3>

        {requested.length === 0 && <p>No pending requests.</p>}

        {requested.map(i => (
          <div key={i.id} className="interest-card">
            <p><strong>Property:</strong> {i.property.title}</p>
            <p className="tag pending">Waiting for owner approval</p>
          </div>
        ))}
      </section>

      {/* ================= ACTIVE / PAYMENT ================= */}
      <section>
        <h3>Active Purchases</h3>

        {accepted.length === 0 && <p>No active purchases.</p>}

        {accepted.map(i => {
          const plan = i.plan;
          const completedPlan = isPlanCompleted(plan);
          const userPaid = hasUserPaid(plan, i.requester.id);

          return (
            <div key={i.id} className="interest-card active">
              <p><strong>Property:</strong> {i.property.title}</p>
              <p><strong>Mode:</strong> {plan.mode}</p>

              {plan.mode === "group" && (
                <p>
                  <strong>Progress:</strong>{" "}
                  {plan.confirmed_count}/{plan.group_size} paid
                </p>
              )}

              {/* STATUS */}
              {completedPlan && (
                <span className="tag completed">COMPLETED</span>
              )}

              {!completedPlan && userPaid && (
                <span className="tag completed">YOU PAID</span>
              )}

              {!completedPlan && !userPaid && (
                <button
                  className="pay-btn"
                  onClick={() => proceedToPayment(plan.id)}
                >
                  Pay Your Share
                </button>
              )}
            </div>
          );
        })}
      </section>

      {/* ================= COMPLETED ================= */}
      <section>
        <h3>Completed Payments</h3>

        {completed.length === 0 && <p>No completed payments.</p>}

        {completed.map(tx => (
          <div key={tx.id} className="purchase-card completed">
            <p>
              <strong>Property:</strong>{" "}
              {tx?.contribution?.plan?.property?.title || "Property"}
            </p>

            <p>
              <strong>Amount Paid:</strong> ₹{tx.amount}
            </p>

            <span className="tag completed">COMPLETED</span>
          </div>
        ))}
      </section>
    </div>
  );
}
