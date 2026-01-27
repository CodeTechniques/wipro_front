import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import MiniVerticalNav from "../components/MiniVerticalNav";

export default function MyPropertyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    apiFetch("/properties/property-requests/my/")
      .then(res => {
        setRequests(res.results || res); // ✅ FIX
      })
      .catch(err => {
        console.error(err);
        setRequests([]);
      });
  }, []);

  return (
    <div className="page">

      <div className="market-sidebar">
  <MiniVerticalNav />
</div>
      <h2>My Property Requests</h2>

      {requests.length === 0 && <p>No requests found.</p>}

      {Array.isArray(requests) &&
        requests.map(req => (
          <div key={req.id} className="card">
            <h4>{req.property_title}</h4>
            <p>
              Status: <b>{req.status.toUpperCase()}</b>
            </p>

            {req.status === "pending" && (
              <p>⏳ Waiting for owner approval</p>
            )}
            {req.status === "approved" && (
              <p>✅ Approved – owner will contact you</p>
            )}
            {req.status === "rejected" && (
              <p>❌ Rejected by owner</p>
            )}
          </div>
        ))}
    </div>
  );
}
