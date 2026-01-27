import "../styles/PropertyCard.css";
import { useState } from "react";
import PropertyDetailModal from "./PropertyDetailModal";
import { uploadPropertyImages } from "../api/propertyImages";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function PropertyCard({ property, onImageUploaded }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { currency } = useCurrency(); // ✅ GLOBAL CURRENCY

  const handleImageUpload = async (files) => {
    try {
      setUploading(true);
      await uploadPropertyImages(property.id, Array.from(files));
      onImageUploaded?.();
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="property-card">
        {/* IMAGE */}
        <div className="property-image">
          <span className="property-tag">
            {property.property_type?.toUpperCase() || "PROPERTY"}
          </span>

          <LazyLoadImage
            src={property.main_image || "/placeholder.jpg"}
            alt={property.title}
            effect="blur"
            width="100%"
            height="100%"
            wrapperClassName="property-image-wrapper"
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </div>

        {/* BODY */}
        <div className="property-body">
          <h3 className="property-title">{property.title}</h3>

          <p className="property-location">
            <i className="bi bi-geo-alt"></i>
            {property.location}, {property.city}
          </p>

          <div className="property-price-row">
            <span className="property-price">
              {formatPrice(property.price, currency)}
            </span>

            {property.is_verified && (
              <span className="property-verified">VERIFIED</span>
            )}
          </div>

          <div className="property-info">
            <div><i className="bi bi-house"></i>{property.bedrooms} Beds</div>
            <div><i className="bi bi-droplet"></i>{property.bathrooms} Baths</div>
            <div><i className="bi bi-aspect-ratio"></i>{property.area_sqft} sqft</div>
          </div>

          <button className="property-btn" onClick={() => setOpen(true)}>
            View Details
          </button>
        </div>
      </div>

      <PropertyDetailModal
        propertyId={property.id}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
