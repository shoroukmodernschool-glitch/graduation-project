import { useState } from "react";

export default function AIAttendance({ open, onClose }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [studentId, setStudentId] = useState("");
  const [sentStudentId, setSentStudentId] = useState("");
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSend = () => {
    if (!question.trim()) return;
    setAnswer("");
    setStudentId("");
    setSentStudentId("");
    setShowChatPopup(true);
  };

  const handleStudentIdSend = async () => {
    if (!studentId.trim() || !question.trim()) return;

    const id = studentId.trim();
    setSentStudentId(id);
    setStudentId("");
    setLoading(true);
    setAnswer("Checking...");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: id, message: question }),
      });

      const data = await res.json();
      setAnswer(data.reply || "No answer returned.");
    } catch (error) {
      console.error(error);
      setAnswer("Backend or AI server is not running.");
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Has my attendance been recorded ?",
    "How many times was my attendance recorded",
  ];

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
              <img src="./images/robot.png" alt="AI" style={{ width: 150, height: 150 }} />
              <img
                src="./images/massege.png"
                alt="chat"
                style={{ width: 30, position: "absolute", top: -8, right: 17 }}
              />
            </div>

            <h2 style={{ color: "#061b9b" }}>Welcome to Shorouq Smart System</h2>
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
              {quickQuestions.map((q) => (
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
                style={{ flex: 1, border: "none", outline: "none", padding: 10 }}
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
              height: 650,
              background: "#f4f6ff",
              borderRadius: 18,
              padding: 25,
              position: "relative",
              overflow: "hidden",
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: 0, color: "#061b9b" }}>Ai Attendance</h3>
                <small style={{ color: "green", marginTop: -5 }}>● online</small>
              </div>
            </div>

            <hr />

            <div
              style={{
                height: 490,
                overflowY: "auto",
                padding: "10px 5px 90px",
              }}
            >
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
                      borderRadius: 12,
                      maxWidth: 320,
                      fontSize: 13,
                      lineHeight: "1.6",
                    }}
                  >
                    {question}
                  </div>
                  <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>{getTime()}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 25 }}>
                <div>
                  <div
                    style={{
                      background: "white",
                      color: "#333",
                      padding: "12px 16px",
                      borderRadius: 12,
                      maxWidth: 390,
                      fontSize: 13,
                      lineHeight: "1.7",
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
                        borderRadius: 12,
                        maxWidth: 300,
                        fontSize: 13,
                      }}
                    >
                      {sentStudentId}
                    </div>
                    <div style={{ fontSize: 11, color: "#777", marginTop: 4 }}>{getTime()}</div>
                  </div>
                </div>
              )}

              {answer && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 25 }}>
                  <div>
                    <div
                      style={{
                        background: "white",
                        color: "#222",
                        padding: "14px 18px",
                        borderRadius: 14,
                        maxWidth: 520,
                        fontSize: 14,
                        lineHeight: "1.9",
                        textAlign: "left",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {loading ? "Checking..." : answer}
                    </div>
                    <div style={{ fontSize: 11, color: "#777", marginTop: 4, textAlign: "right" }}>
                      {getTime()}
                    </div>
                  </div>
                </div>
              )}
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
                onChange={(e) => setStudentId(e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleStudentIdSend();
                }}
                placeholder="Type your student ID..."
                inputMode="numeric"
                style={{ flex: 1, border: "none", outline: "none", padding: 10 }}
              />

              <button
                onClick={handleStudentIdSend}
                disabled={loading}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "none",
                  background: "#061b9b",
                  color: "white",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
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