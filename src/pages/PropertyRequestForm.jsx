import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api"; // your existing helper


export default function PropertyRequestForm() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    age: "",
    occupation: "",
    payment_mode: "single",
    group_size: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (form.payment_mode === "group" && (!form.group_size || form.group_size < 2)) {
    setError("Group size must be at least 2");
    setLoading(false);
    return;
  }

  try {
    await apiFetch(
      `/properties/${propertyId}/request/`,
      {
        method: "POST",
        body: JSON.stringify({
          full_name: form.full_name,
          age: form.age,
          occupation: form.occupation,
          payment_mode: form.payment_mode,
          group_size: form.payment_mode === "group" ? form.group_size : null,
        }),
      }
    );

    // ✅ NAVIGATE TO EXISTING PAGE
    navigate("/my-requests");

  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="request-page">
      <form className="request-card" onSubmit={handleSubmit}>
        <h2>Property Purchase Request</h2>

        {error && <p className="error">{error}</p>}

        <label>Full Name</label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <label>Age</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <label>Occupation</label>
        <input
          type="text"
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          required
        />

        <label>Payment Mode</label>
        <select
          name="payment_mode"
          value={form.payment_mode}
          onChange={handleChange}
        >
          <option value="single">Single Payment</option>
          <option value="group">Group Payment</option>
        </select>

        {form.payment_mode === "group" && (
          <>
            <label>Number of People Paying</label>
            <input
              type="number"
              name="group_size"
              min="2"
              value={form.group_size}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
