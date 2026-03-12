import React from "react";

function Sidebar() {
  return (
    <div style={{
      width: "200px",
      height: "100vh",
      background: "#5b3cc4",
      color: "white",
      padding: "20px"
    }}>
      <h2>School</h2>

      <ul style={{listStyle:"none", padding:0}}>
        <li>Dashboard</li>
        <li>Courses</li>
        <li>Assignments</li>
        <li>Calendar</li>
        <li>Messages</li>
        <li>Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar;