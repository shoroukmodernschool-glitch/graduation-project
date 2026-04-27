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
  setDoc,
  serverTimestamp,
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
  const [studentInfo, setStudentInfo] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [teacherMaterials, setTeacherMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeExam, setActiveExam] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [examScore, setExamScore] = useState(null);

  const [submittedExams, setSubmittedExams] = useState({});

  const subjectName = decodeURIComponent(id || "");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseSubject(null);
        setStudentInfo(null);
        setLessons([]);
        setAssignments([]);
        setExams([]);
        setTeacherMaterials([]);
        setSubmittedExams({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const studentRef = doc(db, "student", user.uid);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
          setFirebaseSubject(null);
          setStudentInfo(null);
          setLessons([]);
          setAssignments([]);
          setExams([]);
          setTeacherMaterials([]);
          setSubmittedExams({});
          setLoading(false);
          return;
        }

        const studentData = studentSnap.data();
        const studentGrade = String(studentData.grade || "").trim();
        const studentStage = String(studentData.stage || "").toLowerCase().trim();

        setStudentInfo({
          id: user.uid,
          email: user.email,
          ...studentData,
        });

        const snapshot = await getDocs(collection(db, "subject"));

        const subjectsData = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ref: docItem.ref,
          ...docItem.data(),
        }));

        const selectedSubject = subjectsData.find((subject) => {
          const subjectRealName = subject.subject_name || subject.name || subject.title || "";
          const subjectGrade = String(subject.grade || "").trim();
          const subjectStage = String(subject.stage || "").toLowerCase().trim();

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
          setTeacherMaterials([]);
          setSubmittedExams({});
          setLoading(false);
          return;
        }

        setFirebaseSubject(selectedSubject);

        const expectedSubjectId =
          selectedSubject.subjectId ||
          selectedSubject.subject_id ||
          `grade${studentGrade}_${subjectName.toLowerCase()}`;

        const lessonsSnapshot = await getDocs(
          collection(db, "subject", selectedSubject.id, "lessons")
        );

        const assignmentsSnapshot = await getDocs(
          collection(db, "subject", selectedSubject.id, "assignments")
        );

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

        const teacherExamsQuery = query(
          collection(db, "teacher_exams"),
          where("grade", "==", studentGrade),
          where("subjectId", "==", expectedSubjectId)
        );

        const teacherExamsSnapshot = await getDocs(teacherExamsQuery);

        const examsData = teacherExamsSnapshot.docs.map((docItem, index) => ({
          id: index + 1,
          firebaseId: docItem.id,
          ...docItem.data(),
        }));

        setExams(examsData);

        const submittedMap = {};

        for (const exam of examsData) {
          const resultId = `${user.uid}_${exam.firebaseId}`;
          const resultRef = doc(db, "exam_results", resultId);
          const resultSnap = await getDoc(resultRef);

          if (resultSnap.exists()) {
            submittedMap[exam.firebaseId] = resultSnap.data();
          }
        }

        setSubmittedExams(submittedMap);

        const materialsQuery = query(
          collection(db, "teacher_materials"),
          where("grade", "==", studentGrade),
          where("subjectId", "==", expectedSubjectId)
        );

        const materialsSnapshot = await getDocs(materialsQuery);

        setTeacherMaterials(
          materialsSnapshot.docs.map((docItem, index) => ({
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
        setTeacherMaterials([]);
        setSubmittedExams({});
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [subjectName]);

  const videos = teacherMaterials.filter((item) => item.type === "video");
  const pdfs = teacherMaterials.filter((item) => item.type === "pdf");

  const subject = useMemo(() => {
    return {
      color: subjectThemes[subjectName] || "english-theme",
      teacher:
        firebaseSubject?.teacherName ||
        firebaseSubject?.teacher_name ||
        firebaseSubject?.teacher ||
        firebaseSubject?.teacher_id ||
        "No teacher assigned",
      lessonsCount: lessons.length + teacherMaterials.length,
      assignmentsCount: assignments.length,
      attendance: firebaseSubject?.attendance ?? 0,
      examsCount: exams.length,
      lessons,
      assignments,
      exams,
    };
  }, [subjectName, firebaseSubject, lessons, assignments, exams, teacherMaterials]);

  const openResource = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const startExam = async (exam) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    const resultId = `${user.uid}_${exam.firebaseId}`;
    const resultRef = doc(db, "exam_results", resultId);
    const resultSnap = await getDoc(resultRef);

    if (resultSnap.exists()) {
      const savedResult = resultSnap.data();

      setSubmittedExams((prev) => ({
        ...prev,
        [exam.firebaseId]: savedResult,
      }));

      alert("You already submitted this exam.");
      return;
    }

    setActiveExam(exam);
    setExamAnswers({});
    setExamScore(null);
  };

  const chooseAnswer = (questionIndex, optionIndex) => {
    if (examScore) return;

    setExamAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const submitExam = async () => {
    if (!activeExam) return;

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    const resultId = `${user.uid}_${activeExam.firebaseId}`;
    const resultRef = doc(db, "exam_results", resultId);
    const oldResultSnap = await getDoc(resultRef);

    if (oldResultSnap.exists()) {
      const savedResult = oldResultSnap.data();

      setSubmittedExams((prev) => ({
        ...prev,
        [activeExam.firebaseId]: savedResult,
      }));

      setActiveExam(null);
      alert("You already submitted this exam.");
      return;
    }

    const totalQuestions = activeExam.questions?.length || 0;

    if (Object.keys(examAnswers).length < totalQuestions) {
      alert("Please answer all questions first.");
      return;
    }

    let correctAnswers = 0;

    activeExam.questions.forEach((question, index) => {
      if (examAnswers[index] === question.correct) {
        correctAnswers += 1;
      }
    });

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const resultData = {
      examId: activeExam.firebaseId,
      examTitle: activeExam.title,
      subjectName,
      subjectId: activeExam.subjectId,
      grade: activeExam.grade,
      studentId: studentInfo?.id || user.uid,
      studentEmail: studentInfo?.email || user.email || "",
      answers: examAnswers,
      score: correctAnswers,
      total: totalQuestions,
      percentage,
      submitted: true,
      submittedAt: serverTimestamp(),
    };

    setExamScore({
      correct: correctAnswers,
      total: totalQuestions,
      percentage,
    });

    try {
      await setDoc(resultRef, resultData);

      setSubmittedExams((prev) => ({
        ...prev,
        [activeExam.firebaseId]: {
          ...resultData,
          submittedAt: new Date(),
        },
      }));
    } catch (error) {
      console.error("Error saving exam result:", error);
      alert("Error saving exam result.");
    }
  };

  if (activeExam) {
    return (
      <div className={`subject-page ${subject.color}`}>
        <DashboardNavbar />

        <div className="subject-container">
          <header className="subject-hero">
            <button className="back-btn" onClick={() => setActiveExam(null)}>
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to Exams</span>
            </button>

            <div className="hero-center">
              <p className="hero-subtitle">Exam</p>
              <h1>{activeExam.title || "Untitled Exam"}</h1>
              <p className="hero-subtitle">
                Duration: {activeExam.duration || "-"} minutes
              </p>
            </div>
          </header>

          <section className="cards-grid">
            {activeExam.questions?.map((question, qIndex) => (
              <div className="content-card" key={qIndex}>
                <div className="card-head">
                  <div className="card-icon">
                    <i className="fa-solid fa-circle-question"></i>
                  </div>
                  <div>
                    <h3>Question {qIndex + 1}</h3>
                    <h4>{question.question}</h4>
                  </div>
                </div>

                <hr />

                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    style={{
                      display: "block",
                      margin: "12px 0",
                      cursor: examScore ? "not-allowed" : "pointer",
                      fontWeight: "600",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={examAnswers[qIndex] === optionIndex}
                      disabled={!!examScore}
                      onChange={() => chooseAnswer(qIndex, optionIndex)}
                      style={{ marginRight: "10px" }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
          </section>

          <div style={{ marginTop: "25px", textAlign: "center" }}>
            {!examScore && (
              <button className="exam-btn" onClick={submitExam}>
                Submit Exam
              </button>
            )}

            {examScore && (
              <div className="content-card" style={{ marginTop: "25px" }}>
                <h2>
                  Your Score: {examScore.correct} / {examScore.total}
                </h2>
                <h3>{examScore.percentage}%</h3>
                <p style={{ marginTop: "10px", fontWeight: "600" }}>
                  Exam submitted successfully. You cannot edit your answers now.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
            {subject.lessons.length === 0 && teacherMaterials.length === 0 ? (
              <div className="empty-card">No lessons available.</div>
            ) : (
              <>
                {subject.lessons.map((lesson) => (
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
                ))}

                {videos.map((video) => (
                  <div className="content-card" key={video.firebaseId}>
                    <div className="card-head">
                      <div className="card-icon">
                        <i className="fa-solid fa-video"></i>
                      </div>
                      <div>
                        <h3>Video {video.id}</h3>
                        <h4>{video.title || video.fileName || "Untitled Video"}</h4>
                      </div>
                    </div>

                    <hr />

                    <div className="btns">
                      <button
                        className="primary-btn"
                        onClick={() => openResource(video.fileUrl)}
                        disabled={!video.fileUrl}
                      >
                        <i className="fa-brands fa-youtube"></i> Watch Video
                      </button>
                    </div>
                  </div>
                ))}

                {pdfs.map((pdf) => (
                  <div className="content-card" key={pdf.firebaseId}>
                    <div className="card-head">
                      <div className="card-icon">
                        <i className="fa-regular fa-file-pdf"></i>
                      </div>
                      <div>
                        <h3>PDF {pdf.id}</h3>
                        <h4>{pdf.title || pdf.fileName || "Untitled PDF"}</h4>
                      </div>
                    </div>

                    <hr />

                    <div className="btns">
                      <button
                        className="secondary-btn"
                        onClick={() => openResource(pdf.fileUrl)}
                        disabled={!pdf.fileUrl}
                      >
                        <i className="fa-regular fa-file-lines"></i> Open PDF
                      </button>
                    </div>
                  </div>
                ))}
              </>
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
              subject.exams.map((exam) => {
                const savedResult = submittedExams[exam.firebaseId];

                return (
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
                      <p className="meta-line">
                        Duration: {exam.duration || "-"} minutes
                      </p>

                      {savedResult ? (
                        <button className="exam-btn" disabled>
                          Submitted
                        </button>
                      ) : (
                        <button className="exam-btn" onClick={() => startExam(exam)}>
                          Start Exam
                        </button>
                      )}
                    </div>

                    {savedResult && (
                      <div style={{ marginTop: "15px", fontWeight: "700" }}>
                        Your Score: {savedResult.score} / {savedResult.total} -{" "}
                        {savedResult.percentage}%
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        )}
      </div>
    </div>
  );
}