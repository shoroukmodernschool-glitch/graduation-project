import "./Login_form.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔥 نحاول نجيب اليوزر من كل collection
      const collections = ["student", "teachers", "parents", "Admin"];

      let userData = null;
      let userRole = "";

      for (let col of collections) {
        const docRef = doc(db, col, user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          userData = docSnap.data();
          userRole = col;
          break;
        }
      }

      if (!userData) {
        alert("User data not found!");
        return;
      }

      alert("Login Successful");

      // 🔥 تحويل حسب النوع
      if (userRole === "student") {
        navigate("/student-dashboard");
      } else if (userRole === "teachers") {
        navigate("/teacher-dashboard");
      } else if (userRole === "parents") {
        navigate("/parent-dashboard");
      } else if (userRole === "Admin") {
        navigate("/admin");
      }

    } catch (error) {
      console.error(error);
      alert(error.message);
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
        <source src={`${import.meta.env.BASE_URL}videos/bk.mp4`} />
      </video>

      <div className="login-card student">

        <h2 className="h2login" > Student Login</h2>

        <div className="role-tabs">

          <button className="active">Student</button>

          <button onClick={() => navigate("/login-parent")}>
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
              placeholder="Student Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="icon">👤</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="icon">🔒</span>
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button className="submit-btn student">
            Submit
          </button>

        </form>

      </div>

    </div>
  );
}