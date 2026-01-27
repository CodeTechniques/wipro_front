import "../styles/profile.css";

export default function ProfileCard({ data }) {
  const {
    profile_pic,
    first_name,
    last_name,
    email,
    phone_number,
    location,
    date_joined,
    kyc_status,
    account_id,
  } = data;

  const joined = new Date(date_joined).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* Avatar */}
        <div className={`avatar ${kyc_status === "approved" ? "verified" : ""}`}>
          <img
            src={profile_pic || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </div>

        <h2>{first_name} {last_name}</h2>

        {kyc_status === "approved" && (
          <span className="verified-badge">✔ Verified</span>
        )}

        <div className="details">
          <Detail label="Email Address" value={email} />
          <Detail label="Phone Number" value={phone_number || "Not provided"} />
          <Detail label="Location" value={location || "—"} />
          <Detail label="Member Since" value={joined} />
          <Detail label="Account ID" value={account_id || "—"} />
        </div>

        <button className="edit-btn">EDIT PROFILE</button>

        <p className="footer-text">
          Verified profile · Encrypted data
        </p>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
