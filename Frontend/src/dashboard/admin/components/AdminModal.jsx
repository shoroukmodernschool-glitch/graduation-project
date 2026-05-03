import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";

export default function AdminModal({ modal, closeAll, openModal, confirm }) {
  const [broadcastTarget, setBroadcastTarget] = useState("All parents");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  if (!modal) return null;

  const { type, data: d } = modal;

  const sendBroadcast = async () => {
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) {
      confirm("Please write subject and message");
      return;
    }

    try {
      setSendingBroadcast(true);

      await addDoc(collection(db, "notifications"), {
        from: "Admin",
        sender: "Admin",
        senderName: "Admin",
        title: broadcastSubject,
        subject: broadcastSubject,
        message: broadcastMessage,
        body: broadcastMessage,
        to: broadcastTarget,
        target: broadcastTarget,
        type: "broadcast",
        status: "Unread",
        read: false,
        createdAt: serverTimestamp(),
      });

      setBroadcastTarget("All parents");
      setBroadcastSubject("");
      setBroadcastMessage("");
      setSendingBroadcast(false);

      confirm("Broadcast sent successfully ✓");
    } catch (error) {
      console.error("Send broadcast error:", error);
      setSendingBroadcast(false);
      confirm("Failed to send broadcast");
    }
  };

  const footer = (confirmText, confirmLabel = "Confirm", danger = false) => (
    <div className="mfooter">
      <button className="mbtn" onClick={closeAll}>Cancel</button>
      <button className={`mbtn ${danger ? "danger" : "p"}`} onClick={() => confirm(confirmText)}>
        {confirmLabel}
      </button>
    </div>
  );

  if (type === "add-student") return (
    <div className="modal">
      <div className="mtitle">Add new student</div>
      <input placeholder="Full name" />
      <input placeholder="Date of birth" />
      <select><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option><option>Grade 6</option></select>
      <select><option>Class A</option><option>Class B</option></select>
      <input placeholder="Parent / guardian name" />
      <input placeholder="Parent phone number" />
      {footer("Student added successfully ✓", "Add student")}
    </div>
  );

  if (type === "edit-student") return (
    <div className="modal">
      <div className="mtitle">Edit student — {d.name || ""}</div>
      <input defaultValue={d.name || ""} placeholder="Full name" />
      <select><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option><option>Grade 6</option></select>
      <input placeholder="Parent phone" />
      <select><option>Active</option><option>Warning</option><option>At risk</option><option>Inactive</option></select>
      {footer("Changes saved ✓", "Save changes")}
    </div>
  );

  if (type === "student-detail") return (
    <div className="modal">
      <div className="mtitle">{d.name || "Student"}</div>
      <div className="child-stats">
        <div className="child-stat"><div className="child-stat-l">Grade</div><div className="child-stat-v">{d.grade || "—"}</div></div>
        <div className="child-stat"><div className="child-stat-l">Avg score</div><div className="child-stat-v">{d.avg || "—"}</div></div>
        <div className="child-stat"><div className="child-stat-l">Attendance</div><div className="child-stat-v">{d.att || "—"}</div></div>
        <div className="child-stat"><div className="child-stat-l">Status</div><div className="child-stat-v">Active</div></div>
      </div>
      <div className="mfooter">
        <button className="mbtn" onClick={closeAll}>Close</button>
        <button className="mbtn p" onClick={() => openModal("edit-student", { name: d.name })}>Edit profile</button>
      </div>
    </div>
  );

  if (type === "add-teacher") return (
    <div className="modal">
      <div className="mtitle">Add new teacher</div>
      <input placeholder="Full name" />
      <input placeholder="Email address" />
      <select><option>Arabic</option><option>Math</option><option>Science</option><option>English</option><option>History</option><option>Art</option><option>PE</option></select>
      <input placeholder="Assigned classes (e.g. 3A, 4B)" />
      <input placeholder="Phone number" />
      {footer("Teacher account created ✓", "Add teacher")}
    </div>
  );

  if (type === "edit-teacher") return (
    <div className="modal">
      <div className="mtitle">Edit teacher — {d.name || ""}</div>
      <input defaultValue={d.name || ""} placeholder="Full name" />
      <input placeholder="Email address" />
      <select><option>Active</option><option>On leave</option><option>Inactive</option></select>
      <input placeholder="Assigned classes" />
      {footer("Changes saved ✓", "Save changes")}
    </div>
  );

  if (type === "teacher-detail") return (
    <div className="modal">
      <div className="mtitle">{d.name || "Teacher"}</div>
      <div className="child-stats">
        <div className="child-stat"><div className="child-stat-l">Subject</div><div className="child-stat-v">{d.subj || "—"}</div></div>
        <div className="child-stat"><div className="child-stat-l">Classes</div><div className="child-stat-v" style={{ fontSize: 14 }}>{d.classes || "—"}</div></div>
        <div className="child-stat"><div className="child-stat-l">Avg rating</div><div className="child-stat-v">{d.rating || "—"} / 5</div></div>
        <div className="child-stat"><div className="child-stat-l">Status</div><div className="child-stat-v">Active</div></div>
      </div>
      <div className="mfooter">
        <button className="mbtn" onClick={closeAll}>Close</button>
        <button className="mbtn p" onClick={() => openModal("edit-teacher", { name: d.name })}>Edit profile</button>
      </div>
    </div>
  );

  if (type === "confirm-delete") return (
    <div className="modal">
      <div className="mtitle">Remove {d.type || "record"}</div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.6 }}>
        Are you sure you want to remove <strong style={{ color: "var(--text-primary)" }}>{d.name || "this record"}</strong>?
        This action cannot be undone.
      </p>
      {footer(`${d.name || "Record"} removed`, "Yes, remove", true)}
    </div>
  );

  if (type === "parent-detail") return (
    <div className="modal">
      <div className="mtitle">{d.name || "Parent"} — Profile</div>
      <div className="child-stats">
        <div className="child-stat"><div className="child-stat-l">Registered</div><div className="child-stat-v" style={{ fontSize: 14 }}>Yes</div></div>
        <div className="child-stat"><div className="child-stat-l">Children</div><div className="child-stat-v">1</div></div>
      </div>
      <div className="mfooter">
        <button className="mbtn" onClick={closeAll}>Close</button>
        <button className="mbtn p" onClick={() => openModal("message-parent", { name: d.name })}>Send message</button>
      </div>
    </div>
  );

  if (type === "message-parent") return (
    <div className="modal">
      <div className="mtitle">Message — {d.name || "Parent"}</div>
      <input placeholder="Subject" />
      <textarea placeholder="Write your message..." />
      {footer("Message sent ✓", "Send message")}
    </div>
  );

  if (type === "broadcast") return (
    <div className="modal">
      <div className="mtitle">Broadcast message</div>

      <select
        value={broadcastTarget}
        onChange={(e) => setBroadcastTarget(e.target.value)}
      >
        <option>All parents</option>
        <option>All teachers</option>
        <option>Everyone (parents + teachers)</option>
        <option>Grade 5 parents only</option>
        <option>Grade 6 parents only</option>
      </select>

      <input
        placeholder="Subject"
        value={broadcastSubject}
        onChange={(e) => setBroadcastSubject(e.target.value)}
      />

      <textarea
        placeholder="Write your message..."
        value={broadcastMessage}
        onChange={(e) => setBroadcastMessage(e.target.value)}
      />

      <div className="mfooter">
        <button className="mbtn" onClick={closeAll}>
          Cancel
        </button>

        <button
          className="mbtn p"
          onClick={sendBroadcast}
          disabled={sendingBroadcast}
        >
          {sendingBroadcast ? "Sending..." : "Send broadcast"}
        </button>
      </div>
    </div>
  );

  if (type === "attendance-detail") return (
    <div className="modal">
      <div className="mtitle">Attendance details — {d.cls || "Class"}</div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.6 }}>
        Full student-level attendance list for <strong style={{ color: "var(--text-primary)" }}>{d.cls || "this class"}</strong> today.
        In a connected backend, this would show each student's status.
      </p>
      <div className="mfooter">
        <button className="mbtn" onClick={closeAll}>Close</button>
        <button className="mbtn p" onClick={() => confirm("Attendance exported (CSV) ✓")}>Export CSV</button>
      </div>
    </div>
  );

  if (type === "export-attendance") return (
    <div className="modal">
      <div className="mtitle">Export attendance report</div>
      <select><option>Today</option><option>This week</option><option>This month</option><option>This semester</option></select>
      <select><option>All classes</option><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option><option>Grade 6</option></select>
      <select><option>PDF</option><option>Excel</option><option>CSV</option></select>
      {footer("Attendance report downloaded ✓", "Download")}
    </div>
  );

  if (type === "export-report") return (
    <div className="modal">
      <div className="mtitle">Export report</div>
      <select><option>Monthly academic report</option><option>Semester report</option><option>Teacher performance</option><option>Full year summary</option></select>
      <select><option>All grades</option><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option><option>Grade 6</option></select>
      <select><option>PDF</option><option>Excel</option><option>CSV</option></select>
      {footer("Report downloaded ✓", "Download")}
    </div>
  );

  if (type === "view-message") return (
    <div className="modal">
      <div className="mtitle">{d.subj || "Message"}</div>
      <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>
        From: {d.from || "—"}
      </p>
      <textarea placeholder="Write your reply..." />
      <div className="mfooter">
        <button className="mbtn" onClick={closeAll}>Close</button>
        <button className="mbtn p" onClick={() => confirm("Reply sent ✓")}>Send reply</button>
      </div>
    </div>
  );

  return null;
}