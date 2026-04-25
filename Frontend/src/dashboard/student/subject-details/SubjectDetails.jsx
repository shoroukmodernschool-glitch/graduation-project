import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import "./SubjectDetails.css";

const subjectThemes = {
  English: "english-theme",
  Math: "math-theme",
  Science: "science-theme",
  Arabic: "arabic-theme",
  Religion: "religion-theme",
  Computer: "computer-theme",
  "Social Studies": "social-theme",
  Geography: "social-theme",
  History: "social-theme",
  Physics: "science-theme",
  Chemistry: "science-theme",
  Biology: "science-theme",
  Philosophy: "social-theme",
};

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("lessons");
  const [firebaseSubject, setFirebaseSubject] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjectName = decodeURIComponent(id || "");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseSubject(null);
        setLessons([]);
        setAssignments([]);
        setExams([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const studentRef = doc(db, "student", user.uid);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
          setFirebaseSubject(null);
          setLessons([]);
          setAssignments([]);
          setExams([]);
          setLoading(false);
          return;
        }

        const studentData = studentSnap.data();
        const studentGrade = String(studentData.grade).trim();
        const studentStage = String(studentData.stage).toLowerCase().trim();

        const snapshot = await getDocs(collection(db, "subject"));

        const subjectsData = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ref: docItem.ref,
          ...docItem.data(),
        }));

        const selectedSubject = subjectsData.find((subject) => {
          const subjectRealName = subject.subject_name || subject.name || subject.title || "";
          const subjectGrade = String(subject.grade).trim();
          const subjectStage = String(subject.stage).toLowerCase().trim();

          return (
            subjectRealName === subjectName &&
            subjectGrade === studentGrade &&
            subjectStage === studentStage
          );
        });

        if (!selectedSubject) {
          setFirebaseSubject(null);
          setLessons([]);
          setAssignments([]);
          setExams([]);
          setLoading(false);
          return;
        }

        setFirebaseSubject(selectedSubject);

        const lessonsSnapshot = await getDocs(collection(db, "subject", selectedSubject.id, "lessons"));
        const assignmentsSnapshot = await getDocs(
          collection(db, "subject", selectedSubject.id, "assignments")
        );
        const examsSnapshot = await getDocs(collection(db, "subject", selectedSubject.id, "exams"));

        setLessons(
          lessonsSnapshot.docs.map((docItem, index) => ({
            id: index + 1,
            firebaseId: docItem.id,
            ...docItem.data(),
          }))
        );

        setAssignments(
          assignmentsSnapshot.docs.map((docItem, index) => ({
            id: index + 1,
            firebaseId: docItem.id,
            ...docItem.data(),
          }))
        );

        setExams(
          examsSnapshot.docs.map((docItem, index) => ({
            id: index + 1,
            firebaseId: docItem.id,
            ...docItem.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching subject data:", error);
        setFirebaseSubject(null);
        setLessons([]);
        setAssignments([]);
        setExams([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [subjectName]);

  const subject = useMemo(() => {
    return {
      color: subjectThemes[subjectName] || "english-theme",
      teacher:
        firebaseSubject?.teacherName ||
        firebaseSubject?.teacher_name ||
        firebaseSubject?.teacher ||
        firebaseSubject?.teacher_id ||
        "No teacher assigned",
      lessonsCount: lessons.length,
      assignmentsCount: assignments.length,
      attendance: firebaseSubject?.attendance ?? 0,
      examsCount: exams.length,
      lessons,
      assignments,
      exams,
    };
  }, [subjectName, firebaseSubject, lessons, assignments, exams]);

  const openResource = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`subject-page ${subject.color}`}>
      <DashboardNavbar />

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
                <h3>{loading ? "Loading..." : subject.teacher}</h3>
              </div>
            </div>

            <div className="attendance-box">
              <span>{loading ? "..." : `${subject.attendance}% Attendance`}</span>
            </div>
          </div>

          <div className="mini-stat-card">
            <p>Lessons</p>
            <h3>{loading ? "..." : subject.lessonsCount}</h3>
          </div>

          <div className="mini-stat-card">
            <p>Assignments</p>
            <h3>{loading ? "..." : subject.assignmentsCount}</h3>
          </div>

          <div className="mini-stat-card">
            <p>Exams</p>
            <h3>{loading ? "..." : subject.examsCount}</h3>
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
                <div className="content-card" key={lesson.firebaseId || lesson.id}>
                  <div className="card-head">
                    <div className="card-icon">
                      <i className="fa-solid fa-book-open"></i>
                    </div>
                    <div>
                      <h3>Lesson {lesson.id}</h3>
                      <h4>{lesson.title || "Untitled Lesson"}</h4>
                    </div>
                  </div>

                  <hr />

                  <p className="meta-line">
                    <i className="fa-regular fa-calendar"></i>{" "}
                    {lesson.date || lesson.createdAt || "-"}
                  </p>

                  <div className="btns">
                    <button
                      className="primary-btn"
                      onClick={() => openResource(lesson.videoUrl)}
                      disabled={!lesson.videoUrl}
                    >
                      <i className="fa-brands fa-youtube"></i> Watch Video
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={() => openResource(lesson.pdfUrl)}
                      disabled={!lesson.pdfUrl}
                    >
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
                <div className="content-card" key={assignment.firebaseId || assignment.id}>
                  <div className="card-head">
                    <div className="card-icon">
                      <i className="fa-solid fa-clipboard-list"></i>
                    </div>
                    <div>
                      <h3>Assignment {assignment.id}</h3>
                      <h4>{assignment.title || "Untitled Assignment"}</h4>
                    </div>
                  </div>

                  <hr />

                  <p className="meta-line">Deadline: {assignment.deadline || "-"}</p>

                  <div className="assignment-footer">
                    <span
                      className={
                        assignment.status === "Submitted"
                          ? "status-badge submitted"
                          : "status-badge not-submitted"
                      }
                    >
                      {assignment.status || "Not Submitted"}
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
                <div className="content-card" key={exam.firebaseId || exam.id}>
                  <div className="card-head">
                    <div className="card-icon">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                    <div>
                      <h3>Quiz {exam.id}</h3>
                      <h4>{exam.title || "Untitled Exam"}</h4>
                    </div>
                  </div>

                  <hr />

                  <div className="exam-row">
                    <p className="meta-line">Duration: {exam.duration || "-"}</p>
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