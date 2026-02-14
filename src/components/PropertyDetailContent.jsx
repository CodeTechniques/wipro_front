import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { formatPrice } from "../utils/currency";

export default function PropertyDetailContent({ propertyId }) {
  const [property, setProperty] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [showFullscreen, setShowFullscreen] = useState(false);
  const navigate = useNavigate();
  const { currency } = useCurrency();

   useEffect(() => {
    const fetchProperty = async () => {
      const data = await apiFetch(`/properties/${propertyId}/`);
      
      // Check if video is a string and convert to proper object
      if (data.video && typeof data.video === 'string') {
        data.video = {
          id: 'video_1',
          video: data.video,
          type: 'video',
          thumbnail: data.images[0].image || null
        };
      }
      
      setProperty(data);
    };
    
    fetchProperty();
  }, [propertyId]);

  // Handle keyboard navigation for fullscreen view
  useEffect(() => {
    const handleKeyDown = (e) => {
      
      if (!showFullscreen) return;
      
      if (e.key === "ArrowRight") {
        handleNextMedia();
      } else if (e.key === "ArrowLeft") {
        handlePrevMedia();
      } else if (e.key === "Escape") {
        setShowFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullscreen, selectedMediaIndex, property?.images, property?.video]);

  if (!property) return <p>Loading...</p>;

  const displayStatus = property.user_request_status
    ? `YOUR REQUEST: ${property.user_request_status.toUpperCase()}`
    : property.status.toUpperCase();
  
  const statusClass = property.user_request_status || property.status;
  
  // Combine images and single video into a media array
  const mediaItems = [
    ...(property.images || []).map(img => ({ ...img, type: 'image' }))
  ];
  // Add video if it exists and is valid
  if (property.video) {
    // If video is a string, create a video object
    if (typeof property.video === 'string') {
      mediaItems.push({
        id: 'video_1',
        video: property.video,
        type: 'video',
        thumbnail: property.images[0].image || null
      });
    } 
    // If video is already an object with video property
    else if (property.video.video) {
      mediaItems.push({
        ...property.video,
        thumbnail: property.images[0].image || null,
        type: 'video'
      });
    }
  }

  console.log('Media Items:', mediaItems); // Debug log
  const hasMedia = mediaItems.length > 0;
  const hasImages = property.images && property.images.length > 0;
  const hasVideo = property.video != null;

  const handlePrevMedia = () => {
    if (!hasMedia) return;
    setSelectedMediaIndex(prev => 
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
    setMediaType(mediaItems[selectedMediaIndex === 0 ? mediaItems.length - 1 : selectedMediaIndex - 1].type);
  };

  const handleNextMedia = () => {
    if (!hasMedia) return;
    setSelectedMediaIndex(prev => 
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
    setMediaType(mediaItems[selectedMediaIndex === mediaItems.length - 1 ? 0 : selectedMediaIndex + 1].type);
    console.log(property.video)
  };

  const openFullscreen = (index) => {
    setSelectedMediaIndex(index);
    setMediaType(mediaItems[index].type);
    setShowFullscreen(true);
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  const renderMedia = (mediaItem, isFullscreen = false) => {
    if (mediaItem.type === 'video') {
      return (
        <video
          src={mediaItem.video || mediaItem.file}
          controls
          className={isFullscreen ? "fullscreen-video" : "pd-main-video"}
          poster={mediaItem.thumbnail}
          autoPlay={isFullscreen}
        >
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img 
          src={mediaItem.image || mediaItem.file} 
          alt={property.title}
        />
      );
    }
  };

  return (
    <>
      <div className="property-modal">
        {/* ================= MEDIA GALLERY ================= */}
        {hasMedia && (
          <div className="pd-image-gallery">
            {/* Main Media Display */}
            <div 
              className="pd-main-media"
              onClick={() => openFullscreen(selectedMediaIndex)}
            >
              {renderMedia(mediaItems[selectedMediaIndex])}
              <div className="media-overlay">
                <i className="bi bi-arrows-fullscreen"></i>
                <span>Click to view fullscreen</span>
                {mediaItems[selectedMediaIndex].type === 'video' && (
                  <span className="video-badge">
                    <i className="bi bi-play-circle"></i> Video Tour
                  </span>
                )}
              </div>
            </div>

            {/* Media Type Tabs (if both images and video exist) */}
            {hasImages && hasVideo && (
              <div className="pd-media-tabs">
                <button 
                  className={`media-tab ${mediaType === 'image' ? 'active' : ''}`}
                  onClick={() => {
                    const firstImageIndex = mediaItems.findIndex(m => m.type === 'image');
                    if (firstImageIndex !== -1) {
                      setSelectedMediaIndex(firstImageIndex);
                      setMediaType('image');
                    }
                  }}
                >
                  <i className="bi bi-images"></i> Photos ({property.images.length})
                </button>
                <button 
                  className={`media-tab ${mediaType === 'video' ? 'active' : ''}`}
                  onClick={() => {
                    const videoIndex = mediaItems.findIndex(m => m.type === 'video');
                    if (videoIndex !== -1) {
                      setSelectedMediaIndex(videoIndex);
                      setMediaType('video');
                    }
                  }}
                >
                  <i className="bi bi-camera-reels"></i> Video Tour
                </button>
              </div>
            )}

            {/* Thumbnail Strip - Only show if more than one media item */}
            {mediaItems.length > 1 && (
              <div className="pd-thumbnail-strip">
                {mediaItems.map((media, index) => (
                  <div 
                    key={media.id || index}
                    className={`pd-thumbnail ${index === selectedMediaIndex ? 'active' : ''} ${media.type === 'video' ? 'video-thumbnail' : ''}`}
                    onClick={() => {
                      setSelectedMediaIndex(index);
                      setMediaType(media.type);
                    }}
                  >
                    {media.type === 'video' ? (
                      <>
                        <img 
                          src={media.thumbnail || media.image || '/video-thumbnail-placeholder.jpg'} 
                          alt="Video tour thumbnail" 
                        />
                        <span className="thumbnail-video-icon">
                          <i className="bi bi-play-circle-fill"></i>
                        </span>
                        {index === mediaItems.length - 1 && hasVideo && (
                          <span className="video-label">Tour</span>
                        )}
                      </>
                    ) : (
                      <img src={media.image} alt={`Photo ${index + 1}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Media Navigation - Only show if more than one media item */}
            {mediaItems.length > 1 && (
              <div className="pd-media-nav">
                <button 
                  className="pd-nav-btn prev"
                  onClick={handlePrevMedia}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <span className="pd-media-counter">
                  {selectedMediaIndex + 1} / {mediaItems.length}
                  {mediaItems[selectedMediaIndex].type === 'video' && ' (Video Tour)'}
                </span>
                <button 
                  className="pd-nav-btn next"
                  onClick={handleNextMedia}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Media Available */}
        {!hasMedia && (
          <div className="pd-no-media">
            <i className="bi bi-image"></i>
            <p>No photos or video available for this property</p>
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
            {hasVideo && (
              <span className="video-available-badge">
                <i className="bi bi-camera-reels"></i> Video Tour Available
              </span>
            )}
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

      {/* ================= FULLSCREEN MEDIA MODAL ================= */}
      {showFullscreen && hasMedia && (
        <div className="fullscreen-modal">
          <div className="fullscreen-header">
            <button className="close-btn" onClick={closeFullscreen}>
              <i className="bi bi-x-lg"></i>
            </button>
            <span className="image-counter">
              {selectedMediaIndex + 1} / {mediaItems.length}
              {mediaItems[selectedMediaIndex].type === 'video' && ' (Video Tour)'}
            </span>
          </div>

          <div className="fullscreen-content">
            <button 
              className="nav-btn prev" 
              onClick={handlePrevMedia}
              disabled={mediaItems.length <= 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <div className="fullscreen-media-container">
              {mediaItems[selectedMediaIndex].type === 'video' ? (
                <video 
                  src={mediaItems[selectedMediaIndex].video || mediaItems[selectedMediaIndex].file}
                  controls
                  autoPlay
                  className="fullscreen-video"
                  poster={mediaItems[selectedMediaIndex].thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={mediaItems[selectedMediaIndex].image} 
                  alt={`${property.title} - ${selectedMediaIndex + 1}`}
                  className="fullscreen-image"
                />
              )}
            </div>

            <button 
              className="nav-btn next" 
              onClick={handleNextMedia}
              disabled={mediaItems.length <= 1}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          {/* Thumbnail strip in fullscreen - Only show if more than one media item */}
          {mediaItems.length > 1 && (
            <div className="fullscreen-thumbnails">
              {mediaItems.map((media, index) => (
                <div 
                  key={media.id || index}
                  className={`fullscreen-thumbnail ${index === selectedMediaIndex ? 'active' : ''} ${media.type === 'video' ? 'video-thumbnail' : ''}`}
                  onClick={() => {
                    setSelectedMediaIndex(index);
                    setMediaType(media.type);
                  }}
                >
                  {media.type === 'video' ? (
                    <>
                      <img 
                        src={media.thumbnail || media.image || '/video-thumbnail-placeholder.jpg'} 
                        alt="Video thumbnail" 
                      />
                      <span className="thumbnail-video-icon small">
                        <i className="bi bi-play-circle-fill"></i>
                      </span>
                    </>
                  ) : (
                    <img src={media.image} alt={`Thumbnail ${index + 1}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>
        {`
        .property-modal {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .pd-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .pd-title {
          font-size: 22px;
          font-weight: 700;
          margin: 0;
        }

        .pd-location {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }

        .video-available-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          padding: 4px 10px;
          background: #e8f0fe;
          color: #2563eb;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .video-available-badge i {
          font-size: 14px;
        }

        .pd-header-right {
          text-align: right;
        }

        .pd-price {
          font-size: 28px;
          font-weight: 800;
          color: #059669;
        }

        .pd-status {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          font-weight: 600;
        }

        .pd-status.available {
          background: #dcfce7;
          color: #166534;
        }

        .pd-status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .pd-status.sold {
          background: #fee2e2;
          color: #991b1b;
        }

        .pd-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 16px;
        }

        .pd-card h4 {
          margin-bottom: 8px;
        }

        .pd-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .pd-grid div {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
        }

        .pd-grid i {
          font-size: 18px;
          color: #2563eb;
        }

        .pd-btn {
          width: 100%;
          margin-top: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }

        .pd-btn.success {
          background: #059669;
        }

        .pd-btn.disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .pd-note {
          font-size: 12px;
          color: #6b7280;
          margin-top: 6px;
        }

        .pd-image-gallery {
          margin-bottom: 2rem;
          position: relative;
        }

        .pd-main-media {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          height: 400px;
          background: #f5f5f5;
        }

        .pd-main-media img,
        .pd-main-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .pd-main-video {
          background: #000;
        }

        .pd-main-media:hover img,
        .pd-main-media:hover .pd-main-video {
          transform: scale(1.02);
        }

        .media-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
        }

        .pd-main-media:hover .media-overlay {
          opacity: 1;
        }

        .media-overlay i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .media-overlay span {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .video-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 1 !important;
        }

        .video-badge i {
          font-size: 16px;
          margin: 0;
          color: #ff4444;
        }

        .pd-media-tabs {
          display: flex;
          gap: 10px;
          margin: 15px 0;
        }

        .media-tab {
          flex: 1;
          padding: 10px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          color: #4b5563;
          transition: all 0.2s ease;
        }

        .media-tab.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .media-tab i {
          margin-right: 6px;
        }

        .pd-thumbnail-strip {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .pd-thumbnail {
          flex: 0 0 80px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          position: relative;
        }

        .pd-thumbnail.video-thumbnail {
          position: relative;
        }

        .thumbnail-video-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 20px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .thumbnail-video-icon.small {
          font-size: 16px;
        }

        .video-label {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: rgba(37, 99, 235, 0.9);
          color: white;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 8px;
          font-weight: 600;
        }

        .pd-thumbnail.active {
          border-color: #007bff;
        }

        .pd-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pd-thumbnail:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .pd-media-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 15px;
        }

        .pd-nav-btn {
          background: #007bff;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pd-nav-btn:hover {
          background: #0056b3;
          transform: scale(1.1);
        }

        .pd-nav-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .pd-nav-btn i {
          font-size: 1.2rem;
        }

        .pd-media-counter {
          font-weight: 500;
          color: #666;
          font-size: 0.9rem;
          min-width: 100px;
          text-align: center;
        }

        .pd-no-media {
          height: 300px;
          background: #f9fafb;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #9ca3af;
        }

        .pd-no-media i {
          font-size: 48px;
        }

        .pd-no-media p {
          font-size: 16px;
        }

        .fullscreen-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .fullscreen-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.8);
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .close-btn i {
          font-size: 1.2rem;
        }

        .image-counter {
          color: white;
          font-weight: 500;
          font-size: 1rem;
        }

        .fullscreen-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin: 0 20px;
          z-index: 1;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-btn i {
          font-size: 1.5rem;
        }

        .fullscreen-media-container {
          max-width: 90%;
          max-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fullscreen-image,
        .fullscreen-video {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .fullscreen-video {
          background: #000;
        }

        .fullscreen-thumbnails {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.8);
          overflow-x: auto;
        }

        .fullscreen-thumbnail {
          flex: 0 0 60px;
          height: 45px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          opacity: 0.7;
          position: relative;
        }

        .fullscreen-thumbnail.video-thumbnail {
          position: relative;
        }

        .fullscreen-thumbnail.active {
          border-color: #007bff;
          opacity: 1;
        }

        .fullscreen-thumbnail:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        .fullscreen-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pd-thumbnail-strip::-webkit-scrollbar,
        .fullscreen-thumbnails::-webkit-scrollbar {
          height: 6px;
        }

        .pd-thumbnail-strip::-webkit-scrollbar-track,
        .fullscreen-thumbnails::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .pd-thumbnail-strip::-webkit-scrollbar-thumb,
        .fullscreen-thumbnails::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .fullscreen-thumbnails::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .fullscreen-thumbnails::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .pd-main-media {
            height: 300px;
          }
          
          .pd-thumbnail {
            flex: 0 0 60px;
            height: 45px;
          }
          
          .nav-btn {
            position: absolute;
            margin: 0;
          }
          
          .nav-btn.prev {
            left: 10px;
          }
          
          .nav-btn.next {
            right: 10px;
          }
          
          .fullscreen-thumbnail {
            flex: 0 0 45px;
            height: 35px;
          }

          .media-tab {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .pd-main-media {
            height: 250px;
          }
          
          .pd-thumbnail {
            flex: 0 0 50px;
            height: 40px;
          }
          
          .pd-media-counter {
            min-width: 80px;
            font-size: 12px;
          }
        }
        `}
      </style>
    </>
  );
}