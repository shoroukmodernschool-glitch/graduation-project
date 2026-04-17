import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "Assignment Reminder",
      title: "English homework is due tomorrow",
      message: "Submit your essay about school life before 10:00 PM.",
      time: "10 mins ago",
      color: "warning",
      icon: "assignment",
    },
    {
      id: 2,
      type: "Attendance Alert",
      title: "Your Math attendance dropped to 75%",
      message: "Please attend the upcoming classes regularly to improve your attendance rate.",
      time: "30 mins ago",
      color: "error",
      icon: "fact_check",
    },
    {
      id: 3,
      type: "Exam Update",
      title: "Science quiz scheduled for Monday",
      message: "The quiz will cover chapters 3 and 4. Be ready.",
      time: "1 hour ago",
      color: "info",
      icon: "quiz",
    },
    {
      id: 4,
      type: "Teacher Message",
      title: "New note from Arabic teacher",
      message: "Please review chapter 3 and prepare the summary for next class.",
      time: "2 hours ago",
      color: "dark",
      icon: "message",
    },
    {
      id: 5,
      type: "School Announcement",
      title: "Parent meeting this Thursday",
      message: "The school will hold a parent meeting at 12:00 PM in the main hall.",
      time: "Today",
      color: "success",
      icon: "campaign",
    },
  ];

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

              {notifications.map((item, index) => {
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
                            {item.type}
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
              })}
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
                    5
                  </MDTypography>
                </MDBox>

                <MDBox mb={2}>
                  <MDTypography variant="button" color="text">
                    Pending Assignments
                  </MDTypography>
                  <MDTypography variant="h4" fontWeight="bold">
                    2
                  </MDTypography>
                </MDBox>

                <MDBox>
                  <MDTypography variant="button" color="text">
                    Attendance Alerts
                  </MDTypography>
                  <MDTypography variant="h4" fontWeight="bold">
                    1
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

                  <MDButton variant="outlined" color="dark" fullWidth>
                    View Assignments
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