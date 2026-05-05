import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [summary, setSummary] = useState({
    unread: 0,
    attendanceAlerts: 0,
  });

  const formatTimeAgo = (date) => {
    if (!date || isNaN(date.getTime())) return "Just now";

    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  const toJsDate = (value) => {
    if (!value) return null;
    if (value?.toDate) return value.toDate();
    if (typeof value === "string") {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  };

  const buildAttendanceDate = (date, time) => {
    if (!date) return null;

    const safeTime = time || "00:00:00";
    const jsDate = new Date(`${date}T${safeTime}`);

    if (isNaN(jsDate.getTime())) {
      const fallbackDate = new Date(date);
      return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
    }

    return jsDate;
  };

  const getNotificationStyle = (type) => {
    if (type === "attendance") {
      return { color: "success", icon: "fact_check", label: "Attendance" };
    }

    if (type === "assignment") {
      return { color: "warning", icon: "assignment", label: "Assignment" };
    }

    if (type === "exam") {
      return { color: "info", icon: "quiz", label: "Exam" };
    }

    if (type === "message") {
      return { color: "dark", icon: "message", label: "Message" };
    }

    return { color: "info", icon: "notifications", label: "Notification" };
  };

  useEffect(() => {
    let unsubscribeNotifications = null;
    let unsubscribeAttendance = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setNotifications([]);
        setStudentId("");
        setSummary({ unread: 0, attendanceAlerts: 0 });
        return;
      }

      try {
        const studentDocRef = doc(db, "student", user.uid);
        const studentSnap = await getDoc(studentDocRef);
        const studentData = studentSnap.exists() ? studentSnap.data() : {};

        const realStudentId = String(
          studentData.student_id ||
            studentData.studentId ||
            studentData.id ||
            user.uid
        );

        console.log("REAL STUDENT ID:", realStudentId);

        setStudentId(realStudentId);

        let realNotifications = [];
        let attendanceNotifications = [];

        const updateScreen = () => {
          const merged = [...realNotifications, ...attendanceNotifications].sort((a, b) => {
            const aTime = a.createdDate ? a.createdDate.getTime() : 0;
            const bTime = b.createdDate ? b.createdDate.getTime() : 0;
            return bTime - aTime;
          });

          setNotifications(merged);

          setSummary({
            unread: realNotifications.filter((item) => item.read === false).length,
            attendanceAlerts: merged.filter((item) => item.type === "attendance").length,
          });
        };

        unsubscribeNotifications = onSnapshot(collection(db, "notifications"), (snapshot) => {
          realNotifications = snapshot.docs
            .map((notificationDoc) => {
              const item = notificationDoc.data();
              const style = getNotificationStyle(item.type);
              const createdDate = toJsDate(item.createdAt) || toJsDate(item.created_at);

              return {
                id: notificationDoc.id,
                source: "notifications",
                ...item,
                color: style.color,
                icon: style.icon,
                typeLabel: item.tag || style.label,
                title: item.title || "Notification",
                message: item.message || "",
                read: item.read === true || item.is_read === true,
                createdDate,
                time: formatTimeAgo(createdDate),
              };
            })
            .filter((item) => {
              const id1 = String(item.student_id || "");
              const id2 = String(item.studentId || "");
              const id3 = String(item.userId || "");
              return id1 === realStudentId || id2 === realStudentId || id3 === user.uid;
            });

          updateScreen();
        });

        unsubscribeAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
          attendanceNotifications = snapshot.docs
            .map((attendanceDoc) => {
              const item = attendanceDoc.data();
              const style = getNotificationStyle("attendance");

              const createdDate =
                toJsDate(item.createdAt) ||
                toJsDate(item.created_at) ||
                buildAttendanceDate(item.date, item.time);

              return {
                id: `attendance-${attendanceDoc.id}`,
                source: "attendance",
                color: style.color,
                icon: style.icon,
                typeLabel: "Attendance",
                title: "Attendance Recorded",
                message: `Your attendance was recorded on ${item.date || "unknown date"}${
                  item.time ? ` at ${item.time}` : ""
                }.`,
                type: "attendance",
                read: true,
                createdDate,
                time: formatTimeAgo(createdDate),
                student_id: item.student_id,
                studentId: item.studentId,
                userId: item.userId,
              };
            })
            .filter((item) => {
              const id1 = String(item.student_id || "");
              const id2 = String(item.studentId || "");
              const id3 = String(item.userId || "");
              return id1 === realStudentId || id2 === realStudentId || id3 === user.uid;
            });

          updateScreen();
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
        setSummary({ unread: 0, attendanceAlerts: 0 });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeNotifications) unsubscribeNotifications();
      if (unsubscribeAttendance) unsubscribeAttendance();
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (item) => item.source === "notifications" && item.read === false
      );

      await Promise.all(
        unreadNotifications.map((item) =>
          updateDoc(doc(db, "notifications", item.id), {
            read: true,
            is_read: true,
          })
        )
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleCheckAttendance = async () => {
    if (!studentId) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId,
          message: "Has my attendance been recorded ?",
        }),
      });

      const data = await res.json();
      alert(data.reply || "No response");
    } catch (error) {
      console.error(error);
      alert("Backend or AI server is not running.");
    }
  };

  const getChipStyles = (color) => {
    const styles = {
      warning: { bg: "#fff3cd", text: "#b26a00" },
      error: { bg: "#fde2e1", text: "#d32f2f" },
      info: { bg: "#dbeafe", text: "#1565c0" },
      dark: { bg: "#e5e7eb", text: "#374151" },
      success: { bg: "#dcfce7", text: "#2e7d32" },
    };

    return styles[color] || styles.info;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox mb={3}>
          <MDTypography variant="h4" fontWeight="bold" color="info">
            Student Notifications
          </MDTypography>
          <MDTypography variant="button" color="text">
            Stay updated with assignments, attendance, exams, and school announcements
          </MDTypography>
        </MDBox>

        <MDBox display="grid" gridTemplateColumns={{ xs: "1fr", lg: "2fr 1fr" }} gap={3}>
          <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
            <MDBox p={3}>
              <MDTypography variant="h5" fontWeight="bold" mb={3}>
                Recent Notifications
              </MDTypography>

              {notifications.length > 0 ? (
                notifications.map((item, index) => {
                  const chip = getChipStyles(item.color);

                  return (
                    <MDBox key={item.id}>
                      <MDBox
                        display="flex"
                        alignItems="flex-start"
                        gap={2}
                        sx={{
                          opacity: item.read ? 0.75 : 1,
                          backgroundColor: item.read ? "transparent" : "#f8fbff",
                          borderRadius: "12px",
                          p: item.read ? 0 : 1.5,
                        }}
                      >
                        <MDBox
                          width="42px"
                          height="42px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          borderRadius="xl"
                          bgColor={item.color}
                          coloredShadow={item.color}
                          flexShrink={0}
                        >
                          <Icon sx={{ color: "#fff !important", fontSize: "20px !important" }}>
                            {item.icon}
                          </Icon>
                        </MDBox>

                        <MDBox flex={1}>
                          <MDBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            gap={2}
                            mb={0.5}
                            flexWrap="wrap"
                          >
                            <MDBox display="flex" alignItems="center" gap={1}>
                              {!item.read && (
                                <MDBox
                                  width="8px"
                                  height="8px"
                                  borderRadius="50%"
                                  sx={{ backgroundColor: "#1e88e5" }}
                                />
                              )}

                              <MDTypography variant="h6" fontWeight="bold">
                                {item.title}
                              </MDTypography>
                            </MDBox>

                            <MDBox
                              px={1.5}
                              py={0.5}
                              borderRadius="lg"
                              sx={{
                                backgroundColor: chip.bg,
                                color: chip.text,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.typeLabel}
                            </MDBox>
                          </MDBox>

                          <MDTypography variant="button" color="text" display="block" mb={1}>
                            {item.message}
                          </MDTypography>

                          <MDTypography variant="caption" color="text">
                            {item.time}
                          </MDTypography>
                        </MDBox>
                      </MDBox>

                      {index !== notifications.length - 1 && <Divider sx={{ my: 2 }} />}
                    </MDBox>
                  );
                })
              ) : (
                <MDTypography variant="button" color="text">
                  No notifications found.
                </MDTypography>
              )}
            </MDBox>
          </Card>

          <MDBox display="flex" flexDirection="column" gap={3}>
            <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  Quick Summary
                </MDTypography>

                <MDBox mb={2}>
                  <MDTypography variant="button" color="text">
                    Unread Notifications
                  </MDTypography>
                  <MDTypography variant="h4" fontWeight="bold">
                    {summary.unread}
                  </MDTypography>
                </MDBox>

                <MDBox>
                  <MDTypography variant="button" color="text">
                    Attendance Alerts
                  </MDTypography>
                  <MDTypography variant="h4" fontWeight="bold">
                    {summary.attendanceAlerts}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Card>

            <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  Actions
                </MDTypography>

                <MDBox display="flex" flexDirection="column" gap={2}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={handleMarkAllAsRead}
                    disabled={summary.unread === 0}
                  >
                    Mark All as Read
                  </MDButton>

                  <MDButton variant="outlined" color="success" fullWidth onClick={handleCheckAttendance}>
                    Check Attendance
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </MDBox>
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;