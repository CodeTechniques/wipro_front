import "./ListingPaymentModal.css";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

const LISTING_FEE = 1000; // INR (base)
const USD_RATE = 89;     // 1 USD = 89 INR

export default function ListingPaymentModal({ open, onClose }) {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  if (!open) return null;

  const formatAmount = (amount) => {
    if (currency === "INR") {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
    return `$${(amount / USD_RATE).toFixed(2)}`;
  };

  const handlePay = () => {
    navigate("/pay", {
      state: {
        purpose: "property_listing",
        amount: LISTING_FEE, // 🔥 always INR
      },
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>List Your Property</h3>

        <p>
          To list your property on the marketplace, please pay the listing fee.
        </p>

        <button className="btn-pay" onClick={handlePay}>
          Pay {formatAmount(LISTING_FEE)} to list your property
        </button>

        {currency !== "INR" && (
          <small className="currency-note">
            * You will be charged in INR at checkout
          </small>
        )}

        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
