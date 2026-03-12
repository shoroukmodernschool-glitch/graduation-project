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
import Camera from "./pages/Camera";

/* Dashboards */
import StudentDashboard from "./pages/Student/StudentDashboard";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ParentDashboard from "./pages/Parent/ParentDashboard";

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

        {/* Camera */}
        <Route path="/camera" element={<Camera />} />

        {/* Dashboards */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />

      </Routes>
    </>
  );
}

export default App;