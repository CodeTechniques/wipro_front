import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";


export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const navigate = useNavigate();
  const [mode, setMode] = useState("single");
  const [groupSize, setGroupSize] = useState(2);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiFetch(`/properties/${id}/`).then(setProperty);
    apiFetch("/properties/users/").then(setUsers);
  }, [id]);

  const sendInterest = async () => {
    try {
      let payload;

      if (mode === "group") {
        // exclude self automatically
        const invited = users
          .slice(0, groupSize - 1)
          .map(u => u.id);

        payload = {
          mode: "group",
          group_size: Number(groupSize),
          invited_user_ids: invited,
          message: `Group purchase with ${groupSize} users`,
        };
      } else {
        payload = {
          mode: "single",
          message: "Single purchase request",
        };
      }

      await apiFetch(`/properties/${id}/interest/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Interest sent successfully");
    } catch (err) {
      alert(err.error || err.detail || "Invalid request");
    }
  };

  if (!property) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>{property.title}</h2>
      <p>{property.description}</p>
      <p>₹ {property.price}</p>

      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="single">Single Payment</option>
        <option value="group">Group Payment</option>
      </select>

      {mode === "group" && (
        <input
          type="number"
          min={2}
          max={50}
          value={groupSize}
          onChange={e => setGroupSize(Number(e.target.value))}
        />
      )}

      <button onClick={sendInterest}>Send Interest</button>

      <button
  className="btn-primary"
  onClick={() => navigate(`/group-interest/${property.id}`)}
>
  Group Purchase
</button>

    </div>
  );
}
