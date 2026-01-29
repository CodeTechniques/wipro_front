import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListingPaymentModal.css";

export default function PropertyCreationResultModal({ 
  open, 
  responseData 
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open && responseData) {
      // Auto-redirect after 3 seconds
      const timer = setTimeout(() => {
        handleRedirect();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open, responseData]);

  if (!open || !responseData) return null;

  const handleRedirect = () => {
    if (responseData.is_verified) {
      navigate("/my-properties", {
        state: { 
          message: "Payment of ₹1000 was deducted from your wallet successfully!" 
        }
      });
    } else {
      navigate("/pay", {
        state: {
          purpose: "property_listing",
          amount: 1000, // Always INR
          propertyId: responseData.id,
          message: "Please complete payment to list your property"
        }
      });
    }
  };

  const handleClose = () => {
    handleRedirect();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>
          {responseData.is_verified ? "✅ Payment Successful!" : "⚠️ Payment Required"}
        </h3>

        <div className="fee-details">
          <p><strong>Property Created:</strong> {responseData.title}</p>
          <p><strong>Property ID:</strong> {responseData.id}</p>
          <p><strong>Status:</strong> {responseData.status}</p>
        </div>

        {responseData.is_verified ? (
          <>
            <p className="success-text">
              ₹1000 has been deducted from your wallet successfully.
              Your property is now listed on the marketplace!
            </p>
            <p className="redirect-text">
              Redirecting to My Properties...
            </p>
          </>
        ) : (
          <>
            <p className="warning-text">
              You don't have sufficient balance in your wallet.
              Please complete the payment to list your property.
            </p>
            <p className="redirect-text">
              Redirecting to Payment Page...
            </p>
          </>
        )}

        <button className="btn-pay" onClick={handleClose}>
          {responseData.is_verified ? "Go to My Properties" : "Go to Payment"}
        </button>
      </div>
    </div>
  );
}