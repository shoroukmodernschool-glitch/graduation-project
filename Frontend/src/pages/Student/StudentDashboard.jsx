import React from "react";
import Sidebar from "../../components/Sidebar";
import CourseCard from "../../components/CourseCard";

function StudentDashboard() {
  return (

    <div style={{display:"flex"}}>

      <Sidebar />

      <div style={{padding:"30px", width:"100%"}}>

        <h1>Hello Student 👋</h1>

        <h2>Today's Courses</h2>

        <CourseCard title="Biology" progress="79" />
        <CourseCard title="Color Theory" progress="64" />

      </div>

    </div>

  )
}

export default StudentDashboard