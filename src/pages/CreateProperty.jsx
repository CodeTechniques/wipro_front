import { useState, useRef } from "react";
import { apiFetch } from "../api/api";
// import "./create-property.css";
import { useNavigate } from "react-router-dom";
import MiniVerticalNav from "../components/MiniVerticalNav";
import PropertyCreationConfirmationModal from "../components/PropertyCreationConfirmationModal";
import PropertyCreationResultModal from "../components/PropertyCreationResultModal";
import { color } from "framer-motion";

// Helper function to check image aspect ratio
const checkImageRatio = (file, targetRatio = 4/3, tolerance = 0.1) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const actualRatio = img.width / img.height;
      const ratioDiff = Math.abs(actualRatio - targetRatio);
      
      // Check if ratio is within tolerance
      if (ratioDiff <= tolerance) {
        resolve({
          valid: true,
          width: img.width,
          height: img.height,
          actualRatio: actualRatio.toFixed(2)
        });
      } else {
        resolve({
          valid: false,
          width: img.width,
          height: img.height,
          actualRatio: actualRatio.toFixed(2),
          targetRatio: targetRatio.toFixed(2)
        });
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    
    // Create object URL for the file
    img.src = URL.createObjectURL(file);
  });
};

// Helper function to check video duration and size
const checkVideo = (file, maxDuration = 60, maxSizeMB = 50) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      const sizeMB = file.size / (1024 * 1024);
      
      const issues = [];
      
      if (duration > maxDuration) {
        issues.push(`Duration ${duration.toFixed(1)}s exceeds ${maxDuration}s`);
      }
      
      if (sizeMB > maxSizeMB) {
        issues.push(`Size ${sizeMB.toFixed(1)}MB exceeds ${maxSizeMB}MB`);
      }
      
      resolve({
        valid: issues.length === 0,
        duration: duration.toFixed(1),
        sizeMB: sizeMB.toFixed(1),
        width: video.videoWidth,
        height: video.videoHeight,
        issues
      });
    };
    
    video.onerror = () => {
      reject(new Error("Failed to load video"));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

export default function CreateProperty() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [videoErrors, setVideoErrors] = useState([]);
  const [ratioValidationEnabled, setRatioValidationEnabled] = useState(true);
  const [videoValidationEnabled, setVideoValidationEnabled] = useState(true);
  
  // Modal states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    property_type: "residential",
    listing_type: "sale",
    price: "",
    rent_price: "",
    location: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    area_sqft: "",
    bedrooms: 0,
    bathrooms: 0,
    floors: 1,
    parking_spaces: 0,
    furnished: false,
    ac_available: false,
    balcony: false,
    gym: false,
    swimming_pool: false,
    garden: false,
    security: false,
    lift_available: false,
    power_backup: false,
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    investment_enabled: true,
    investors_required: 10,
    investors_min: 10,
    investors_max: 50,
  });

  /* ---------------- IMAGE HANDLING ---------------- */

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const errors = [];
    const validImages = [];

    // Clear previous errors
    setImageErrors([]);

    // Check each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await checkImageRatio(file, 4/3, 0.15); // 15% tolerance
        
        if (!result.valid && ratioValidationEnabled) {
          // Special handling for first image (main image)
          if (i === 0 && images.length === 0) {
            errors.push({
              index: i,
              filename: file.name,
              message: `First image (main image) should be in 4:3 ratio. Your image is ${result.width}×${result.height} (${result.actualRatio}:1). Consider cropping to 4:3 for best display.`,
              isFirstImage: true,
              width: result.width,
              height: result.height
            });
            
            // Still allow adding but with warning
            validImages.push(file);
          } else if (i > 0) {
            // For other images, just show warning but allow
            errors.push({
              index: i,
              filename: file.name,
              message: `Image ${i+1} is ${result.width}×${result.height} (${result.actualRatio}:1). 4:3 ratio recommended for best display.`,
              isWarning: true,
              width: result.width,
              height: result.height
            });
            validImages.push(file);
          }
        } else {
          validImages.push(file);
        }
      } catch (error) {
        console.error("Error checking image:", error);
        validImages.push(file); // Allow anyway if we can't check
      }
    }

    // Combine with existing images
    setImages(prev => [...prev, ...validImages]);
    setImageErrors(errors);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------------- VIDEO HANDLING ---------------- */

  const handleVideosChange = async (e) => {
    const files = Array.from(e.target.files);
    const errors = [];
    const validVideos = [];

    // Clear previous errors
    setVideoErrors([]);

    // Check each video
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await checkVideo(file, 60, 50); // Max 60 seconds, 50MB
        
        if (!result.valid && videoValidationEnabled) {
          errors.push({
            index: i,
            filename: file.name,
            message: `Video issues: ${result.issues.join(', ')}.`,
            isWarning: true,
            duration: result.duration,
            sizeMB: result.sizeMB,
            resolution: `${result.width}×${result.height}`
          });
          
          // Ask user if they want to proceed with problematic video
          if (window.confirm(`Video "${file.name}" has issues: ${result.issues.join(', ')}. Do you want to upload it anyway?`)) {
            validVideos.push(file);
          }
        } else {
          validVideos.push(file);
        }
      } catch (error) {
        console.error("Error checking video:", error);
        // Still allow upload if validation fails
        if (window.confirm(`Could not validate video "${file.name}". Upload anyway?`)) {
          validVideos.push(file);
        }
      }
    }

    // Combine with existing videos
    setVideos(prev => [...prev, ...validVideos]);
    setVideoErrors(errors);

    // Reset video input
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageErrors(prev => prev.filter(err => err.index !== index));
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
    setVideoErrors(prev => prev.filter(err => err.index !== index));
  };

  const clearAllImages = () => {
    setImages([]);
    setImageErrors([]);
  };

  const clearAllVideos = () => {
    setVideos([]);
    setVideoErrors([]);
  };

  /* ---------------- FORM HELPERS ---------------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const isFormValid = () =>
    form.title &&
    form.location &&
    form.address &&
    form.city &&
    form.state &&
    form.pincode &&
    form.contact_name &&
    form.contact_phone &&
    form.contact_email &&
    Number(form.price) > 0 &&
    Number(form.area_sqft) > 0;

  const buildPayload = () => ({
    ...form,
    price: Number(form.price),
    rent_price: form.rent_price ? Number(form.rent_price) : null,
    area_sqft: Number(form.area_sqft),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    floors: Number(form.floors),
    parking_spaces: Number(form.parking_spaces),
    investors_required: Number(form.investors_required),
    investors_min: Number(form.investors_min),
    investors_max: Number(form.investors_max),
    has_video: videos.length > 0
  });

  /* ---------------- HANDLE FORM SUBMIT ---------------- */

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill all required fields correctly");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    // Check if there are critical errors for first image
    const firstImageError = imageErrors.find(err => err.isFirstImage && !err.isWarning);
    if (firstImageError && ratioValidationEnabled) {
      const proceed = window.confirm(
        `⚠️ Your main image is not in 4:3 ratio (${firstImageError.width}×${firstImageError.height}).\n\n` +
        `It will display with letterboxing or cropping in property cards.\n\n` +
        `Do you want to proceed anyway?`
      );
      if (!proceed) return;
    }

    // Show confirmation modal before submission
    setShowConfirmationModal(true);
  };

  /* ---------------- ACTUAL API CALL ---------------- */

  const createProperty = async () => {
    setLoading(true);

    try {
      // 1️⃣ Create property
      const propertyResponse = await apiFetch("/properties/", {
        method: "POST",
        body: JSON.stringify(buildPayload()),
      });

      const newPropertyId = propertyResponse.id;

      // 2️⃣ Upload images if any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));

        await apiFetch(`/properties/${newPropertyId}/images/`, {
          method: "POST",
          body: formData,
        });
      }

      // 3️⃣ Upload videos if any
      if (videos.length > 0) {
        const videoFormData = new FormData();
        videos.forEach((video) => videoFormData.append("videos", video));

        await apiFetch(`/properties/${newPropertyId}/videos/upload/`, {
          method: "POST",
          body: videoFormData,
        });
      }

      // Store the API response for the result modal
      setApiResponse({
        ...propertyResponse,
        images_count: images.length,
        videos_count: videos.length
      });
      
      // Show result modal
      setShowResultModal(true);

    } catch (err) {
      alert(err?.detail || JSON.stringify(err) || "Error creating property");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
    <div className="create-property">
      <h2>Create Property</h2>

      <div className="market-sidebar">
        <MiniVerticalNav />
      </div>

      <form onSubmit={handleFormSubmit}>
        <input 
          name="title" 
          placeholder="Title *" 
          required 
          value={form.title}
          className="form-input"
          onChange={handleChange} 
        />
        
        <textarea 
          name="description" 
          placeholder="Description" 
          value={form.description}
          onChange={handleChange} 
          className="border-gray-300 form-input border-1 rounded-lg"
        />

        <select name="property_type" className="form-input" value={form.property_type} onChange={handleChange}>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
        </select>

        <select name="listing_type" className="form-input" value={form.listing_type} onChange={handleChange}>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="both">Sale & Rent</option>
        </select>

        <input 
          name="price" 
          type="number" 
          placeholder="Price *" 
          required 
          value={form.price}
          onChange={handleChange} 
          min="1"
          className="form-input"
        />
        
        <input 
          name="rent_price" 
          type="number" 
          placeholder="Rent Price (optional)" 
          value={form.rent_price}
          onChange={handleChange} 
          min="0"
          className="form-input"
        />

        <input 
          name="location" 
          placeholder="Location *" 
          required 
          value={form.location}
          className="form-input"
          onChange={handleChange} 
        />
        
        <input 
          name="address" 
          placeholder="Full Address *" 
          required 
          value={form.address}
          onChange={handleChange} 
          className="form-input"
        />
        
        <input 
          name="city" 
          placeholder="City *" 
          required 
          value={form.city}
          onChange={handleChange} 
          className="form-input"
        />
        
        <input 
          name="state" 
          placeholder="State *" 
          required 
          value={form.state}
          onChange={handleChange} 
          className="form-input"
        />
        
        <input 
          name="pincode" 
          placeholder="Pincode *" 
          required 
          value={form.pincode}
          onChange={handleChange} 
          className="form-input"
        />

        <input 
          name="area_sqft" 
          type="number" 
          placeholder="Area (sqft) *" 
          required 
          value={form.area_sqft}
          onChange={handleChange} 
          min="1"
          className="form-input"
        />
        
        <input 
          name="bedrooms" 
          type="number" 
          placeholder="Bedrooms" 
          value={form.bedrooms}
          onChange={handleChange} 
          min="0"
          className="form-input"
        />
        
        <input 
          name="bathrooms" 
          type="number" 
          placeholder="Bathrooms" 
          value={form.bathrooms}
          onChange={handleChange} 
          min="0"
          className="form-input"
        />

        {/* 🔥 IMAGE UPLOAD SECTION */}
        <div className="image-upload-section">
          <h4>Property Images</h4>
          
          <div className="ratio-info">
            <strong>Recommended ratio:</strong> 4:3 (e.g., 1200×900, 1600×1200)
            <div className="ratio-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={ratioValidationEnabled}
                  onChange={(e) => setRatioValidationEnabled(e.target.checked)}
                />
                Enable ratio validation
              </label>
              <span className="hint">(Checks first image for 4:3 ratio)</span>
            </div>
          </div>
          
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImagesChange}
            className="file-input"
          />
          
          {images.length > 0 && (
            <div className="image-preview-section">
              <div className="image-preview-header">
                <span>Selected images: {images.length}</span>
                <button 
                  type="button" 
                  onClick={clearAllImages}
                  className="clear-all-btn"
                >
                  Clear All
                </button>
              </div>
              
              <div className="image-previews">
                {images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <div className="preview-info">
                      <span className="filename">{image.name}</span>
                      <span className="size">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      {index === 0 && (
                        <span className="main-image-badge">Main Image</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                    
                    {/* Show preview if available */}
                    {URL.createObjectURL && (
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`}
                        className="preview-img"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Display image errors/warnings */}
          {imageErrors.length > 0 && (
            <div className="image-errors">
              {imageErrors.map((error, idx) => (
                <div 
                  key={idx} 
                  className={`error-item ${error.isWarning ? 'warning' : 'error'} ${error.isFirstImage ? 'first-image-error' : ''}`}
                >
                  <strong>{error.isFirstImage ? '⚠️ Important: ' : 'ℹ️ '}</strong>
                  {error.message}
                </div>
              ))}
            </div>
          )}
          
          {images.length === 0 && (
            <div className="upload-hint">
              <p>📸 Upload at least one image. The first image will be used as the main display image.</p>
              <p>For best results, use landscape images in 4:3 aspect ratio (like 1200×900).</p>
            </div>
          )}
        </div>

        {/* 🎥 VIDEO UPLOAD SECTION */}
        <div className="video-upload-section">
          <h4>Property Videos (Optional)</h4>
          
          <div className="video-info">
            <strong>Video guidelines:</strong> Max 60 seconds, up to 50MB, MP4/MOV format recommended
            <div className="video-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={videoValidationEnabled}
                  onChange={(e) => setVideoValidationEnabled(e.target.checked)}
                />
                Enable video validation
              </label>
              <span className="hint">(Checks duration and file size)</span>
            </div>
          </div>
          
          <input 
            ref={videoInputRef}
            type="file" 
            multiple 
            accept="video/*" 
            onChange={handleVideosChange}
            className="file-input"
          />
          
          {videos.length > 0 && (
            <div className="video-preview-section">
              <div className="video-preview-header">
                <span>Selected videos: {videos.length}</span>
                <button 
                  type="button" 
                  onClick={clearAllVideos}
                  className="clear-all-btn"
                >
                  Clear All
                </button>
              </div>
              
              <div className="video-previews">
                {videos.map((video, index) => (
                  <div key={index} className="video-preview-item">
                    <div className="video-info-bar">
                      <span className="filename">{video.name}</span>
                      <span className="size">
                        {(video.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                    
                    {/* Video preview */}
                    {URL.createObjectURL && (
                      <video 
                        src={URL.createObjectURL(video)} 
                        controls
                        className="preview-video"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Display video errors/warnings */}
          {videoErrors.length > 0 && (
            <div className="video-errors">
              {videoErrors.map((error, idx) => (
                <div key={idx} className="error-item warning">
                  <strong>⚠️ Video warning:</strong> {error.message}
                  <div className="error-details">
                    {error.duration && <span>Duration: {error.duration}s</span>}
                    {error.sizeMB && <span>Size: {error.sizeMB}MB</span>}
                    {error.resolution && <span>Resolution: {error.resolution}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {videos.length === 0 && (
            <div className="upload-hint">
              <p>🎥 You can upload walkthrough videos of the property (optional but recommended).</p>
              <p>Supported formats: MP4, MOV, AVI (max 50MB per video)</p>
            </div>
          )}
        </div>

        <h4>Contact Information</h4>
        <input 
          name="contact_name" 
          placeholder="Contact Name *" 
          required 
          value={form.contact_name}
          onChange={handleChange} 
          className="form-input"
        />
        
        <input 
          name="contact_phone" 
          placeholder="Contact Phone *" 
          required 
          value={form.contact_phone}
          onChange={handleChange} 
          className="form-input"
        />
        
        <input 
          name="contact_email" 
          type="email" 
          placeholder="Contact Email *" 
          required 
          value={form.contact_email}
          onChange={handleChange} 
          className="form-input"
        />

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Creating..." : "Create Property"}
        </button>
      </form>

      {/* Confirmation Modal (before submission) */}
      <PropertyCreationConfirmationModal
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onSubmit={createProperty}
      />
      
      <PropertyCreationResultModal
        open={showResultModal}
        responseData={apiResponse}
      />
    </div>
    <style jsx>{`
    .create-property {
  max-width: 800px;
  margin: 30px auto;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

h2, h4 {
  color: #1e293b;
  margin-bottom: 20px;
}

h2 {
  font-size: 28px;
  font-weight: 700;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
}

h4 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 24px;
}

.create-property input,
.create-property textarea,
.create-property select {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s;
  background: white;
}

.create-property input:focus,
.create-property textarea:focus,
.create-property select:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.create-property label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #334155;
}

.form-input::placeholder {
  color: #94a3b8;
}

.submit-btn {
  padding: 16px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
  width: 100%;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Image Upload Section */
.image-upload-section,
.video-upload-section {
  margin: 24px 0;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
}

.ratio-info,
.video-info {
  margin-bottom: 16px;
  padding: 16px;
  background: #e6f7e6;
  border-radius: 12px;
  border-left: 4px solid #22c55e;
}

.ratio-info strong,
.video-info strong {
  color: #16a34a;
  margin-right: 0.5rem;
  display: block;
  margin-bottom: 8px;
}

.ratio-toggle,
.video-toggle {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.ratio-toggle label,
.video-toggle label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #1e293b;
}

.ratio-toggle .hint,
.video-toggle .hint {
  font-size: 0.85rem;
  color: #64748b;
}

.file-input {
  margin: 16px 0;
  padding: 12px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  width: 100%;
  cursor: pointer;
  background: white;
}

.file-input:hover {
  border-color: #22c55e;
  background: #f0fdf4;
}

/* Image Previews */
.image-preview-section,
.video-preview-section {
  margin-top: 20px;
}

.image-preview-header,
.video-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.image-preview-header span,
.video-preview-header span {
  font-weight: 600;
  color: #1e293b;
}

.clear-all-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.image-previews,
.video-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.image-preview-item,
.video-preview-item {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.image-preview-item:hover,
.video-preview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-color: #22c55e;
}

.preview-info,
.video-info-bar {
  padding: 10px;
  background: #f8fafc;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
}

.filename {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  color: #1e293b;
}

.size {
  color: #64748b;
  font-size: 11px;
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 12px;
}

.main-image-badge {
  background: #22c55e;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.remove-btn {
  background: #94a3b8;
  color: white;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #ef4444;
  transform: scale(1.1);
}

.preview-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}

.preview-video {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}

/* Image Errors */
.image-errors,
.video-errors {
  margin-top: 16px;
}

.error-item {
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-item.error {
  background: #fee2e2;
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.error-item.warning {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  color: #92400e;
}

.error-item.first-image-error {
  background: #ffedd5;
  border-left: 4px solid #f97316;
  border: 2px solid #f97316;
}

.error-details {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
}

.upload-hint {
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.upload-hint p {
  margin: 4px 0;
}

.upload-hint p:first-child {
  font-weight: 600;
  color: #1e293b;
}

/* Market Sidebar */
.market-sidebar {
  margin-bottom: 30px;
}

/* Responsive */
@media (max-width: 768px) {
  .create-property {
    margin: 20px;
    padding: 20px;
  }

  .image-previews,
  .video-previews {
    grid-template-columns: 1fr;
  }
  
  .preview-info,
  .video-info-bar {
    flex-wrap: wrap;
  }
  
  .filename {
    width: 100%;
  }

  .ratio-toggle,
  .video-toggle {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .create-property {
    margin: 10px;
    padding: 15px;
  }

  h2 {
    font-size: 24px;
  }

  .image-upload-section,
  .video-upload-section {
    padding: 16px;
  }

  .error-details {
    flex-direction: column;
    gap: 4px;
  }
}
    `}</style>
    </>
  );
}