import { useState } from "react";

export default function AIAttendance({ open, onClose }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [studentId, setStudentId] = useState("");
  const [sentStudentId, setSentStudentId] = useState("");
  const [showChatPopup, setShowChatPopup] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    if (!question.trim()) return;
    setAnswer("      ");
    setShowChatPopup(true);
  };

  const handleStudentIdSend = () => {
    if (!studentId.trim()) return;
    setSentStudentId(studentId);
    setStudentId("");
  };

  const getTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "900px",
            maxWidth: "95%",
            background: "#f4f6ff",
            border: "3px solid #1e9bff",
            borderRadius: 8,
            padding: "25px 45px",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: 15,
              top: 10,
              border: "none",
              background: "transparent",
              fontSize: 26,
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src="./images/robot.png"
                alt="AI"
                style={{ width: 150, height: 150 }}
              />

              <img
                src="./images/massege.png"
                alt="chat"
                style={{
                  width: 30,
                  position: "absolute",
                  top: -8,
                  right: 17,
                }}
              />
            </div>

            <h2 style={{ color: "#061b9b" }}>
              Welcome to Shorouq Smart System
            </h2>

            <h3 style={{ color: "#061b9b" }}>How can I assist you today?</h3>

            <p>Choose from the options below</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                maxWidth: 560,
                margin: "20px auto",
              }}
            >
              {[
                "Was an absence recorded?",
                "How many absences do I have?",
                "What is my latest absence?",
                "Do I have repeated absences?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuestion(q);
                    setAnswer("");
                  }}
                  style={{
                    border: "none",
                    background: "white",
                    padding: "12px",
                    borderRadius: 10,
                    color: "#061b9b",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {answer && (
              <div
                style={{
                  background: "white",
                  maxWidth: 560,
                  margin: "15px auto",
                  padding: 12,
                  borderRadius: 10,
                  color: "#061b9b",
                }}
              >
                {answer}
              </div>
            )}

            <div
              style={{
                display: "flex",
                maxWidth: 650,
                margin: "40px auto 10px",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: 14,
                padding: 8,
              }}
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: 10,
                }}
              />

              <button
                onClick={handleSend}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "none",
                  background: "#061b9b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>

      {showChatPopup && (
        <div
          onClick={() => setShowChatPopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 820,
              maxWidth: "95%",
              height: 560,
              background: "#f4f6ff",
              borderRadius: 18,
              padding: 25,
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowChatPopup(false)}
              style={{
                position: "absolute",
                right: 18,
                top: 12,
                border: "none",
                background: "transparent",
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="./images/head.png" alt="AI" style={{ width: 45 }} />

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h3 style={{ margin: 0, marginLeft: 0, color: "#061b9b" }}>
                  Ai Attendance
                </h3>

                <small style={{ color: "green", marginTop: -5 }}>
                  ● online
                </small>
              </div>
            </div>

            <hr />

            <div style={{ textAlign: "center", margin: "15px 0" }}>
              <span
                style={{
                  background: "white",
                  padding: "6px 14px",
                  borderRadius: 20,
                  color: "#061b9b",
                  fontSize: 12,
                }}
              >
                Today
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 30 }}>
              <div>
                <div
                  style={{
                    background: "#061b9b",
                    color: "white",
                    padding: "12px 16px",
                    borderRadius: 8,
                    maxWidth: 300,
                    fontSize: 13,
                  }}
                >
                  {question}
                </div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>
                  {getTime()}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 25 }}>
              <div>
                <div
                  style={{
                    background: "white",
                    color: "#333",
                    padding: "12px 16px",
                    borderRadius: 8,
                    maxWidth: 360,
                    fontSize: 13,
                  }}
                >
                  Hello! Please enter your student ID to check your attendance.
                </div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 4, textAlign: "right" }}>
                  {getTime()}
                </div>
              </div>
            </div>

            {sentStudentId && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 25 }}>
                <div>
                  <div
                    style={{
                      background: "#061b9b",
                      color: "white",
                      padding: "12px 16px",
                      borderRadius: 8,
                      maxWidth: 300,
                      fontSize: 13,
                    }}
                  >
                    {sentStudentId}
                  </div>
                  <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>
                    {getTime()}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 25 }}>
              <div>
                <div
                  style={{
                    background: "white",
                    color: "#333",
                    padding: "12px 16px",
                    borderRadius: 8,
                    maxWidth: 360,
                    fontSize: 13,
                  }}
                >
                  {answer || "You have 2 absences so far"}
                </div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 4, textAlign: "right" }}>
                  {getTime()}
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: 70,
                right: 70,
                bottom: 35,
                display: "flex",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: 12,
                padding: 8,
              }}
            >
              <input
                value={studentId}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setStudentId(value);
                }}
                placeholder="Type your student ID..."
                inputMode="numeric"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: 10,
                }}
              />

              <button
                onClick={handleStudentIdSend}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "none",
                  background: "#061b9b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}