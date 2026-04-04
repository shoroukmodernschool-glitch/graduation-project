import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./sign_up.css";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function SignupParent() {

  const navigate = useNavigate();
  const [userType, setUserType] = useState("parent");

  // 🔥 state للبيانات
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    parentId: "",
    phone: "",
    email: "",
    password: "",
    notes: ""
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
    if (value === "teacher") navigate("/signup-teacher");
    if (value === "admin") navigate("/signup-admin");
  };

  // 🔥 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "parent", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        parentId: formData.parentId,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        role: "parent",
        createdAt: serverTimestamp()
      });

      alert("Parent Account Created ✅");
      navigate("/profile");

    } catch (error) {
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

        {/* 🔥 ضفنا onSubmit بس */}
        <form className="student-form" onSubmit={handleSubmit}>

          <div className="user-type">
            <div className="role-tabs">

              <button type="button" className={`${userType === "student" ? "active" : ""} student`} onClick={() => handleUserTypeChange("student")}>
                Student
              </button>

              <button type="button" className={`${userType === "parent" ? "active" : ""} parent`} onClick={() => handleUserTypeChange("parent")}>
                Parent
              </button>

              <button type="button" className={`${userType === "teacher" ? "active" : ""} teacher`} onClick={() => handleUserTypeChange("teacher")}>
                Teacher
              </button>

              <button type="button" className={`${userType === "admin" ? "active" : ""} admin`} onClick={() => handleUserTypeChange("admin")}>
                Administration
              </button>

            </div>
          </div>

          <div className="section-title">
            <span className="number">1</span>
            <h3>Parent Personal Information</h3>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>First name</label>
              <div className="input-icon">
                <input name="firstName" onChange={handleChange} type="text" placeholder="First name as stated in passport" />
              </div>
            </div>

            <div className="form-group">
              <label>Last name</label>
              <div className="input-icon">
                <input name="lastName" onChange={handleChange} type="text" placeholder="Last name as stated in passport" />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <div className="input-icon">
                <input name="address" onChange={handleChange} type="text" placeholder="Address" />
              </div>
            </div>

            <div className="form-group">
              <label>Parent Id</label>
              <div className="input-icon">
                <input name="parentId" onChange={handleChange} type="text" placeholder="Parent Id" />
              </div>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <div className="input-icon">
                <input name="phone" onChange={handleChange} type="text" placeholder="Phone" />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-icon">
                <input name="email" onChange={handleChange} type="email" placeholder="Email" />
              </div>
            </div>

            {/* 🔥 ضفنا password من غير ما نغير الشكل */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon">
                <input name="password" onChange={handleChange} type="password" placeholder="Password" />
              </div>
            </div>

          </div>

          <div className="Scholar-info">

            <div className="section-title">
              <span className="number">2</span>
              <h3>Additional Parent Information</h3>
            </div>

            <div className="notes-grid">

              <div className="notes-field">
                <label>Notes</label>
                <textarea name="notes" onChange={handleChange} placeholder="Any additional notes you would like to add"></textarea>
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