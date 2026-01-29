import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import "./PropertyDetailContent.css";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function PropertyDetailContent({ propertyId }) {
  const [property, setProperty] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const navigate = useNavigate();
  const { currency } = useCurrency();

  useEffect(() => {
    apiFetch(`/properties/${propertyId}/`).then(setProperty);
  }, [propertyId]);

  // Handle keyboard navigation for fullscreen view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showFullscreen || !property?.images?.length) return;
      
      if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "Escape") {
        setShowFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullscreen, selectedImageIndex, property?.images]);

  if (!property) return <p>Loading...</p>;

  const displayStatus = property.user_request_status
    ? `YOUR REQUEST: ${property.user_request_status.toUpperCase()}`
    : property.status.toUpperCase();

  const statusClass = property.user_request_status || property.status;

  const handlePrevImage = () => {
    if (!property?.images?.length) return;
    setSelectedImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!property?.images?.length) return;
    setSelectedImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const openFullscreen = (index) => {
    setSelectedImageIndex(index);
    setShowFullscreen(true);
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  return (
    <>
      <div className="property-modal">
        {/* ================= IMAGE GALLERY ================= */}
        {property.images && property.images.length > 0 && (
          <div className="pd-image-gallery">
            {/* Main Image */}
            <div 
              className="pd-main-image"
              onClick={() => openFullscreen(selectedImageIndex)}
            >
              <img 
                src={property.images[selectedImageIndex]?.image} 
                alt={property.title}
              />
              <div className="image-overlay">
                <i className="bi bi-arrows-fullscreen"></i>
                <span>Click to view fullscreen</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="pd-thumbnail-strip">
                {property.images.map((img, index) => (
                  <div 
                    key={img.id}
                    className={`pd-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={img.image} alt={`${property.title} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Image Navigation (only shown when multiple images) */}
            {property.images.length > 1 && (
              <div className="pd-image-nav">
                <button 
                  className="pd-nav-btn prev"
                  onClick={handlePrevImage}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <span className="pd-image-counter">
                  {selectedImageIndex + 1} / {property.images.length}
                </span>
                <button 
                  className="pd-nav-btn next"
                  onClick={handleNextImage}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="pd-header">
          <div className="pd-header-left">
            <h2 className="pd-title">{property.title}</h2>
            <p className="pd-location">
              <i className="bi bi-geo-alt"></i>{" "}
              {property.location}, {property.city}
            </p>
          </div>

          <div className="pd-header-right">
            <div className="pd-price">
              {formatPrice(property.price, currency)}
            </div>

            <span className={`pd-status ${statusClass}`}>
              {displayStatus}
            </span>
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div className="pd-card">
          <div className="pd-grid">
            <div><i className="bi bi-house"></i><span>{property.property_type}</span></div>
            <div><i className="bi bi-tag"></i><span>{property.listing_type}</span></div>
            <div><i className="bi bi-aspect-ratio"></i><span>{property.area_sqft} sqft</span></div>
            <div><i className="bi bi-door-open"></i><span>{property.bedrooms} Beds</span></div>
            <div><i className="bi bi-droplet"></i><span>{property.bathrooms} Baths</span></div>
            <div><i className="bi bi-eye"></i><span>{property.views_count} Views</span></div>
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="pd-card">
          <h4>Description</h4>
          <p>{property.description}</p>
        </div>

        {/* ================= ACTION ================= */}
        <div className="pd-card">
          <h4>Interested in this property?</h4>

          {property.user_request_status === "pending" ? (
            <button className="pd-btn disabled" disabled>Request Pending</button>
          ) : property.user_request_status === "approved" ? (
            <button className="pd-btn success" disabled>Request Approved</button>
          ) : property.user_request_status === "rejected" ? (
            <button
              className="pd-btn"
              onClick={() => navigate(`/property/${propertyId}/request`)}
            >
              Re-apply / Contact Owner
            </button>
          ) : (
            <button
              className="pd-btn"
              onClick={() => navigate(`/property/${propertyId}/request`)}
            >
              Contact Owner / Buy Property
            </button>
          )}

          <p className="pd-note">
            {property.user_request_status === "pending" &&
              "⏳ Your request is under review by the owner."}
            {property.user_request_status === "approved" &&
              "✅ Your request was approved. Owner will contact you."}
            {property.user_request_status === "rejected" &&
              "❌ Your request was rejected. You may submit a new request."}
            {!property.user_request_status &&
              "Fill a short form. Owner will review your request."}
          </p>
        </div>
      </div>

      {/* ================= FULLSCREEN IMAGE MODAL ================= */}
      {showFullscreen && property.images && property.images.length > 0 && (
        <div className="fullscreen-modal">
          <div className="fullscreen-header">
            <button className="close-btn" onClick={closeFullscreen}>
              <i className="bi bi-x-lg"></i>
            </button>
            <span className="image-counter">
              {selectedImageIndex + 1} / {property.images.length}
            </span>
          </div>

          <div className="fullscreen-content">
            <button 
              className="nav-btn prev" 
              onClick={handlePrevImage}
              disabled={property.images.length <= 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <div className="fullscreen-image-container">
              <img 
                src={property.images[selectedImageIndex]?.image} 
                alt={`${property.title} - ${selectedImageIndex + 1}`}
              />
            </div>

            <button 
              className="nav-btn next" 
              onClick={handleNextImage}
              disabled={property.images.length <= 1}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          {/* Thumbnail strip in fullscreen */}
          {property.images.length > 1 && (
            <div className="fullscreen-thumbnails">
              {property.images.map((img, index) => (
                <div 
                  key={img.id}
                  className={`fullscreen-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={img.image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}