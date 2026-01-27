// src/components/PropertyGallery.jsx
import React, { useState } from 'react';


const PropertyGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const defaultImages = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  const handlePrev = () => {
    setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="property-gallery">
      {/* Main Image */}
      <div className="main-image-container">
        <div 
          className="main-image"
          onClick={() => setShowLightbox(true)}
          style={{
            backgroundImage: `url(${displayImages[selectedImage]})`
          }}
        >
          <div className="image-overlay">
            <button className="zoom-btn">🔍</button>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        {displayImages.length > 1 && (
          <>
            <button className="nav-btn prev-btn" onClick={handlePrev}>
              ←
            </button>
            <button className="nav-btn next-btn" onClick={handleNext}>
              →
            </button>
          </>
        )}
        
        {/* Image Counter */}
        <div className="image-counter">
          {selectedImage + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="thumbnail-container">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
              style={{
                backgroundImage: `url(${image})`
              }}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && (
        <div className="lightbox" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content">
            <img src={displayImages[selectedImage]} alt="Property" />
            <button className="close-btn">×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
