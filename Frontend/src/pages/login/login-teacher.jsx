import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginTeacher() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("🔥 Start Teacher Login...");

      // ✅ Firebase Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("✅ Firebase login success");

      const user = userCredential.user;

      // 🔥 token
      const token = await user.getIdToken();
      console.log("🟢 TOKEN:", token);

      console.log("🚀 قبل fetch");

      // ✅ FIX هنا
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

      const data = await res.json();
      console.log("🟣 Laravel Response:", data);

      alert("Login successful ✅");

      navigate("/teacher-dashboard");

    } catch (error) {
      console.log("❌ Login Error:", error);
      alert("Wrong email or password ❌");
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

      <div className="login-card teacher">

        <h2 className="h2login">Teacher Login</h2>

        <div className="role-tabs">

          <button onClick={() => navigate("/login")}>
            Student
          </button>

          <button onClick={() => navigate("/login-parent")}>
            Parent
          </button>

          <button className="active">
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
              placeholder="Teacher Email"
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

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button className="submit-btn teacher">
            Submit
          </button>

        </form>

      </div>

    </div>
  );
}