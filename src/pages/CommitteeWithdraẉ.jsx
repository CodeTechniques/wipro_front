// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiFetch } from "../api/api";

// export default function CommitteeWithdraw() {
//   const { userCommitteeId } = useParams(); // ✅ comes as string
//   const navigate = useNavigate();

//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [methodId, setMethodId] = useState("");
//   const [details, setDetails] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   /* 🔹 Load withdrawal-enabled payment methods */
//   useEffect(() => {
//     apiFetch("/payment-methods/?for_withdrawal=true")
//       .then(setPaymentMethods)
//       .catch(() => alert("Failed to load payment methods"))
//       .finally(() => setLoading(false));
//   }, []);

//   const submitWithdraw = async () => {
//     if (!amount || Number(amount) <= 0) {
//       alert("Enter a valid amount");
//       return;
//     }

//     if (!methodId) {
//       alert("Select a payment method");
//       return;
//     }

//     if (!details.trim()) {
//       alert("Enter withdrawal details");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await apiFetch("/withdraw-request/", {
//         method: "POST",
//         body: JSON.stringify({
//           user_committee_id: Number(userCommitteeId), // ✅ CRITICAL FIX
//           amount: Number(amount),                     // ✅ ensure Decimal-safe
//           payment_method_id: Number(methodId),        // ✅ ensure int
//           withdrawal_details: details.trim(),
//         }),
//       });

//       alert("Withdrawal request submitted successfully");
//       navigate(`/payment-history/${userCommitteeId}`);
//     } catch (err) {
//       alert(err?.error || "Failed to submit withdrawal");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

//   return (
//     <div
//       style={{
//         maxWidth: 600,
//         margin: "40px auto",
//         padding: 24,
//         borderRadius: 12,
//         border: "1px solid #e5e7eb",
//         background: "#fff",
//       }}
//     >
//       <h2 style={{ marginBottom: 20 }}>Wit Committee</h2>

//       {/* AMOUNT */}
//       <label>Amount</label>
//       <input
//         type="number"
//         min="1"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         placeholder="Enter amount"
//         style={{ width: "100%", padding: 10, marginBottom: 14 }}
//       />

//       {/* METHOD */}
//       <label>Payment Method</label>
//       <select
//         value={methodId}
//         onChange={(e) => setMethodId(e.target.value)}
//         style={{ width: "100%", padding: 10, marginBottom: 14 }}
//       >
//         <option value="">Select method</option>
//         {paymentMethods.map((pm) => (
//           <option key={pm.id} value={pm.id}>
//             {pm.name} ({pm.method_type.toUpperCase()})
//           </option>
//         ))}
//       </select>

//       {/* DETAILS */}
//       <label>Withdrawal Details</label>
//       <textarea
//         value={details}
//         onChange={(e) => setDetails(e.target.value)}
//         rows={4}
//         placeholder="UPI ID / Bank details / Wallet address"
//         style={{ width: "100%", padding: 10 }}
//       />

//       {/* SUBMIT */}
//       <button
//         onClick={submitWithdraw}
//         disabled={submitting}
//         style={{
//           marginTop: 20,
//           width: "100%",
//           padding: 14,
//           background: submitting ? "#9ca3af" : "#dc2626",
//           color: "#fff",
//           border: "none",
//           borderRadius: 8,
//           fontSize: 16,
//           cursor: submitting ? "not-allowed" : "pointer",
//         }}
//       >
//         {submitting ? "Submitting..." : "Request Withdrawal"}
//       </button>
//     </div>
//   );
// }
