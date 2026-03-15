import "./sign_up.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SignUp() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("student");

  const handleUserTypeChange = (value) => {
    setUserType(value);

    if (value === "parent") {
      navigate("/signup-parent");
    }

    if (value === "teacher") {
      navigate("/signup-teacher");
    }

     if (value === "admin") {
    navigate("/signup-admin");
  }

  };

  return (
    <>
      {/* ===== VIDEO BACKGROUND ===== */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="./videos/student.mp4" type="video/mp4" />
      </video>

      {/* ===== PAGE ===== */}
      <div className="signup-page">
        <Navbar />

        {/* ===== FORM ===== */}
        <form className="student-form">

          {/* Section Title */}
          <div className="section-title">
            <span className="number">1</span>
            <h3>
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Personal Information
            </h3>
          </div>

          {/* User Type Tabs */}
          <div className="user-type">
            <div className="role-tabs">

              <button
                type="button"
                className={userType === "student" ? "active" : ""}
                onClick={() => handleUserTypeChange("student")}
              >
                Student
              </button>

              <button
                type="button"
                className={userType === "parent" ? "active" : ""}
                onClick={() => handleUserTypeChange("parent")}
              >
                Parent
              </button>

              <button
                type="button"
                className={userType === "teacher" ? "active" : ""}
                onClick={() => handleUserTypeChange("teacher")}
              >
                Teacher
              </button>

              <button
                type="button"
                className={userType === "admin" ? "active" : ""}
                onClick={() => handleUserTypeChange("admin")}
              >
                Administration
              </button>

            </div>
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
              <label>Date of Birth</label>
              <div className="input-icon">
                <input type="text" placeholder="Day / Month / Year" />
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <div className="input-icon">
                <select>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                {userType === "teacher"
                  ? "Teacher Id"
                  : userType === "parent"
                    ? "Parent Id"
                    : "Student Id"}
              </label>
              <div className="input-icon">
                <input
                  type="text"
                  placeholder={
                    userType === "teacher"
                      ? "Teacher Id"
                      : userType === "parent"
                        ? "Parent Id"
                        : "Student Id"
                  }
                />
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

          {/* Face ID */}
          <div className="face-section">
            <div className="section-title">
              <span className="number">2</span>
              <h3>Register Face ID</h3>
            </div>

            <button
              type="button"
              className="face-btn"
              onClick={() => console.log("Open Camera Later")}
            >
              📷 Register Face ID
            </button>
          </div>

          {/* Scholar Info */}
          <div className="Scholar-info">
            <div className="section-title">
              <span className="number">3</span>
              <h3>
                {userType === "teacher"
                  ? "Teacher Information"
                  : userType === "parent"
                    ? "Parent Information"
                    : "Student Scholar Information"}
              </h3>
            </div>

            <div className="notes-grid">
              <div className="form-group">
                <label>Grade</label>
                <div className="input-icon">
                  <input type="text" placeholder="Which grade I'm applying to?" />
                </div>
              </div>

              <div className="form-group">
                <label>Class</label>
                <div className="input-icon">
                  <input type="text" placeholder="Which class?" />
                </div>
              </div>

              <div className="notes-field">
                <label>Notes</label>
                <textarea placeholder="Please mention if you have any chronic or medical conditions"></textarea>
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