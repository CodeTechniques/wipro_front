import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function InviteMembersPage() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  /* ======================
     SEARCH USERS
  ======================= */
  const handleSearch = (value) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await apiFetch(
          `/properties/users/search/?q=${value}`
        );
        setUsers(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  /* ======================
     SEND INVITE
  ======================= */
  const sendInvite = async (userId, username) => {
    try {
      await apiFetch(`/properties/plans/${planId}/invite-user/`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
      });

      alert(`Invite sent to ${username}`);
    } catch (err) {
      alert(err.error || "Invite failed");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Invite Group Members</h2>

      <input
        placeholder="Search username"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      {loading && <p>Searching...</p>}

      {users.length > 0 && (
        <div style={{ border: "1px solid #ccc", marginTop: 10 }}>
          {users.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8,
                borderBottom: "1px solid #eee",
              }}
            >
              <span>@{u.username}</span>
              <button onClick={() => sendInvite(u.id, u.username)}>
                Send Request
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        style={{ marginTop: 20 }}
        onClick={() => navigate(-1)}
      >
        Back to Payment
      </button>
    </div>
  );
}
