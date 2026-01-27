import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import "./owner-dashboard.css";

export default function OwnerDashboard() {
  const [requested, setRequested] = useState([]);
  const [activeDeals, setActiveDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/properties/interests/received/")
      .then((data) => {
        const items = data.results || [];

        setRequested(items.filter(i => i.status === "requested"));
        setActiveDeals(items.filter(i => i.status === "accepted"));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const respond = async (id, action) => {
    try {
      await apiFetch(`/properties/interests/${id}/respond/`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });

      // Move item between sections
      setRequested(prev => prev.filter(i => i.id !== id));

      if (action === "accept") {
        const accepted = requested.find(i => i.id === id);
        if (accepted) {
          setActiveDeals(prev => [
            { ...accepted, status: "accepted" },
            ...prev,
          ]);
        }
      }
    } catch (err) {
      alert(err.detail || "Action failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="owner-container">
      <h2>Owner Dashboard</h2>

      {/* ================= REQUESTED ================= */}
      <section>
        <h3>Interest Requests</h3>

        {requested.length === 0 && <p>No new requests.</p>}

        {requested.map(i => (
          <div key={i.id} className="interest-card">
            <p><strong>Property:</strong> {i.property.title}</p>
            <p><strong>User:</strong> {i.requester.username}</p>
            <p><strong>Mode:</strong> {i.plan.mode}</p>
            <p><strong>Message:</strong> {i.message || "—"}</p>

            <div className="actions">
              <button
                className="accept"
                onClick={() => respond(i.id, "accept")}
              >
                Accept
              </button>
              <button
                className="reject"
                onClick={() => respond(i.id, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= ACTIVE DEALS ================= */}
      <section>
        <h3>Active Deals (Payment Pending)</h3>

        {activeDeals.length === 0 && <p>No active deals.</p>}

        {activeDeals.map(i => (
          <div key={i.id} className="interest-card active">
            <p><strong>Property:</strong> {i.property.title}</p>
            <p><strong>Buyer:</strong> {i.requester.username}</p>
            <p><strong>Mode:</strong> {i.plan.mode}</p>
            <p><strong>Plan Status:</strong> {i.plan.status}</p>

            <p>
              <strong>Payment:</strong>{" "}
              {i.plan.confirmed_count} / {i.plan.group_size} paid
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
