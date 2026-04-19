import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginParent() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("🔥 Start Parent Login...");

      await signOut(auth);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("✅ Firebase login success");

      const user = userCredential.user;
      console.log("👤 UID:", user.uid);

      // 1) هات بيانات اليوزر من Firestore
      // غيّر اسم الكولكشن لو عندك اسمه parents أو parent
      const parentRef = doc(db, "parents", user.uid);
      const parentSnap = await getDoc(parentRef);

      // لو مش موجود في parents
      if (!parentSnap.exists()) {
        await signOut(auth);
        alert("هذا الحساب ليس حساب Parent");
        return;
      }

      const parentData = parentSnap.data();
      console.log("📄 Parent Firestore Data:", parentData);

      // 2) تأكد من الـ role
      if (parentData.role !== "parent") {
        await signOut(auth);
        alert("غير مسموح، هذا الحساب ليس Parent");
        return;
      }

      // 3) هات توكن جديد
      const token = await user.getIdToken(true);
      console.log("🟢 TOKEN:", token);

      // 4) ابعت التوكن للباك
      const res = await fetch("http://127.0.0.1:8000/api/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("📡 Laravel status:", res.status);

      const data = await res.json();
      console.log("🟣 Laravel Response:", data);

      if (!res.ok) {
        alert("الباك رفض التوكن");
        return;
      }

      alert("Login successful ✅");

      // 5) دخله على داشبورد البيرنت
      navigate("/parent-dashboard");
    } catch (error) {
      console.error("❌ Login Error:", error);
      alert("Error حصل ❌ بص الـ console");
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={`${import.meta.env.BASE_URL}videos/bk.mp4`}
          type="video/mp4"
        />
      </video>

      <div className="login-card parent">
        <h2 className="h2login">Parent Login</h2>

        <div className="role-tabs">
          <button onClick={() => navigate("/login")}>
            Student
          </button>

          <button className="active">
            Parent
          </button>

          <button onClick={() => navigate("/login-teacher")}>
            Teacher
          </button>

          <button onClick={() => navigate("/login-admin")}>
            Administration
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Parent Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="icon">
              <FaEnvelope />
            </span>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button className="submit-btn parent" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}