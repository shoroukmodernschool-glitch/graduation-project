import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SubjectDetails.css";

const subjectData = {
  English: {
    color: "english-theme",
    teacher: "Mr. Ahmed Mohamed",
    lessonsCount: 10,
    assignmentsCount: 5,
    attendance: 50,
    examsCount: 2,
    lessons: [
      { id: 1, title: "Introduction", date: "12 October" },
      { id: 2, title: "Grammar", date: "15 October" },
    ],
    assignments: [
      { id: 1, title: "Assignment 1", deadline: "20 October", status: "Not Submitted" },
      { id: 2, title: "Assignment 2", deadline: "24 October", status: "Submitted" },
    ],
    exams: [
      { id: 1, title: "Grammar Quiz", duration: "10 minutes" },
      { id: 2, title: "Vocabulary Quiz", duration: "20 minutes" },
    ],
  },

  Math: {
    color: "math-theme",
    teacher: "Mr. Ahmed Mohamed",
    lessonsCount: 8,
    assignmentsCount: 4,
    attendance: 70,
    examsCount: 2,
    lessons: [
      { id: 1, title: "Numbers", date: "10 October" },
      { id: 2, title: "Fractions", date: "14 October" },
    ],
    assignments: [
      { id: 1, title: "Solve Sheet 1", deadline: "18 October", status: "Submitted" },
      { id: 2, title: "Solve Sheet 2", deadline: "23 October", status: "Not Submitted" },
    ],
    exams: [
      { id: 1, title: "Numbers Quiz", duration: "15 minutes" },
      { id: 2, title: "Fractions Quiz", duration: "20 minutes" },
    ],
  },

  Science: {
    color: "science-theme",
    teacher: "Mr. Ahmed Mohamed",
    lessonsCount: 12,
    assignmentsCount: 6,
    attendance: 60,
    examsCount: 2,
    lessons: [
      { id: 1, title: "Plants", date: "11 October" },
      { id: 2, title: "Atoms", date: "16 October" },
    ],
    assignments: [
      { id: 1, title: "Lab Report", deadline: "21 October", status: "Not Submitted" },
      { id: 2, title: "Science Worksheet", deadline: "27 October", status: "Submitted" },
    ],
    exams: [
      { id: 1, title: "Plants Quiz", duration: "10 minutes" },
      { id: 2, title: "Atoms Quiz", duration: "15 minutes" },
    ],
  },

  Arabic: {
    color: "arabic-theme",
    teacher: "Mr. Ahmed Mohamed",
    lessonsCount: 9,
    assignmentsCount: 3,
    attendance: 80,
    examsCount: 2,
    lessons: [
      { id: 1, title: "Introduction", date: "12 October" },
      { id: 2, title: "Grammar", date: "15 October" },
    ],
    assignments: [
      { id: 1, title: "Assignment 1", deadline: "20 October", status: "Not Submitted" },
      { id: 2, title: "Assignment 2", deadline: "24 October", status: "Submitted" },
    ],
    exams: [
      { id: 1, title: "Grammar Quiz", duration: "10 minutes" },
      { id: 2, title: "Vocabulary Quiz", duration: "20 minutes" },
    ],
  },

  Religion: {
    color: "religion-theme",
    teacher: "Mr. Ahmed Mohamed",
    lessonsCount: 7,
    assignmentsCount: 2,
    attendance: 90,
    examsCount: 1,
    lessons: [
      { id: 1, title: "Moral Values", date: "9 October" },
      { id: 2, title: "Good Behavior", date: "13 October" },
    ],
    assignments: [
      { id: 1, title: "Short Report", deadline: "19 October", status: "Submitted" },
    ],
    exams: [{ id: 1, title: "Values Quiz", duration: "10 minutes" }],
  },

  Computer: {
    color: "computer-theme",
    teacher: "Mr. Ahmed Mohamed",
    lessonsCount: 6,
    assignmentsCount: 3,
    attendance: 85,
    examsCount: 1,
    lessons: [
      { id: 1, title: "Computer Basics", date: "8 October" },
      { id: 2, title: "Parts of Computer", date: "12 October" },
    ],
    assignments: [
      { id: 1, title: "Write About Hardware", deadline: "22 October", status: "Not Submitted" },
    ],
    exams: [{ id: 1, title: "Basics Quiz", duration: "15 minutes" }],
  },

  "Social Studies": {
    color: "social-theme",
    teacher: "Mr. Ahmed Mohamed",
    lessonsCount: 6,
    assignmentsCount: 2,
    attendance: 75,
    examsCount: 1,
    lessons: [
      { id: 1, title: "Maps", date: "7 October" },
      { id: 2, title: "Egypt Governorates", date: "11 October" },
    ],
    assignments: [
      { id: 1, title: "Map Activity", deadline: "25 October", status: "Submitted" },
    ],
    exams: [{ id: 1, title: "Maps Quiz", duration: "10 minutes" }],
  },
};

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lessons");

  const subjectName = decodeURIComponent(id || "");

  const subject = useMemo(() => {
    return (
      subjectData[subjectName] || {
        color: "english-theme",
        teacher: "Mr. Ahmed Mohamed",
        lessonsCount: 0,
        assignmentsCount: 0,
        attendance: 0,
        examsCount: 0,
        lessons: [],
        assignments: [],
        exams: [],
      }
    );
  }, [subjectName]);

  return (
    <div className={`subject-page ${subject.color}`}>
      <div className="subject-container">
        <header className="subject-hero">
          <button className="back-btn" onClick={() => navigate("/subjects")}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back</span>
          </button>

          <div className="hero-center">
            <p className="hero-subtitle">Subject Details</p>
            <h1>{subjectName}</h1>
          </div>
        </header>

        <section className="overview-grid">
          <div className="main-info-card">
            <div className="teacher-line">
              <div className="teacher-avatar">
                <i className="fa-solid fa-user"></i>
              </div>

              <div>
                <p className="small-label">Teacher</p>
                <h3>{subject.teacher}</h3>
              </div>
            </div>

            <div className="attendance-box">
              <span>{subject.attendance}% Attendance</span>
            </div>
          </div>

          <div className="mini-stat-card">
            <p>Lessons</p>
            <h3>{subject.lessonsCount}</h3>
          </div>

          <div className="mini-stat-card">
            <p>Assignments</p>
            <h3>{subject.assignmentsCount}</h3>
          </div>

          <div className="mini-stat-card">
            <p>Exams</p>
            <h3>{subject.examsCount}</h3>
          </div>
        </section>

        <div className="tabs">
          <button
            className={activeTab === "lessons" ? "active" : ""}
            onClick={() => setActiveTab("lessons")}
          >
            Lessons
          </button>

          <button
            className={activeTab === "assignments" ? "active" : ""}
            onClick={() => setActiveTab("assignments")}
          >
            Assignments
          </button>

          <button
            className={activeTab === "exams" ? "active" : ""}
            onClick={() => setActiveTab("exams")}
          >
            Exams
          </button>
        </div>

        {activeTab === "lessons" && (
          <section className="cards-grid">
            {subject.lessons.length === 0 ? (
              <div className="empty-card">No lessons available.</div>
            ) : (
              subject.lessons.map((lesson) => (
                <div className="content-card" key={lesson.id}>
                  <div className="card-head">
                    <div className="card-icon">
                      <i className="fa-solid fa-book-open"></i>
                    </div>
                    <div>
                      <h3>Lesson {lesson.id}</h3>
                      <h4>{lesson.title}</h4>
                    </div>
                  </div>

                  <hr />

                  <p className="meta-line">
                    <i className="fa-regular fa-calendar"></i> {lesson.date}
                  </p>

                  <div className="btns">
                    <button className="primary-btn">
                      <i className="fa-brands fa-youtube"></i> Watch Video
                    </button>
                    <button className="secondary-btn">
                      <i className="fa-regular fa-file-lines"></i> PDF
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "assignments" && (
          <section className="cards-grid">
            {subject.assignments.length === 0 ? (
              <div className="empty-card">No assignments available.</div>
            ) : (
              subject.assignments.map((assignment) => (
                <div className="content-card" key={assignment.id}>
                  <div className="card-head">
                    <div className="card-icon">
                      <i className="fa-solid fa-clipboard-list"></i>
                    </div>
                    <div>
                      <h3>Assignment {assignment.id}</h3>
                      <h4>{assignment.title}</h4>
                    </div>
                  </div>

                  <hr />

                  <p className="meta-line">Deadline: {assignment.deadline}</p>

                  <div className="assignment-footer">
                    <span
                      className={
                        assignment.status === "Submitted"
                          ? "status-badge submitted"
                          : "status-badge not-submitted"
                      }
                    >
                      {assignment.status}
                    </span>

                    <div className="btns small-btns">
                      <button className="secondary-btn">
                        <i className="fa-solid fa-file-arrow-up"></i> Upload
                      </button>
                      <button className="primary-btn">Submit</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "exams" && (
          <section className="cards-grid">
            {subject.exams.length === 0 ? (
              <div className="empty-card">No exams available.</div>
            ) : (
              subject.exams.map((exam) => (
                <div className="content-card" key={exam.id}>
                  <div className="card-head">
                    <div className="card-icon">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                    <div>
                      <h3>Quiz {exam.id}</h3>
                      <h4>{exam.title}</h4>
                    </div>
                  </div>

                  <hr />

                  <div className="exam-row">
                    <p className="meta-line">Duration: {exam.duration}</p>
                    <button className="exam-btn">Start Exam</button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}