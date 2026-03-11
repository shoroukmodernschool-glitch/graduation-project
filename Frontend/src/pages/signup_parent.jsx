import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SignupParent() {
  const navigate = useNavigate();

  // 👇 الديفولت Parent
  const [userType, setUserType] = useState("parent");

  const handleUserTypeChange = (e) => {
    const value = e.target.value;
    setUserType(value);

    if (value === "student") {
      navigate("/signup");
    }

    if (value === "teacher") {
      navigate("/signup-teacher"); // تأكد إن الراوت صح
    }
  };

  return (
    <>
      {/* ===== VIDEO BACKGROUND ===== */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="./videos/parent.mp4" type="video/mp4" />
      </video>

      {/* ===== PAGE ===== */}
      <div className="signup-page">
        <Navbar />

        {/* ===== FORM ===== */}
        <form className="student-form">

          {/* Section Title */}
          <div className="section-title">
            <span className="number">1</span>
            <h3>Parent Personal Information</h3>
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
              <label>Address</label>
              <div className="input-icon">
                <input type="text" placeholder="Address" />
              </div>
            </div>

            <div className="form-group">
              <label>Parent Id</label>
              <div className="input-icon">
                <input type="text" placeholder="Parent Id" />
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

          {/* Additional Info */}
          <div className="Scholar-info">
            <div className="section-title">
              <span className="number">2</span>
              <h3>Additional Parent Information</h3>
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