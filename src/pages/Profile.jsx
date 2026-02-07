import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PencilSimple, CheckCircle, Calendar, MapPin, Phone, Envelope, IdentificationCard, ShieldCheck } from "phosphor-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    location: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiFetch("/auth/profile-details/");
      setProfile(data);
      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        location: data.location || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const fd = new FormData();
      fd.append("profile_pic", file);

      await apiFetch("/auth/profile-details/", {
        method: "PATCH",
        body: fd,
      });

      toast.success('Profile picture updated successfully');
      fetchProfile(); // Refresh profile data
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const saveProfile = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("first_name", form.first_name.trim());
      fd.append("last_name", form.last_name.trim());
      fd.append("location", form.location.trim());

      await apiFetch("/auth/profile-details/", {
        method: "PATCH",
        body: fd,
      });

      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      toast.error(error?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <p>Failed to load profile. Please try again.</p>
      </div>
    );
  }

  const joinedDate = new Date(profile.date_joined);
  const formattedDate = joinedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric"
  });

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="profile-wrapper">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your personal information</p>
          </div>

          {/* Main Profile Card */}
          <div className="profile-card">
            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <div className={`avatar-container ${profile.kyc_status === "approved" ? "verified" : ""}`}>
                <div 
                  className="avatar-wrapper"
                  onClick={() => fileRef.current.click()}
                >
                  <img
                    src={profile.profile_pic || "/avatar-placeholder.png"}
                    alt="Profile"
                    className="avatar-image"
                  />
                  <div className="avatar-overlay">
                    <PencilSimple size={24} weight="bold" />
                  </div>
                </div>
                {profile.kyc_status === "approved" && (
                  <div className="verification-badge">
                    <CheckCircle size={16} weight="fill" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => uploadImage(e.target.files[0])}
              />

              <div className="profile-name-section">
                <h2 className="profile-name">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="profile-email">{profile.email}</p>
                <button 
                  className="edit-profile-btn"
                  onClick={() => setEditing(true)}
                >
                  <PencilSimple size={18} />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="profile-details-grid">
              <DetailItem 
                icon={<Envelope size={20} weight="duotone" />}
                label="Email Address"
                value={profile.email}
              />
              
              <DetailItem 
                icon={<Phone size={20} weight="duotone" />}
                label="Phone Number"
                value={profile.phone_number || "Not provided"}
              />
              
              <DetailItem 
                icon={<MapPin size={20} weight="duotone" />}
                label="Location"
                value={profile.location || "Not provided"}
              />
              
              <DetailItem 
                icon={<Calendar size={20} weight="duotone" />}
                label="Member Since"
                value={formattedDate}
              />
              
              <DetailItem 
                icon={<IdentificationCard size={20} weight="duotone" />}
                label="Account ID"
                value={profile.account_id || "—"}
              />
              
              <DetailItem 
                icon={<ShieldCheck size={20} weight="duotone" />}
                label="KYC Status"
                value={
                  <span className={`kyc-status ${profile.kyc_status}`}>
                    {profile.kyc_status === "approved" ? "✓ Approved" : 
                     profile.kyc_status === "pending" ? "⏳ Pending" : 
                     profile.kyc_status === "rejected" ? "✗ Rejected" : "Not Submitted"}
                  </span>
                }
              />
            </div>

            {/* Security Footer */}
            <div className="profile-footer">
              <div className="security-note">
                <ShieldCheck size={18} weight="duotone" />
                <span>Your data is encrypted and securely stored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editing && (
          <div className="modal-backdrop">
            <div className="modal-container">
              <div className="modal-header">
                <h3>Edit Profile</h3>
                <button 
                  className="modal-close"
                  onClick={() => !saving && setEditing(false)}
                  disabled={saving}
                >
                  &times;
                </button>
              </div>

              <div className="modal-form">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your first name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your last name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    disabled={saving}
                  />
                </div>
          
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    disabled={saving}
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    className="save-btn"
                    onClick={saveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="button-spinner"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => !saving && setEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-wrapper {
          min-height: 100vh;
          background: transparent;
          padding: 20px;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .profile-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #000;
          margin-bottom: 8px;
        }

        .profile-subtitle {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
        }

        .profile-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          padding: 40px;
          margin-bottom: 40px;
        }

        .profile-picture-section {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .avatar-container {
          position: relative;
        }

        .avatar-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          border: 4px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .avatar-wrapper:hover {
          border-color: #667eea;
          transform: scale(1.05);
        }

        .avatar-wrapper:hover .avatar-overlay {
          opacity: 1;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
        }

        .verification-badge {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .profile-name-section {
          flex: 1;
          min-width: 200px;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .profile-email {
          font-size: 1rem;
          color: #64748b;
          margin: 0 0 16px 0;
        }

        .edit-profile-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-profile-btn:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .detail-item {
          background: #f8fafc;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .detail-item:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .detail-icon {
          color: #667eea;
        }

        .detail-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-value {
          font-size: 1.125rem;
          font-weight: 500;
          color: #1e293b;
          margin: 0;
          word-break: break-word;
        }

        .kyc-status {
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
        }

        .kyc-status.approved {
          background: #dcfce7;
          color: #166534;
        }

        .kyc-status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .kyc-status.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .profile-footer {
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .security-note {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.875rem;
        }

        .security-note svg {
          color: #10b981;
        }

        /* Loading Styles */
        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: white;
          border-radius: 24px;
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e293b;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .modal-close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-form {
          padding: 32px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }

        .required {
          color: #ef4444;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          color: #1e293b;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .save-btn {
          flex: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .cancel-btn {
          flex: 1;
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover:not(:disabled) {
          background: #e2e8f0;
        }

        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-left-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Error State */
        .profile-error {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #ef4444;
          font-size: 1.125rem;
        }

        /* Animations */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .profile-card {
            padding: 32px;
          }
          
          .profile-details-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .profile-wrapper {
            padding: 16px;
          }
          
          .profile-title {
            font-size: 2rem;
          }
          
          .profile-card {
            padding: 24px;
            border-radius: 20px;
          }
          
          .profile-picture-section {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }
          
          .profile-name-section {
            text-align: center;
          }
          
          .profile-details-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .modal-container {
            max-height: 80vh;
          }
        }

        @media (max-width: 480px) {
          .profile-title {
            font-size: 1.75rem;
          }
          
          .profile-card {
            padding: 20px;
            border-radius: 16px;
          }
          
          .avatar-wrapper {
            width: 100px;
            height: 100px;
          }
          
          .profile-name {
            font-size: 1.5rem;
          }
          
          .modal-form {
            padding: 24px;
          }
          
          .modal-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 360px) {
          .profile-wrapper {
            padding: 12px;
          }
          
          .profile-card {
            padding: 16px;
          }
          
          .avatar-wrapper {
            width: 80px;
            height: 80px;
          }
          
          .profile-name {
            font-size: 1.25rem;
          }
        }

      `}</style>
    </>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="detail-item">
      <div className="detail-header">
        <span className="detail-icon">{icon}</span>
        <span className="detail-label">{label}</span>
      </div>
      <p className="detail-value">{value}</p>
    </div>
  );
}