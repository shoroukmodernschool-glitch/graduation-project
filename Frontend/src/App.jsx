import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/home_page";
import Login from "./pages/login_form";
import LoginParent from "./pages/login-parent";
import LoginTeacher from "./pages/login-teacher";

import SignUp from "./pages/sign_up";
import SignupParent from "./pages/signup_parent";
import SignupTeacher from "./pages/signup_Teacher";
import Camera from "./pages/Camera";


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

        {/* Fallback */}
        <Route path="*" element={<Home />} />

      </Routes>
    </>
  );
}

export default App;