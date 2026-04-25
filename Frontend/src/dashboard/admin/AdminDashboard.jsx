import { useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [page, setPage] = useState("overview");
  const [showNoti, setShowNoti] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [dot, setDot] = useState(true);

  const tabs = [
    "overview",
    "students",
    "teachers",
    "parents",
    "attendance",
    "payments",
    "reports",
    "messages",
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const closeAll = () => {
    setModal(null);
    setShowNoti(false);
    setShowProfile(false);
  };

  const openModal = (type, data = {}) => setModal({ type, data });

  const confirm = (msg) => {
    closeAll();
    showToast(msg);
  };

  const renderModal = () => {
    if (!modal) return null;

    const { type, data: d } = modal;

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
        <select>
          <option>All parents</option>
          <option>All teachers</option>
          <option>Everyone (parents + teachers)</option>
          <option>Grade 5 parents only</option>
          <option>Grade 6 parents only</option>
        </select>
        <input placeholder="Subject" />
        <textarea placeholder="Write your message..." />
        {footer("Broadcast sent successfully ✓", "Send broadcast")}
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

    if (type === "record-payment") return (
      <div className="modal">
        <div className="mtitle">Record payment — {d.name || "Student"}</div>
        <input placeholder="Amount (EGP)" />
        <select><option>Cash</option><option>Bank transfer</option><option>Card</option></select>
        <input type="date" />
        <input placeholder="Reference / receipt number" />
        {footer("Payment recorded ✓", "Record payment")}
      </div>
    );

    if (type === "payment-receipt") return (
      <div className="modal">
        <div className="mtitle">Payment receipt — {d.name || "Student"}</div>
        <div className="pay-r"><span>Student</span><span>{d.name || "—"}</span></div>
        <div className="pay-r"><span>Amount</span><span>EGP 4,500</span></div>
        <div className="pay-r"><span>Date paid</span><span>April 1, 2026</span></div>
        <div className="pay-r"><span>Method</span><span>Bank transfer</span></div>
        <div className="pay-r"><span>Status</span><span className="pok">Paid</span></div>
        <div className="mfooter">
          <button className="mbtn" onClick={closeAll}>Close</button>
          <button className="mbtn p" onClick={() => confirm("Receipt downloaded (PDF) ✓")}>Download PDF</button>
        </div>
      </div>
    );

    if (type === "send-reminders") return (
      <div className="modal">
        <div className="mtitle">Send payment reminders</div>
        <select>
          <option>All overdue (7 parents)</option>
          <option>Overdue + partial (23 parents)</option>
          <option>Grade 5 overdue only</option>
          <option>Grade 6 overdue only</option>
        </select>
        <textarea placeholder="Custom message (optional — leave blank for default reminder)..." />
        {footer("Reminders sent to 23 parents ✓", "Send reminders")}
      </div>
    );

    if (type === "export-payments") return (
      <div className="modal">
        <div className="mtitle">Export financial report</div>
        <select><option>This month</option><option>Last month</option><option>This semester</option><option>Full year</option></select>
        <select><option>PDF</option><option>Excel</option><option>CSV</option></select>
        {footer("Financial report downloaded ✓", "Download")}
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
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>From: {d.from || "—"}</p>
        <textarea placeholder="Write your reply..." />
        <div className="mfooter">
          <button className="mbtn" onClick={closeAll}>Close</button>
          <button className="mbtn p" onClick={() => confirm("Reply sent ✓")}>Send reply</button>
        </div>
      </div>
    );

    return null;
  };

  return (
    <div className="admin-dashboard-page">
      <div className="wrap container">

        <div className="topbar">
          <div className="logo">School<span>Admin</span></div>
          <div className="tr">
            <div className="ibtn" title="Notifications" onClick={(e) => { e.stopPropagation(); setShowProfile(false); setShowNoti(!showNoti); setDot(false); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {dot && <div className="ndot" />}
            </div>
            <div className="ava" title="Admin profile" onClick={(e) => { e.stopPropagation(); setShowNoti(false); setShowProfile(!showProfile); }}>AD</div>
          </div>
        </div>

        {showNoti && (
          <div className="panel np show">
            <div className="pt">Notifications</div>
            <div className="ni">Sara Ahmed absent without excuse — Class 5B<span>10 min ago</span></div>
            <div className="ni">Payment overdue: 3 students<span>1 hour ago</span></div>
            <div className="ni">New parent message from Mr. Karim<span>2 hours ago</span></div>
            <div className="ni">Monthly report ready to export<span>Today 8:00 AM</span></div>
          </div>
        )}

        {showProfile && (
          <div className="panel pp show">
            <div className="pi pi-n">Admin User</div>
            <div className="pi" onClick={() => { closeAll(); showToast("Profile settings — coming soon"); }}>My profile</div>
            <div className="pi" onClick={() => { closeAll(); showToast("System settings — coming soon"); }}>System settings</div>
            <div className="pi pi-d" onClick={() => { closeAll(); showToast("Signed out successfully"); }}>Sign out</div>
          </div>
        )}

        <div className="tabs">
          {tabs.map((t) => (
            <button key={t} className={`tab ${page === t ? "active" : ""}`} onClick={() => setPage(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {page === "overview" && (
          <div className="page active">
            <div className="metrics">
              <div className="mc"><div className="mc-l">Total students</div><div className="mc-v">842</div><div className="mc-s up">+14 this semester</div></div>
              <div className="mc"><div className="mc-l">Teaching staff</div><div className="mc-v">56</div><div className="mc-s muted">Across all grades</div></div>
              <div className="mc"><div className="mc-l">Today's attendance</div><div className="mc-v">91%</div><div className="mc-s dn">↓ 3% vs yesterday</div></div>
              <div className="mc"><div className="mc-l">Pending payments</div><div className="mc-v">EGP 48k</div><div className="mc-s dn">23 overdue</div></div>
            </div>

            <div className="grid2">
              <div className="card">
                <div className="card-title">Performance by grade</div>
                {[
                  ["Grade 1", "91%", "#1D9E75"], ["Grade 2", "87%", "#1D9E75"],
                  ["Grade 3", "78%", "#378ADD"], ["Grade 4", "83%", "#378ADD"],
                  ["Grade 5", "69%", "#EF9F27"], ["Grade 6", "74%", "#EF9F27"],
                ].map(([g, p, c]) => (
                  <div className="bar-r" key={g}>
                    <div className="bar-l">{g}</div>
                    <div className="bar-t"><div className="bar-f" style={{ width: p, background: c }} /></div>
                    <div className="bar-p">{p}</div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-title">Recent activity</div>
                {[
                  ["#E24B4A", "3 students marked absent — Grade 5B", "20 min ago"],
                  ["#1D9E75", "Monthly report generated", "1 hour ago"],
                  ["#378ADD", "New teacher account created", "2 hours ago"],
                  ["#EF9F27", "Payment reminder sent to 23 parents", "Today 9:00 AM"],
                  ["#7F77DD", "New parent message received", "Today 8:30 AM"],
                ].map(([c, t, m]) => (
                  <div className="act-r" key={t}>
                    <div className="adot" style={{ background: c }} />
                    <div><div className="at">{t}</div><div className="atm">{m}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid3">
              <div className="inner2">
                <div className="card">
                  <div className="card-title">Attendance this week</div>
                  {["Monday 94%", "Tuesday 93%", "Wednesday 89%", "Thursday 91%", "Today 91%"].map((x) => {
                    const [d, v] = x.split(" ");
                    return <div className="stat-row" key={x}><div className="stat-l">{d}</div><div className="stat-v" style={d === "Today" ? { color: "#378ADD" } : {}}>{v}</div></div>;
                  })}
                </div>
                <div className="card">
                  <div className="card-title">Payment summary</div>
                  <div className="stat-row"><div className="stat-l">Collected</div><div className="stat-v" style={{ color: "#27500A" }}>EGP 312k</div></div>
                  <div className="stat-row"><div className="stat-l">Pending</div><div className="stat-v" style={{ color: "#633806" }}>EGP 48k</div></div>
                  <div className="stat-row"><div className="stat-l">Overdue</div><div className="stat-v" style={{ color: "#791F1F" }}>EGP 12k</div></div>
                  <div className="stat-row"><div className="stat-l">Students paid</div><div className="stat-v">819 / 842</div></div>
                  <div className="stat-row"><div className="stat-l">Collection rate</div><div className="stat-v">97%</div></div>
                </div>
              </div>

              <div className="card">
                <div className="card-title">Quick actions</div>
                <button className="qb" onClick={() => openModal("add-student")}>Add new student</button>
                <button className="qb" onClick={() => openModal("add-teacher")}>Add new teacher</button>
                <button className="qb" onClick={() => openModal("broadcast")}>Broadcast message</button>
                <button className="qb" onClick={() => openModal("export-report")}>Export monthly report</button>
                <button className="qb" onClick={() => openModal("send-reminders")}>Send payment reminders</button>
              </div>
            </div>
          </div>
        )}

        {page === "students" && (
          <div className="page active">
            <div className="page-header">
              <div className="page-title">All students <span className="page-sub">(842 total)</span></div>
              <div style={{ display: "flex", gap: 8 }}>
                <select className="ctrl-select">
                  <option>All grades</option><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option><option>Grade 6</option>
                </select>
                <button className="qb inline-btn" onClick={() => openModal("add-student")}>Add student</button>
              </div>
            </div>

            <div className="card card-table">
              <table className="tbl">
                <thead><tr><th>Name</th><th>Grade</th><th>Attendance</th><th>Avg score</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[
                    ["Ahmed Karim", "Grade 5", "96%", "88%", "bg", "Active"],
                    ["Sara Hassan", "Grade 3", "78%", "71%", "ba", "Warning"],
                    ["Youssef Nour", "Grade 1", "99%", "94%", "bg", "Active"],
                    ["Lina Fawzi", "Grade 6", "61%", "55%", "br", "At risk"],
                    ["Omar Tarek", "Grade 4", "91%", "82%", "bg", "Active"],
                  ].map(([name, grade, att, avg, badge, status]) => (
                    <tr key={name} onClick={() => openModal("student-detail", { name, grade, att, avg })}>
                      <td>{name}</td><td>{grade}</td><td>{att}</td><td>{avg}</td><td><span className={`badge ${badge}`}>{status}</span></td>
                      <td className="actions-cell">
                        <button className="mbtn sm" onClick={(e) => { e.stopPropagation(); openModal("edit-student", { name }); }}>Edit</button>
                        <button className="mbtn sm danger" onClick={(e) => { e.stopPropagation(); openModal("confirm-delete", { type: "student", name }); }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === "teachers" && (
          <div className="page active">
            <div className="page-header">
              <div className="page-title">Teaching staff <span className="page-sub">(56 total)</span></div>
              <button className="qb inline-btn" onClick={() => openModal("add-teacher")}>Add teacher</button>
            </div>

            <div className="card card-table">
              <table className="tbl">
                <thead><tr><th>Name</th><th>Subject</th><th>Classes</th><th>Avg rating</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[
                    ["Mr. Hassan Ali", "Arabic", "5A, 5B, 6A", "4.8", "bg", "Active"],
                    ["Ms. Layla Omar", "Math", "3A, 3B, 4A", "4.5", "bg", "Active"],
                    ["Mr. Sami Fares", "Science", "2A, 2B", "4.1", "ba", "On leave"],
                    ["Ms. Nour Saad", "English", "4A, 5A, 6B", "4.7", "bg", "Active"],
                  ].map(([name, subj, classes, rating, badge, status]) => (
                    <tr key={name} onClick={() => openModal("teacher-detail", { name, subj, classes, rating })}>
                      <td>{name}</td><td>{subj}</td><td>{classes}</td><td>{rating} / 5</td><td><span className={`badge ${badge}`}>{status}</span></td>
                      <td className="actions-cell">
                        <button className="mbtn sm" onClick={(e) => { e.stopPropagation(); openModal("edit-teacher", { name }); }}>Edit</button>
                        <button className="mbtn sm danger" onClick={(e) => { e.stopPropagation(); openModal("confirm-delete", { type: "teacher", name }); }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === "parents" && (
          <div className="page active">
            <div className="page-header">
              <div className="page-title">Parents / Guardians <span className="page-sub">(631 registered)</span></div>
              <button className="qb inline-btn" onClick={() => openModal("broadcast")}>Broadcast to all</button>
            </div>

            <div className="card card-table">
              <table className="tbl">
                <thead><tr><th>Parent name</th><th>Child(ren)</th><th>Contact</th><th>Payment status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[
                    ["Mr. Karim Ahmed", "Ahmed Karim (5A)", "01001234567", "bg", "Paid"],
                    ["Mrs. Hana Hassan", "Sara Hassan (3B)", "01112345678", "ba", "Partial"],
                    ["Mr. Tarek Nour", "Youssef (1A), Lina (3A)", "01223456789", "br", "Overdue"],
                    ["Mrs. Rania Fawzi", "Lina Fawzi (6B)", "01334567890", "bg", "Paid"],
                  ].map(([name, child, contact, badge, status]) => (
                    <tr key={name}>
                      <td>{name}</td><td>{child}</td><td>{contact}</td><td><span className={`badge ${badge}`}>{status}</span></td>
                      <td className="actions-cell">
                        <button className="mbtn sm" onClick={() => openModal("message-parent", { name })}>Message</button>
                        <button className="mbtn sm" onClick={() => openModal("parent-detail", { name })}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === "attendance" && (
          <div className="page active">
            <div className="page-header">
              <div className="page-title">Attendance — Today</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="date" className="ctrl-select" />
                <button className="qb inline-btn" onClick={() => openModal("export-attendance")}>Export</button>
              </div>
            </div>

            <div className="metrics" style={{ marginBottom: 12 }}>
              <div className="mc"><div className="mc-l">Present</div><div className="mc-v" style={{ color: "#27500A" }}>766</div><div className="mc-s muted">91% of total</div></div>
              <div className="mc"><div className="mc-l">Absent</div><div className="mc-v" style={{ color: "#791F1F" }}>58</div><div className="mc-s muted">6.9% of total</div></div>
              <div className="mc"><div className="mc-l">Late</div><div className="mc-v" style={{ color: "#633806" }}>18</div><div className="mc-s muted">2.1% of total</div></div>
              <div className="mc"><div className="mc-l">Excused</div><div className="mc-v">12</div><div className="mc-s muted">of 58 absent</div></div>
            </div>

            <div className="card card-table">
              <table className="tbl">
                <thead><tr><th>Class</th><th>Teacher</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th><th>Actions</th></tr></thead>
                <tbody>
                  {[
                    ["Grade 1A", "Ms. Nour", "28", "2", "0", "93%", "bg"],
                    ["Grade 3B", "Mr. Hassan", "24", "5", "2", "80%", "ba"],
                    ["Grade 5A", "Ms. Layla", "22", "6", "3", "73%", "br"],
                    ["Grade 6B", "Mr. Sami", "29", "1", "1", "94%", "bg"],
                  ].map(([cls, teacher, present, absent, late, rate, badge]) => (
                    <tr key={cls}>
                      <td>{cls}</td><td>{teacher}</td><td>{present}</td><td>{absent}</td><td>{late}</td><td><span className={`badge ${badge}`}>{rate}</span></td>
                      <td><button className="mbtn sm" onClick={() => openModal("attendance-detail", { cls })}>Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === "payments" && (
          <div className="page active">
            <div className="page-header">
              <div className="page-title">Payments & fees</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="qb inline-btn" onClick={() => openModal("send-reminders")}>Send reminders</button>
                <button className="qb inline-btn" onClick={() => openModal("export-payments")}>Export</button>
              </div>
            </div>

            <div className="metrics" style={{ marginBottom: 12 }}>
              <div className="mc"><div className="mc-l">Total collected</div><div className="mc-v" style={{ color: "#27500A" }}>EGP 312k</div><div className="mc-s muted">This semester</div></div>
              <div className="mc"><div className="mc-l">Pending</div><div className="mc-v" style={{ color: "#633806" }}>EGP 48k</div><div className="mc-s muted">23 students</div></div>
              <div className="mc"><div className="mc-l">Overdue</div><div className="mc-v" style={{ color: "#791F1F" }}>EGP 12k</div><div className="mc-s dn">7 students</div></div>
              <div className="mc"><div className="mc-l">Collection rate</div><div className="mc-v">97%</div><div className="mc-s up">+2% vs last month</div></div>
            </div>

            <div className="card card-table">
              <table className="tbl">
                <thead><tr><th>Student</th><th>Grade</th><th>Fee type</th><th>Amount</th><th>Due date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[
                    ["Ahmed Karim", "5A", "Tuition", "EGP 4,500", "Apr 1", "bg", "Paid", "payment-receipt", "Receipt"],
                    ["Sara Hassan", "3B", "Tuition", "EGP 4,500", "Apr 1", "ba", "Partial", "record-payment", "Record"],
                    ["Lina Fawzi", "6B", "Tuition + Bus", "EGP 5,200", "Mar 15", "br", "Overdue", "record-payment", "Record"],
                    ["Omar Tarek", "4A", "Activities", "EGP 800", "Apr 10", "bg", "Paid", "payment-receipt", "Receipt"],
                  ].map(([name, grade, feeType, amount, due, badge, status, modalType, btn]) => (
                    <tr key={name}>
                      <td>{name}</td><td>{grade}</td><td>{feeType}</td><td>{amount}</td><td>{due}</td><td><span className={`badge ${badge}`}>{status}</span></td>
                      <td><button className="mbtn sm" onClick={() => openModal(modalType, { name })}>{btn}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === "reports" && (
          <div className="page active">
            <div className="page-title" style={{ marginBottom: 12 }}>Reports & analytics</div>
            <div className="grid2">
              <div className="card">
                <div className="card-title">Academic performance breakdown</div>
                {[
                  ["Excellent", "32%", "#1D9E75"],
                  ["Good", "41%", "#378ADD"],
                  ["Average", "18%", "#EF9F27"],
                  ["At risk", "9%", "#E24B4A"],
                ].map(([label, percent, color]) => (
                  <div className="bar-r" key={label}>
                    <div className="bar-l">{label}</div>
                    <div className="bar-t"><div className="bar-f" style={{ width: percent, background: color }} /></div>
                    <div className="bar-p">{percent}</div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-title">Export available reports</div>
                <button className="qb" onClick={() => openModal("export-report")}>Monthly academic report</button>
                <button className="qb" onClick={() => openModal("export-attendance")}>Attendance summary</button>
                <button className="qb" onClick={() => openModal("export-payments")}>Financial report</button>
                <button className="qb" onClick={() => openModal("export-report")}>Teacher performance report</button>
              </div>
            </div>
          </div>
        )}

        {page === "messages" && (
          <div className="page active">
            <div className="page-header">
              <div className="page-title">Messages & notifications</div>
              <button className="qb inline-btn" onClick={() => openModal("broadcast")}>New broadcast</button>
            </div>

            <div className="card card-table">
              <table className="tbl">
                <thead><tr><th>From</th><th>Subject</th><th>To</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[
                    ["Mr. Karim Ahmed", "Question about Sara's grades", "Admin", "Today 10:30", "bb", "Unread", "Reply"],
                    ["Admin", "Payment reminder — April fees", "All parents", "Today 9:00", "bg", "Sent", "View"],
                    ["Ms. Layla Omar", "Grade 3B performance update", "Admin", "Yesterday", "bg", "Read", "Reply"],
                    ["Admin", "Schedule change — Thursday", "All teachers", "Apr 20", "bg", "Sent", "View"],
                  ].map(([from, subj, to, date, badge, status, action]) => (
                    <tr key={`${from}-${subj}`}>
                      <td>{from}</td><td>{subj}</td><td>{to}</td><td>{date}</td><td><span className={`badge ${badge}`}>{status}</span></td>
                      <td><button className="mbtn sm" onClick={() => openModal("view-message", { from, subj })}>{action}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {modal && (
          <div className="overlay show" onClick={closeAll}>
            <div className="mwrap" onClick={(e) => e.stopPropagation()}>
              {renderModal()}
            </div>
          </div>
        )}

        {toast && <div className="toast" style={{ display: "block" }}>{toast}</div>}
      </div>
    </div>
  );
}