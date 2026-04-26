import { useLocation } from "react-router-dom";

function TeacherExams() {
  const location = useLocation();

  const subject = location.state?.subject;
  const grade = location.state?.grade;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Teacher Exams Page</h1>
      <h2>Subject: {subject?.name || "No Subject"}</h2>
      <h2>Grade: {grade || "No Grade"}</h2>
    </div>
  );
}

export default TeacherExams;