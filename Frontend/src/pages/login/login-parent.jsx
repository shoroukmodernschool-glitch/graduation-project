import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState } from "react";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginParent() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      console.log("🔥 Start Login...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("✅ Firebase login success");

      const user = userCredential.user;

      console.log("🔥 قبل token");

      const token = await user.getIdToken();

      console.log("🔥 بعد token");
      console.log("🟢 TOKEN:", token);

      console.log("🚀 قبل fetch");

      try {
        const res = await fetch("http://127.0.0.1:8000/api/test", { // ✅ التعديل هنا
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

      } catch (err) {
        console.log("❌ FETCH ERROR:", err);
      }

      alert("Login successful ✅");

      // navigate("/parent-dashboard");

    } catch (error) {
      console.error("❌ Login Error FULL:", error);
      alert("Error حصل ❌ بصي الـ console");
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
            <span className="icon">👤</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="icon">🔒</span>
          </div>

          <div className="options">

            <label>
              <input type="checkbox" /> Remember Me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button className="submit-btn parent">
            Submit
          </button>

        </form>

      </div>

    </div>
  );
}