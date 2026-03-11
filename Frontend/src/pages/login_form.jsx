import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    if (loading) return;

    if (!loginId.trim() || !password.trim()) {
      alert("Please enter Student ID and Password");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          student_id: loginId.trim(),
          password: password
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.status === "success") {

        localStorage.setItem("student", JSON.stringify(data.student));

      navigate("/student-dashboard");

      } else {

        alert(data.message || "Invalid ID or Password");

      }

    } catch (error) {

      console.error("Login Error:", error);
      alert("Cannot connect to server. Make sure Laravel server is running.");

    }

    setLoading(false);
  };

  return (

    <div className="login-page">

      <Navbar />

      <video
        key={role}
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={`${import.meta.env.BASE_URL}videos/student.mp4`}
          type="video/mp4"
        />
      </video>

      <div className={`login-card ${role.toLowerCase()}`}>

        <h2>Login</h2>

        <div className="role-tabs">

          <button
            className={role === "Student" ? "active" : ""}
            onClick={() => setRole("Student")}
          >
            Student
          </button>

          <button
            onClick={() => navigate("/login-parent")}
          >
            Parent
          </button>

          <button
            onClick={() => navigate("/login-teacher")}
          >
            Teacher
          </button>

        </div>

        <div className="input-group">

          <input
            type="text"
            className="animated-input"
            placeholder="Student ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />

          <span className="icon">👤</span>

        </div>

        <div className="input-group">

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span className="icon">🔒</span>

        </div>

        <div className="options">

          <label>
            <input type="checkbox" /> Remember Me
          </label>

          <Link to="/forgot-password">Forgot Password?</Link>

        </div>

        <button
          className={`submit-btn ${role.toLowerCase()}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Submit"}
        </button>

      </div>

    </div>

  );
}