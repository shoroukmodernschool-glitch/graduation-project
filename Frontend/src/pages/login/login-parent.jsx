import "./Login_form.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginParent() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Popup States
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Cooldown State
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const openForgotPopup = () => {
    setShowForgotPopup(true);
    setResetEmail("");
    setResetCode("");
    setForgotMessage("");
    setIsCodeVerified(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const closeForgotPopup = () => {
    setShowForgotPopup(false);
    setResetEmail("");
    setResetCode("");
    setForgotMessage("");
    setIsCodeVerified(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSendCode = async () => {
    if (cooldown > 0) return;

    if (!resetEmail.trim()) {
      setForgotMessage("Please enter your email.");
      return;
    }

    try {
      setForgotMessage("");
      setIsCodeVerified(false);
      setNewPassword("");
      setConfirmPassword("");

      const res = await fetch("http://127.0.0.1:8000/api/forgot-password/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
        }),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        setForgotMessage("Backend returned invalid JSON.");
        return;
      }

      if (!res.ok) {
        setForgotMessage(
          data.error_details || data.message || data.error || "Failed to send code."
        );
        return;
      }

      setCooldown(60);
      setForgotMessage(data.message || "Code sent successfully.");
    } catch (error) {
      console.error("Send Code Error:", error);
      setForgotMessage(error.message || "Something went wrong.");
    }
  };

  const handleVerifyCode = async () => {
    if (!resetCode.trim()) {
      setForgotMessage("Please enter the code.");
      return;
    }

    try {
      setForgotMessage("");

      const res = await fetch("http://127.0.0.1:8000/api/forgot-password/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          code: resetCode,
        }),
      });

      const data = await res.json();
      console.log("Verify code response:", data);

      if (!res.ok) {
        setForgotMessage(
          data.error_details || data.message || data.error || "Invalid code."
        );
        return;
      }

      setIsCodeVerified(true);
      setForgotMessage(data.message || "Code verified.");
    } catch (error) {
      console.error("Verify Code Error:", error);
      setForgotMessage(error.message || "Invalid code.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setForgotMessage("Please enter the new password and confirm it.");
      return;
    }

    if (newPassword.length < 6) {
      setForgotMessage("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotMessage("Passwords do not match.");
      return;
    }

    try {
      setForgotMessage("");

      const res = await fetch("http://127.0.0.1:8000/api/forgot-password/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();
      console.log("Reset password response:", data);

      if (!res.ok) {
        setForgotMessage(
          data.error_details || data.message || data.error || "Failed to reset password."
        );
        return;
      }

      setForgotMessage(data.message || "Password reset successfully.");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
      setIsCodeVerified(false);
    } catch (error) {
      console.error("Reset Password Error:", error);
      setForgotMessage(error.message || "Failed to reset password.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("🔥 Start Parent Login...");

      await signOut(auth);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("✅ Firebase login success");

      const user = userCredential.user;
      console.log("👤 UID:", user.uid);

      const parentRef = doc(db, "parents", user.uid);
      const parentSnap = await getDoc(parentRef);

      if (!parentSnap.exists()) {
        await signOut(auth);
        alert("هذا الحساب ليس حساب Parent");
        return;
      }

      const parentData = parentSnap.data();
      console.log("📄 Parent Firestore Data:", parentData);

      if (parentData.role !== "parent") {
        await signOut(auth);
        alert("غير مسموح، هذا الحساب ليس Parent");
        return;
      }

      const token = await user.getIdToken(true);
      console.log("🟢 TOKEN:", token);

      const res = await fetch("http://127.0.0.1:8000/api/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("📡 Laravel status:", res.status);

      const data = await res.json();
      console.log("🟣 Laravel Response:", data);

      if (!res.ok) {
        alert("الباك رفض التوكن");
        return;
      }

      alert("Login successful ✅");

      navigate("/parent-dashboard");
    } catch (error) {
      console.error("❌ Login Error:", error);
      alert("Error حصل ❌ بص الـ console");
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={`${import.meta.env.BASE_URL}videos/bk.mp4`}
          type="video/mp4"
        />
      </video>

      <div className="login-card parent">
        <h2 className="h2login">Parent Login</h2>

        <div className="role-tabs">
          <button onClick={() => navigate("/login")}>
            Student
          </button>

          <button className="active">
            Parent
          </button>

          <button onClick={() => navigate("/login-teacher")}>
            Teacher
          </button>

          <button onClick={() => navigate("/login-admin")}>
            Administration
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Parent Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="icon">
              <FaEnvelope />
            </span>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>

            <button
              type="button"
              className="forgot-link-btn"
              onClick={openForgotPopup}
            >
              Forgot Password?
            </button>
          </div>

          <button className="submit-btn parent" type="submit">
            Submit
          </button>
        </form>
      </div>

      {showForgotPopup && (
        <div className="forgot-overlay">
          <div className="forgot-popup">
            <button
              type="button"
              className="close-popup-btn"
              onClick={closeForgotPopup}
            >
              ×
            </button>

            <h2>Forgot Password</h2>

            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button
              type="button"
              onClick={handleSendCode}
              className="forgot-action-btn"
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Wait ${cooldown}s` : "Send Code"}
            </button>

            {cooldown > 0 && (
              <p className="forgot-message">
                Please wait {cooldown} seconds before requesting another code.
              </p>
            )}

            <input
              type="text"
              placeholder="Enter code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />

            <button
              type="button"
              onClick={handleVerifyCode}
              className="forgot-action-btn"
            >
              Verify Code
            </button>

            {isCodeVerified && (
              <>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="forgot-action-btn"
                >
                  Reset Password
                </button>
              </>
            )}

            {forgotMessage && (
              <p className="forgot-message">{forgotMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}