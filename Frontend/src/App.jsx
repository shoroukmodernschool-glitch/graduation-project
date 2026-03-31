import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

/* Firebase */
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/* Pages */
import About from "./pages/About/About";
import Home from "./pages/home/home_page";

/* Login */
import Login from "./pages/login/login_form";
import LoginParent from "./pages/login/login-parent";
import LoginTeacher from "./pages/login/login-teacher";
import LoginAdmin from "./pages/login/login_Admin";

/* Signup */
import SignUp from "./pages/signup/sign_up";
import SignupParent from "./pages/signup/signup_parent";
import SignupTeacher from "./pages/signup/signup_Teacher";
import SignupAdmin from "./pages/signup/SignupAdmin";

/* Contact */
import Contact from "./pages/contactus/contact";

/* ACADEMIC_LEVELS */
import EarlyChildhood from "./pages/ACADEMIC_LEVELS/EarlyChildhood";
import LowerSchool from "./pages/ACADEMIC_LEVELS/LowerSchool";
import MiddleSchool from "./pages/ACADEMIC_LEVELS/MiddleSchool";
import UpperSchool from "./pages/ACADEMIC_LEVELS/UpperSchool";

/* Student Dashboard */
import Dashboard from "./dashboard/layouts/dashboard/student";
import Profile from "./dashboard/layouts/profile";
import Tables from "./dashboard/layouts/tables";
import Billing from "./dashboard/layouts/billing";
import Notifications from "./dashboard/layouts/notifications";

/* ✅ FIXED SUBJECTS IMPORT */
import Subjects from "./pages/subjects/Subjects";

function App() {
  const location = useLocation();
  const [students, setStudents] = useState([]);

  const hideNavbar =
    location.pathname.includes("login") ||
    location.pathname.includes("signup") ||
    location.pathname.includes("student-dashboard") ||
    location.pathname.includes("/profile") ||
    location.pathname.includes("/tables") ||
    location.pathname.includes("/billing") ||
    location.pathname.includes("/notifications");

  useEffect(() => {
    console.log("App Loaded");

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(data);
        console.log("Firebase Data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}

      {students.length > 0 && (
        <div style={{ padding: "20px" }}>
          <h3>Students Data From Firebase</h3>
          {students.map((student) => (
            <p key={student.id}>{student.name}</p>
          ))}
        </div>
      )}

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-parent" element={<LoginParent />} />
        <Route path="/login-teacher" element={<LoginTeacher />} />
        <Route path="/login-admin" element={<LoginAdmin />} />

        {/* Signup */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-parent" element={<SignupParent />} />
        <Route path="/signup-teacher" element={<SignupTeacher />} />
        <Route path="/signup-admin" element={<SignupAdmin />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Academic */}
        <Route path="/early-childhood" element={<EarlyChildhood />} />
        <Route path="/lower-school" element={<LowerSchool />} />
        <Route path="/middle-school" element={<MiddleSchool />} />
        <Route path="/upper-school" element={<UpperSchool />} />

        {/* Student Dashboard */}
        <Route path="/student-dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* ✅ Subjects Page */}
        <Route path="/subjects" element={<Subjects />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;