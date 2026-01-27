import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api/api";

import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function JoinCommitteeModal({ committee, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { currency } = useCurrency(); // ✅ GLOBAL CURRENCY

  if (!committee) return null;

  const handleJoin = async () => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/committees/${committee.id}/join/`, {
        method: "POST",
      });

       navigate(`/join-success/${committee.id}`);
      //navigate(`/my-committee/${userCommitteeId}`);
    } catch (err) {
      setError(err.error || "Failed to join committee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>Join {committee.name}</h2>
        <p className="subtitle">Confirm your investment details</p>

        <div className="summary-box">
          {committee.daily_amount && (
            <div className="row">
              <span>Daily Investment</span>
              <strong>
                {formatPrice(committee.daily_amount, currency)}
              </strong>
            </div>
          )}

          {committee.monthly_amount && (
            <div className="row">
              <span>Monthly Investment</span>
              <strong>
                {formatPrice(committee.monthly_amount, currency)}
              </strong>
            </div>
          )}

          <div className="row">
            <span>Duration</span>
            <strong>{committee.duration_months} months</strong>
          </div>

          <div className="row total">
            <span>Total Return</span>
            <strong className="green">
              {formatPrice(committee.expected_total_return, currency)}
            </strong>
          </div>
        </div>

        <ul className="benefits">
          <li>
            <i className="bi bi-check-circle-fill"></i>
            Guaranteed {committee.roi_percent}% returns
          </li>
          <li>
            <i className="bi bi-bank"></i>
            Eligible for loan after 3 months
          </li>
          <li>
            <i className="bi bi-shield-check"></i>
            100% secure and transparent
          </li>
        </ul>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="confirm-btn"
          onClick={handleJoin}
          disabled={loading}
        >
          {loading ? "Joining..." : "Confirm & Join Committee"}
        </button>
      </div>
    </div>
  );
}
