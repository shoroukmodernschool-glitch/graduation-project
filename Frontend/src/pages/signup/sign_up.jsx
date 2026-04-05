import "./sign_up.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);

  const [errors, setErrors] = useState({}); // ✅ جديد

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    alert("Image Selected ✅");
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // ✅ Validation Function
  const validate = () => {
    let newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      let imageURL = "";

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

      await setDoc(doc(db, "student", user.uid), {
        ...formData,
        faceImage: imageURL,
        role: "student",
        createdAt: serverTimestamp()
      });

      alert("Account Created ✅");
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

      <div className="signup-page">
        <Navbar />

        <form className="student-form" onSubmit={handleSubmit}>

          <div className="role-tabs">
            <button type="button" className="active">Student</button>
            <button type="button" onClick={() => navigate("/signup-parent")}>Parent</button>
            <button type="button" onClick={() => navigate("/signup-teacher")}>Teacher</button>
            <button type="button" onClick={() => navigate("/signup-admin")}>Administration</button>
          </div>

          <div className="section-title">
            <span className="number">1</span>
            <h3>Student Personal Information</h3>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <input name="firstName" onChange={handleChange} placeholder="First name" />
              {errors.firstName && <small style={{color:"red"}}>{errors.firstName}</small>}
            </div>

            <div className="form-group">
              <input name="lastName" onChange={handleChange} placeholder="Last name" />
              {errors.lastName && <small style={{color:"red"}}>{errors.lastName}</small>}
            </div>

            <div className="form-group">
              <input name="address" onChange={handleChange} placeholder="Address" />
            </div>

            <div className="form-group">
              <input type="date" name="dob" onChange={handleChange} />
            </div>

            <div className="form-group">
              <select name="gender" onChange={handleChange}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <input name="id" onChange={handleChange} placeholder="Student ID" />
            </div>

            <div className="form-group">
              <input name="phone" onChange={handleChange} placeholder="Phone" />
            </div>

            <div className="form-group">
              <input name="email" onChange={handleChange} type="email" placeholder="Email" />
              {errors.email && <small style={{color:"red"}}>{errors.email}</small>}
            </div>

            <div className="form-group">
              <input name="password" onChange={handleChange} type="password" placeholder="Password" />
              {errors.password && <small style={{color:"red"}}>{errors.password}</small>}
            </div>

          </div>

          <div className="section-title">
            <span className="number">2</span>
            <h3>Register Face ID</h3>
          </div>

          <button type="button" className="confirm" onClick={openFilePicker}>
            {imageFile ? "Image Selected ✅" : "Register Face ID"}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <div className="section-title">
            <span className="number">3</span>
            <h3>Student Scholar Information</h3>
          </div>

          <div className="Scholar-info">

            <div className="form-group">
              <input name="className" onChange={handleChange} placeholder="Class" />
            </div>

            <div className="form-group">
              <input name="grade" onChange={handleChange} placeholder="Grade" />
            </div>

            <div className="form-group notes-full">
              <textarea name="notes" onChange={handleChange} placeholder="Notes"></textarea>
            </div>

          </div>

          <button type="submit" className="confirm">
            Confirm
          </button>

        </form>
      </div>
    </>
  );
}