// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { apiFetch } from "../api/api";
// import "../styles/ProfileKYC.css";

// export default function KYC() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     kyc_type: "",

//     email: "",
//     phone_number: "",

//     // 🇮🇳 Indian KYCs
//     aadhar_number: "",
//     aadhar_front_photo: null,
//     aadhar_back_photo: null,
//     pan_number: "",
//     pan_card_photo: null,

//     // 🌍 Foreign KYC
//     passport_number: "",
//     passport_photo: null,
//     international_id_number: "",
//     international_id_photo: null,

//     // 💳 Payment
//     upi_id: "",
//     bank_name: "",
//     bank_account_number: "",
//     bank_ifsc_code: "",
//     usdt_address: "",
//   });

//   const [status, setStatus] = useState("form");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [alert, setAlert] = useState("");

//   // 🔹 Load existing KYC status
//   useEffect(() => {
//     apiFetch("/auth/kyc/")
//       .then((res) => {
//         if (res.exists) {
//           setStatus(res.status);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     setForm({
//       ...form,
//       [name]: files ? files[0] : value,
//     });

//     // remove error while typing
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//     setAlert("");
//   };

//   // ✅ VALIDATION
//   const validateForm = () => {
//     const newErrors = {};

//     if (!form.kyc_type) newErrors.kyc_type = "Please select KYC type";

//     if (!form.email) newErrors.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
//       newErrors.email = "Invalid email";

//     if (!form.phone_number)
//       newErrors.phone_number = "Phone number is required";
//     else if (!/^\+?[0-9]{7,15}$/.test(form.phone_number))
//       newErrors.phone_number = "Invalid phone number";

//     if (form.kyc_type === "indian") {
//       if (!form.aadhar_number)
//         newErrors.aadhar_number = "Aadhaar is required";
//       else if (!/^\d{12}$/.test(form.aadhar_number))
//         newErrors.aadhar_number = "Aadhaar must be 12 digits";

//       if (!form.pan_number)
//         newErrors.pan_number = "PAN is required";
//       else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.pan_number))
//         newErrors.pan_number = "Invalid PAN format";
//     }

//     if (form.kyc_type === "foreign") {
//       if (!form.passport_number)
//         newErrors.passport_number = "Passport is required";
//     }

    
//     // 💳 PAYMENT RULE
// if (form.kyc_type === "indian") {
//   const hasPayment =
//     form.upi_id ||
//     form.bank_name ||
//     form.bank_account_number ||
//     form.bank_ifsc_code ||
//     form.usdt_address;

//   if (!hasPayment) {
//     newErrors.payment =
//       "Please provide at least one payment or withdrawal method";
//   }
// }

// if (form.kyc_type === "foreign") {
//   if (!form.usdt_address) {
//     newErrors.usdt_address = "USDT address is required for foreign users";
//   }
// }


//     return Object.keys(newErrors).length === 0;
//   };

//   const submitKYC = async () => {
//     if (!validateForm()) return;

//     setLoading(true);

//     const cleaned = { ...form };

//     if (form.kyc_type === "indian") {
//       delete cleaned.passport_number;
//       delete cleaned.passport_photo;
//       delete cleaned.international_id_number;
//       delete cleaned.international_id_photo;
//     }

//     if (form.kyc_type === "foreign") {
//       delete cleaned.aadhar_number;
//       delete cleaned.aadhar_front_photo;
//       delete cleaned.aadhar_back_photo;
//       delete cleaned.pan_number;
//       delete cleaned.pan_card_photo;
//     }

//     delete cleaned.kyc_type;

//     const data = new FormData();
//     Object.keys(cleaned).forEach((k) => {
//       if (cleaned[k]) data.append(k, cleaned[k]);
//     });

//     try {
//       await apiFetch("/auth/kyc/", { method: "POST", body: data });
//       setStatus("pending");
//     } catch {
//       setAlert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (["pending", "approved", "rejected"].includes(status)) {
//     return (
//       <div className="kyc-status-page">
//   <div className={`kyc-status-card ${status}`}>

//     {/* ICON */}
//     <div className="kyc-status-icon">
//       {status === "pending" && <i className="bi bi-hourglass-split"></i>}
//       {status === "approved" && <i className="bi bi-check-circle-fill"></i>}
//       {status === "rejected" && <i className="bi bi-x-circle-fill"></i>}
//     </div>

//     {/* TITLE */}
//     <h2 className="kyc-status-title">
//       {status === "pending" && "Verification in Progress"}
//       {status === "approved" && "KYC Verified Successfully"}
//       {status === "rejected" && "Verification Failed"}
//     </h2>

//     {/* MESSAGE */}
//     <p className="kyc-status-text">
//       {status === "pending" &&
//         "Your documents have been submitted successfully. Our team is reviewing them."}

//       {status === "approved" &&
//         "Your identity has been verified. You now have full access to all features."}

//       {status === "rejected" &&
//         "Your verification could not be completed. Please contact support for assistance."}
//     </p>

//     {/* EXTRA INFO */}
//     {status === "pending" && (
//       <div className="kyc-status-info">
//         <span><i className="bi bi-clock"></i> Usually takes 24–48 hours</span>
//         <span><i className="bi bi-shield-lock"></i> Your data is secure</span>
//       </div>
//     )}

//     {/* ACTION */}
//     {status === "approved" && (
//       <button className="kyc-status-btn" onClick={() => navigate("/")}>
//         Go to Dashboard
//       </button>
//     )}
//   </div>
// </div>

//     );
//   }

//   return (
//     <div className="kyc-page">
//       <div className="kyc-card">
//         <h1>Complete your <span>KYC</span></h1>

//         {alert && <div className="form-alert error">{alert}</div>}

//         {/* KYC TYPE */}
//         <div className="kyc-type-box">
//           <h3><i className="bi bi-shield-check"></i> Select KYC Type</h3>

//           <div className="kyc-type-options">
//             <label className={`kyc-option ${form.kyc_type === "indian" ? "active" : ""}`}>
//               <input type="radio" name="kyc_type" value="indian" onChange={handleChange} />
//               <i className="bi bi-flag-fill"></i>
//               <strong>Indian Citizen</strong>
//             </label>

//             <label className={`kyc-option ${form.kyc_type === "foreign" ? "active" : ""}`}>
//               <input type="radio" name="kyc_type" value="foreign" onChange={handleChange} />
//               <i className="bi bi-globe2"></i>
//               <strong>Foreign Citizen</strong>
//             </label>
//           </div>

//           {errors.kyc_type && <div className="field-error">{errors.kyc_type}</div>}
//         </div>

//         <Section title="Basic Information">
//           <Input name="email" placeholder="Email" onChange={handleChange} error={errors.email} />
//           <Input name="phone_number" placeholder="Phone Number" onChange={handleChange} error={errors.phone_number} />
//         </Section>

//         {form.kyc_type === "indian" && (
//           <Section title="Indian KYC">
//             <Input name="aadhar_number" placeholder="Aadhaar Number" onChange={handleChange} error={errors.aadhar_number} />
//             <div className="image-folder">
//             <File name="aadhar_front_photo" label="Aadhaar Front Photo" value={form.aadhar_front_photo} onChange={handleChange} />
//             <File name="aadhar_back_photo" label="Aadhaar Back Photo" value={form.aadhar_back_photo} onChange={handleChange} />
//             </div>
//             <Input name="pan_number" placeholder="PAN Number" onChange={handleChange} error={errors.pan_number} />
//             <File name="pan_card_photo" label="PAN Card Photo" value={form.pan_card_photo} onChange={handleChange} />
//           </Section>
//         )}

//         {form.kyc_type === "foreign" && (
//           <Section title="Foreign KYC">
//             <Input name="passport_number" placeholder="Passport Number" onChange={handleChange} error={errors.passport_number} />
//             <File name="passport_photo" label="Passport Photo" value={form.passport_photo} onChange={handleChange} />
//             {/* ✅ MISSING FIELD FIXED */}
//     <Input
//       name="international_id_number"
//       placeholder="International ID Number"
//       onChange={handleChange}
//       error={errors.international_id_number}
//     />
//             <File name="international_id_photo" label="International ID Photo" value={form.international_id_photo} onChange={handleChange} />
//           </Section>
//         )}

//         <Section title="Payment / Withdrawal Details">

//   {/* 🇮🇳 INDIAN USERS */}
//   {form.kyc_type === "indian" && (
//     <>
//       <Input name="upi_id" placeholder="UPI ID" onChange={handleChange} />
//       <Input name="bank_name" placeholder="Bank Name" onChange={handleChange} />
//       <Input
//         name="bank_account_number"
//         placeholder="Account Number"
//         onChange={handleChange}
//       />
//       <Input
//         name="bank_ifsc_code"
//         placeholder="IFSC Code"
//         onChange={handleChange}
//       />
//       <Input name="usdt_address" placeholder="USDT Address" onChange={handleChange} />
//     </>
//   )}

//   {/* 🌍 FOREIGN USERS */}
//   {form.kyc_type === "foreign" && (
//     <Input
//       name="usdt_address"
//       placeholder="USDT Address"
//       onChange={handleChange}
//       error={errors.usdt_address}
//     />
//   )}

//   {errors.payment && <div className="field-error">{errors.payment}</div>}
// </Section>


//         <button className="submit" onClick={submitKYC} disabled={loading}>
//           {loading ? "Submitting..." : "Submit KYC"}
//         </button>
//       </div>
//     </div>
//   );
// }

// /* HELPERS */

// const Section = ({ title, children }) => (
//   <div className="kyc-section">
//     <h3>{title}</h3>
//     {children}
//   </div>
// );

// const Input = ({ name, placeholder, onChange, error }) => (
//   <div className={`input-wrap ${error ? "has-error" : ""}`}>
//     <input name={name} placeholder={placeholder} onChange={onChange} />
//     {error && <div className="field-error">{error}</div>}
//   </div>
// );

// const File = ({ name, label, value, onChange }) => {
//   const preview = value ? URL.createObjectURL(value) : null;

//   return (
//     <div className="upload-box d">
//       <label>{label}</label>
//       <div className="upload-area">
//         {preview ? (
//           <img src={preview} alt="preview" className="preview-img" />
//         ) : (
//           <span><i className="bi bi-cloud-upload"></i> Click to upload</span>
//         )}
//         <input type="file" name={name} accept="image/*" onChange={onChange} />
//       </div>
//     </div>
//   );
// };

// # new
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import "../styles/ProfileKYC.css";

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

      {/* ✅ KYC TYPE SELECTOR */}
      <div className="kyc-type-box">
        <h3>
          <i className="bi bi-shield-check"></i> Select KYC Type
        </h3>

        <div className="kyc-type-options">
          <label
            className={`kyc-option ${
              form.kyc_type === "indian" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="kyc_type"
              value="indian"
              onChange={handleChange}
            />
            <i className="bi bi-flag-fill"></i>
            <strong>Indian Citizen</strong>
          </label>

          <label
            className={`kyc-option ${
              form.kyc_type === "foreign" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name="kyc_type"
              value="foreign"
              onChange={handleChange}
            />
            <i className="bi bi-globe2"></i>
            <strong>Foreign Citizen</strong>
          </label>
        </div>
      </div>

      {/* BASIC INFO */}
      <Section title="Basic Information" icon="bi-person">
        <Input name="email" placeholder="Email" onChange={handleChange} />
        <Input
          name="phone_number"
          placeholder="Phone number"
          onChange={handleChange}
        />
      </Section>

      {/* 🇮🇳 INDIAN KYC */}
      {form.kyc_type === "indian" && (
        <Section title="Indian KYC" icon="bi-person-vcard">
          <Input
            name="aadhar_number"
            placeholder="Aadhaar Number"
            onChange={handleChange}
          />
          <File
            name="aadhar_front_photo"
            label="Aadhaar Front Photo"
            onChange={handleChange}
          />
          <File
            name="aadhar_back_photo"
            label="Aadhaar Back Photo"
            onChange={handleChange}
          />
          <Input
            name="pan_number"
            placeholder="PAN Number"
            onChange={handleChange}
          />
          <File
            name="pan_card_photo"
            label="PAN Card Photo"
            onChange={handleChange}
          />
        </Section>
      )}

      {/* 🌍 FOREIGN KYC */}
      {form.kyc_type === "foreign" && (
        <Section title="Foreign KYC" icon="bi-globe">
          <Input
            name="passport_number"
            placeholder="Passport Number"
            onChange={handleChange}
          />
          <File
            name="passport_photo"
            label="Passport Photo"
            onChange={handleChange}
          />
          <Input
            name="international_id_number"
            placeholder="International ID Number"
            onChange={handleChange}
          />
          <File
            name="international_id_photo"
            label="International ID Photo"
            onChange={handleChange}
          />
        </Section>
      )}

      {/* 💳 PAYMENT SECTION */}
      <Section title="Payment / Withdrawal Details" icon="bi-wallet2">
        {/* 🇮🇳 Indian */}
        {form.kyc_type === "indian" && (
          <>
            <Input name="upi_id" placeholder="UPI ID" onChange={handleChange} />
            <Input
              name="bank_name"
              placeholder="Bank Name"
              onChange={handleChange}
            />
            <Input
              name="bank_account_number"
              placeholder="Account Number"
              onChange={handleChange}
            />
            <Input
              name="bank_ifsc_code"
              placeholder="IFSC Code"
              onChange={handleChange}
            />
            <Input
              name="usdt_address"
              placeholder="USDT Address"
              onChange={handleChange}
            />
          </>
        )}

        {/* 🌍 Foreign */}
        {form.kyc_type === "foreign" && (
          <Input
            name="usdt_address"
            placeholder="USDT Address"
            onChange={handleChange}
          />
        )}
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


