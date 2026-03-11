import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SignupTeacher() {
  const navigate = useNavigate();

  // 👇 الديفولت Teacher
  const [userType, setUserType] = useState("teacher");

  const handleUserTypeChange = (e) => {
    const value = e.target.value;
    setUserType(value);

    if (value === "student") {
      navigate("/signup");
    }

    if (value === "parent") {
      navigate("/signup-parent");
    }
  };

  return (
    <>
      {/* ===== VIDEO BACKGROUND ===== */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="./videos/teacher.mp4" type="video/mp4" />
      </video>

      {/* ===== PAGE ===== */}
      <div className="signup-page">
        <Navbar />

        {/* ===== FORM ===== */}
        <form className="student-form">

          {/* Section Title */}
          <div className="section-title">
            <span className="number">1</span>
            <h3>Teacher Personal Information</h3>
          </div>

          {/* User Type Select */}
          <div className="user-type">
            <select value={userType} onChange={handleUserTypeChange}>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Grid */}
          <div className="form-grid">
            <div className="form-group">
              <label>First name</label>
              <div className="input-icon">
                <input type="text" placeholder="First name as stated in passport" />
              </div>
            </div>

            <div className="form-group">
              <label>Last name</label>
              <div className="input-icon">
                <input type="text" placeholder="Last name as stated in passport" />
              </div>
            </div>

            <div className="form-group">
              <label>Teacher ID</label>
              <div className="input-icon">
                <input type="text" placeholder="Teacher ID" />
              </div>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <div className="input-icon">
                <input type="text" placeholder="Phone" />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-icon">
                <input type="text" placeholder="Email" />
              </div>
            </div>
          </div>

          {/* Teacher Extra Info */}
          <div className="Scholar-info">
            <div className="section-title">
              <span className="number">2</span>
              <h3>Teacher Information</h3>
            </div>

            <div className="form-group">
              <label>Specialization</label>
              <div className="input-icon">
                <input type="text" placeholder="Which specialization?" />
              </div>
            </div>

            <div className="notes-grid">
              <div className="notes-field">
                <label>Notes</label>
                <textarea placeholder="Any additional notes you would like to add"></textarea>
              </div>
            </div>
          </div>

          <button className="confirm" type="submit">
            Confirm
          </button>

        </form>
      </div>
    </>
  );
}