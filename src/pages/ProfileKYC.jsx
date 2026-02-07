import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  ShieldCheck, 
  Person, 
  Globe, 
  IdentificationCard, 
  CreditCard, 
  Bank, 
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Phone,
  Envelope
} from "phosphor-react";

export default function KYC() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kyc_type: "", // indian | foreign
    email: "",
    phone_number: "",
    aadhar_number: "",
    pan_number: "",
    aadhar_front_photo: null,
    aadhar_back_photo: null,
    pan_card_photo: null,
    passport_number: "",
    passport_photo: null,
    international_id_number: "",
    international_id_photo: null,
    upi_id: "",
    bank_name: "",
    bank_account_number: "",
    bank_ifsc_code: "",
    usdt_address: "",
  });

  const [status, setStatus] = useState("form"); // form | pending | approved | rejected
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [filePreviews, setFilePreviews] = useState({});

  // Load existing KYC status
  useEffect(() => {
    apiFetch("/auth/kyc/")
      .then((res) => {
        if (res.exists) {
          setStatus(res.status);
        }
      })
      .catch(() => {});
  }, []);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (name, file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
      toast.error('Please upload only images (JPG, PNG) or PDF files');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => ({
          ...prev,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF files, clear any image preview
      setFilePreviews(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Update form with file
    setForm(prev => ({
      ...prev,
      [name]: file
    }));
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: "" }));
    
    toast.success(`${file.name} selected`);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Phone validation
    if (!form.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\+?[0-9]{7,15}$/.test(form.phone_number)) {
      newErrors.phone_number = "Enter a valid international phone number";
    }

    // KYC Type validation
    if (!form.kyc_type) {
      newErrors.kyc_type = "Please select KYC type";
    }

    // Indian KYC validation
    if (form.kyc_type === "indian") {
      if (!form.aadhar_number) {
        newErrors.aadhar_number = "Aadhaar number is required";
      } else if (!/^\d{12}$/.test(form.aadhar_number)) {
        newErrors.aadhar_number = "Aadhaar must be 12 digits";
      }

      if (!form.pan_number) {
        newErrors.pan_number = "PAN number is required";
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan_number)) {
        newErrors.pan_number = "Invalid PAN format (ABCDE1234F)";
      }

      if (!form.aadhar_front_photo) {
        newErrors.aadhar_front_photo = "Aadhaar front photo is required";
      }

      if (!form.pan_card_photo) {
        newErrors.pan_card_photo = "PAN card photo is required";
      }
    }

    // Foreign KYC validation
    if (form.kyc_type === "foreign") {
      if (!form.passport_number) {
        newErrors.passport_number = "Passport number is required";
      }

      if (!form.passport_photo) {
        newErrors.passport_photo = "Passport photo is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitKYC = async () => {
    if (!validateForm()) {
      Object.values(errors).forEach(error => {
        toast.error(error);
      });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      // Append all form fields to FormData
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          if (form[key] instanceof File) {
            // Append file with proper field name
            data.append(key, form[key]);
          } else {
            // Append text fields
            data.append(key, form[key]);
          }
        }
      });

      // Add referral code if exists
      const referralCode = localStorage.getItem("referral_code");
      if (referralCode) {
        data.append("referral_code", referralCode);
      }

      // Send FormData directly to backend
      await apiFetch("/auth/kyc/", {
        method: "POST",
        body: data,
      });

      localStorage.removeItem("referral_code");
      setStatus("pending");
      toast.success("KYC submitted successfully! Verification in progress.");
    } catch (error) {
      console.error("KYC submission error:", error);
      toast.error(error?.detail || error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (name) => {
    setForm(prev => ({ ...prev, [name]: null }));
    setFilePreviews(prev => ({ ...prev, [name]: null }));
  };

  // Status UI (PENDING / APPROVED / REJECTED)
// Status UI (PENDING / APPROVED / REJECTED)
if (["pending", "approved", "rejected"].includes(status)) {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="kyc-status-container">
        <div className={`kyc-status-card ${status}`}>
          {/* Status Icon with Animation */}
          <div className="status-icon-wrapper">
            <div className="status-icon">
              {status === "pending" && (
                <>
                  <div className="pulse-animation"></div>
                  <Clock size={80} weight="duotone" />
                </>
              )}
              {status === "approved" && (
                <>
                  <div className="success-glow"></div>
                  <CheckCircle size={80} weight="duotone" />
                </>
              )}
              {status === "rejected" && (
                <XCircle size={80} weight="duotone" />
              )}
            </div>
          </div>
          
          {/* Status Title with Badge */}
          <div className="status-header">
            <h2 className="status-title">
              {status === "pending" && "Verification in Progress"}
              {status === "approved" && "KYC Verified Successfully"}
              {status === "rejected" && "Verification Failed"}
            </h2>
            <span className={`status-badge ${status}`}>
              {status === "pending" && "Processing"}
              {status === "approved" && "Verified"}
              {status === "rejected" && "Rejected"}
            </span>
          </div>
          
          {/* Status Description */}
          <div className="status-description-wrapper">
            <p className="status-description">
              {status === "pending" && 
                "Your KYC documents have been successfully submitted. Our verification team is reviewing your information. You'll receive a notification once the process is complete."}
              {status === "approved" && 
                "Congratulations! Your identity verification is complete. Your account is now fully verified with enhanced security features and access to all platform services."}
              {status === "rejected" && 
                "We were unable to verify your identity with the submitted documents. This could be due to blurry images, expired documents, or information mismatch. Please review and resubmit."}
            </p>
            
            {/* Additional Info for Pending Status */}
            {status === "pending" && (
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot active"></div>
                  <div className="timeline-content">
                    <h4>Document Submitted</h4>
                    <p>Your documents have been received</p>
                    <span className="timeline-time">Just now</span>
                  </div>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Verification Complete</h4>
                    <p>Our team is verifying your documents</p>
                    <span className="timeline-time">Estimated: 24-48 hours</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Steps for Rejected Status */}
            {status === "rejected" && (
              <div className="action-steps">
                <h4>Next Steps:</h4>
                <ul className="steps-list">
                  {/* <li>
                    <span className="step-number">1</span>
                    Review the rejection reason email
                  </li> */}
                  <li>
                    <span className="step-number">1</span>
                    Ensure documents are clear and valid
                  </li>
                  <li>
                    <span className="step-number">2</span>
                    Update any incorrect information
                  </li>
                  <li>
                    <span className="step-number">3</span>
                    Resubmit your KYC application
                  </li>
                </ul>
              </div>
            )}
            
            {/* Benefits for Approved Status */}
            {status === "approved" && (
              <div className="benefits-section">
                <h4>✅ Your account is now enabled for:</h4>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <ShieldCheck size={24} />
                    <span>Full account security</span>
                  </div>
                  <div className="benefit-item">
                    <CreditCard size={24} />
                    <span>Unlimited transactions</span>
                  </div>
                  <div className="benefit-item">
                    <Bank size={24} />
                    <span>withdrawals</span>
                  </div>
                  <div className="benefit-item">
                    <Globe size={24} />
                    <span>access controll</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Status Info Cards */}
          {status === "pending" && (
            <div className="status-info-cards">
              <div className="info-card">
                <div className="info-icon">
                  <Clock size={24} />
                </div>
                <div className="info-content">
                  <h5>Processing Time</h5>
                  <p>24-48 hours during business days</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="info-content">
                  <h5>Data Security</h5>
                  <p>256-bit encryption & GDPR compliant</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <Phone size={24} />
                </div>
                <div className="info-content">
                  <h5>Need Help?</h5>
                  <p>Contact: wipogroupn@gmail.com</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="status-actions">
            {status === "pending" && (
              <>
                <button 
                  className="status-button secondary"
                  onClick={() => navigate("/home")}
                >
                  Go to Home
                </button>
                <button 
                  className="status-button"
                  onClick={() => window.location.reload()}
                >
                  Refresh Status
                </button>
              </>
            )}
            
            {status === "approved" && (
              <>
                <button 
                  className="status-button"
                  onClick={() => navigate("/home")}
                >
                  Go to Home
                </button>
                <button 
                  className="status-button secondary"
                  onClick={() => navigate("/profile")}
                >
                  View Profile
                </button>
              </>
            )}
            
            {status === "rejected" && (
              <>
                <button 
                  className="status-button"
                  onClick={() => setStatus("form")}
                >
                  Resubmit KYC
                </button>
                <button 
                  className="status-button secondary"
                  onClick={() => navigate("/contactUs")}
                >
                  Contact Support
                </button>
                <button 
                  className="status-button outline"
                  onClick={() => navigate("/home")}
                >
                  Go to Home
                </button>
              </>
            )}
          </div>
          
          {/* Footer Note */}
          <div className="status-footer">
            <p>
              <ShieldCheck size={16} />
              Your information is protected by bank-level security
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .kyc-status-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .kyc-status-card {
          background: white;
          border-radius: 28px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          padding: 48px;
          text-align: center;
          max-width: 800px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .kyc-status-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, 
            ${status === 'pending' ? '#f59e0b' : 
              status === 'approved' ? '#10b981' : 
              '#ef4444'} 0%, 
            ${status === 'pending' ? '#fbbf24' : 
              status === 'approved' ? '#34d399' : 
              '#f87171'} 100%);
        }

        .status-icon-wrapper {
          position: relative;
          margin-bottom: 32px;
        }

        .status-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 auto;
        }

        .kyc-status-card.pending .status-icon {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #d97706;
        }

        .kyc-status-card.approved .status-icon {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #059669;
        }

        .kyc-status-card.rejected .status-icon {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #dc2626;
        }

        .pulse-animation {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.2);
          animation: pulse 2s infinite;
        }

        .success-glow {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
          animation: glow 2s infinite;
        }

        .status-header {
          margin-bottom: 24px;
        }

        .status-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }

        .status-badge {
          display: inline-block;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-description-wrapper {
          margin-bottom: 40px;
          text-align: left;
        }

        .status-description {
          font-size: 1.125rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 32px;
          text-align: center;
        }

        /* Timeline for Pending Status */
        .timeline {
          position: relative;
          margin: 32px 0;
          padding-left: 30px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e2e8f0;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 32px;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          left: -30px;
          top: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e2e8f0;
          border: 4px solid white;
          z-index: 1;
        }

        .timeline-dot.active {
          background: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
        }

        .timeline-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .timeline-content p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 4px 0;
        }

        .timeline-time {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Action Steps for Rejected Status */
        .action-steps {
          background: #f8fafc;
          border-radius: 16px;
          padding: 24px;
          margin: 24px 0;
        }

        .action-steps h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 16px 0;
          text-align: center;
        }

        .steps-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .steps-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          color: #475569;
          font-size: 0.875rem;
        }

        .steps-list li:last-child {
          margin-bottom: 0;
        }

        .step-number {
          width: 24px;
          height: 24px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        /* Benefits for Approved Status */
        .benefits-section {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-radius: 16px;
          padding: 24px;
          margin: 24px 0;
        }

        .benefits-section h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #065f46;
          margin: 0 0 20px 0;
          text-align: center;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #047857;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .benefit-item svg {
          flex-shrink: 0;
        }

        /* Status Info Cards */
        .status-info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 32px 0;
        }

        .info-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .info-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          color: white;
        }

        .info-content h5 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .info-content p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        /* Status Actions */
        .status-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin: 32px 0;
          flex-wrap: wrap;
        }

        .status-button {
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          min-width: 160px;
        }

        .status-button:not(.secondary):not(.outline) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .status-button:not(.secondary):not(.outline):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .status-button.secondary {
          background: #f1f5f9;
          color: #475569;
        }

        .status-button.secondary:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .status-button.outline {
          background: transparent;
          border-color: #cbd5e1;
          color: #475569;
        }

        .status-button.outline:hover {
          border-color: #94a3b8;
          transform: translateY(-2px);
        }

        /* Status Footer */
        .status-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .status-footer p {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.875rem;
          margin: 0;
        }

        .status-footer svg {
          color: #10b981;
        }

        /* Animations */
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .kyc-status-card {
            padding: 32px;
            margin: 20px;
          }

          .status-title {
            font-size: 2rem;
          }

          .status-description {
            font-size: 1rem;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .status-info-cards {
            grid-template-columns: 1fr;
          }

          .status-actions {
            flex-direction: column;
          }

          .status-button {
            width: 100%;
          }

          .timeline {
            padding-left: 20px;
          }

          .timeline::before {
            left: 10px;
          }

          .timeline-dot {
            left: -20px;
            width: 24px;
            height: 24px;
          }
        }

        @media (max-width: 480px) {
          .kyc-status-card {
            padding: 24px;
          }

          .status-title {
            font-size: 1.75rem;
          }

          .status-icon {
            width: 100px;
            height: 100px;
          }

          .status-icon svg {
            width: 60px;
            height: 60px;
          }

          .pulse-animation,
          .success-glow {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </>
  );
}

  // Form UI
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="kyc-container">
        <div className="kyc-header">
          <h1 className="kyc-title">Complete Your KYC Verification</h1>
          <p className="kyc-subtitle">
            Secure your account and unlock all features with identity verification
          </p>
        </div>

        <div className="kyc-card">
          {/* KYC Type Selector */}
          <div className="kyc-section">
            <div className="section-header">
              <ShieldCheck size={24} weight="duotone" />
              <h3>Select KYC Type</h3>
            </div>
            
            <div className="kyc-type-grid">
              <label className={`kyc-type-card ${form.kyc_type === "indian" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="kyc_type"
                  value="indian"
                  onChange={handleTextChange}
                  hidden
                />
                <div className="type-icon">
                  <Person size={32} weight="duotone" />
                </div>
                <div className="type-content">
                  <h4>Indian Citizen</h4>
                  <p>Aadhaar & PAN verification</p>
                </div>
              </label>
              
              <label className={`kyc-type-card ${form.kyc_type === "foreign" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="kyc_type"
                  value="foreign"
                  onChange={handleTextChange}
                  hidden
                />
                <div className="type-icon">
                  <Globe size={32} weight="duotone" />
                </div>
                <div className="type-content">
                  <h4>Foreign Citizen</h4>
                  <p>Passport verification</p>
                </div>
              </label>
            </div>
            
            {errors.kyc_type && <div className="error-text">{errors.kyc_type}</div>}
          </div>

          {/* Basic Information */}
          <div className="kyc-section">
            <div className="section-header">
              <Person size={24} weight="duotone" />
              <h3>Basic Information</h3>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Envelope size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={handleTextChange}
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  className={`form-input ${errors.phone_number ? 'error' : ''}`}
                  placeholder="+91 9876543210"
                  value={form.phone_number}
                  onChange={handleTextChange}
                />
                {errors.phone_number && <div className="error-text">{errors.phone_number}</div>}
              </div>
            </div>
          </div>

          {/* Indian KYC Section */}
          {form.kyc_type === "indian" && (
            <div className="kyc-section">
              <div className="section-header">
                <IdentificationCard size={24} weight="duotone" />
                <h3>Indian KYC Documents</h3>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Aadhaar Number *</label>
                  <input
                    type="text"
                    name="aadhar_number"
                    className={`form-input ${errors.aadhar_number ? 'error' : ''}`}
                    placeholder="1234 5678 9012"
                    value={form.aadhar_number}
                    onChange={handleTextChange}
                  />
                  {errors.aadhar_number && <div className="error-text">{errors.aadhar_number}</div>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">PAN Number *</label>
                  <input
                    type="text"
                    name="pan_number"
                    className={`form-input ${errors.pan_number ? 'error' : ''}`}
                    placeholder="ABCDE1234F"
                    value={form.pan_number}
                    onChange={handleTextChange}
                  />
                  {errors.pan_number && <div className="error-text">{errors.pan_number}</div>}
                </div>
              </div>
              
              <div className="upload-grid">
                <FileUpload
                  name="aadhar_front_photo"
                  label="Aadhaar Front Photo *"
                  error={errors.aadhar_front_photo}
                  preview={filePreviews.aadhar_front_photo}
                  fileName={form.aadhar_front_photo?.name}
                  onChange={(file) => handleFileChange("aadhar_front_photo", file)}
                  onRemove={() => removeFile("aadhar_front_photo")}
                />
                
                <FileUpload
                  name="aadhar_back_photo"
                  label="Aadhaar Back Photo"
                  error={errors.aadhar_back_photo}
                  preview={filePreviews.aadhar_back_photo}
                  fileName={form.aadhar_back_photo?.name}
                  onChange={(file) => handleFileChange("aadhar_back_photo", file)}
                  onRemove={() => removeFile("aadhar_back_photo")}
                />
                
                <FileUpload
                  name="pan_card_photo"
                  label="PAN Card Photo *"
                  error={errors.pan_card_photo}
                  preview={filePreviews.pan_card_photo}
                  fileName={form.pan_card_photo?.name}
                  onChange={(file) => handleFileChange("pan_card_photo", file)}
                  onRemove={() => removeFile("pan_card_photo")}
                />
              </div>
            </div>
          )}

          {/* Foreign KYC Section */}
          {form.kyc_type === "foreign" && (
            <div className="kyc-section">
              <div className="section-header">
                <Globe size={24} weight="duotone" />
                <h3>Foreign KYC Documents</h3>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Passport Number *</label>
                  <input
                    type="text"
                    name="passport_number"
                    className={`form-input ${errors.passport_number ? 'error' : ''}`}
                    placeholder="A12345678"
                    value={form.passport_number}
                    onChange={handleTextChange}
                  />
                  {errors.passport_number && <div className="error-text">{errors.passport_number}</div>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">International ID Number</label>
                  <input
                    type="text"
                    name="international_id_number"
                    className="form-input"
                    placeholder="ID Number"
                    value={form.international_id_number}
                    onChange={handleTextChange}
                  />
                </div>
              </div>
              
              <div className="upload-grid">
                <FileUpload
                  name="passport_photo"
                  label="Passport Photo *"
                  error={errors.passport_photo}
                  preview={filePreviews.passport_photo}
                  fileName={form.passport_photo?.name}
                  onChange={(file) => handleFileChange("passport_photo", file)}
                  onRemove={() => removeFile("passport_photo")}
                />
                
                <FileUpload
                  name="international_id_photo"
                  label="International ID Photo"
                  error={errors.international_id_photo}
                  preview={filePreviews.international_id_photo}
                  fileName={form.international_id_photo?.name}
                  onChange={(file) => handleFileChange("international_id_photo", file)}
                  onRemove={() => removeFile("international_id_photo")}
                />
              </div>
            </div>
          )}

          {/* Payment Details */}
          {form.kyc_type && (
            <div className="kyc-section">
              <div className="section-header">
                <CreditCard size={24} weight="duotone" />
                <h3>Payment & Withdrawal Details</h3>
              </div>
              
              <div className="form-grid">
                {form.kyc_type === "indian" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">UPI ID</label>
                      <input
                        type="text"
                        name="upi_id"
                        className="form-input"
                        placeholder="username@upi"
                        value={form.upi_id}
                        onChange={handleTextChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Bank Name</label>
                      <input
                        type="text"
                        name="bank_name"
                        className="form-input"
                        placeholder="Bank Name"
                        value={form.bank_name}
                        onChange={handleTextChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Account Number</label>
                      <input
                        type="text"
                        name="bank_account_number"
                        className="form-input"
                        placeholder="Account Number"
                        value={form.bank_account_number}
                        onChange={handleTextChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">IFSC Code</label>
                      <input
                        type="text"
                        name="bank_ifsc_code"
                        className="form-input"
                        placeholder="IFSC Code"
                        value={form.bank_ifsc_code}
                        onChange={handleTextChange}
                      />
                    </div>
                  </>
                )}
                
                <div className="form-group">
                  <label className="form-label">USDT Address</label>
                  <input
                    type="text"
                    name="usdt_address"
                    className="form-input"
                    placeholder="0x..."
                    value={form.usdt_address}
                    onChange={handleTextChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            className="submit-button" 
            onClick={submitKYC} 
            disabled={loading || !form.kyc_type}
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Submitting...
              </>
            ) : (
              'Submit KYC Verification'
            )}
          </button>
          
          <div className="kyc-footer">
            <div className="security-note">
              <ShieldCheck size={18} />
              <span>Your information is encrypted and securely stored</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .kyc-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .kyc-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .kyc-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .kyc-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .kyc-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          padding: 40px;
        }

        .kyc-section {
          margin-bottom: 40px;
          padding-bottom: 32px;
          border-bottom: 1px solid #e2e8f0;
        }

        .kyc-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .section-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .section-header svg {
          color: #667eea;
        }

        .kyc-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 12px;
        }

        .kyc-type-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .kyc-type-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .kyc-type-card.active {
          border-color: #667eea;
          background: #f0f4ff;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }

        .type-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .type-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .type-content p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          color: #1e293b;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .form-input.error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-text {
          font-size: 0.875rem;
          color: #ef4444;
          margin-top: 4px;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .file-upload {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          background: white;
        }

        .file-upload:hover {
          border-color: #667eea;
        }

        .file-upload.error {
          border-color: #ef4444;
        }

        .upload-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .upload-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .remove-btn:hover {
          background: #fee2e2;
        }

        .file-preview {
          position: relative;
          margin-bottom: 12px;
        }

        .preview-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }

        .file-input {
          display: none;
        }

        .upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .upload-icon {
          color: #64748b;
          margin-bottom: 8px;
        }

        .upload-area:hover .upload-icon {
          color: #667eea;
        }

        .upload-text {
          margin: 0;
          font-weight: 600;
          color: #475569;
        }

        .upload-subtext {
          font-size: 0.75rem;
          color: #64748b;
          margin: 4px 0 0 0;
        }

        .file-name {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 8px;
          word-break: break-all;
        }

        .submit-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 40px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .button-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-left-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .kyc-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.875rem;
        }

        .security-note svg {
          color: #10b981;
        }

        /* Status Page Styles */
        .kyc-status-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f8fafc;
        }

        .kyc-status-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          padding: 48px;
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .kyc-status-card.pending .status-icon {
          color: #f59e0b;
        }

        .kyc-status-card.approved .status-icon {
          color: #10b981;
        }

        .kyc-status-card.rejected .status-icon {
          color: #ef4444;
        }

        .status-icon {
          margin-bottom: 24px;
        }

        .status-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .status-description {
          font-size: 1.125rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .status-info {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          color: #475569;
          font-size: 0.875rem;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .status-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        /* Animations */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .kyc-card {
            padding: 32px;
          }
          
          .kyc-type-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .kyc-container {
            padding: 20px;
          }
          
          .kyc-title {
            font-size: 2rem;
          }
          
          .kyc-card {
            padding: 24px;
            border-radius: 20px;
          }
          
          .section-header h3 {
            font-size: 1.25rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .upload-grid {
            grid-template-columns: 1fr;
          }
          
          .kyc-status-card {
            padding: 32px;
          }
          
          .status-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .kyc-title {
            font-size: 1.75rem;
          }
          
          .kyc-subtitle {
            font-size: 1rem;
          }
          
          .kyc-card {
            padding: 20px;
            border-radius: 16px;
          }
          
          .kyc-type-card {
            padding: 20px;
            flex-direction: column;
            text-align: center;
          }
          
          .type-icon {
            width: 50px;
            height: 50px;
          }
          
          .submit-button {
            padding: 14px;
            font-size: 1rem;
          }
          
          .kyc-status-card {
            padding: 24px;
          }
          
          .status-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

// Updated File Upload Component
function FileUpload({ name, label, error, preview, fileName, onChange, onRemove }) {
  return (
    <div className={`file-upload ${error ? 'error' : ''}`}>
      <div className="upload-header">
        <span className="upload-label">{label}</span>
        {(preview || fileName) && (
          <button type="button" className="remove-btn" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      
      {preview ? (
        <div className="file-preview">
          <img src={preview} alt="Preview" className="preview-image" />
          {fileName && <p className="file-name">{fileName}</p>}
        </div>
      ) : fileName ? (
        <p className="file-name">{fileName}</p>
      ) : null}
      
      <label className="upload-area">
        <input
          type="file"
          name={name}
          className="file-input"
          onChange={(e) => onChange(e.target.files[0])}
          accept="image/*,.pdf"
        />
        <div className="upload-icon">
          <Upload size={32} weight="duotone" />
        </div>
        <p className="upload-text">Click to upload</p>
        <p className="upload-subtext">JPG, PNG or PDF (Max 10MB)</p>
      </label>
      
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}