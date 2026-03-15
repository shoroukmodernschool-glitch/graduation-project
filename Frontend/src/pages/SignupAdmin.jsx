import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SignupParent() {
  const navigate = useNavigate();

  // 👇 الديفولت Parent
  const [userType, setUserType] = useState("parent");

  const handleUserTypeChange = (value) => {
    setUserType(value);

    if (value === "student") {
      navigate("/signup");
    }

    if (value === "teacher") {
      navigate("/signup-teacher");
    }

    if (value === "admin") {
      navigate("/signup-admin"); // لو عندك صفحة ادمن
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
            <h3>Administration Personal Information</h3>
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
              <label>Administration Id</label>
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

         

          <button className="confirm" type="submit">
            ii
          </button>

        </form>
      </div>
    </>
  );
}