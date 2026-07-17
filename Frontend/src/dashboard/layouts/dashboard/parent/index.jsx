import { useEffect, useMemo, useState } from "react";

import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import "./Parent.css";

import { auth, db } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

function ParentDashboard() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [children, setChildren] = useState([]);
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [parentName, setParentName] = useState("Parent");

  const [notifications, setNotifications] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [activities, setActivities] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [attendanceWeek, setAttendanceWeek] = useState(0);

  const getThisWeekDates = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date.toISOString().split("T")[0];
    });
  };

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
        setAttendanceDetails([]);
        setNotifications([]);
        setSubjectPerformance([]);
        setActivities([]);
        setAttendanceWeek(0);
        setPendingAssignments(0);
        setLoadingChildren(false);
        return;
      }

      try {
        setLoadingChildren(true);

        let parentData = null;

        const parentDoc = await getDoc(doc(db, "parents", user.uid));

        if (parentDoc.exists()) {
          parentData = parentDoc.data();
        } else {
          const parentQuery = query(
            collection(db, "parents"),
            where("email", "==", user.email)
          );

          const parentSnap = await getDocs(parentQuery);

          if (!parentSnap.empty) {
            parentData = parentSnap.docs[0].data();
          }
        }

        if (!parentData) {
          setChildren([]);
          setAttendanceDetails([]);
          setLoadingChildren(false);
          return;
        }

        setParentName(
          `${parentData.firstName || ""} ${parentData.lastName || ""}`.trim() ||
            parentData.name ||
            parentData.fullName ||
            "Parent"
        );

        const studentIds = Array.isArray(parentData.student_ids)
          ? parentData.student_ids
          : parentData.student_id
          ? [parentData.student_id]
          : [];

        if (studentIds.length === 0) {
          setChildren([]);
          setAttendanceDetails([]);
          setLoadingChildren(false);
          return;
        }

        const weekDates = getThisWeekDates();
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
              rawGrade: data.grade || "",
              status: "Excellent",
              avg: Number(data.avg || 0),
              attendance: 0,
              avatarClass: "ava-g",
              initials: `${firstName?.[0] || fullName?.[0] || "S"}${
                lastName?.[0] || ""
              }`.toUpperCase(),
            });
          });
        }

        let totalPresent = 0;
        const totalExpected = allStudents.length * weekDates.length;
        const allAttendanceDetails = [];

        const studentsWithAttendance = await Promise.all(
          allStudents.map(async (student) => {
            let presentDays = 0;
            const presentDates = [];

            const attendanceQuery = query(
              collection(db, "attendance"),
              where("studentId", "==", student.student_id)
            );

            const attendanceSnap = await getDocs(attendanceQuery);

            attendanceSnap.forEach((attDoc) => {
              const att = attDoc.data();

              if (weekDates.includes(att.date)) {
                presentDays += 1;
                presentDates.push(att.date);
              }
            });

            totalPresent += presentDays;

            const days = weekDates.map((date) => ({
              date,
              status: presentDates.includes(date) ? "Present" : "Absent",
            }));

            allAttendanceDetails.push({
              id: student.id,
              name: student.name,
              grade: student.grade,
              days,
            });

            return {
              ...student,
              attendance: weekDates.length
                ? Math.round((presentDays / weekDates.length) * 100)
                : 0,
            };
          })
        );

        setChildren(studentsWithAttendance);
        setAttendanceDetails(allAttendanceDetails);

        setAttendanceWeek(
          totalExpected ? Math.round((totalPresent / totalExpected) * 100) : 0
        );

        let notifSnap;

        try {
          const notifQuery = query(
            collection(db, "notifications"),
            orderBy("createdAt", "desc")
          );
          notifSnap = await getDocs(notifQuery);
        } catch (error) {
          notifSnap = await getDocs(collection(db, "notifications"));
        }

        const parentNotifications = notifSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((n) => {
            const target = n.target || n.to || n.targetRole || "";

            const isDirectParent =
              n.parentId === parentData.parentId ||
              n.parentEmail === user.email ||
              studentIds.includes(n.studentId) ||
              n.targetRole === "parent";

            const isBroadcastForParents =
              target === "All parents" ||
              target === "Everyone (parents + teachers)";

            const isGradeBroadcast = studentsWithAttendance.some((student) => {
              return target === `Grade ${student.rawGrade} parents only`;
            });

            return isDirectParent || isBroadcastForParents || isGradeBroadcast;
          })
          .slice(0, 10)
          .map((n) => ({
            id: n.id,
            text: n.title || n.subject || n.message || "New notification",
            message: n.message || n.body || "",
            time: n.date || n.createdAt?.toDate?.().toLocaleString?.() || "Recently",
          }));

        setNotifications(parentNotifications);

        const recentActivities = parentNotifications.map((item) => ({
          color: "#378ADD",
          text: item.text,
          time: item.time,
        }));

        setActivities(recentActivities);

        const assignmentsSnap = await getDocs(collection(db, "teacher_materials"));
        const assignmentsCount = assignmentsSnap.docs
          .map((d) => d.data())
          .filter((item) => {
            return (
              item.type === "assignment" &&
              studentsWithAttendance.some(
                (student) => String(student.rawGrade) === String(item.grade)
              )
            );
          }).length;

        setPendingAssignments(assignmentsCount);

       const examResultsSnap = await getDocs(collection(db, "exam_results"));

const results = examResultsSnap.docs
  .map((d) => d.data())
  .filter((result) =>
    // )
    studentsWithAttendance.some(
      (student) => student.id === result.studentId
    )
  );

if (results.length > 0) {
  const grouped = {};

  results.forEach((result) => {
    const subject =
      result.examTitle || result.subjectName || result.subject || "Unknown";

    const score = Number(result.percentage || result.score || 0);

    if (!grouped[subject]) {
      grouped[subject] = [];
    }

    grouped[subject].push(score);
  });

  const performance = Object.keys(grouped).map((subject) => {
    const values = grouped[subject];

    const avg =
      values.reduce((sum, value) => sum + value, 0) / values.length;

    return {
      subject,
      value: Math.round(avg),
      color:
        avg >= 85
          ? "#1D9E75"
          : avg >= 70
          ? "#378ADD"
          : "#EF9F27",
    };
  });

  setSubjectPerformance(performance);
} else {
  setSubjectPerformance([]);
}
      } catch (error) {
        console.error("Error loading parent dashboard:", error);
        setChildren([]);
        setAttendanceDetails([]);
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
    setAttendanceModalOpen(false);
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
          

          {notifOpen && (
            <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
              <div className="panel-title">Parent Notifications</div>

              {notifications.length === 0 ? (
                <div className="notif-item">No notifications yet</div>
              ) : (
                notifications.map((item) => (
                  <div className="notif-item" key={item.id}>
                    <strong>{item.text}</strong>
                    {item.message && <p>{item.message}</p>}
                    <span>{item.time}</span>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="sec-label">Overview</div>

          <div className="metrics">
            <div className="mcard">
              <div className="mcard-label">Children enrolled</div>
              <div className="mcard-val">{children.length}</div>
              <div className="mcard-sub muted">Active accounts</div>
            </div>

            <div
              className="mcard"
              onClick={() => setAttendanceModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <div className="mcard-label">Attendance this week</div>
              <div className="mcard-val">{attendanceWeek}%</div>
              <div className="mcard-sub up">
                Click to view attendance details
              </div>
            </div>

            <div className="mcard">
              <div className="mcard-label">Pending assignments</div>
              <div className="mcard-val">{pendingAssignments}</div>
              <div className="mcard-sub down">From teacher materials</div>
            </div>

            <div
  className="mcard"
  style={{ cursor: "pointer" }}
  onClick={(e) => {
    e.stopPropagation();
    setNotifOpen(true);
    setProfileOpen(false);
  }}
>
  <div className="mcard-label">New messages</div>
  <div className="mcard-val">{notifications.length}</div>
  <div className="mcard-sub muted">
    Click to view notifications
  </div>
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

              {subjectPerformance.length === 0 ? (
                <div className="muted">No exam results yet</div>
              ) : (
                subjectPerformance.map((item) => (
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
                ))
              )}
            </div>
          </div>

          <div className="bottom">
            <div className="inner2">
              <div className="raised">
                <div className="sec-label">Recent activity</div>

                {activities.length === 0 ? (
                  <div className="muted">No recent activity</div>
                ) : (
                  activities.map((item, index) => (
                    <div className="act-row" key={index}>
                      <div className="act-dot" style={{ background: item.color }} />
                      <div>
                        <div className="act-text">{item.text}</div>
                        <div className="act-time">{item.time}</div>
                      </div>
                    </div>
                  ))
                )}
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

            </div>
          </div>
        </div>

        {overlayOpen && (
          <div className="overlay show" onClick={closeAll}>
            <div className="modal-wrap">{renderModalContent()}</div>
          </div>
        )}

        {attendanceModalOpen && (
          <div className="overlay show" onClick={() => setAttendanceModalOpen(false)}>
            <div className="modal-wrap">
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-title">Attendance Details This Week</div>

                {attendanceDetails.length === 0 ? (
                  <div className="muted">No attendance records found</div>
                ) : (
                  attendanceDetails.map((child) => (
                    <div key={child.id} style={{ marginBottom: 18 }}>
                      <h4 style={{ marginBottom: 8 }}>
                        {child.name} — {child.grade}
                      </h4>

                      {child.days.map((day) => (
                        <div
                          key={day.date}
                          className="child-stat"
                          style={{ marginBottom: 6 }}
                        >
                          <div className="child-stat-label">{day.date}</div>
                          <div
                            className="child-stat-val"
                            style={{
                              color: day.status === "Present" ? "#1D9E75" : "#d32f2f",
                              fontSize: 16,
                            }}
                          >
                            {day.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}

                <div className="modal-footer">
                  <button
                    className="mbtn"
                    onClick={() => setAttendanceModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>

      <Footer />
    </>
  );
}

export default ParentDashboard;