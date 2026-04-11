import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      console.log("🔥 Start Admin Login...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("✅ Firebase login success");

      const user = userCredential.user;

      const adminRef = doc(db, "Admin", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        await signOut(auth);
        localStorage.removeItem("token");
        setErrorMessage("This account is not an admin.");
        setLoading(false);
        return;
      }

      const adminData = adminSnap.data();
      console.log("🟣 Admin Data:", adminData);

      if (adminData.role && adminData.role.toLowerCase() !== "admin") {
        await signOut(auth);
        localStorage.removeItem("token");
        setErrorMessage("Access denied. Admins only.");
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

      navigate("/admin", { replace: true });
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

      <div className="login-card admin">
        <h2 className="h2login">Administration Login</h2>

        <div className="role-tabs">
          <button onClick={() => navigate("/login")}>
            Student
          </button>

          <button onClick={() => navigate("/login-parent")}>
            Parent
          </button>

          <button onClick={() => navigate("/login-teacher")}>
            Teacher
          </button>

          <button className="active">
            Administration
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Administration Email"
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

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          {errorMessage && (
            <p className="login-error">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="submit-btn admin"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-content">
                 Logging in..
                <span className="loader"></span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}