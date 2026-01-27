import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import '../styles/main.css'


export default function PaymentPage() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [payable, setPayable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const generateGroupMembers = (groupSize, confirmedCount) => {
  return Array.from({ length: groupSize }).map((_, index) => {
    if (index < confirmedCount) {
      return { id: index + 1, status: "paid" };
    }
    if (index === confirmedCount) {
      return { id: index + 1, status: "you" };
    }
    return { id: index + 1, status: "pending" };
  });
};


  const [form, setForm] = useState({
    payer_name: "",
    payer_phone: "",
    note: "",
    force_fail: false, // fake failure switch
  });

  useEffect(() => {
    apiFetch(`/properties/plans/${planId}/payable/`)
      .then(setPayable)
      .catch(err => {
        alert(err.error || "Payment not allowed");
        navigate("/buyer-dashboard");
      })
      .finally(() => setLoading(false));
  }, [planId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const generateInvite = async () => {
  const res = await apiFetch(
    `/properties/plans/${planId}/share-invite/`,
    { method: "POST" }
  );
  navigator.clipboard.writeText(res.invite_link);
  alert("Invite link copied! Share it anywhere.");
};


  const submitPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await apiFetch(`/properties/plans/${planId}/pay/`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("Payment successful!");
      navigate(`/payment-success/${planId}`);
    } catch (err) {
      alert(err.error || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Loading payment details...</p>;
  if (!payable) return null;

  return (
    <div className="payment-container">
      <h2>Payment</h2>

      {/* ===== SUMMARY ===== */}
      /*<div className="payment-summary">
        <p><strong>Mode:</strong> {payable.mode}</p>
        <p><strong>Group Size:</strong> {payable.group_size}</p>

        <p><strong>Base Price:</strong> ₹{payable.base_price}</p>
        <p><strong>GST:</strong> {payable.gst_percent}%</p>
        <p><strong>Platform Fee:</strong> {payable.platform_percent}%</p>

        <hr />

        <p className="total">
          <strong>Your Payable:</strong> ₹{payable.your_payable}
        </p>

        <button onClick={generateInvite}>
  Share Group Invite
</button>


        <small>{payable.note}</small>
      </div>

      <h3>Payment Summary</h3>

<p>
  <strong>Mode:</strong>{" "}
  {payable.mode === "group" ? "Group Payment" : "Single Payment"}
</p>

<p><strong>Total Payable:</strong> ₹{payable.total_payable}</p>

{payable.mode === "group" && (
  <>
    <p><strong>Group Size:</strong> {payable.group_size}</p>
    <p><strong>Paid:</strong> {payable.confirmed_count}</p>
    <p><strong>Remaining:</strong> {payable.group_size - payable.confirmed_count}</p>
  </>
)}

<button
  onClick={() => navigate(`/invite-members/${planId}`)}
  style={{ marginBottom: 20 }}
>
  Invite Group Members
</button>


<p><strong>Your Payable:</strong> ₹{payable.your_payable}</p>



      {/* ===== FORM ===== */}
      /*<form onSubmit={submitPayment} className="payment-form">
        <input
          name="payer_name"
          placeholder="Payer Name"
          required
          onChange={handleChange}
        />

        <input
          name="payer_phone"
          placeholder="Payer Phone"
          required
          onChange={handleChange}
        />

        <textarea
          name="note"
          placeholder="Note (optional)"
          onChange={handleChange}
        />

        {/* Fake failure toggle (dev only) */}
       /* <label className="checkbox">
          <input
            type="checkbox"
            name="force_fail"
            onChange={handleChange}
          />
          Simulate Payment Failure
        </label>

        <button disabled={processing}>
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}





