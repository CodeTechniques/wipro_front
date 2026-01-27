import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

  const [amount, setAmount] = useState("");
  const [userPaymentMethod, setUserPaymentMethod] = useState("");

  // 🔥 METHOD-SPECIFIC STATES
  const [upiId, setUpiId] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* 🔹 Fetch wallet (net balance) */
  useEffect(() => {
    apiFetch("/me/")
      .then((res) => {
        setWallet(res);
        setLoadingWallet(false);
      })
      .catch(() => setLoadingWallet(false));
  }, []);

  const resetMethodFields = () => {
    setUpiId("");
    setUsdtAddress("");
    setBankName("");
    setBankAccount("");
    setBankIfsc("");
  };

  const handleWithdraw = async () => {
    let withdrawalDetails = "";

    if (!amount || !userPaymentMethod) {
      setError("Amount and withdrawal method are required");
      return;
    }

    if (wallet && Number(amount) > Number(wallet.net_balance)) {
      setError("Withdrawal amount exceeds available balance");
      return;
    }

    // 🔥 BUILD DETAILS BASED ON METHOD
    if (userPaymentMethod === "upi") {
      if (!upiId) {
        setError("UPI ID is required");
        return;
      }
      withdrawalDetails = `UPI ID: ${upiId}`;
    }

    if (userPaymentMethod === "usdt") {
      if (!usdtAddress) {
        setError("USDT wallet address is required");
        return;
      }
      withdrawalDetails = `USDT Address: ${usdtAddress}`;
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

    setError("");

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("request_type", "withdraw");
      formData.append("user_payment_method", userPaymentMethod);
      formData.append("withdrawal_details", withdrawalDetails);

      await apiFetch("/all-payment-request/", {
        method: "POST",
        body: formData,
      });

      alert("Withdrawal request submitted. Awaiting admin approval.");
      navigate("/payment-history");
    } catch (err) {
      alert(err?.error || "Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingWallet) {
    return <p style={{ padding: 40 }}>Loading wallet...</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 30 }}>
      <h2>Withdraw Funds</h2>

      {/* NET BALANCE */}
      {wallet && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <p style={{ margin: 0, fontSize: 14 }}>Available Balance</p>
          <h3>{formatPrice(wallet.net_balance, currency)}</h3>
        </div>
      )}

      {/* AMOUNT */}
      <label>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter withdrawal amount"
        style={{ width: "100%", padding: 10, marginBottom: 16 }}
      />

      {/* METHOD */}
      <label>Withdrawal Method</label>
      <select
        value={userPaymentMethod}
        onChange={(e) => {
          setUserPaymentMethod(e.target.value);
          resetMethodFields();
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
            placeholder="Enter account holder name"
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <label>Account Number</label>
          <input
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="Enter account number"
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <label>IFSC Code</label>
          <input
            value={bankIfsc}
            onChange={(e) => setBankIfsc(e.target.value)}
            placeholder="Enter IFSC code"
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
            placeholder="Enter USDT wallet address"
            style={{ width: "100%", padding: 10, marginBottom: 16 }}
          />
        </>
      )}

      {error && (
        <p style={{ color: "red", marginBottom: 12 }}>
          {error}
        </p>
      )}

      <button
        onClick={handleWithdraw}
        disabled={submitting}
        style={{
          width: "100%",
          padding: 14,
          background: "#dc2626",
          color: "#fff",
          borderRadius: 8,
          border: "none",
          fontSize: 16,
        }}
      >
        {submitting ? "Submitting..." : "Request Withdrawal"}
      </button>
    </div>
  );
}
