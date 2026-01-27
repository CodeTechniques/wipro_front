import { useState } from "react";
import "./PropertyForm.css";

export default function PropertyForm({ initialData, onSubmit, submitText }) {
  const normalize = (data) => ({
    ...data,

    title: data.title || "",
    description: data.description || "",
    location: data.location || "",
    address: data.address || "",
    city: data.city || "",
    state: data.state || "",
    pincode: data.pincode || "",
    contact_name: data.contact_name || "",
    contact_phone: data.contact_phone || "",
    contact_email: data.contact_email || "",

    price: data.price ?? "",
    rent_price: data.rent_price ?? "",
    area_sqft: data.area_sqft ?? "",
    bedrooms: data.bedrooms ?? 0,
    bathrooms: data.bathrooms ?? 0,

    furnished: !!data.furnished,
    ac_available: !!data.ac_available,
    balcony: !!data.balcony,
    gym: !!data.gym,
    swimming_pool: !!data.swimming_pool,
    garden: !!data.garden,
    security: !!data.security,
    lift_available: !!data.lift_available,
    power_backup: !!data.power_backup,

    investment_enabled: !!data.investment_enabled,
    investors_required: data.investors_required ?? "",
    investors_min: data.investors_min ?? "",
    investors_max: data.investors_max ?? "",
  });

  const [form, setForm] = useState(() => normalize(initialData));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      {/* BASIC */}
      <section className="form-card">
        <h3>Basic Information</h3>

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <div className="grid-2">
          <div>
            <label>Property Type</label>
            <select name="property_type" value={form.property_type} onChange={handleChange}>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
            </select>
          </div>

          <div>
            <label>Listing Type</label>
            <select name="listing_type" value={form.listing_type} onChange={handleChange}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="both">Sale & Rent</option>
            </select>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="form-card">
        <h3>Location</h3>

        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} />

        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} />

        <div className="grid-3">
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" />
          <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" />
        </div>
      </section>

      {/* PRICING */}
      <section className="form-card">
        <h3>Pricing</h3>

        <div className="grid-2">
          <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" />
          <input type="number" name="rent_price" value={form.rent_price} onChange={handleChange} placeholder="Rent (optional)" />
        </div>
      </section>

      {/* DETAILS */}
      <section className="form-card">
        <h3>Property Details</h3>

        <div className="grid-3">
          <input type="number" name="area_sqft" value={form.area_sqft} onChange={handleChange} placeholder="Area (sqft)" />
          <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="Bedrooms" />
          <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="Bathrooms" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="form-card">
        <h3>Features</h3>

        <div className="features-grid">
          {[
            ["furnished", "Furnished"],
            ["ac_available", "AC"],
            ["balcony", "Balcony"],
            ["gym", "Gym"],
            ["swimming_pool", "Swimming Pool"],
            ["garden", "Garden"],
            ["security", "Security"],
            ["lift_available", "Lift"],
            ["power_backup", "Power Backup"],
          ].map(([key, label]) => (
            <label key={key} className={`feature-tile ${form[key] ? "active" : ""}`}>
              <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* INVESTMENT */}
      <section className="form-card">
        <h3>Group Investment</h3>

        <label className="switch">
          <input type="checkbox" name="investment_enabled" checked={form.investment_enabled} onChange={handleChange} />
          Enable Group Investment
        </label>

        {form.investment_enabled && (
          <div className="grid-3">
            <input type="number" name="investors_required" value={form.investors_required} onChange={handleChange} placeholder="Required" />
            <input type="number" name="investors_min" value={form.investors_min} onChange={handleChange} placeholder="Min" />
            <input type="number" name="investors_max" value={form.investors_max} onChange={handleChange} placeholder="Max" />
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section className="form-card">
        <h3>Contact</h3>

        <div className="grid-3">
          <input name="contact_name" value={form.contact_name} onChange={handleChange} placeholder="Name" />
          <input name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="Phone" />
          <input name="contact_email" value={form.contact_email} onChange={handleChange} placeholder="Email" />
        </div>
      </section>

      <button className="submit-btn">{submitText}</button>
    </form>
  );
}
