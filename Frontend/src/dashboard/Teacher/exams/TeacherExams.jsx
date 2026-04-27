import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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
    {
      question: "",
      options: ["", "", "", ""],
      correct: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct: 0,
      },
    ]);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) return;

    const confirmDelete = window.confirm("Delete this question?");
    if (!confirmDelete) return;

    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
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

  const saveExam = async () => {
    if (!title || !duration || !subject || !grade) {
      alert("Complete exam title, duration, subject and grade.");
      return;
    }

    const hasEmpty = questions.some(
      (q) => !q.question || q.options.some((opt) => !opt)
    );

    if (hasEmpty) {
      alert("Complete all questions and options.");
      return;
    }

    const gradeNumber = String(grade).replace("Grade ", "").trim();

    const subjectId =
      subject?.subjectId ||
      `grade${gradeNumber}_${String(subject?.name || "").toLowerCase()}`;

    try {
      await addDoc(collection(db, "teacher_exams"), {
        title,
        duration: Number(duration),
        subjectName: subject.name,
        subjectId,
        grade: gradeNumber,
        teacherId: teacher?.id || "",
        teacherEmail: teacher?.email || "",
        questions,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, "notifications"), {
        title: "New Exam Added",
        message: `A new exam "${title}" has been added in ${subject.name}.`,
        type: "exam",
        subjectName: subject.name,
        subjectId,
        grade: gradeNumber,
        targetRole: "student",
        teacherId: teacher?.id || "",
        teacherEmail: teacher?.email || "",
        readBy: [],
        createdAt: serverTimestamp(),
      });

      alert("Exam saved successfully and notification sent.");

      setTitle("");
      setDuration("");
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correct: 0,
        },
      ]);
    } catch (error) {
      console.error("Error saving exam:", error);
      alert("Error saving exam.");
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
              <button
                className="exam-delete-btn"
                onClick={() => deleteQuestion(qIndex)}
              >
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