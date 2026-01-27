import { useState } from "react";
import { apiFetch } from "../api/api";
import PropertyForm from "./PropertyForm";
import PropertyImageManager from "./PropertyImageManager";
import "../styles/Modal.css";

export default function EditPropertyModal({ property, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (formData) => {
    setLoading(true);
    await apiFetch(`/properties/${property.id}/`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
    setLoading(false);
    onUpdated();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card large">
        <div className="modal-header">
          <h3>Edit Property</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <PropertyForm
            initialData={property}
            onSubmit={handleUpdate}
            submitText="Update Property"
            loading={loading}
          />

          <PropertyImageManager
            propertyId={property.id}
            images={property.images || []}
            onRefresh={onUpdated}
          />
        </div>
      </div>
    </div>
  );
}
