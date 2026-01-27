import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";



const LoanDetails = () => {
  const [data, setData] = useState(null);
  const [emis, setEmis] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dues, setDues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dueNotifications, setDueNotifications] = useState([]);
  const [committeeDues, setCommitteeDues] = useState([]);


  // ✅ normal async function (NO hooks)
  const loadLoan = async () => {
    const res = await apiFetch("/loans/user-loan/");
    setData(res);
  };

  // ✅ normal async function (NO hooks)
  const loadEmis = async () => {
    const res = await apiFetch("/loans/emis/");
    if (res.has_loan) {
      setEmis(res.emis);
    }
  };

  useEffect(() => {
  apiFetch("/universal-dues/")
    .then(setDues)
    .catch(console.error);
}, []);

 /* 🔹 Fetch notifications */
  useEffect(() => {
    apiFetch("/notifications/").then(setNotifications).catch(console.error);
  }, []);

  // ✅ hooks ONLY here
  useEffect(() => {
    const loadAll = async () => {
      try {
        await loadLoan();
        await loadEmis();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const payEmi = (emi) => {
  navigate("/pay", {
    state: {
      payment_id: emi.id,
    },
  });
};


  if (loading) return <p>Loading...</p>;
  if (!data || !data.has_loan) return <p>No active loan found.</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "50px auto" }}>
      <h2>Loan Wallet</h2>

      {/* 🔹 3 BOXES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginTop: 30,
        }}
      >
        <div className="wallet-box">
          <p>Loan Amount</p>
          <h2>₹{data.loan_amount}</h2>
        </div>

        <div className="wallet-box">
          <p>Amount Paid</p>
          <h2>₹{data.amount_paid}</h2>
        </div>

        <div className="wallet-box highlight">
          <p>EMI Amount</p>
          <h2>₹{data.emi_amount}</h2>
        </div>
      </div>

      {/* 🔹 EMI TABLE */}
      <h3 style={{ marginTop: 40 }}>EMI Schedule</h3>

      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {emis.map((emi) => (
            <tr key={emi.id}>
              <td>{emi.due_date}</td>
              <td>₹{emi.amount}</td>
              <td>{emi.status}</td>
              <td>
                {emi.status === "pending" ? (
                  <button
                    onClick={() => payEmi(emi)}
                    style={{
                      background: "#22c55e",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Pay Now
                  </button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                  <b>₹{d.amount}</b> due for <b>{d.committee_name}</b> (
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

{dues.length > 0 && (
  <div style={{ marginBottom: 30 }}>
    <h3 style={{ color: "#dc2626" }}>Important Notices</h3>

    {dues.map((d) => (
      <div
        key={d.id}
        style={{
          marginTop: 12,
          padding: 16,
          borderRadius: 8,
          border: "1px solid #fca5a5",
          background: "#fff1f2",
        }}
      >
        <h4>{d.heading}</h4>
        <p>{d.description}</p>

        {d.amount && (
          <p style={{ fontWeight: 600 }}>
            Amount: ₹{d.amount}
          </p>
        )}

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <button
            onClick={async () => {
              const res = await apiFetch(
                `/universal-dues/${d.id}/response/`,
                {
                  method: "POST",
                  body: JSON.stringify({ action: "pay_now" }),
                }
              );

              navigate("/pay", {
                state: {
                  amount: res.amount,
                  context: res.context,
                  reference_id: res.reference_id,
                },
              });
            }}
            style={{
              padding: "8px 14px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
            }}
          >
            Pay Now
          </button>

          <button
            onClick={async () => {
              await apiFetch(
                `/universal-dues/${d.id}/response/`,
                {
                  method: "POST",
                  body: JSON.stringify({ action: "pay_later" }),
                }
              );

              setDues((prev) => prev.filter((x) => x.id !== d.id));
            }}
            style={{
              padding: "8px 14px",
              background: "#e5e7eb",
              border: "none",
              borderRadius: 6,
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
};

export default LoanDetails;
