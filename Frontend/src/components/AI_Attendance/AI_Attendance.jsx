import { useState } from "react";

export default function AIAttendance({ open, onClose }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  if (!open) return null;

  return (
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
          <div style={{ fontSize: 70 }}>🤖</div>

          <h2 style={{ color: "#061b9b" }}>
            Welcome to Shorouq Smart System
          </h2>

          <h3 style={{ color: "#061b9b" }}>
            How can I assist you today?
          </h3>

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
                  setAnswer("هنربطها بالداتا بعد كده 👌");
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
              onClick={() =>
                setAnswer("هنا هنخليه يرد من attendance data 🔥")
              }
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
  );
}