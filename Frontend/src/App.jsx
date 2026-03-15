import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import About from "./pages/About/About";
import Home from "./pages/home_page";
import Login from "./pages/login_form";
import LoginParent from "./pages/login-parent";
import LoginTeacher from "./pages/login-teacher";
import SignUp from "./pages/sign_up";
import SignupParent from "./pages/signup_parent";
import SignupTeacher from "./pages/signup_Teacher";
import SignupAdmin from "./pages/SignupAdmin";
import Camera from "./pages/Camera";
/* Dashboards */
import StudentDashboard from "./pages/Student/StudentDashboard";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ParentDashboard from "./pages/Parent/ParentDashboard";
/* ACADEMIC_LEVELS */
import EarlyChildhood from "./pages/ACADEMIC_LEVELS/EarlyChildhood";
import LowerSchool from "./pages/ACADEMIC_LEVELS/LowerSchool";
import MiddleSchool from "./pages/ACADEMIC_LEVELS/MiddleSchool";
import UpperSchool from "./pages/ACADEMIC_LEVELS/UpperSchool";
function App() {

  useEffect(() => {
    console.log("App Loaded");
  }, []);

  return (
    <>
      <Navbar />

      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Login Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-parent" element={<LoginParent />} />
        <Route path="/login-teacher" element={<LoginTeacher />} />

        {/* Signup Pages */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-parent" element={<SignupParent />} />
        <Route path="/signup-teacher" element={<SignupTeacher />} />
<Route path="/signup-admin" element={<SignupAdmin />} />
        {/* Camera */}
        <Route path="/camera" element={<Camera />} />

        {/* Dashboards */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        {/* ACADEMIC_LEVELS */}
        <Route path="/early-childhood" element={<EarlyChildhood />} />
        <Route path="/lower-school" element={<LowerSchool />} />
        <Route path="/middle-school" element={<MiddleSchool />} />
        <Route path="/upper-school" element={<UpperSchool />} />
        {/* Fallback */}
        <Route path="*" element={<Home />} />

      </Routes>
    </>
  );
}

export default App;