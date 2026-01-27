// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { apiFetch } from "../api/api";

// export default function CommitteeWithdraw() {
//   const { userCommitteeId } = useParams();
//   const navigate = useNavigate();

//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [methodId, setMethodId] = useState("");
//   const [details, setDetails] = useState("");
//   const [screenshot, setScreenshot] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // 🔒 STATIC PAYMENT METHODS (UI CONTROLLED)
//   const STATIC_METHODS = [
//     { type: "upi", label: "UPI" },
//     { type: "bank", label: "Bank Transfer" },
//     { type: "usdt", label: "USDT" },
//   ];

//   // 🔄 FETCH BACKEND METHODS (ONLY FOR ID MAPPING)
//   useEffect(() => {
//     apiFetch("/payment-methods/?for_withdrawal=true")
//       .then((data) => setPaymentMethods(data))
//       .finally(() => setLoading(false));
//   }, []);

//   // 🔁 MAP BACKEND METHODS BY TYPE
//   const methodByType = paymentMethods.reduce((acc, m) => {
//     acc[m.method_type] = m;
//     return acc;
//   }, {});

//   const submitWithdraw = async () => {
//     // 🔐 FRONTEND VALIDATION
//     if (!amount || !methodId || !details || !screenshot) {
//       setError("All fields including payment screenshot are required");
//       return;
//     }

//     setError("");

//     try {
//       setSubmitting(true);

//       const formData = new FormData();
//       formData.append("user_committee_id", userCommitteeId);
//       formData.append("amount", amount);
//       formData.append("payment_method_id", methodId);
//       formData.append("withdrawal_details", details);
//       formData.append("payment_screenshot", screenshot);

//       await apiFetch("/withdraw-request/", {
//         method: "POST",
//         body: formData, // 🔥 multipart/form-data
//       });

//       alert("Withdrawal request submitted");
//       navigate(`/payment-history/${userCommitteeId}`);
//     } catch (err) {
//       alert(err?.error || "Failed to submit withdrawal");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div style={{ maxWidth: 600, margin: "40px auto" }}>
//       <h2>Withdraw from Committee</h2>

//       {/* AMOUNT */}
//       <label>Amount</label>
//       <input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         style={{ width: "100%", padding: 10, marginBottom: 12 }}
//       />

//       {/* PAYMENT METHOD (STATIC UI) */}
//       <label>Payment Method</label>
//       <select
//         value={methodId}
//         onChange={(e) => setMethodId(e.target.value)}
//         style={{ width: "100%", padding: 10, marginBottom: 12 }}
//       >
//         <option value="">Select method</option>

//         {STATIC_METHODS.map((m) => {
//           const backendMethod = methodByType[m.type];
//           if (!backendMethod) return null;

//           return (
//             <option key={m.type} value={backendMethod.id}>
//               {m.label}
//             </option>
//           );
//         })}
//       </select>

//       {/* WITHDRAWAL DETAILS */}
//       <label>Withdrawal Details (UPI / Bank / Wallet)</label>
//       <textarea
//         value={details}
//         onChange={(e) => setDetails(e.target.value)}
//         rows={4}
//         style={{ width: "100%", padding: 10, marginBottom: 12 }}
//       />

//       {/* SCREENSHOT (MANDATORY) */}
//       <label>Payment Screenshot (required)</label>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => {
//           setScreenshot(e.target.files[0]);
//           setError("");
//         }}
//         style={{ width: "100%", marginBottom: 8 }}
//       />

//       {error && (
//         <p style={{ color: "red", fontSize: 14, marginBottom: 8 }}>
//           {error}
//         </p>
//       )}

//       {/* SUBMIT */}
//       <button
//         onClick={submitWithdraw}
//         disabled={submitting || !screenshot}
//         style={{
//           marginTop: 20,
//           width: "100%",
//           padding: 14,
//           background: "#dc2626",
//           color: "#fff",
//           border: "none",
//           borderRadius: 8,
//           fontSize: 16,
//           cursor: submitting || !screenshot ? "not-allowed" : "pointer",
//           opacity: submitting || !screenshot ? 0.6 : 1,
//         }}
//       >
//         {submitting ? "Submitting..." : "Request Withdrawal"}
//       </button>
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function CommitteeWithdraw() {
  const { userCommitteeId } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [userPaymentMethod, setUserPaymentMethod] = useState("");

  // 🔥 METHOD-SPECIFIC STATES
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitWithdraw = async () => {
    if (!amount || !userPaymentMethod) {
      setError("Amount and withdrawal method are required");
      return;
    }

    let withdrawalDetails = "";

    // 🔥 BUILD DETAILS BASED ON METHOD
    if (userPaymentMethod === "upi") {
      if (!upiId) {
        setError("UPI ID is required");
        return;
      }
      withdrawalDetails = `UPI ID: ${upiId}`;
    }

    if (userPaymentMethod === "bank") {
      if (!bankName || !bankAccount || !bankIfsc) {
        setError("All bank details are required");
        return;
      }
      withdrawalDetails = `
Account Holder Name: ${bankName}
Account Number: ${bankAccount}
IFSC Code: ${bankIfsc}
      `.trim();
    }

    if (userPaymentMethod === "usdt") {
      if (!usdtAddress) {
        setError("USDT wallet address is required");
        return;
      }
      withdrawalDetails = `USDT Address: ${usdtAddress}`;
    }

    setError("");

    try {
      setSubmitting(true);

      const payload = {
        user_committee_id: userCommitteeId,
        amount,
        user_payment_method: userPaymentMethod,
        withdrawal_details: withdrawalDetails,
      };

      await apiFetch("/withdraw-request/", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Committee withdrawal request submitted");
      navigate(`/payment-history/${userCommitteeId}`);
    } catch (err) {
      alert(err?.error || "Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 30 }}>
      <h2>Withdraw from Committee</h2>

      {/* AMOUNT */}
      <label>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 16 }}
      />

      {/* METHOD */}
      <label>Withdrawal Method</label>
      <select
        value={userPaymentMethod}
        onChange={(e) => {
          setUserPaymentMethod(e.target.value);
          setError("");
        }}
        style={{ width: "100%", padding: 10, marginBottom: 16 }}
      >
        <option value="">Select method</option>
        <option value="upi">UPI</option>
        <option value="bank">Bank Transfer</option>
        <option value="usdt">USDT</option>
      </select>

      {/* 🔥 UPI */}
      {userPaymentMethod === "upi" && (
        <>
          <label>Enter your UPI ID</label>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="example@upi"
            style={{ width: "100%", padding: 10, marginBottom: 16 }}
          />
        </>
      )}

      {/* 🔥 BANK */}
      {userPaymentMethod === "bank" && (
        <>
          <label>Account Holder Name</label>
          <input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <label>Account Number</label>
          <input
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <label>IFSC Code</label>
          <input
            value={bankIfsc}
            onChange={(e) => setBankIfsc(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 16 }}
          />
        </>
      )}

      {/* 🔥 USDT */}
      {userPaymentMethod === "usdt" && (
        <>
          <label>USDT Wallet Address</label>
          <input
            value={usdtAddress}
            onChange={(e) => setUsdtAddress(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 16 }}
          />
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={submitWithdraw}
        disabled={submitting}
        style={{
          width: "100%",
          padding: 14,
          background: "#dc2626",
          color: "#fff",
          borderRadius: 8,
          border: "none",
          marginTop: 20,
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Submitting..." : "Request Withdrawal"}
      </button>
    </div>
  );
}
