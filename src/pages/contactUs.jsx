import React, { useState } from "react";
import { 
  ChatCircleDots,
  EnvelopeSimple,
  Phone
} from "phosphor-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget this import
import { apiFetch } from "../api/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Changed from false to true
    
    try {
      const response = await apiFetch("/auth/contact-us/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          full_name: formData.fullName
        }),
      });
      
      console.log("API Response:", response);
      
      // Clear form on success
      setFormData({
        fullName: '',
        email: '',
        message: ''
      });
      
      // Show success toast
      toast.success(response.message || "Message sent successfully!");
      
    } catch (err) {
      console.error("Error:", err);
      toast.error(err?.detail || err?.message || "Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Add ToastContainer at the top level */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <section className="contact-container">
        {/* TOP TEXT */}
        <div className="contact-center">
          <div className="contact-badge">
            <ChatCircleDots size={16} weight="fill" />
            HELP & SUPPORT CENTER
          </div>

          <h1 className="contact-main-title">How can we help you?</h1>
          <p className="contact-subtitle">
            Our dedicated support team is here to assist you with your WIPO account,
            investments, and technical queries.
          </p>
        </div>

        {/* CONTENT */}
        <div className="contact-grid">
          {/* LEFT - Info Cards */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <EnvelopeSimple size={24} weight="duotone" />
              </div>
              <h3 className="contact-info-title">Email Support</h3>
              <p className="contact-info-text">wipogroupn@gmail.com</p>
              <span className="contact-info-badge">24/7 RESPONSE RATE</span>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <Phone size={24} weight="duotone" />
              </div>
              <h3 className="contact-info-title">Phone Number</h3>
              <p className="contact-info-text">+91 9759109006</p>
              <p className="contact-info-text">+1 (938) 209 0088</p>
              <span className="contact-info-badge">MON – SAT: 10AM – 7PM</span>
            </div>
          </div>

          {/* RIGHT - Form */}
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <div className="form-group">
                  <label className="contact-label">FULL NAME</label>
                  <input 
                    type="text" 
                    name="fullName"
                    className="contact-input"
                    placeholder="e.g. Your Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="contact-label">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    name="email"
                    className="contact-input"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="contact-full form-group">
                  <label className="contact-label">YOUR MESSAGE</label>
                  <textarea 
                    name="message"
                    className="contact-textarea"
                    placeholder="How can we assist you today?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="contact-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  "Send Message →"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Scoped CSS Styles */}
      <style>
      {`
        .contact-page {
          box-sizing: border-box;
          min-height: 100vh;
          padding: 0;
          margin: 0;
        }

        .contact-page * {
          box-sizing: border-box;
        }

        .contact-page {
          background: #f8fffb;
          color: #020617;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
          width: 100%;
        }

        .contact-center {
          text-align: center;
          margin-bottom: 60px;
          padding: 0 10px;
        }

        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #dcfce7;
          color: #15803d;
          padding: 8px 20px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .contact-main-title {
          font-size: clamp(32px, 5vw, 48px);
          margin-bottom: 16px;
          margin-top: 0;
          line-height: 1.2;
          font-weight: 700;
        }

        .contact-subtitle {
          max-width: 720px;
          margin: 0 auto;
          color: #475569;
          font-size: 16px;
          line-height: 1.6;
          padding: 0 20px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 40px;
          margin-top: 60px;
        }

        .contact-info-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .contact-info-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          flex: 1;
        }

        .contact-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .contact-info-icon {
          width: 52px;
          height: 52px;
          background: #ecfdf5;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #16a34a;
        }

        .contact-info-title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 600;
        }

        .contact-info-text {
          margin: 0;
          font-size: 15px;
          color: #475569;
          line-height: 1.5;
        }

        .contact-info-badge {
          display: block;
          margin-top: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #16a34a;
        }

        .contact-form-card {
          background: #ffffff;
          border-radius: 28px;
          padding: clamp(24px, 4vw, 40px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }

        .contact-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          width: 100%;
        }

        .contact-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 8px;
          display: block;
        }

        .contact-input,
        .contact-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }

        .contact-textarea {
          resize: none;
          min-height: 140px;
          line-height: 1.5;
        }

        .contact-input:focus,
        .contact-textarea:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .contact-full {
          grid-column: 1 / -1;
        }

        .contact-submit-btn {
          margin-top: 24px;
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 16px 32px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .contact-submit-btn:hover:not(:disabled) {
          background: #15803d;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(22, 163, 74, 0.2);
        }

        .contact-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid #ffffff;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .contact-container {
            padding: 40px 16px;
          }
          
          .contact-grid {
            gap: 30px;
          }
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .contact-info-section {
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .contact-info-card {
            flex: 1;
            min-width: 280px;
          }
        }

        @media (max-width: 768px) {
          .contact-center {
            margin-bottom: 40px;
          }
          
          .contact-main-title {
            font-size: 32px;
          }
          
          .contact-subtitle {
            font-size: 15px;
            padding: 0 10px;
          }
          
          .contact-form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .contact-info-section {
            flex-direction: column;
          }
          
          .contact-info-card {
            min-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .contact-container {
            padding: 30px 16px;
          }
          
          .contact-center {
            margin-bottom: 30px;
          }
          
          .contact-main-title {
            font-size: 28px;
          }
          
          .contact-badge {
            font-size: 12px;
            padding: 6px 16px;
          }
          
          .contact-form-card {
            padding: 24px;
            border-radius: 20px;
          }
          
          .contact-submit-btn {
            padding: 14px 24px;
            font-size: 14px;
          }
        }

        @media (max-width: 360px) {
          .contact-main-title {
            font-size: 24px;
          }
          
          .contact-info-card,
          .contact-form-card {
            padding: 20px;
          }
          
          .contact-input,
          .contact-textarea {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;