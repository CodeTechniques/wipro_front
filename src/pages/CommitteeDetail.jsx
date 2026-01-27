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
              onClick={() => {
                if (!btn.disabled) {
                  navigate(`/pay/${userCommitteeId}/${plan.id}`);
                }
              }}
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
                  <button
                    onClick={async () => {
                      await apiFetch(`/due-notifications/${d.id}/response/`, {
                        method: "POST",
                        body: JSON.stringify({
                          action: "pay_now",
                        }),
                      });

                      navigate(`/pay/${d.user_committee_id}/${d.plan_id}`);
                    }}
                  >
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
