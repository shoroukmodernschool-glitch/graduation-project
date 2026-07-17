import "./sign_up.css";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "../../components/Navbar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();

  const imageFile = location.state?.imageFile || null;

  const [verificationCode, setVerificationCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("pendingSignupData");

    if (!storedData) {
      navigate("/signup");
      return;
    }

    setPendingData(JSON.parse(storedData));
  }, [navigate]);

  const uploadStudentPhoto = async (file, user, studentData) => {
    if (!file) {
      return {
        public_id: "",
        format: "",
        type: ""
      };
    }

    const token = await user.getIdToken(true);

    const uploadData = new FormData();
    uploadData.append("image", file);
    uploadData.append("student_id", studentData.id || user.uid || studentData.email);

    const res = await fetch("http://127.0.0.1:8000/api/cloudinary/student-photo/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: uploadData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || "Failed to upload image");
    }

    return data;
  };

  const handleVerifyCode = async () => {
    if (!pendingData) return;

    if (!verificationCode.trim()) {
      setMessage("Please enter the verification code");
      return;
    }

    try {
      setVerifyLoading(true);
      setMessage("");

      const verifyRes = await fetch("http://127.0.0.1:8000/api/signup/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email: pendingData.email,
          otp: verificationCode
        })
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setMessage(verifyData.error || verifyData.message || "Invalid verification code");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        pendingData.email,
        pendingData.password
      );

      const user = userCredential.user;

      const uploadedImage = await uploadStudentPhoto(imageFile, user, pendingData);

      await setDoc(doc(db, "student", user.uid), {
        firstName: pendingData.firstName || "",
        lastName: pendingData.lastName || "",
        address: pendingData.address || "",
        dob: pendingData.dob || "",
        gender: pendingData.gender || "",
        id: pendingData.id || "",
        phone: pendingData.phone || "",
        email: pendingData.email || "",
        grade: pendingData.grade || "",
        className: pendingData.className || "",
        notes: pendingData.notes || "",
        faceImage: uploadedImage.public_id || "",
        imagePublicId: uploadedImage.public_id || "",
        imageFormat: uploadedImage.format || "",
        imageType: uploadedImage.type || "",
        role: "student",
        email_verified: true,
        createdAt: serverTimestamp()
      });

      localStorage.removeItem("pendingSignupData");

      alert("Account Created ✅");
      navigate("/profile");
    } catch (error) {
      console.error("Verify signup error:", error);
      setMessage(error.message || "Something went wrong");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!pendingData) return;

    try {
      setResendLoading(true);
      setMessage("");

      const res = await fetch("http://127.0.0.1:8000/api/signup/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email: pendingData.email
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || data.message || "Failed to resend OTP");
        return;
      }

      setMessage(data.message || "OTP resent successfully ✅");
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage("Server connection failed while resending OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="./videos/bk.mp4" type="video/mp4" />
      </video>

      <div className="signup-page">
        <Navbar />

        <div
          className="student-form"
          style={{
            maxWidth: "500px",
            margin: "120px auto 0"
          }}
        >
          <div className="section-title">
            <span className="number">4</span>
            <h3>Verify Email Code</h3>
          </div>

          <div className="form-group" style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          {pendingData?.email && (
            <small style={{ display: "block", marginTop: "10px", color: "#fff" }}>
              Code was sent to: {pendingData.email}
            </small>
          )}

          {message && (
            <small
              style={{
                display: "block",
                marginTop: "12px",
                color: message.toLowerCase().includes("success") || message.includes("✅")
                  ? "lightgreen"
                  : "#ffcc00"
              }}
            >
              {message}
            </small>
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
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
              onClick={handleResendCode}
              disabled={resendLoading}
              style={{ margin: 0 }}
            >
              {resendLoading ? "Resending..." : "Resend Code"}
            </button>

            <button
              type="button"
              className="confirm"
              onClick={() => navigate("/signup")}
              style={{ margin: 0 }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}