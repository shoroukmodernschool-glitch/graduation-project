import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./sign_up.css";

export default function SignupAdmin() {

  const navigate = useNavigate();

  // 👇 الادمن هو الافتراضي
  const [userType, setUserType] = useState("admin");

  const handleUserTypeChange = (value) => {
    setUserType(value);

    if (value === "student") {
      navigate("/signup");
    }

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
      {/* VIDEO BACKGROUND */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="./videos/bk.mp4" type="video/mp4" />
      </video>

      {/* PAGE */}
      <div className={`signup-page ${userType}`}>
        <Navbar />

        <form className="student-form">

          {/* TITLE */}
          <div className="section-title">
            <span className="number">1</span>
            <h3>Administration Personal Information</h3>
          </div>

          {/* USER TYPE */}
          <div className="user-type">
            <div className="role-tabs">

              <button
                type="button"
                className={`${userType === "student" ? "active" : ""} student`}
                onClick={() => handleUserTypeChange("student")}
              >
                Student
              </button>

              <button
                type="button"
                className={`${userType === "parent" ? "active" : ""} parent`}
                onClick={() => handleUserTypeChange("parent")}
              >
                Parent
              </button>

              <button
                type="button"
                className={`${userType === "teacher" ? "active" : ""} teacher`}
                onClick={() => handleUserTypeChange("teacher")}
              >
                Teacher
              </button>

              <button
                type="button"
                className={`${userType === "admin" ? "active" : ""} admin`}
                onClick={() => handleUserTypeChange("admin")}
              >
                Administration
              </button>

            </div>
          </div>

          {/* FORM GRID */}
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
                <input type="text" placeholder="Administration Id" />
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
            Confirm
          </button>

        </form>
      </div>
    </>
  );
}