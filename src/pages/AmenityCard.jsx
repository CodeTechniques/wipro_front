export default function AmenityCard({ label, name, checked, onChange, icon }) {
  return (
    <label className={`amenity-card ${checked ? "active" : ""}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <div className="amenity-icon">{icon}</div>
      <span>{label}</span>
    </label>
  );
}
