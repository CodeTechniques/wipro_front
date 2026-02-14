import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function CommitteeDetail() {
  const { userCommitteeId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [dueNotifications, setDueNotifications] = useState([]);
  const [committeeDues, setCommitteeDues] = useState([]);
  
  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const { currency } = useCurrency(); // ✅ GLOBAL CURRENCY

  /* 🔹 Committee details */
  useEffect(() => {
    apiFetch(`/committee-detail/${userCommitteeId}/`)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userCommitteeId]);

  /* 🔹 Payment plans */
  useEffect(() => {
    if (!data) return;

    apiFetch(`/committee-plans/${data.committee_id}/`)
      .then(setPlans)
      .catch(console.error);
  }, [data]);

  /* 🔹 Fetch notifications */
  useEffect(() => {
    apiFetch("/notifications/").then(setNotifications).catch(console.error);
  }, []);

  useEffect(() => {
    apiFetch("/due-notifications/")
      .then(setDueNotifications)
      .catch(console.error);
  }, []);

  useEffect(() => {
    apiFetch("/committee-dues/")
      .then(setCommitteeDues)
      .catch(console.error);
  }, []);

  const handleCommitteeDuePayNow = async (d) => {
    // 🔥 create per-user due if not exists
    await apiFetch(`/committee-dues/${d.id}/expand/`, {
      method: "POST",
    });

    // navigate to existing payment flow
    navigate(`/pay/${userCommitteeId}/${d.plan_id}`);
  };

  const handlePayNow = async (userCommitteeId, plan = null) => {
    setProcessingPayment(true);
    
    try {
      // First attempt to pay using wallet
      const response = await apiFetch(`/pay-due/${userCommitteeId}/`, {
        method: "POST",
      });

      // If successful
      setShowPaymentModal(false);
      alert("Payment successful! Your dues have been cleared.");
      
    } catch (error) {
      console.log("Payment error:", error);
      
      // Check if error is due to insufficient balance
      if (error.error === "Insufficient wallet balance" || 
          error?.detail === "Insufficient wallet balance" ||
          error?.message === "Insufficient wallet balance") {
        
        setShowPaymentModal(false);
        
        // Navigate to payment page with plan info
        if (plan) {
          navigate(`/pay/${userCommitteeId}/${plan.id}`);
        } else {
          navigate(`/pay/${userCommitteeId}`);
        }
      } else {
        // Handle other errors
        alert(error.error || error.detail || "Payment failed. Please try again.");
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleOpenPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const dismissDue = async (id) => {
    await apiFetch(`/due-notifications/${id}/dismiss/`, {
      method: "POST",
    });

    setDueNotifications((prev) => prev.filter((d) => d.id !== id));
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiFetch(`/notifications/${notificationId}/read/`, {
        method: "POST",
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* 🔹 Latest payment status */
  useEffect(() => {
    apiFetch(`/payment-history/${userCommitteeId}/`)
      .then((res) => {
        if (res.length > 0) {
          setPaymentStatus(res[0].status); // latest payment
        }
      })
      .catch(console.error);
  }, [userCommitteeId]);

  /* 🔹 Button config */
  const getPayButtonConfig = () => {
    switch (paymentStatus) {
      case "pending":
        return {
          text: "Pending",
          disabled: true,
          bg: "#facc15",
        };
      case "approved":
        return {
          text: "Active",
          disabled: true,
          bg: "#22c55e",
        };
      case "rejected":
        return {
          text: "Rejected – Pay Again",
          disabled: false,
          bg: "#ef4444",
        };
      default:
        return {
          text: "Pay Now",
          disabled: false,
          bg: "#16a34a",
        };
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!data) return <p>Error loading committee</p>;

  const btn = getPayButtonConfig();

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
      <h2>{data.committee_name}</h2>

      {/* 🔹 STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 20,
        }}
      >
        <StatBox label="Invested" value={formatPrice(data.invested, currency)} />
        <StatBox label="Withdrawn" value={formatPrice(data.withdrawn, currency)} />
        <StatBox label="After 1 Year" value={formatPrice(data.expected_after_year, currency)} highlight />
      </div>

      {/* 🔹 PAYMENT PLANS */}
      <h3 style={{ marginTop: 40 }}>Payment Plans</h3>

      <div style={{ marginTop: 16 }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              padding: "14px 0",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h4>{plan.name}</h4>
              <p style={{ fontSize: 14, color: "#6b7280" }}>
                {formatPrice(plan.amount, currency)} • {plan.type.toUpperCase()} • Every{" "}
                {plan.interval_days} days
              </p>

              {/* 🔹 Status note */}
              {paymentStatus === "pending" && (
                <p style={{ fontSize: 12, color: "#92400e" }}>
                  Payment under verification
                </p>
              )}
              {paymentStatus === "approved" && (
                <p style={{ fontSize: 12, color: "#166534" }}>Plan is active</p>
              )}
              {paymentStatus === "rejected" && (
                <p style={{ fontSize: 12, color: "#991b1b" }}>
                  Payment rejected by admin
                </p>
              )}
            </div>

            {/* 🔹 PAY BUTTON */}
            <button
              disabled={btn.disabled}
              onClick={() => handleOpenPaymentModal(plan)}
              style={{
                padding: "8px 16px",
                background: btn.bg,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: btn.disabled ? "not-allowed" : "pointer",
                opacity: btn.disabled ? 0.7 : 1,
                width: "6rem",
              }}
            >
              {btn.text}
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 INVEST / WITHDRAW ACTION ROW */}
      <div
        style={{
          marginTop: 30,
          padding: "16px 20px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Quick Actions</h3>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>
            You can invest or withdraw anytime from this committee
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {/* 💰 INVEST */}
          <button
            onClick={() => {
              // 👉 Use first plan as default invest plan
              navigate(`/pay/${userCommitteeId}`);
            }}
            style={{
              padding: "10px 18px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            💰 Invest Now
          </button>

          {/* ⬇ WITHDRAW */}
          <button
            onClick={() => navigate(`/committee/${userCommitteeId}/withdraw`)}
            style={{
              padding: "10px 18px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* 🔔 ADMIN MESSAGES */}
      <div style={{ marginTop: 50 }}>
        <h3>Messages from Admin</h3>

        {notifications.length === 0 && (
          <p style={{ color: "#6b7280" }}>No messages yet</p>
        )}

        {notifications.map((n) => {
          const isPaymentDue = n.title === "Payment Due";

          return (
            <div key={n.id}>
              <h4>{n.title}</h4>
              <p>{n.message}</p>
              <small style={{ color: "#6b7280" }}>{n.created_at}</small>
            </div>
          );
        })}

        {/* 🔥 PAYMENT DUE POPUP / SECTION */}
        {dueNotifications.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h3 style={{ color: "#ea580c" }}>Payment Due</h3>

            {dueNotifications.map((d) => (
              <div
                key={d.id}
                style={{
                  marginTop: 12,
                  padding: 16,
                  borderRadius: 8,
                  background: "#fff7ed",
                  border: "1px solid #fb923c",
                }}
              >
                <p>
                  <b>{formatPrice(d.amount, currency)}</b> due for <b>{d.committee_name}</b> (
                  {d.plan_name})
                </p>

                <small>Reminder every {d.repeat_after_minutes} minutes</small>

                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <button onClick={() => handleOpenPaymentModal({ id: d.plan_id })}>
                    Pay Now
                  </button>

                  <button
                    onClick={async () => {
                      await apiFetch(`/due-notifications/${d.id}/response/`, {
                        method: "POST",
                        body: JSON.stringify({
                          action: "pay_later",
                        }),
                      });

                      setDueNotifications((prev) =>
                        prev.filter((x) => x.id !== d.id)
                      );
                    }}
                  >
                    Pay Later
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 COMMITTEE-WIDE PAYMENT DUES */}
        {committeeDues.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h3 style={{ color: "#0f766e" }}>Committee Payment Requests</h3>

            {committeeDues.map((d) => (
              <div
                key={`committee-${d.id}`}
                style={{
                  marginTop: 12,
                  padding: 16,
                  borderRadius: 8,
                  background: "#ecfeff",
                  border: "1px solid #06b6d4",
                }}
              >
                <p>
                  <b>₹{d.amount}</b> due for{" "}
                  <b>{d.committee_name}</b> ({d.plan_name})
                </p>

                <small>
                  Universal request • Reminder every {d.repeat_after_minutes} minutes
                </small>

                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <button
                    onClick={async () => {
                      try {
                        const res = await apiFetch(
                          `/committee-dues/${d.id}/response/`,
                          {
                            method: "POST",
                          }
                        );

                        // redirect using backend response
                        navigate(`/pay/${res.user_committee_id}/${res.plan_id}`);
                      } catch (err) {
                        console.error(err);
                        alert("Failed to process payment request");
                      }
                    }}
                    style={{
                      padding: "8px 14px",
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Pay Now
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await apiFetch(`/committee-dues/${d.id}/response/`, {
                          method: "POST",
                          body: JSON.stringify({
                            action: "pay_later",
                          }),
                        });

                        // remove from UI after response is recorded
                        setCommitteeDues((prev) =>
                          prev.filter((x) => x.id !== d.id)
                        );
                      } catch (err) {
                        console.error(err);
                        alert("Failed to process Pay Later");
                      }
                    }}
                    style={{
                      padding: "8px 14px",
                      background: "#e5e7eb",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Pay Later
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && selectedPlan && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>Confirm Payment</h3>
              <button 
                className="payment-modal-close"
                onClick={() => setShowPaymentModal(false)}
                disabled={processingPayment}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="payment-modal-content">
              <p>You are about to make a payment for:</p>
              
              <div className="payment-details">
                <div className="payment-detail-row">
                  <span>Committee:</span>
                  <strong>{data.committee_name}</strong>
                </div>
                <div className="payment-detail-row">
                  <span>Plan:</span>
                  <strong>{selectedPlan.name}</strong>
                </div>
                <div className="payment-detail-row">
                  <span>Amount:</span>
                  <strong className="payment-amount">
                    {formatPrice(selectedPlan.amount, currency)}
                  </strong>
                </div>
                <div className="payment-detail-row">
                  <span>Type:</span>
                  <span className="payment-plan-type">{selectedPlan.type}</span>
                </div>
              </div>

              <p className="payment-note">
                This payment will be processed from your wallet balance.
              </p>
            </div>

            <div className="payment-modal-footer">
              <button
                className="payment-cancel-btn"
                onClick={() => setShowPaymentModal(false)}
                disabled={processingPayment}
              >
                Cancel
              </button>
              <button
                className="payment-confirm-btn"
                onClick={() => handlePayNow(userCommitteeId, selectedPlan)}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <i className="bi bi-hourglass-split"></i> Processing...
                  </>
                ) : (
                  <>
                    Confirm Payment <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .payment-modal {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .payment-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .payment-modal-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 20px;
        }

        .payment-modal-close {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 20px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .payment-modal-close:hover:not(:disabled) {
          background: #f1f5f9;
          color: #1e293b;
        }

        .payment-modal-close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .payment-modal-content {
          padding: 24px;
        }

        .payment-modal-content p {
          margin: 0 0 16px 0;
          color: #475569;
        }

        .payment-details {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
        }

        .payment-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px dashed #e2e8f0;
        }

        .payment-detail-row:last-child {
          border-bottom: none;
        }

        .payment-detail-row span {
          color: #64748b;
        }

        .payment-detail-row strong {
          color: #1e293b;
          font-size: 16px;
        }

        .payment-amount {
          color: #16a34a !important;
          font-size: 18px !important;
        }

        .payment-plan-type {
          background: #e6f7e6;
          color: #16a34a;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .payment-note {
          font-size: 13px;
          color: #64748b;
          background: #fff3cd;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }

        .payment-modal-footer {
          padding: 20px 24px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
        }

        .payment-cancel-btn {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .payment-cancel-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #9ca3af;
        }

        .payment-cancel-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .payment-confirm-btn {
          flex: 1;
          padding: 12px;
          background: #16a34a;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .payment-confirm-btn:hover:not(:disabled) {
          background: #15803d;
          transform: translateY(-1px);
        }

        .payment-confirm-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .payment-confirm-btn i {
          font-size: 16px;
        }

        @media (max-width: 480px) {
          .payment-modal {
            width: 95%;
          }

          .payment-modal-header {
            padding: 16px 20px;
          }

          .payment-modal-content {
            padding: 20px;
          }

          .payment-modal-footer {
            padding: 16px 20px 20px;
          }
        }
      `}</style>
    </div>
  );
}

/* 🔹 Small reusable component */
function StatBox({ label, value, highlight }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        background: highlight ? "#dcfce7" : "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <p style={{ color: "#6b7280" }}>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}