import { useState, useRef } from "react";
import { apiFetch } from "../api/api";
import "./create-property.css";
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

export default function CreateProperty() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [ratioValidationEnabled, setRatioValidationEnabled] = useState(true);
  
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

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageErrors(prev => prev.filter(err => err.index !== index));
  };

  const clearAllImages = () => {
    setImages([]);
    setImageErrors([]);
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

      // Store the API response for the result modal
      setApiResponse(propertyResponse);
      
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
          
          <div className="ratio-info text-black">
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
            className="file-input form-input"
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

        <button type="submit" disabled={loading}>
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
  );
}