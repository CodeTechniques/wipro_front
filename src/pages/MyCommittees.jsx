import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";


export default function MyCommittees() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    apiFetch("/my-committees/")
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2>My Committees</h2>

      <p style={{ marginTop: 10 }}>
        You have joined <b>{data.count}</b> committee(s)
      </p>

      <div style={{ marginTop: 20 }}>
        {data.committees.length === 0 && (
          <p>You have not joined any committee yet.</p>
        )}

        {data.committees.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              background: "#fff",
            }}
          >
            <h3>{c.committee_name}</h3>
            <p><b>Total Invested:</b> ₹{c.total_invested}</p>
            <p><b>Status:</b> {c.is_active ? "Active" : "Closed"}</p>
            <button
  onClick={() => navigate(`/my-committee/${c.id}`)}
  style={{ marginTop: 10 }}
>
  View Details
</button>

          </div>
        ))}
      </div>
    </div>
  );
}
