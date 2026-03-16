import "./sign_up.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function SignUp() {

  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    dob: "",
    gender: "",
    id: "",
    phone: "",
    email: "",
    grade: "",
    className: "",
    notes: "",
    password: ""
  });

  const handleUserTypeChange = (value) => {
    setUserType(value);

    if (value === "parent") navigate("/signup-parent");
    if (value === "teacher") navigate("/signup-teacher");
    if (value === "admin") navigate("/signup-admin");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

      await setDoc(doc(db, userType, user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        dob: formData.dob,
        gender: formData.gender,
        id: formData.id,
        phone: formData.phone,
        email: formData.email,
        grade: formData.grade,
        className: formData.className,
        notes: formData.notes,
        role: userType,
        createdAt: new Date()
      });

      alert("Account Created Successfully");

      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="./videos/bk.mp4" type="video/mp4" />
      </video>

      <div className={`signup-page ${userType}`}>
        <Navbar />

        <form className="student-form" onSubmit={handleSubmit}>

          <div className="section-title">
            <span className="number">1</span>
            <h3>
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Personal Information
            </h3>
          </div>

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

          <div className="form-grid">

            <div className="form-group">
              <label>First name</label>
              <input name="firstName" onChange={handleChange} type="text" placeholder="First name" />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input name="lastName" onChange={handleChange} type="text" placeholder="Last name" />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input name="address" onChange={handleChange} type="text" placeholder="Address" />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input name="dob" onChange={handleChange} type="text" placeholder="Day / Month / Year" />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>ID</label>
              <input name="id" onChange={handleChange} type="text" placeholder="ID" />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" onChange={handleChange} type="text" placeholder="Phone" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" onChange={handleChange} type="email" placeholder="Email" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input name="password" onChange={handleChange} type="password" placeholder="Password" />
            </div>

          </div>

          <div className="Scholar-info">

            <div className="section-title">
              <span className="number">3</span>
              <h3>Scholar Information</h3>
            </div>

            <div className="notes-grid">

              <div className="form-group">
                <label>Grade</label>
                <input name="grade" onChange={handleChange} type="text" placeholder="Grade" />
              </div>

              <div className="form-group">
                <label>Class</label>
                <input name="className" onChange={handleChange} type="text" placeholder="Class" />
              </div>

              <div className="notes-field">
                <label>Notes</label>
                <textarea name="notes" onChange={handleChange}></textarea>
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