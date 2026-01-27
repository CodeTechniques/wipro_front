import { Link } from "react-router-dom";

export default function MyCommitteeCard({ committee }) {
  return (
    <div className="card">
      <h3>{committee.name}</h3>

      <p><strong>Invested:</strong> ₹{committee.invested}</p>
      <p><strong>Days Active:</strong> {committee.days}</p>
      <p><strong>Interest Earned:</strong> ₹{committee.interest}</p>

      <p className={`status ${committee.status}`}>
        {committee.status.toUpperCase()}
      </p>

      <div className="actions">
        <Link to={`/committees/${committee.id}`}>View</Link>
        <Link to={`/committees/${committee.id}/withdraw`}>Withdraw</Link>
      </div>
    </div>
  );
}
