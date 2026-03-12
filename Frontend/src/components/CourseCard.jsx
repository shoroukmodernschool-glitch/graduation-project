import React from "react";

function CourseCard({title, progress}) {
  return (
    <div style={{
      background:"#fff",
      padding:"20px",
      marginBottom:"20px",
      borderRadius:"10px",
      boxShadow:"0 0 10px rgba(0,0,0,0.1)"
    }}>
      <h3>{title}</h3>
      <p>{progress}% completed</p>

      <button>Continue</button>
    </div>
  )
}

export default CourseCard