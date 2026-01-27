import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import "../styles/MyProperties.css";
import { useNavigate } from "react-router-dom";
import MiniVerticalNav from "../components/MiniVerticalNav";

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/properties/my-properties/").then((data) => {
      setProperties(data.results || []);
    });
  }, []);

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this property?")) return;

  await apiFetch(`/properties/${id}/delete/`, {
    method: "DELETE",
  });

  setProperties((prev) => prev.filter((p) => p.id !== id));
};


  return (
    <div className="my-properties-page">
      <h2>My Properties</h2>

      <MiniVerticalNav />

      {properties.length === 0 && (
        <p className="empty">No properties created yet.</p>
      )}

      <div className="owner-grid">
        {properties.map((property) => (
          <div key={property.id} className="owner-card">
            {/* IMAGE */}
            <div className="owner-image">
              <img
                src={property.main_image || "/placeholder.jpg"}
                alt={property.title}
                // onError={(e) => {
                //   e.target.src = "/placeholder.jpg";
                // }}
              />

              {/* HOVER ACTIONS */}
              <div className="owner-actions">
                <button
                  title="Edit"
                  onClick={() =>
                    navigate(`/properties/edit/${property.id}`)
                  }
                >
                  <i className="bi bi-pencil"></i>
                </button>

                <button
                  title="Delete"
                  onClick={() => handleDelete(property.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>

              

              <span className={`status-badge ${property.status}`}>
                {property.status?.toUpperCase()}
              </span>
            </div>

            {/* BODY */}
            <div className="owner-body">
              <h3>{property.title}</h3>

              <p className="location">
                <i className="bi bi-geo-alt"></i>
                {property.location}, {property.city}
              </p>

              <div className="owner-meta">
                <span>₹ {property.price}</span>
                <span>{property.area_sqft} sqft</span>
                <span>{property.bedrooms} Beds</span>
                <span>{property.bathrooms} Baths</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
