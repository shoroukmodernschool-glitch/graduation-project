import "./sign_up.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

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

      // 🔥 خليها student زي عندك
      await setDoc(doc(db, "student", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        dob: formData.dob,
        gender: formData.gender,
        studentId: formData.id,
        phone: formData.phone,
        email: formData.email,
        grade: formData.grade,
        className: formData.className,
        notes: formData.notes,
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
          <input name="firstName" onChange={handleChange} placeholder="First name" />
          <input name="lastName" onChange={handleChange} placeholder="Last name" />
          <input name="address" onChange={handleChange} placeholder="Address" />
          <input type="date" name="dob" onChange={handleChange} />

          <select name="gender" onChange={handleChange}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input name="id" onChange={handleChange} placeholder="Student ID" />
          <input name="phone" onChange={handleChange} placeholder="Phone" />
          <input name="email" onChange={handleChange} type="email" placeholder="Email" />
          <input name="password" onChange={handleChange} type="password" placeholder="Password" />

          <input type="file" onChange={handleImageUpload} />

          <input name="grade" onChange={handleChange} placeholder="Grade" />
          <input name="className" onChange={handleChange} placeholder="Class" />
          <textarea name="notes" onChange={handleChange} placeholder="Notes"></textarea>

          <button type="submit">Confirm</button>
        </form>
      </div>
    </>
  );
}