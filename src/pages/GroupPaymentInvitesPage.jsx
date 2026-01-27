import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function GroupPaymentInvitesPage() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/properties/group-invites/")
      .then(data => {
        setInvites(data.results || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const respond = async (inviteId, action) => {
    try {
      const res = await apiFetch(
        `/group-payment-invites/${inviteId}/respond/`,
        {
          method: "POST",
          body: JSON.stringify({ action }),
        }
      );

      // redirect on accept
      if (res.redirect) {
        navigate(res.redirect);
        return;
      }

      setInvites(prev =>
        prev.map(inv =>
          inv.id === inviteId ? { ...inv, status: action } : inv
        )
      );
    } catch (err) {
      alert(err.error || "Action failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Group Payment Requests</h2>

      {invites.length === 0 && <p>No pending invites</p>}

      {invites.map(invite => (
        <div key={invite.id} className="card">
          <h4>{invite.property.title}</h4>
          <p>Status: {invite.status}</p>

          {invite.status === "pending" && (
            <>
              <button onClick={() => respond(invite.id, "accept")}>
                Accept
              </button>
              <button onClick={() => respond(invite.id, "reject")}>
                Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
