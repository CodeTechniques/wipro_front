import { useState } from "react";
import { apiFetch } from "../api/api";
import "./create-property.css";
import { useNavigate } from "react-router-dom";
import MiniVerticalNav from "../components/MiniVerticalNav";
import PropertyCreationConfirmationModal from "../components/PropertyCreationConfirmationModal";
import PropertyCreationResultModal from "../components/PropertyCreationResultModal";

export default function CreateProperty() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  
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

  /* ---------------- HELPERS ---------------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files));
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
          placeholder="Title" 
          required 
          value={form.title}
          onChange={handleChange} 
        />
        
        <textarea 
          name="description" 
          placeholder="Description" 
          value={form.description}
          onChange={handleChange} 
        />

        <select name="property_type" value={form.property_type} onChange={handleChange}>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
        </select>

        <select name="listing_type" value={form.listing_type} onChange={handleChange}>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="both">Sale & Rent</option>
        </select>

        <input 
          name="price" 
          type="number" 
          placeholder="Price" 
          required 
          value={form.price}
          onChange={handleChange} 
        />
        
        <input 
          name="rent_price" 
          type="number" 
          placeholder="Rent Price (optional)" 
          value={form.rent_price}
          onChange={handleChange} 
        />

        <input 
          name="location" 
          placeholder="Location" 
          required 
          value={form.location}
          onChange={handleChange} 
        />
        
        <input 
          name="address" 
          placeholder="Full Address" 
          required 
          value={form.address}
          onChange={handleChange} 
        />
        
        <input 
          name="city" 
          placeholder="City" 
          required 
          value={form.city}
          onChange={handleChange} 
        />
        
        <input 
          name="state" 
          placeholder="State" 
          required 
          value={form.state}
          onChange={handleChange} 
        />
        
        <input 
          name="pincode" 
          placeholder="Pincode" 
          required 
          value={form.pincode}
          onChange={handleChange} 
        />

        <input 
          name="area_sqft" 
          type="number" 
          placeholder="Area (sqft)" 
          required 
          value={form.area_sqft}
          onChange={handleChange} 
        />
        
        <input 
          name="bedrooms" 
          type="number" 
          placeholder="Bedrooms" 
          value={form.bedrooms}
          onChange={handleChange} 
        />
        
        <input 
          name="bathrooms" 
          type="number" 
          placeholder="Bathrooms" 
          value={form.bathrooms}
          onChange={handleChange} 
        />

        {/* 🔥 IMAGE UPLOAD */}
        <h4>Property Images</h4>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleImagesChange} 
        />

        <h4>Contact</h4>
        <input 
          name="contact_name" 
          placeholder="Contact Name" 
          required 
          value={form.contact_name}
          onChange={handleChange} 
        />
        
        <input 
          name="contact_phone" 
          placeholder="Contact Phone" 
          required 
          value={form.contact_phone}
          onChange={handleChange} 
        />
        
        <input 
          name="contact_email" 
          type="email" 
          placeholder="Contact Email" 
          required 
          value={form.contact_email}
          onChange={handleChange} 
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