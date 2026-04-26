import { useState } from "react";
import axios from "axios";
import "./chatbot.css";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [waitingForAttendanceId, setWaitingForAttendanceId] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "أهلاً بيكي، أنا شات بوت المدرسة. اسأليني عن الغياب أو الدرجات أو الجدول.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const checkAttendanceFromExcel = async (studentId) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/check-attendance-excel",
        {
          student_id: studentId,
        }
      );

      return response.data.reply || "مفيش رد دلوقتي.";
    } catch (error) {
      return "حصل خطأ في الاتصال بالسيرفر.";
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: currentMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      if (waitingForAttendanceId) {
        const reply = await checkAttendanceFromExcel(currentMessage);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: reply,
          },
        ]);

        setWaitingForAttendanceId(false);
        return;
      }

      if (
        currentMessage.includes("غيابي") ||
        currentMessage.includes("حضوري") ||
        currentMessage.includes("الحضور") ||
        currentMessage.includes("اتسجل")
      ) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "ممكن تبعت الـ ID الخاص بيك؟",
          },
        ]);

        setWaitingForAttendanceId(true);
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/chatbot/message",
        {
          message: currentMessage,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply || "مفيش رد دلوقتي.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "حصل خطأ في الاتصال بالسيرفر.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <h2 className="chatbot-title">School Chatbot</h2>

        <div className="chatbot-box">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbot-message ${
                msg.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && <div className="chatbot-loading">جاري الرد...</div>}
        </div>

        <div className="chatbot-input-row">
          <input
            type="text"
            placeholder="اكتب رسالتك هنا..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="chatbot-input"
          />
          <button onClick={sendMessage} className="chatbot-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}