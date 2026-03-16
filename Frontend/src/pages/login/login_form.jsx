import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function Login() {

  const navigate = useNavigate();

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

      <div className="login-card student">

        <h2>Login</h2>

        <div className="role-tabs">

          <button className="active">
            Student
          </button>

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

        <div className="input-group">
          <input type="text" placeholder="Student ID" />
          <span className="icon">👤</span>
        </div>

        <div className="input-group">
          <input type="password" placeholder="Password" />
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

        <button className="submit-btn student">
          Submit
        </button>

      </div>

    </div>

  );
}