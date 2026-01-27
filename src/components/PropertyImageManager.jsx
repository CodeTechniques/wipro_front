import { useState } from "react";
import { apiFetch } from "../api/api";
import "./PropertyImageManager.css";

export default function PropertyImageManager({ propertyId, images, onRefresh }) {
  const [files, setFiles] = useState([]);

  const handleUpload = async () => {
    if (files.length === 0) return alert("Select images");

    const fd = new FormData();
    files.forEach(f => fd.append("images", f));

    await apiFetch(`/properties/${propertyId}/images/`, {
      method: "POST",
      body: fd,
    });

    setFiles([]);
    onRefresh();
  };

  const deleteImage = async (id) => {
    if (!confirm("Delete this image?")) return;

    await apiFetch(`/properties/property-images/${id}/`, {
      method: "DELETE",
    });

    onRefresh();
  };

  return (
    <div className="image-manager">
      <h3>Property Images</h3>

      <div className="image-grid">
        {images.map(img => (
          <div key={img.id} className="image-card">
            <img src={img.image} alt="" />
            <button onClick={() => deleteImage(img.id)}>✕</button>
          </div>
        ))}
      </div>

      <div className="upload-box">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setFiles([...e.target.files])}
        />
        <button onClick={handleUpload}>Upload Images</button>
      </div>
    </div>
  );
}
