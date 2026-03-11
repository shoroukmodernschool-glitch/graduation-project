import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function LoginTeacher() {

  const navigate = useNavigate();
  const [role] = useState("Teacher");

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
          src={`${import.meta.env.BASE_URL}videos/teacher.mp4`}
          type="video/mp4"
        />
      </video>

      <div className={`login-card ${role.toLowerCase()}`}>

        <h2>Login</h2>

        {/* Role Tabs */}
        <div className="role-tabs">

          <button
            onClick={() => navigate("/login")}
          >
            Student
          </button>

          <button
            onClick={() => navigate("/login-parent")}
          >
            Parent
          </button>

          <button
            className="active"
          >
            Teacher
          </button>

        </div>

        {/* Teacher ID */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Teacher ID"
            className="animated-input"
          />
          <span className="icon">👤</span>
        </div>

        {/* Password */}
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
          />
          <span className="icon">🔒</span>
        </div>

        {/* Options */}
        <div className="options">
          <label>
            <input type="checkbox" /> Remember Me
          </label>

          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <button className={`submit-btn ${role.toLowerCase()}`}>
          Submit
        </button>

      </div>

    </div>
  );
}