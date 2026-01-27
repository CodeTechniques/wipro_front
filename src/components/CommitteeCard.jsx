import { Link } from "react-router-dom";

export default function CommitteeCard({ committee }) {
  return (
    <div className="card">
      <h3>{committee.name}</h3>
      <p>Interest: 15% yearly</p>
      <p>Min Invest: ₹{committee.min_amount}</p>
      <p>Max Invest: ₹{committee.max_amount}</p>

      <Link to={`/committees/${committee.id}`}>
        View Details
      </Link>
    </div>
  );
}
