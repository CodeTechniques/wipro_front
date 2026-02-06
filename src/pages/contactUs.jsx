import React, { useState } from "react";
import { 
  ChatCircleDots,
  EnvelopeSimple,
  Phone
} from "phosphor-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    // You can add API call or form handling here
  };

  return (
    <div className="contact-page">
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
          <div>
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
              <p className="contact-info-text">+1 (938) 209 0088</p>
              <span className="contact-info-badge">MON – SAT: 10AM – 7PM</span>
            </div>
          </div>

          {/* RIGHT - Form */}
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <div>
                  <label className="contact-label">FULL NAME</label>
                  <input 
                    type="text" 
                    name="fullName"
                    className="contact-input"
                    placeholder="e.g. Aman Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="contact-label">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    name="email"
                    className="contact-input"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-full">
                  <label className="contact-label">YOUR MESSAGE</label>
                  <textarea 
                    name="message"
                    className="contact-textarea"
                    placeholder="How can we assist you today?"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message →
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
        }

        .contact-page * {
          box-sizing: border-box;
        }

        .contact-page {
          background: #f8fffb;
          color: #020617;
        }

        .contact-container {
          max-width: 1200px;
          margin: auto;
          padding: 80px 16px;
        }

        .contact-center {
          text-align: center;
          margin-bottom: 60px;
        }

        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #dcfce7;
          color: #15803d;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .contact-main-title {
          font-size: 48px;
          margin-bottom: 12px;
          margin-top: 0;
        }

        .contact-subtitle {
          max-width: 720px;
          margin: auto;
          color: #475569;
          font-size: 16px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 40px;
          margin-top: 60px;
        }

        .contact-info-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          margin-bottom: 24px;
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
          margin: 0 0 6px;
          font-size: 18px;
        }

        .contact-info-text {
          margin: 0;
          font-size: 15px;
          color: #475569;
        }

        .contact-info-badge {
          display: block;
          margin-top: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #16a34a;
        }

        .contact-form-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }

        .contact-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .contact-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 6px;
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .contact-textarea {
          resize: none;
          height: 140px;
        }

        .contact-input:focus,
        .contact-textarea:focus {
          border-color: #22c55e;
        }

        .contact-full {
          grid-column: 1 / -1;
        }

        .contact-submit-btn {
          margin-top: 20px;
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 14px 28px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .contact-submit-btn:hover {
          background: #15803d;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-main-title {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;