import "./sign_up.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [emailLoading, setEmailLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [showCodePopup, setShowCodePopup] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    dob: "",
    gender: "",
    id: "",
    phone: "",
    email: "",
    grade: "",
    className: "",
    notes: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));

    if (name === "email") {
      setIsCodeSent(false);
      setIsEmailVerified(false);
      setVerificationCode("");
      setVerificationMessage("");
      setShowCodePopup(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    alert("Image Selected ✅");
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleSendCode = async () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required"
      }));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Invalid email"
      }));
      return;
    }

    try {
      setEmailLoading(true);
      setVerificationMessage("");

      const res = await fetch("http://127.0.0.1:8000/api/send-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setVerificationMessage(data.error || data.message || "Failed to send code");
        return;
      }

      setIsCodeSent(true);
      setIsEmailVerified(false);
      setShowCodePopup(true);
      setVerificationMessage(data.message || "Verification code sent successfully ✅");
    } catch (error) {
      console.error("Send code error:", error);
      setVerificationMessage("Server connection failed while sending code");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationMessage("Please enter the verification code");
      return;
    }

    try {
      setVerifyLoading(true);
      setVerificationMessage("");

      const res = await fetch("http://127.0.0.1:8000/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setIsEmailVerified(false);
        setVerificationMessage(data.error || data.message || "Invalid verification code");
        return;
      }

      setIsEmailVerified(true);
      setShowCodePopup(false);
      setVerificationMessage(data.message || "Email verified successfully ✅");
      setErrors((prev) => ({
        ...prev,
        emailVerification: ""
      }));
    } catch (error) {
      console.error("Verify code error:", error);
      setVerificationMessage("Server connection failed while verifying code");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSignupLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      let imageURL = "";

      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
        formDataUpload.append("upload_preset", "react_upload");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dzoppqvhy/image/upload",
          {
            method: "POST",
            body: formDataUpload
          }
        );

        const data = await res.json();
        imageURL = data.secure_url || "";
      }

      await setDoc(doc(db, "student", user.uid), {
        ...formData,
        faceImage: imageURL,
        role: "student",
        email_verified: isEmailVerified,
        createdAt: serverTimestamp()
      });

      alert("Account Created ✅");
      navigate("/profile");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <>
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="./videos/bk.mp4" type="video/mp4" />
      </video>

      <div className="signup-page">
        <Navbar />

        <form className="student-form" onSubmit={handleSubmit}>
          <div className="role-tabs">
            <button type="button" className="active">Student</button>
            <button type="button" onClick={() => navigate("/signup-parent")}>Parent</button>
            <button type="button" onClick={() => navigate("/signup-teacher")}>Teacher</button>
            <button type="button" onClick={() => navigate("/signup-admin")}>Administration</button>
          </div>

          <div className="section-title">
            <span className="number">1</span>
            <h3>Student Personal Information</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
              {errors.firstName && (
                <small style={{ color: "red" }}>{errors.firstName}</small>
              )}
            </div>

            <div className="form-group">
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
              {errors.lastName && (
                <small style={{ color: "red" }}>{errors.lastName}</small>
              )}
            </div>

            <div className="form-group">
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>

            <div className="form-group">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <input
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Student ID"
              />
            </div>

            <div className="form-group">
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>

            <div className="form-group">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                disabled={isEmailVerified}
              />
              {errors.email && (
                <small style={{ color: "red" }}>{errors.email}</small>
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="confirm"
                  onClick={handleSendCode}
                  disabled={emailLoading || isEmailVerified}
                  style={{ margin: 0 }}
                >
                  {emailLoading ? "Sending..." : isCodeSent ? "Resend Code" : "Send Code"}
                </button>
              </div>

              {verificationMessage && (
                <small
                  style={{
                    color: isEmailVerified ? "lightgreen" : "#ffcc00",
                    display: "block",
                    marginTop: "10px"
                  }}
                >
                  {verificationMessage}
                </small>
              )}

              {errors.emailVerification && (
                <small style={{ color: "red", display: "block", marginTop: "8px" }}>
                  {errors.emailVerification}
                </small>
              )}
            </div>

            <div className="form-group">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <small style={{ color: "red" }}>{errors.password}</small>
              )}
            </div>
          </div>

          <div className="section-title">
            <span className="number">2</span>
            <h3>Register Face ID</h3>
          </div>

          <button type="button" className="confirm" onClick={openFilePicker}>
            {imageFile ? "Image Selected ✅" : "Register Face ID"}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <div className="section-title">
            <span className="number">3</span>
            <h3 className="edit">Student Scholar Information</h3>
          </div>

          <div className="Scholar-info">
            <div className="form-group">
              <input
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="Class"
              />
            </div>

            <div className="form-group">
              <input
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Grade"
              />
            </div>

            <div className="form-group notes-full">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="confirm"
            disabled={signupLoading}
            style={{
              opacity: signupLoading ? 0.7 : 1,
              cursor: signupLoading ? "not-allowed" : "pointer"
            }}
          >
            {signupLoading ? "Creating Account..." : "Confirm"}
          </button>
        </form>
      </div>

      {showCodePopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "400px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              textAlign: "center"
            }}
          >
            <h2 style={{ marginBottom: "15px", color: "#333" }}>
              Enter Verification Code
            </h2>

            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
                marginBottom: "15px"
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}
            >
              <button
                type="button"
                className="confirm"
                onClick={handleVerifyCode}
                disabled={verifyLoading}
                style={{ margin: 0 }}
              >
                {verifyLoading ? "Verifying..." : "Verify Code"}
              </button>

              <button
                type="button"
                className="confirm"
                onClick={() => setShowCodePopup(false)}
                style={{ margin: 0 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}