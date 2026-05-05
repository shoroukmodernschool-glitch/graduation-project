import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import "./TeacherExams.css";

function TeacherExams() {
  const location = useLocation();
  const navigate = useNavigate();

  const subject = location.state?.subject;
  const grade = location.state?.grade;
  const teacher = location.state?.teacher;

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correct: 0 },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) return;
    if (!window.confirm("Delete this question?")) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex, optionIndex) => {
    const updated = [...questions];
    updated[qIndex].correct = optionIndex;
    setQuestions(updated);
  };

  const sendExamNotificationsToStudentsAndParents = async (gradeNumber, subjectId) => {
    const studentsSnap = await getDocs(collection(db, "student"));

    const targetStudents = studentsSnap.docs
      .map((studentDoc) => ({
        docId: studentDoc.id,
        ...studentDoc.data(),
      }))
      .filter((student) => {
        const studentGrade = String(student.grade || student.Grade || "")
          .replace("Grade ", "")
          .trim();

        return studentGrade === String(gradeNumber);
      });

    console.log("TARGET STUDENTS:", targetStudents.length);

    const notificationsPromises = targetStudents.flatMap((student) => {
      const realStudentId = String(
        student.student_id || student.studentId || student.id || student.docId
      );

      const parentId = student.parent_id || student.parentId || "";
      const parentEmail = student.parent_email || student.parentEmail || "";

      const studentNotification = addDoc(collection(db, "notifications"), {
        student_id: realStudentId,
        studentId: realStudentId,
        userId: student.docId,

        title: "New Exam Added",
        message: `A new exam "${title}" has been added in ${subject?.name || "your subject"}.`,
        type: "exam",
        targetRole: "student",

        subjectName: subject?.name || "",
        subjectId,
        grade: gradeNumber,

        teacherId: teacher?.id || "",
        teacherEmail: teacher?.email || "",

        read: false,
        is_read: false,
        createdAt: serverTimestamp(),
      });

      const parentNotification = addDoc(collection(db, "notifications"), {
        student_id: realStudentId,
        studentId: realStudentId,
        userId: parentId,
        parent_id: parentId,
        parent_email: parentEmail,

        title: "New Exam Added",
        message: `A new exam "${title}" has been added for your child in ${
          subject?.name || "the subject"
        }.`,
        type: "exam",
        targetRole: "parent",

        subjectName: subject?.name || "",
        subjectId,
        grade: gradeNumber,

        teacherId: teacher?.id || "",
        teacherEmail: teacher?.email || "",

        read: false,
        is_read: false,
        createdAt: serverTimestamp(),
      });

      return parentId || parentEmail
        ? [studentNotification, parentNotification]
        : [studentNotification];
    });

    await Promise.all(notificationsPromises);
  };

  const saveExam = async () => {
    console.log("SAVE EXAM CLICKED", { title, duration, subject, grade, teacher });

    if (!title.trim()) {
      alert("Enter exam title.");
      return;
    }

    if (!duration) {
      alert("Enter exam duration.");
      return;
    }

    if (!subject?.name) {
      alert("Subject is missing. Go back and open exams from teacher subjects again.");
      console.log("MISSING SUBJECT:", subject);
      return;
    }

    if (!grade) {
      alert("Grade is missing. Go back and open exams from teacher subjects again.");
      console.log("MISSING GRADE:", grade);
      return;
    }

    const hasEmpty = questions.some(
      (q) => !q.question.trim() || q.options.some((opt) => !opt.trim())
    );

    if (hasEmpty) {
      alert("Complete all questions and options.");
      return;
    }

    const gradeNumber = String(grade).replace("Grade ", "").trim();

    const subjectId =
      subject?.subjectId ||
      `grade${gradeNumber}_${String(subject?.name || "").toLowerCase().replace(/\s+/g, "_")}`;

    try {
      console.log("START SAVING EXAM...");

      const examRef = await addDoc(collection(db, "teacher_exams"), {
        title: title.trim(),
        duration: Number(duration),
        subjectName: subject.name,
        subjectId,
        grade: gradeNumber,
        teacherId: teacher?.id || "",
        teacherEmail: teacher?.email || "",
        questions,
        createdAt: serverTimestamp(),
      });

      console.log("EXAM SAVED SUCCESSFULLY:", examRef.id);

      await sendExamNotificationsToStudentsAndParents(gradeNumber, subjectId);

      alert("Exam saved successfully and notifications sent.");

      setTitle("");
      setDuration("");
      setQuestions([{ question: "", options: ["", "", "", ""], correct: 0 }]);
    } catch (error) {
      console.error("ERROR SAVING EXAM:", error);
      alert(error.message || "Error saving exam.");
    }
  };

  return (
    <div className="teacher-exams-page">
      <button className="exam-back-btn" onClick={() => navigate("/teacher-subjects")}>
        ← Back
      </button>

      <div className="exam-header">
        <p>Create and manage exams</p>
        <h1>Create Exam</h1>
        <div className="exam-meta">
          <span>Subject: {subject?.name || "No Subject"}</span>
          <span>Grade: {grade || "No Grade"}</span>
        </div>
      </div>

      <div className="exam-form-card">
        <h2>Exam Information</h2>

        <input
          className="exam-input"
          placeholder="Exam title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="exam-input"
          type="number"
          placeholder="Duration in minutes"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-card">
          <div className="question-head">
            <h2 className="question-title">Question {qIndex + 1}</h2>

            {questions.length > 1 && (
              <button className="exam-delete-btn" onClick={() => deleteQuestion(qIndex)}>
                Delete
              </button>
            )}
          </div>

          <input
            className="exam-input"
            placeholder="Write question"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, e.target.value)}
          />

          {q.options.map((option, optionIndex) => (
            <div key={optionIndex} className="option-row">
              <input
                className="exam-input option-input"
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) => updateOption(qIndex, optionIndex, e.target.value)}
              />

              <label className="correct-label">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correct === optionIndex}
                  onChange={() => setCorrectAnswer(qIndex, optionIndex)}
                />
                Correct
              </label>
            </div>
          ))}
        </div>
      ))}

      <div className="exam-actions">
        <button className="exam-add-btn" onClick={addQuestion}>
          + Add Question
        </button>

        <button className="exam-save-btn" onClick={saveExam}>
          Save Exam
        </button>
      </div>
    </div>
  );
}

export default TeacherExams;