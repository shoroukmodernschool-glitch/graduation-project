import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";

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
import VerifyCode from "./pages/signup/VerifyCode"; // ✅ إضافة

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

import Attendance from "./dashboard/layouts/attendance";
import Notifications from "./dashboard/layouts/notifications";

import AdminDashboard from "./dashboard/layouts/dashboard/admin";

/* Parent Dashboard */
import ParentDashboard from "./dashboard/layouts/dashboard/parent";

/* Subjects */
import Subjects from "./pages/subjects/Subjects";
import SubjectDetails from "./pages/subject-details/SubjectDetails";

/* Chatbot */
import ChatbotPage from "./pages/chatbot/chatbot";

function App() {
  const location = useLocation();
  const [students, setStudents] = useState([]);

  const hideNavbar =

  location.pathname.startsWith("/login") ||
  location.pathname.startsWith("/signup") ||
  location.pathname.startsWith("/student-dashboard") ||
  location.pathname.startsWith("/parent-dashboard") ||
  location.pathname.startsWith("/parent-attendance") ||
  location.pathname.startsWith("/parent-notifications") ||
  location.pathname.startsWith("/parent-profile") ||
  location.pathname.startsWith("/admin") ||
  location.pathname.startsWith("/profile") ||
  location.pathname.startsWith("/tables") ||
  location.pathname.startsWith("/attendance") ||
  location.pathname.startsWith("/notifications") ||
  location.pathname.startsWith("/subjects") ||
  location.pathname.startsWith("/subject");
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
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />
        <Route path="/login-parent" element={<LoginParent />} />
        <Route path="/login-teacher" element={<LoginTeacher />} />
        <Route path="/login-admin" element={<LoginAdmin />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-parent" element={<SignupParent />} />
        <Route path="/signup-teacher" element={<SignupTeacher />} />
        <Route path="/signup-admin" element={<SignupAdmin />} />

        <Route path="/verify-code" element={<VerifyCode />} /> {/* ✅ إضافة */}

        <Route path="/contact" element={<Contact />} />

        <Route path="/early-childhood" element={<EarlyChildhood />} />
        <Route path="/lower-school" element={<LowerSchool />} />
        <Route path="/middle-school" element={<MiddleSchool />} />
        <Route path="/upper-school" element={<UpperSchool />} />

        <Route path="/chatbot" element={<ChatbotPage />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent-dashboard"
          element={
            <ProtectedRoute>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subject/:id" element={<SubjectDetails />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tables"
          element={
            <ProtectedRoute>
              <Tables />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;