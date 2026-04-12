import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password Popup States
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const openForgotPopup = () => {
    setShowForgotPopup(true);
    setResetEmail("");
    setResetCode("");
    setForgotMessage("");
  };

  const closeForgotPopup = () => {
    setShowForgotPopup(false);
    setResetEmail("");
    setResetCode("");
    setForgotMessage("");
  };

  const handleSendCode = async () => {
    if (!resetEmail) {
      setForgotMessage("Please enter your email.");
      return;
    }

    try {
      // مؤقتًا لحد ما الباك يشتغل
      setForgotMessage("Code sent successfully.");
    } catch (error) {
      setForgotMessage("Something went wrong.");
    }
  };

  const handleVerifyCode = async () => {
    if (!resetCode) {
      setForgotMessage("Please enter the code.");
      return;
    }

    try {
      // مؤقتًا لحد ما الباك يشتغل
      setForgotMessage("Code verified.");
    } catch (error) {
      setForgotMessage("Invalid code.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      console.log("🔥 Start Student Login...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("✅ Firebase login success");

      const user = userCredential.user;

      const studentRef = doc(db, "student", user.uid);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        await signOut(auth);
        localStorage.removeItem("token");
        setErrorMessage("This account is not a student.");
        setLoading(false);
        return;
      }

      const studentData = studentSnap.data();
      console.log("🟣 Student Data:", studentData);

      if (studentData.role && studentData.role.toLowerCase() !== "student") {
        await signOut(auth);
        localStorage.removeItem("token");
        setErrorMessage("Access denied. Students only.");
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      console.log("🟢 TOKEN:", token);

      localStorage.setItem("token", token);

      console.log("🚀 قبل fetch");

      const res = await fetch("http://127.0.0.1:8000/api/test", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 بعد fetch");
      console.log("📡 Laravel status:", res.status);

      const apiData = await res.json();
      console.log("🟣 Laravel Response:", apiData);

      if (!res.ok) {
        await signOut(auth);
        localStorage.removeItem("token");
        setErrorMessage("Laravel verification failed.");
        setLoading(false);
        return;
      }

      navigate("/student-dashboard", { replace: true });
    } catch (error) {
      console.error("❌ Login Error:", error);

      if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("User not found.");
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("An error occurred during login.");
      }

      setLoading(false);
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
        <source src={`${import.meta.env.BASE_URL}videos/bk.mp4`} />
      </video>

      <div className="login-card student">
        <h2 className="h2login">Student Login</h2>

        <div className="role-tabs">
          <button className="active">Student</button>

          <button onClick={() => navigate("/login-parent")}>
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
              placeholder="Student Email"
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

          {errorMessage && (
            <p className="login-error">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="submit-btn student"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-content">
                جاري الدخول
                <span className="loader"></span>
              </span>
            ) : (
              "Submit"
            )}
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
            >
              Send Code
            </button>

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

            {forgotMessage && (
              <p className="forgot-message">{forgotMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}