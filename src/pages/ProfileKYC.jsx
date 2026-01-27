import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import "../styles/ProfileKYC.css";

export default function KYC() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    aadhar_number: "",
    pan_number: "",
    aadhar_front_photo: null,
    pan_card_photo: null,

     // 🌍 foreign client fields (optional)
  passport_number: "",
  passport_photo: null,

  international_id_number: "",
  international_id_photo: null,

  aadhar_front_photo: null,
  pan_card_photo: null,

  // 💳 Payment methods
    upi_id: "",
    bank_name: "",
    bank_account_number: "",
    bank_ifsc_code: "",
    usdt_address: "",
  });

  const [status, setStatus] = useState("form"); 
  // form | pending | approved | rejected
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState("");

  // 🔹 Load existing KYC status
  useEffect(() => {
    apiFetch("/auth/kyc/")
      .then((res) => {
        if (res.exists) {
          setStatus(res.status);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });

    // remove error while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setAlert("");
  };


  // ✅ VALIDATION
  const validateForm = () => {
  const newErrors = {};

  /* EMAIL */
  if (!form.email) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = "Enter a valid email address";
  }

  /* PHONE (INTERNATIONAL FRIENDLY) */
  if (!form.phone_number) {
    newErrors.phone_number = "Phone number is required";
  } else if (!/^\+?[0-9]{7,15}$/.test(form.phone_number)) {
    newErrors.phone_number =
      "Enter a valid international phone number";
  }

  /* AADHAAR (ONLY IF PROVIDED) */
  if (form.aadhar_number && !/^\d{12}$/.test(form.aadhar_number)) {
    newErrors.aadhar_number = "Aadhaar must be 12 digits";
  }

  /* PAN (ONLY IF PROVIDED) */
  if (
    form.pan_number &&
    !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan_number)
  ) {
    newErrors.pan_number = "Invalid PAN format (ABCDE1234F)";
  }

  setErrors(newErrors);
  setAlert(
    Object.keys(newErrors).length
      ? "Please correct the highlighted fields"
      : ""
  );

  return Object.keys(newErrors).length === 0;
};


  const submitKYC = async () => {
    if (!validateForm()) return;

    setLoading(true);

  const data = new FormData();
  Object.keys(form).forEach((key) => {
    if (form[key]) data.append(key, form[key]);
  });

  // 🔥 ADD THIS PART
  const referralCode = localStorage.getItem("referral_code");
  if (referralCode) {
    data.append("referral_code", referralCode);
  }

  try {
      await apiFetch("/auth/kyc/", {
        method: "POST",
        body: data,
      });

      localStorage.removeItem("referral_code");
      setStatus("pending");
    } catch {
      setAlert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // 🔹 STATUS UI (PENDING / APPROVED / REJECTED)
if (["pending", "approved", "rejected"].includes(status)) {
  return (
    <div className="kyc-status-page">
      <div className={`kyc-status-card ${status}`}>

        {/* ICON */}
        <div className="status-icon">
          {status === "pending" && "⏳"}
          {status === "approved" && "✅"}
          {status === "rejected" && "❌"}
        </div>

        {/* TITLE */}
        <h2>
          {status === "pending" && "Verification in Progress"}
          {status === "approved" && "KYC Verified Successfully"}
          {status === "rejected" && "Verification Failed"}
        </h2>

        {/* DESCRIPTION */}
        <p className="status-text">
          {status === "pending" &&
            "Your documents were submitted successfully. Please wait while our team verifies your details."}

          {status === "approved" &&
            "Your account is now fully verified and unlocked for all features."}

          {status === "rejected" &&
            "Unfortunately, your verification was rejected. Please contact support for assistance."}
        </p>

        {/* EXTRA INFO */}
        {status === "pending" && (
          <div className="status-info">
            <div>⏱️ Usually takes 24–48 hours</div>
            <div>🔒 Your data is encrypted & secure</div>
          </div>
        )}

        {/* ACTION BUTTON */}
         {/* ✅ BUTTON ONLY FOR APPROVED */}
        {status === "approved" && (
          <button
            className="status-btn"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        )}

      </div>
    </div>
  );
}


  // 🧾 FORM UI
  return (
    <div className="kyc-page">
      <div className="kyc-card">
        <h1>
          Complete your <span>KYC</span>
        </h1>

        {alert && <div className="form-alert error">{alert}</div>}

        <Section title="Basic Information" icon="bi-person">
          <Input name="email" placeholder="Email" onChange={handleChange} />
          <Input name="phone_number"  placeholder="Phone number" onChange={handleChange} />
        </Section>

        <Section title="Indian KYC (Optional)" icon="bi-person-vcard">
          <Input name="aadhar_number" placeholder="Aadhaar Number" onChange={handleChange} />
          <File name="aadhar_front_photo" label="Aadhaar Front Photo" onChange={handleChange} />
          <Input name="pan_number" placeholder="PAN Number" onChange={handleChange} />
          <File name="pan_card_photo" label="PAN Card Photo" onChange={handleChange} />
        </Section>

        <Section title="Foreign KYC (Optional)" icon="bi-globe">
          <Input name="passport_number" placeholder="Passport Number" onChange={handleChange} />
          <File name="passport_photo" label="Passport Photo" onChange={handleChange} />
          <Input name="international_id_number" placeholder="International ID Number" onChange={handleChange} />
          <File name="international_id_photo" label="International ID Photo" onChange={handleChange} />
        </Section>

        <Section title="Payment / Withdrawal Details" icon="bi-wallet2">
          <Input name="upi_id" placeholder="UPI ID" onChange={handleChange} />
          <Input name="bank_name" placeholder="Bank Name" onChange={handleChange} />
          <Input name="bank_account_number" placeholder="Account Number" onChange={handleChange} />
          <Input name="bank_ifsc_code" placeholder="IFSC Code" onChange={handleChange} />
          <Input name="usdt_address" placeholder="USDT Address" onChange={handleChange} />
        </Section>

        <button className="submit" onClick={submitKYC} disabled={loading}>
          {loading ? "Submitting..." : "Submit KYC"}
        </button>
      </div>
    </div>
  );
}

/* 🔹 Small helpers */
const Section = ({ title, icon, children }) => (
  <div className="kyc-section">
    <h3>
      <i className={`bi ${icon}`} /> {title}
    </h3>
    {children}
  </div>
);

const Input = ({ name, placeholder, icon, onChange }) => (
  <div className="input-wrap">
    {icon && <i className={`bi ${icon}`} />}
    <input name={name} placeholder={placeholder} onChange={onChange} />
  </div>
);

const File = ({ name, label, onChange }) => (
  <div className="upload-box">
    <label>{label}</label>
    <input type="file" name={name} onChange={onChange} />
  </div>

  );
