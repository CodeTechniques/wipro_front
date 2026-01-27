import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function PaymentPage() {
  const { userCommitteeId } = useParams();
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [openMethodId, setOpenMethodId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [amounts, setAmounts] = useState({});       // ✅ amount per method
  const [screenshots, setScreenshots] = useState({}); // ✅ screenshot per method
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch(`/committee-detail/${userCommitteeId}/`)
      .then((res) => {
        setPaymentMethods(res.payment_methods);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userCommitteeId]);

  const handleAmountChange = (methodId, value) => {
    setAmounts((prev) => ({
      ...prev,
      [methodId]: value,
    }));
  };

  const handleScreenshotChange = (methodId, file) => {
    setScreenshots((prev) => ({
      ...prev,
      [methodId]: file,
    }));
  };

  const handlePaymentRequest = async (method) => {
    const amount = amounts[method.id];
    const screenshot = screenshots[method.id];

    // 🔐 VALIDATION
    if (!amount || Number(amount) <= 0) {
      setErrors((prev) => ({
        ...prev,
        [method.id]: "Please enter a valid amount",
      }));
      return;
    }

    if (!screenshot) {
      setErrors((prev) => ({
        ...prev,
        [method.id]: "Payment screenshot is required",
      }));
      return;
    }

    setErrors({});

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("user_committee_id", userCommitteeId);
      formData.append("payment_method_id", method.id);
      formData.append("amount", amount); // ✅ FIXED
      formData.append("payment_screenshot", screenshot);

      await apiFetch("/payment-request/", {
        method: "POST",
        body: formData,
      });

      navigate(`/payment-history/${userCommitteeId}`);
    } catch (err) {
      alert("Failed to submit payment request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "0 auto" }}>
      <h2>Make Payment</h2>

      <div style={{ marginTop: 20 }}>
        {paymentMethods.map((pm) => {
          const isOpen = openMethodId === pm.id;

          return (
            <div
              key={pm.id}
              style={{
                marginBottom: 14,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              {/* HEADER */}
              <div
                onClick={() => setOpenMethodId(isOpen ? null : pm.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  cursor: "pointer",
                  background: isOpen ? "#ecfdf5" : "#ffffff",
                }}
              >
                <div>
                  <h4 style={{ marginBottom: 4 }}>{pm.name}</h4>
                  <p style={{ fontSize: 14, color: "#6b7280" }}>
                    {pm.type.toUpperCase()}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 18,
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  ›
                </span>
              </div>

              {/* BODY */}
              <div
                style={{
                  maxHeight: isOpen ? 500 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                  background: "#f9fafb",
                }}
              >
                <div style={{ padding: 16 }}>
                  {/* AMOUNT */}
                  <label><b>Amount Paid</b></label>
                  <input
                    type="number"
                    value={amounts[pm.id] || ""}
                    onChange={(e) =>
                      handleAmountChange(pm.id, e.target.value)
                    }
                    placeholder="Enter amount"
                    style={{
                      width: "100%",
                      padding: 10,
                      marginTop: 6,
                      marginBottom: 12,
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                    }}
                  />

                  {/* METHOD DETAILS */}
                  {pm.type === "upi" && <p><b>UPI ID:</b> {pm.details.upi}</p>}
                  {pm.type === "bank" && (
                    <>
                      <p><b>Bank:</b> {pm.details.bank}</p>
                      <p><b>Account:</b> {pm.details.account}</p>
                      <p><b>IFSC:</b> {pm.details.ifsc}</p>
                    </>
                  )}
                  {pm.type === "usdt" && (
                    <p><b>USDT Address:</b> {pm.details.usdt}</p>
                  )}

                  {/* SCREENSHOT */}
                  <label style={{ marginTop: 12 }}>
                    <b>Payment Screenshot (required)</b>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleScreenshotChange(pm.id, e.target.files[0])
                    }
                    style={{ marginTop: 6 }}
                  />

                  {errors[pm.id] && (
                    <p style={{ color: "red", fontSize: 13 }}>
                      {errors[pm.id]}
                    </p>
                  )}

                  <button
                    disabled={submitting}
                    onClick={() => handlePaymentRequest(pm)}
                    style={{
                      marginTop: 16,
                      width: "100%",
                      padding: 14,
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    {submitting ? "Submitting..." : "I Have Paid"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
