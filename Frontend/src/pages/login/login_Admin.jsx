import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("🔥 Start Admin Login...");

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("✅ Firebase login success");

      const user = result.user;

      // 🔥 TOKEN
      const token = await user.getIdToken();
      console.log("🟢 TOKEN:", token);

      console.log("🚀 قبل fetch");

      const res = await fetch("http://127.0.0.1:8000/api/test", { // ✅ FIX
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 بعد fetch");
      console.log("📡 Laravel status:", res.status);

      const data = await res.json();
      console.log("🟣 Laravel Response:", data);

    } catch (error) {
      console.error("❌ Login Error:", error);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <video className="background-video" autoPlay loop muted playsInline>
        <source
          src={`${import.meta.env.BASE_URL}videos/bk.mp4`}
          type="video/mp4"
        />
      </video>

      <div className="login-card admin">
        <h2 className="h2login">Administration Login</h2>

        <div className="role-tabs">
          <button onClick={() => navigate("/login")}>Student</button>
          <button onClick={() => navigate("/login-parent")}>Parent</button>
          <button onClick={() => navigate("/login-teacher")}>Teacher</button>
          <button className="active">Administration</button>
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Administration Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span className="icon">👤</span>
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="icon">🔒</span>
        </div>

        <div className="options">
          <label>
            <input type="checkbox" /> Remember Me
          </label>

          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <button className="submit-btn admin" onClick={handleLogin}>
          Submit
        </button>
      </div>
    </div>
  );
}