import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

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
      await apiFetch(`/properties/${propertyId}/request/`, {
        method: "POST",
        body: JSON.stringify({
          full_name: form.full_name,
          age: form.age,
          occupation: form.occupation,
          payment_mode: form.payment_mode,
          group_size: form.payment_mode === "group" ? form.group_size : null,
        }),
      });
      navigate("/my-requests");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    },
    card: {
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
      padding: '2.5rem',
      border: '1px solid #e5e7eb',
      animation: 'fadeIn 0.4s ease-out',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 0.5rem 0',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '0.95rem',
      color: '#6b7280',
      textAlign: 'center',
      margin: '0 0 2rem 0',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.925rem',
      fontWeight: '600',
      color: '#374151',
      letterSpacing: '0.01em',
    },
    input: {
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      background: '#ffffff',
      color: '#111827',
      outline: 'none',
      fontFamily: 'inherit',
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    radioGroup: {
      display: 'flex',
      gap: '1.5rem',
      marginTop: '0.25rem',
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
    },
    radioInput: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#3b82f6',
    },
    radioLabel: {
      fontSize: '0.95rem',
      color: '#4b5563',
      cursor: 'pointer',
      userSelect: 'none',
    },
    button: {
      padding: '0.875rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#ffffff',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '0.5rem',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
    },
    buttonDisabled: {
      padding: '0.875rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#ffffff',
      background: '#9ca3af',
      border: 'none',
      borderRadius: '8px',
      cursor: 'not-allowed',
      marginTop: '0.5rem',
      opacity: '0.7',
    },
    errorAlert: {
      padding: '1rem 1.25rem',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      fontSize: '0.925rem',
      fontWeight: '500',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .property-input:hover {
            border-color: #cbd5e1 !important;
          }

          .property-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }

          .property-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3) !important;
            transform: translateY(-1px);
          }

          .property-button:active:not(:disabled) {
            transform: translateY(0);
          }

          @media (max-width: 640px) {
            .property-container {
              padding: 1rem !important;
              margin: 1rem auto !important;
            }
            .property-card {
              padding: 1.5rem !important;
            }
            .property-title {
              font-size: 1.5rem !important;
            }
            .property-subtitle {
              font-size: 0.875rem !important;
            }
            .property-radio-group {
              flex-direction: column !important;
              gap: 1rem !important;
            }
          }
        `}
      </style>

      <div style={styles.card} className="property-card">
        <h1 style={styles.title} className="property-title">
          Property Purchase Request
        </h1>
        <p style={styles.subtitle} className="property-subtitle">
          Fill out the form below to submit your request
        </p>

        {error && (
          <div style={styles.errorAlert}>
            <span>⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="full_name">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              style={styles.input}
              className="property-input"
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="age">
              Age
            </label>
            <input
              id="age"
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              style={styles.input}
              className="property-input"
              placeholder="Enter your age"
              min="18"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="occupation">
              Occupation
            </label>
            <input
              id="occupation"
              type="text"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              required
              style={styles.input}
              className="property-input"
              placeholder="Enter your occupation"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Mode</label>
            <div style={styles.radioGroup} className="property-radio-group">
              <label style={styles.radioOption}>
                <input
                  type="radio"
                  name="payment_mode"
                  value="single"
                  checked={form.payment_mode === "single"}
                  onChange={handleChange}
                  style={styles.radioInput}
                />
                <span style={styles.radioLabel}>Single Payment</span>
              </label>
              <label style={styles.radioOption}>
                <input
                  type="radio"
                  name="payment_mode"
                  value="group"
                  checked={form.payment_mode === "group"}
                  onChange={handleChange}
                  style={styles.radioInput}
                />
                <span style={styles.radioLabel}>Group Payment</span>
              </label>
            </div>
          </div>

          {form.payment_mode === "group" && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="group_size">
                Number of People Paying
              </label>
              <input
                id="group_size"
                type="number"
                name="group_size"
                value={form.group_size}
                onChange={handleChange}
                min="2"
                required
                style={styles.input}
                className="property-input"
                placeholder="Enter number of people (min. 2)"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
            className="property-button"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}