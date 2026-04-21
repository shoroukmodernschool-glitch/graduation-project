import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../../firebase";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState({
    unread: 0,
    pendingAssignments: 0,
    attendanceAlerts: 0,
  });

  const formatTimeAgo = (date) => {
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setNotifications([]);
        setSummary({
          unread: 0,
          pendingAssignments: 0,
          attendanceAlerts: 0,
        });
        return;
      }

      try {
        const notificationsRef = collection(db, "notifications");
        const q = query(notificationsRef, orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);

        console.log("Current UID:", user.uid);
        console.log("Notifications count:", snapshot.size);
        console.log(
          "Notifications data:",
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        const allData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const data = allData.filter((item) => item.userId === user.uid);

        const formattedNotifications = data.map((item) => ({
          ...item,
          color:
            item.type === "assignment"
              ? "warning"
              : item.type === "attendance"
              ? "error"
              : item.type === "exam"
              ? "info"
              : item.type === "message"
              ? "dark"
              : item.type === "announcement"
              ? "success"
              : "info",
          icon:
            item.type === "assignment"
              ? "assignment"
              : item.type === "attendance"
              ? "fact_check"
              : item.type === "exam"
              ? "quiz"
              : item.type === "message"
              ? "message"
              : item.type === "announcement"
              ? "campaign"
              : "notifications",
          time: item.createdAt?.toDate
            ? formatTimeAgo(item.createdAt.toDate())
            : "Just now",
          typeLabel: item.tag || item.type || "Notification",
        }));

        setNotifications(formattedNotifications);

        setSummary({
          unread: data.filter((item) => item.read === false).length,
          pendingAssignments: data.filter((item) => item.type === "assignment").length,
          attendanceAlerts: data.filter((item) => item.type === "attendance").length,
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
        setSummary({
          unread: 0,
          pendingAssignments: 0,
          attendanceAlerts: 0,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const getChipStyles = (color) => {
    const styles = {
      warning: {
        bg: "#fff3cd",
        text: "#b26a00",
      },
      error: {
        bg: "#fde2e1",
        text: "#d32f2f",
      },
      info: {
        bg: "#dbeafe",
        text: "#1565c0",
      },
      dark: {
        bg: "#e5e7eb",
        text: "#374151",
      },
      success: {
        bg: "#dcfce7",
        text: "#2e7d32",
      },
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

        <MDBox
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            lg: "2fr 1fr",
          }}
          gap={3}
        >
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
                      <MDBox display="flex" alignItems="flex-start" gap={2}>
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
                            <MDTypography variant="h6" fontWeight="bold">
                              {item.title}
                            </MDTypography>

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
                  <MDButton variant="gradient" color="info" fullWidth>
                    Mark All as Read
                  </MDButton>

                  
                  <MDButton variant="outlined" color="success" fullWidth>
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