import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import "../styles/main.css";

export default function GroupInterestPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [groupSize, setGroupSize] = useState(2);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    apiFetch(`/properties/${propertyId}/`)
      .then(setProperty)
      .catch(() => alert("Property not found"))
      .finally(() => setLoading(false));
  }, [propertyId]);

  const sendGroupRequest = async () => {
    setProcessing(true);
    try {
      await apiFetch(`/properties/${propertyId}/group-request/`, {
        method: "POST",
        body: JSON.stringify({
          group_size: groupSize,
          message: `Group purchase request with ${groupSize} investors`,
        }),
      });

      alert("Group purchase request sent to owner");
      navigate("/buyer-dashboard");
    } catch (err) {
      alert(err.error || "Failed to send request");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!property) return null;

  return (
    <div className="container">
      <h2>Group Purchase Request</h2>

      <div className="card">
        <h3>{property.title}</h3>
        <p>{property.description}</p>
        <p>
          <strong>Price:</strong> ₹{property.price}
        </p>
      </div>

      <div className="card">
        <label>
          <strong>Number of investors (2–50)</strong>
        </label>

        <input
          type="number"
          min={2}
          max={50}
          value={groupSize}
          onChange={(e) => setGroupSize(Number(e.target.value))}
        />

        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          Owner approval is required before payment.
        </p>

        <button
          className="btn-primary"
          onClick={sendGroupRequest}
          disabled={processing}
        >
          {processing ? "Sending..." : "Send Group Request"}
        </button>
      </div>
    </div>
  );
}
