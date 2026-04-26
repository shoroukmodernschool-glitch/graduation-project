import { useEffect, useMemo, useState } from "react";

import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import "./Parent.css";

import { auth, db } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

function ParentDashboard() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [parentName, setParentName] = useState("Parent");

  const notifications = useMemo(
    () => [
      { text: "New message from Mr. Hassan (Arabic)", time: "2 hours ago" },
      { text: "Parent meeting reminder — today 4:00 PM", time: "This morning" },
    ],
    []
  );

  const subjectPerformance = useMemo(
    () => [
      { subject: "Math", value: 88, color: "#1D9E75" },
      { subject: "Arabic", value: 75, color: "#378ADD" },
      { subject: "Science", value: 92, color: "#1D9E75" },
      { subject: "English", value: 61, color: "#EF9F27" },
      { subject: "History", value: 80, color: "#378ADD" },
    ],
    []
  );

  const activities = useMemo(
    () => [
      { color: "#1D9E75", text: "Homework submitted", time: "2 hours ago" },
      { color: "#378ADD", text: "New message from teacher", time: "4 hours ago" },
      { color: "#EF9F27", text: "Parent meeting reminder", time: "Today" },
    ],
    []
  );

  const schedule = useMemo(
    () => [
      { time: "8:00 AM", color: "#1D9E75", title: "School starts", child: "Student" },
      { time: "11:30 AM", color: "#378ADD", title: "English extra class", child: "Student" },
      { time: "4:00 PM", color: "#7F77DD", title: "Parent meeting", child: "Zoom" },
    ],
    []
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChildren([]);
        setLoadingChildren(false);
        return;
      }

      try {
        setLoadingChildren(true);

        const parentQuery = query(
          collection(db, "parents"),
          where("email", "==", user.email)
        );

        const parentSnap = await getDocs(parentQuery);

        if (parentSnap.empty) {
          setChildren([]);
          setLoadingChildren(false);
          return;
        }

        const parentData = parentSnap.docs[0].data();

        setParentName(
          `${parentData.firstName || ""} ${parentData.lastName || ""}`.trim() ||
            parentData.name ||
            "Parent"
        );

        const studentIds = Array.isArray(parentData.student_ids)
          ? parentData.student_ids
          : parentData.student_id
          ? [parentData.student_id]
          : [];

        if (studentIds.length === 0) {
          setChildren([]);
          setLoadingChildren(false);
          return;
        }

        const allStudents = [];

        for (const studentId of studentIds) {
          const studentQuery = query(
            collection(db, "student"),
            where("student_id", "==", studentId)
          );

          const studentSnap = await getDocs(studentQuery);

          studentSnap.forEach((docSnap) => {
            const data = docSnap.data();

            const firstName = data.firstName || "";
            const lastName = data.lastName || "";
            const fullName =
              `${firstName} ${lastName}`.trim() ||
              data.name ||
              data.studentName ||
              "Student";

            allStudents.push({
              id: docSnap.id,
              student_id: data.student_id,
              name: fullName,
              grade: data.grade ? `Grade ${data.grade}` : "No grade",
              status: "Excellent",
              avg: data.avg || 0,
              attendance: data.attendance || 0,
              avatarClass: "ava-g",
              initials: `${firstName?.[0] || fullName?.[0] || "S"}${
                lastName?.[0] || ""
              }`.toUpperCase(),
            });
          });
        }

        setChildren(allStudents);
      } catch (error) {
        console.error("Error loading parent children:", error);
        setChildren([]);
      } finally {
        setLoadingChildren(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(window.parentToastTimer);
    window.parentToastTimer = setTimeout(() => {
      setToast("");
    }, 2600);
  };

  const closeAll = () => {
    setOverlayOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
    setSelectedChild(null);
    setActiveModal(null);
  };

  const openChildModal = (child) => {
    setSelectedChild(child);
    setActiveModal(null);
    setOverlayOpen(true);
    setNotifOpen(false);
    setProfileOpen(false);
  };

  const openActionModal = (type) => {
    setSelectedChild(null);
    setActiveModal(type);
    setOverlayOpen(true);
    setNotifOpen(false);
    setProfileOpen(false);
  };

  const badgeClass = (status) => (status === "Excellent" ? "b-green" : "b-amber");

  const renderModalContent = () => {
    if (selectedChild) {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">{selectedChild.name} — Profile</div>

          <div className="child-modal-head">
            <div className={`ava ${selectedChild.avatarClass} modal-ava`}>
              {selectedChild.initials}
            </div>

            <div>
              <div className="modal-child-name">{selectedChild.name}</div>
              <div className="modal-child-grade">{selectedChild.grade}</div>
            </div>

            <span className={`badge ${badgeClass(selectedChild.status)} modal-badge`}>
              {selectedChild.status}
            </span>
          </div>

          <div className="child-stats">
            <div className="child-stat">
              <div className="child-stat-label">Average score</div>
              <div className="child-stat-val">{selectedChild.avg}%</div>
            </div>
            <div className="child-stat">
              <div className="child-stat-label">Attendance</div>
              <div className="child-stat-val">{selectedChild.attendance}%</div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Close
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                setSelectedChild(null);
                setActiveModal("message");
              }}
            >
              Message teacher
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "message") {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Message a teacher</div>

          <select defaultValue="Mr. Hassan — Arabic">
            <option>Mr. Hassan — Arabic</option>
            <option>Ms. Layla — Math</option>
            <option>Mr. Omar — Science</option>
            <option>Ms. Nour — English</option>
          </select>

          <input type="text" placeholder="Subject" />
          <textarea placeholder="Write your message..." />

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Message sent successfully ✓");
              }}
            >
              Send message
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "report") {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Performance report</div>

          <select defaultValue={children[0]?.name || "Student"}>
            {children.length > 0 ? (
              children.map((child) => (
                <option key={child.id}>{child.name}</option>
              ))
            ) : (
              <option>No student</option>
            )}
          </select>

          <select defaultValue="This semester">
            <option>This semester</option>
            <option>Last semester</option>
            <option>Full year</option>
          </select>

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Report loaded ✓");
              }}
            >
              View report
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "appointment") {
      const today = new Date().toISOString().split("T")[0];

      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Book an appointment</div>

          <select defaultValue="Mr. Hassan — Arabic">
            <option>Mr. Hassan — Arabic</option>
            <option>Ms. Layla — Math</option>
            <option>Mr. Omar — Science</option>
            <option>Ms. Nour — English</option>
          </select>

          <input type="date" min={today} />
          <select defaultValue="9:00 AM">
            <option>9:00 AM</option>
            <option>10:00 AM</option>
            <option>11:00 AM</option>
            <option>2:00 PM</option>
            <option>3:00 PM</option>
            <option>4:00 PM</option>
          </select>

          <input type="text" placeholder="Reason (optional)" />

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Appointment booked ✓");
              }}
            >
              Confirm booking
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "payment") {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Close
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Redirecting to payment gateway...");
              }}
            >
              Pay now
            </button>
          </div>
        </div>
      );
    }

    if (activeModal === "download") {
      return (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">Download reports</div>

          <select defaultValue={children[0]?.name || "Student"}>
            {children.length > 0 ? (
              children.map((child) => (
                <option key={child.id}>{child.name}</option>
              ))
            ) : (
              <option>No student</option>
            )}
          </select>

          <select defaultValue="Mid-year report card">
            <option>Mid-year report card</option>
            <option>Final report card</option>
            <option>Attendance summary</option>
            <option>Behavior report</option>
          </select>

          <div className="modal-footer">
            <button className="mbtn" onClick={closeAll}>
              Cancel
            </button>
            <button
              className="mbtn primary"
              onClick={() => {
                closeAll();
                showToast("Report downloaded (PDF) ✓");
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <DashboardNavbar />

      <div
        className="parent-dashboard-page"
        onClick={() => {
          setNotifOpen(false);
          setProfileOpen(false);
        }}
      >
        <div className="wrap container">
          <div className="topbar">
            <div className="logo">ParentBoard</div>
          </div>

          {notifOpen && (
            <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
              <div className="panel-title">Notifications</div>
              {notifications.map((item, index) => (
                <div className="notif-item" key={index}>
                  {item.text}
                  <span>{item.time}</span>
                </div>
              ))}
            </div>
          )}

          {profileOpen && (
            <div className="profile-panel" onClick={(e) => e.stopPropagation()}>
              <div className="p-item p-name">{parentName}</div>
              <div
                className="p-item"
                onClick={() => {
                  setProfileOpen(false);
                  showToast("Settings panel — coming soon");
                }}
              >
                Settings
              </div>
              <div
                className="p-item"
                onClick={() => {
                  setProfileOpen(false);
                  showToast("Help center — coming soon");
                }}
              >
                Help & support
              </div>
              <div
                className="p-item p-danger"
                onClick={() => {
                  setProfileOpen(false);
                  showToast("Signed out successfully");
                }}
              >
                Sign out
              </div>
            </div>
          )}

          <div className="sec-label">Overview</div>

          <div className="metrics">
            <div className="mcard">
              <div className="mcard-label">Children enrolled</div>
              <div className="mcard-val">{children.length}</div>
              <div className="mcard-sub muted">Active accounts</div>
            </div>

            <div className="mcard">
              <div className="mcard-label">Attendance this week</div>
              <div className="mcard-val">
                {children[0]?.attendance ? `${children[0].attendance}%` : "0%"}
              </div>
              <div className="mcard-sub up">Linked from student data</div>
            </div>

            <div className="mcard">
              <div className="mcard-label">Pending assignments</div>
              <div className="mcard-val">5</div>
              <div className="mcard-sub down">3 due soon</div>
            </div>

            <div className="mcard">
              <div className="mcard-label">New messages</div>
              <div className="mcard-val">2</div>
              <div className="mcard-sub muted">From teachers</div>
            </div>
          </div>

          <div className="mid">
            <div className="raised">
              <div className="sec-label">Children</div>

              {loadingChildren ? (
                <div className="muted">Loading children...</div>
              ) : children.length === 0 ? (
                <div className="muted">No children found for this parent</div>
              ) : (
                children.map((child) => (
                  <div className="child-row" key={child.id} onClick={() => openChildModal(child)}>
                    <div className={`ava ${child.avatarClass}`}>{child.initials}</div>

                    <div className="child-info">
                      <div className="child-name">{child.name}</div>
                      <div className="child-grade">{child.grade}</div>
                    </div>

                    <span className={`badge ${badgeClass(child.status)}`}>{child.status}</span>
                  </div>
                ))
              )}
            </div>

            <div className="raised">
              <div className="sec-label">Subject performance</div>

              {subjectPerformance.map((item) => (
                <div className="bar-row" key={item.subject}>
                  <div className="bar-label">{item.subject}</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${item.value}%`, background: item.color }}
                    />
                  </div>
                  <div className="bar-pct">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bottom">
            <div className="inner2">
              <div className="raised">
                <div className="sec-label">Recent activity</div>

                {activities.map((item, index) => (
                  <div className="act-row" key={index}>
                    <div className="act-dot" style={{ background: item.color }} />
                    <div>
                      <div className="act-text">{item.text}</div>
                      <div className="act-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="raised">
                <div className="sec-label">Today&apos;s schedule</div>

                {schedule.map((item, index) => (
                  <div className="sch-row" key={index}>
                    <div className="sch-time">{item.time}</div>
                    <div className="sch-line" style={{ background: item.color }} />
                    <div className="sch-body">
                      <div className="sch-title">{item.title}</div>
                      <div className="sch-child">{item.child}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="raised">
              <div className="sec-label">Quick actions</div>

              <button className="qbtn" onClick={() => openActionModal("message")}>
                Message a teacher
              </button>

              <button className="qbtn" onClick={() => openActionModal("report")}>
                View performance report
              </button>

              <button className="qbtn" onClick={() => openActionModal("appointment")}>
                Book an appointment
              </button>

              

              <button className="qbtn" onClick={() => openActionModal("download")}>
                Download reports
              </button>
            </div>
          </div>
        </div>

        {overlayOpen && (
          <div className="overlay show" onClick={closeAll}>
            <div className="modal-wrap">{renderModalContent()}</div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>

      <Footer />
    </>
  );
}

export default ParentDashboard;