import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./sign_up.css";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignupAdmin() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("admin");

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
    adminId: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email") {
      setIsCodeSent(false);
      setIsEmailVerified(false);
      setVerificationCode("");
      setVerificationMessage("");
      setShowCodePopup(false);
    }
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);

    if (value === "student") navigate("/signup");
    if (value === "parent") navigate("/signup-parent");
    if (value === "teacher") navigate("/signup-teacher");
    if (value === "admin") navigate("/signup-admin");
  };

  const handleSendCode = async () => {
    if (!formData.email.trim()) {
      setVerificationMessage("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setVerificationMessage("Invalid email");
      return;
    }

    try {
      setEmailLoading(true);
      setVerificationMessage("");

      const res = await fetch("http://127.0.0.1:8000/api/signup/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
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

      const res = await fetch("http://127.0.0.1:8000/api/signup/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: verificationCode,
        }),
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
    } catch (error) {
      console.error("Verify code error:", error);
      setVerificationMessage("Server connection failed while verifying code");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      setVerificationMessage("Please verify your email first");
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

      await setDoc(doc(db, "Admin", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        adminId: formData.adminId,
        phone: formData.phone,
        email: formData.email,
        role: "admin",
        createdAt: new Date(),
      });

      alert("Admin registered successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
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

      <div className={`signup-page ${userType}`}>
        <Navbar />

        <form className="student-form" onSubmit={handleSubmit}>
          <div className="user-type">
            <div className="role-tabs">
              <button
                type="button"
                className={`${userType === "student" ? "active" : ""} student`}
                onClick={() => handleUserTypeChange("student")}
              >
                Student
              </button>

              <button
                type="button"
                className={`${userType === "parent" ? "active" : ""} parent`}
                onClick={() => handleUserTypeChange("parent")}
              >
                Parent
              </button>

              <button
                type="button"
                className={`${userType === "teacher" ? "active" : ""} teacher`}
                onClick={() => handleUserTypeChange("teacher")}
              >
                Teacher
              </button>

              <button
                type="button"
                className={`${userType === "admin" ? "active" : ""} admin`}
                onClick={() => handleUserTypeChange("admin")}
              >
                Administration
              </button>
            </div>
          </div>

          <div className="section-title">
            <span className="number">1</span>
            <h3>Administration Personal Information</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="First name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Last name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="address"
                value={formData.address}
                placeholder="Address"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="adminId"
                value={formData.adminId}
                placeholder="Administration Id"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                placeholder="Phone"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
                disabled={isEmailVerified}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group"></div>

            <div className="form-group">
              <button
                type="button"
                className="confirm"
                onClick={handleSendCode}
                disabled={emailLoading || isEmailVerified}
                style={{
                  width: "100%",
                  height: "49px",
                  margin: 0,
                  padding: 0,
                }}
              >
                {emailLoading ? "Sending..." : isCodeSent ? "Resend Code" : "Send Code"}
              </button>

              {verificationMessage && (
                <small
                  style={{
                    color: isEmailVerified ? "lightgreen" : "#ffcc00",
                    display: "block",
                    marginTop: "10px",
                  }}
                >
                  {verificationMessage}
                </small>
              )}
            </div>
          </div>

          <button
            className="confirm"
            type="submit"
            disabled={signupLoading}
            style={{
              opacity: signupLoading ? 0.7 : 1,
              cursor: signupLoading ? "not-allowed" : "pointer",
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
            zIndex: 9999,
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
              textAlign: "center",
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
                marginBottom: "15px",
              }}
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
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