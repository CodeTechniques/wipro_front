import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import PropertyForm from "../components/PropertyForm";
import PropertyImageManager from "../components/PropertyImageManager";
import "../styles/EditPropertyPage.css";

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProperty = async () => {
    const res = await apiFetch(`/properties/${id}/`);
    setProperty(res);
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSaving(true);
      await apiFetch(`/properties/${id}/`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      navigate("/my-properties");
    } finally {
      setSaving(false);
    }
  };

  if (!property) {
    return <div className="page-loading">Loading property...</div>;
  }

  return (
    <div className="edit-property-page">
      {/* HEADER */}
      <div className="edit-header">
        <div>
          <h2>Edit Property</h2>
          <p className="subtext">
            Update details, pricing and images for this property
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn-outline"
            onClick={() => navigate("/my-properties")}
          >
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              document.getElementById("property-form-submit").click()
            }
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="edit-content">
        {/* PROPERTY FORM */}
        <div className="card">
          <h3 className="card-title">Property Details</h3>

          <PropertyForm
            initialData={property}
            onSubmit={handleUpdate}
            submitText="Save"
            hiddenSubmitId="property-form-submit"
          />
        </div>

        {/* IMAGE MANAGER */}
        {/* <div className="card">
          <h3 className="card-title">Property Images</h3>

          <PropertyImageManager
            propertyId={id}
            images={property.images || []}
            onRefresh={fetchProperty}
          />
        </div> */}
      </div>
    </div>
  );
}
