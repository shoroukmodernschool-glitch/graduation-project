import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";

export default function Messages({ openModal }) {
  const [messagesList, setMessagesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesQ = query(
          collection(db, "notifications"),
          orderBy("createdAt", "desc")
        );

        const messagesSnap = await getDocs(messagesQ);

        const data = messagesSnap.docs.map((docItem) => {
          const msg = docItem.data();

          let dateText = "—";

          if (msg.createdAt?.toDate) {
            dateText = msg.createdAt.toDate().toLocaleString();
          } else if (msg.date) {
            dateText = msg.date;
          } else if (msg.time) {
            dateText = msg.time;
          }

          return {
            id: docItem.id,
            from: msg.from || msg.senderName || msg.sender || "System",
            subject: msg.title || msg.subject || "Notification",
            to: msg.to || msg.receiverRole || msg.role || "Admin",
            date: dateText,
            status: msg.status || (msg.read ? "Read" : "Unread"),
          };
        });

        setMessagesList(data);
      } catch (error) {
        console.error("Fetch messages error:", error);

        try {
          const messagesSnap = await getDocs(collection(db, "notifications"));

          const data = messagesSnap.docs.map((docItem) => {
            const msg = docItem.data();

            return {
              id: docItem.id,
              from: msg.from || msg.senderName || msg.sender || "System",
              subject: msg.title || msg.subject || "Notification",
              to: msg.to || msg.receiverRole || msg.role || "Admin",
              date: msg.date || msg.time || "—",
              status: msg.status || (msg.read ? "Read" : "Unread"),
            };
          });

          setMessagesList(data);
        } catch (fallbackError) {
          console.error("Fetch messages fallback error:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "notifications", id));

      setMessagesList((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Delete message error:", error);
      alert("Error deleting message");
    }
  };

  const getBadgeClass = (status) => {
    const s = String(status || "").toLowerCase();

    if (s.includes("unread") || s.includes("new")) return "bb";
    if (s.includes("sent") || s.includes("read")) return "bg";
    return "ba";
  };

  const getActionLabel = (status) => {
    const s = String(status || "").toLowerCase();

    if (s.includes("unread") || s.includes("new")) return "Reply";
    return "View";
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Messages & notifications</div>

        <button
          className="qb inline-btn"
          onClick={() => openModal("broadcast")}
        >
          New broadcast
        </button>
      </div>

      <div className="card card-table">
        <table className="tbl">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>To</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading messages...</td>
              </tr>
            ) : messagesList.length === 0 ? (
              <tr>
                <td colSpan="6">No messages found</td>
              </tr>
            ) : (
              messagesList.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.from}</td>
                  <td>{msg.subject}</td>
                  <td>{msg.to}</td>
                  <td>{msg.date}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(msg.status)}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="mbtn sm"
                      onClick={() =>
                        openModal("view-message", {
                          from: msg.from,
                          subj: msg.subject,
                        })
                      }
                    >
                      {getActionLabel(msg.status)}
                    </button>

                    <button
                      className="mbtn sm"
                      onClick={() => handleDelete(msg.id)}
                      style={{
                        marginLeft: "6px",
                        color: "#fff",
                        background: "#ef4444",
                        border: "none",
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}