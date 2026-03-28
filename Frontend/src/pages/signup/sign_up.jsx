import "./sign_up.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");

  const [imageFile, setImageFile] = useState(null); // 👈 نخزن الصورة هنا

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

  // 🔥 نخزن الصورة بس (من غير رفع)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    alert("Image Selected ✅");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Create Account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      let imageURL = "";

      // 2️⃣ Upload to Cloudinary بعد ما بقى عندنا user
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
        formDataUpload.append("upload_preset", "react_upload");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dzoppqvhy/image/upload",
          {
            method: "POST",
            body: formDataUpload
          }
        );

        const data = await res.json();
        imageURL = data.secure_url;
      }

      // 3️⃣ تحديد الكولكشن
      const collectionName =
        userType === "student"
          ? "student"
          : userType === "teacher"
          ? "teachers"
          : userType === "parent"
          ? "parents"
          : "Admin";

      // 4️⃣ حفظ كل البيانات + الصورة
      await setDoc(doc(db, collectionName, user.uid), {
        uid: user.uid,
        ...formData,
        faceImage: imageURL, // 👈 هنا اللينك
        role: userType,
        createdAt: serverTimestamp()
      });

      alert("Account Created Successfully ✅");

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

        <form className="student-form" onSubmit={handleSubmit}>

          <div className="role-tabs">
            <button type="button" className={userType === "student" ? "active" : ""} onClick={() => handleUserTypeChange("student")}>Student</button>
            <button type="button" className={userType === "parent" ? "active" : ""} onClick={() => handleUserTypeChange("parent")}>Parent</button>
            <button type="button" className={userType === "teacher" ? "active" : ""} onClick={() => handleUserTypeChange("teacher")}>Teacher</button>
            <button type="button" className={userType === "admin" ? "active" : ""} onClick={() => handleUserTypeChange("admin")}>Administration</button>
          </div>

          <div className="section-title">
            <span className="number">1</span>
            <h3>Student Personal Information</h3>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>First name</label>
              <input name="firstName" onChange={handleChange} placeholder="First name" />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input name="lastName" onChange={handleChange} placeholder="Last name" />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input name="address" onChange={handleChange} placeholder="Address" />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input name="dob" onChange={handleChange} placeholder="Date of Birth" />
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
              <label>Student ID</label>
              <input name="id" onChange={handleChange} placeholder="Student ID" />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" onChange={handleChange} placeholder="Phone" />
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

          <div className="section-title">
            <span className="number">2</span>
            <h3>Register Face ID</h3>
          </div>

          <input
            type="file"
            accept="image/*"
            id="faceUpload"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <button
            type="button"
            className="confirm"
            onClick={() => document.getElementById("faceUpload").click()}
          >
            📷 Register Face ID
          </button>

          <div className="Scholar-info">

            <div className="section-title">
              <span className="number">3</span>
              <h3>Scholar Information</h3>
            </div>

            <div className="form-group">
              <label>Grade</label>
              <input name="grade" onChange={handleChange} placeholder="Grade" />
            </div>

            <div className="form-group">
              <label>Class</label>
              <input name="className" onChange={handleChange} placeholder="Class" />
            </div>

            <div className="form-group notes-full">
              <label>Notes</label>
              <textarea name="notes" onChange={handleChange} placeholder="Notes"></textarea>
            </div>

          </div>

          <button className="confirm" type="submit">Confirm</button>

        </form>
      </div>
    </>
  );
}