import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api/api";
import "../styles/profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    location: "",
  });

  useEffect(() => {
    apiFetch("/auth/profile-details/")
      .then((data) => {
        setProfile(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          location: data.location || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("profile_pic", file);

    await apiFetch("/auth/profile-details/", {
      method: "PATCH",
      body: fd,
    });

    window.location.reload();
  };

  const saveProfile = async () => {
  const fd = new FormData();
  fd.append("first_name", form.first_name);
  fd.append("last_name", form.last_name);
  fd.append("location", form.location);

  await apiFetch("/auth/profile-details/", {
    method: "PATCH",
    body: fd,   // ✅ FormData, NOT JSON
  });

  window.location.reload();
};


  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!profile) return null;

  const joined = new Date(profile.date_joined).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* Avatar */}
        <div
          className={`avatar ${profile.kyc_status === "approved" ? "verified" : ""}`}
          onClick={() => fileRef.current.click()}
        >
          <img
            src={profile.profile_pic || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        <h2>{profile.first_name} {profile.last_name}</h2>

        {profile.kyc_status === "approved" && (
          <span className="verified-badge">✔ Verified</span>
        )}

        <div className="details">
          <Detail label="Email Address" value={profile.email} />
          <Detail label="Phone Number" value={profile.phone_number || "—"} />
          <Detail label="Location" value={profile.location || "—"} />
          <Detail label="Member Since" value={joined} />
          <Detail label="Account ID" value={profile.account_id || "—"} />
        </div>

        <button className="edit-btn" onClick={() => setEditing(true)}>
          EDIT PROFILE
        </button>

        <p className="footer-text">
          Verified profile · Encrypted data
        </p>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Profile</h3>

            <input
              placeholder="First name"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
            />

            <input
              placeholder="Last name"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
            />

            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={saveProfile}>Save</button>
              <button className="cancel" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
