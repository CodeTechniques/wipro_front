// import { useEffect, useState } from "react";
// import { apiFetch } from "../api/api";
// import { useCurrency } from "../context/CurrencyContext";

// function StatusBadge({ status }) {
//   const colors = {
//     pending: "#f59e0b",
//     approved: "#16a34a",
//     rejected: "#dc2626",
//     overdue: "#6b7280",
//   };

//   return (
//     <span
//       style={{
//         padding: "4px 10px",
//         borderRadius: 20,
//         fontSize: 12,
//         color: "#fff",
//         background: colors[status] || "#6b7280",
//       }}
//     >
//       {status.toUpperCase()}
//     </span>
//   );
// }

// export default function PaymentHistory() {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { currency, rate } = useCurrency();

//   const formatAmount = (amount) => {
//     const value = Number(amount || 0);

//     if (currency === "INR") {
//       return `₹${value.toLocaleString("en-IN")}`;
//     }

//     return `${currency} ${(value / rate).toFixed(2)}`;
//   };

//   useEffect(() => {
//     apiFetch("/payment-history/")
//       .then((res) => {
//         setPayments(res);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

//   return (
//     <div style={{ maxWidth: 900, margin: "0 auto", padding: 30 }}>
//       <h2>Payment History</h2>

//       {payments.length === 0 && <p>No payments yet</p>}

//       {payments.map((p) => (
//         <div
//           key={p.id}
//           style={{
//             marginTop: 16,
//             padding: 16,
//             borderRadius: 10,
//             border: "1px solid #e5e7eb",
//             background: "#fff",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{formatAmount(p.amount)}</strong>
//             <StatusBadge status={p.status} />
//           </div>

//           {/* BACKEND PAYMENT METHOD (ADMIN SIDE) */}
//           <p>
//             <b>System Method:</b> {p.payment_method || "—"}
//           </p>

//           {/* 🔥 USER PAYMENT METHOD (WITHDRAW ONLY) */}
//           {p.request_type === "withdraw" && (
//   <>
//     <p>
//       <b>User Withdrawal Method:</b>{" "}
//       {p.user_payment_method_details || "—"}
//     </p>
//   </>
// )}


//           <p>
//             <b>Type:</b>{" "}
//             {p.request_type === "deposit" ? "DEPOSIT" : "WITHDRAW"}
//           </p>

//           <p>
//             <b>Date:</b> {p.created_at}
//           </p>

//           {p.admin_message && (
//             <p style={{ marginTop: 8 }}>
//               <b>Admin:</b> {p.admin_message}
//             </p>
//           )}

//           {currency !== "INR" && (
//             <small style={{ color: "#6b7280" }}>
//               * Charged in INR
//             </small>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";

const USD_RATE = 89; // ✅ 1 USD = 89 INR

function StatusBadge({ status }) {
  const colors = {
    pending: "#f59e0b",
    approved: "#16a34a",
    rejected: "#dc2626",
    overdue: "#6b7280",
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        color: "#fff",
        background: colors[status] || "#6b7280",
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currency } = useCurrency();

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    if (currency === "INR") {
      return `₹${value.toLocaleString("en-IN")}`;
    }

    // USD conversion
    return `$${(value / USD_RATE).toFixed(2)}`;
  };

  useEffect(() => {
    apiFetch("/payment-history/")
      .then((res) => {
        setPayments(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 30 }}>
      <h2>Payment History</h2>

      {payments.length === 0 && <p>No payments yet</p>}

      {payments.map((p) => (
        <div
          key={p.id}
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{formatAmount(p.amount)}</strong>
            <StatusBadge status={p.status} />
          </div>

          <p>
            <b>Type:</b>{" "}
            {p.request_type === "deposit" ? "DEPOSIT" : "WITHDRAW"}
          </p>

          <p>
            <b>Date:</b> {p.created_at}
          </p>

          {p.admin_message && (
            <p style={{ marginTop: 8 }}>
              <b>Admin:</b> {p.admin_message}
            </p>
          )}

          {currency !== "INR" && (
            <small style={{ color: "#6b7280" }}>
              * Amount shown in USD (charged in INR)
            </small>
          )}
        </div>
      ))}
    </div>
  );
}
