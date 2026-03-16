import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./sign_up.css";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignupAdmin() {

  const navigate = useNavigate();
  const [userType, setUserType] = useState("admin");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    adminId: "",
    phone: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);

    if (value === "student") navigate("/signup");
    if (value === "parent") navigate("/signup-parent");
    if (value === "teacher") navigate("/signup-teacher");
    if (value === "admin") navigate("/signup-admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "Admin", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        adminId: formData.adminId,
        phone: formData.phone,
        email: formData.email,
        role: "admin",
        createdAt: new Date()
      });

      alert("Admin registered successfully");

      navigate("/login");

    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <>
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="./videos/bk.mp4" type="video/mp4" />
      </video>

      <div className={`signup-page ${userType}`}>
        <Navbar />

        <form className="student-form" onSubmit={handleSubmit}>

          <div className="section-title">
            <span className="number">1</span>
            <h3>Administration Personal Information</h3>
          </div>

          <div className="user-type">
            <div className="role-tabs">

              <button type="button"
              className={`${userType === "student" ? "active" : ""}`}
              onClick={() => handleUserTypeChange("student")}>
                Student
              </button>

              <button type="button"
              className={`${userType === "parent" ? "active" : ""}`}
              onClick={() => handleUserTypeChange("parent")}>
                Parent
              </button>

              <button type="button"
              className={`${userType === "teacher" ? "active" : ""}`}
              onClick={() => handleUserTypeChange("teacher")}>
                Teacher
              </button>

              <button type="button"
              className={`${userType === "admin" ? "active" : ""}`}
              onClick={() => handleUserTypeChange("admin")}>
                Administration
              </button>

            </div>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>First name</label>
              <input
              type="text"
              name="firstName"
              placeholder="First name"
              onChange={handleChange}
              required
              />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input
              type="text"
              name="lastName"
              placeholder="Last name"
              onChange={handleChange}
              required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Administration Id</label>
              <input
              type="text"
              name="adminId"
              placeholder="Administration Id"
              onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              />
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