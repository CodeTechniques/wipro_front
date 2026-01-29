import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import "./ListingPaymentModal.css"; // Reuse same CSS

const LISTING_FEE = 1000; // INR
const USD_RATE = 89;

export default function PropertyCreationConfirmationModal({ 
  open, 
  onClose, 
  onSubmit 
}) {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  if (!open) return null;

  const formatAmount = (amount) => {
    if (currency === "INR") {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
    return `$${(amount / USD_RATE).toFixed(2)}`;
  };

  const handleConfirm = () => {
    onSubmit();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Confirm Property Creation</h3>
        
        <div className="fee-details">
          <p><strong>Property Listing Fee:</strong> {formatAmount(LISTING_FEE)}</p>
          {currency !== "INR" && (
            <p className="currency-note">
              * Equivalent to ₹{LISTING_FEE.toLocaleString("en-IN")} INR
            </p>
          )}
        </div>

        <p className="warning-text">
          ⚠️ {LISTING_FEE.toLocaleString("en-IN")} INR will be deducted from your wallet balance.
          If you have insufficient balance, you'll be redirected to payment page.
        </p>

        <div className="modal-actions">
          <button className="btn-pay" onClick={handleConfirm}>
            Confirm & Create Property
          </button>
          
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}