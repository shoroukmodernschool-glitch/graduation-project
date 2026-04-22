import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import { useMemo, useState } from "react";

import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";

function Notifications() {
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");

  const [notifications] = useState([
    {
      id: 1,
      title: "New assignment submission",
      message: "Ahmed Mohamed submitted the Mathematics homework for Grade 5.",
      type: "Assignment",
      date: "Today, 10:30 AM",
      isNew: true,
    },
    {
      id: 2,
      title: "Exam reminder",
      message: "Grade 6 mathematics quiz is scheduled for tomorrow.",
      type: "Exam",
      date: "Today, 08:15 AM",
      isNew: true,
    },
    {
      id: 3,
      title: "Attendance update",
      message: "Mariam Tarek was marked late in Grade 6 today.",
      type: "Attendance",
      date: "Yesterday, 12:40 PM",
      isNew: false,
    },
    {
      id: 4,
      title: "PDF uploaded successfully",
      message: "Your lesson PDF for Grade 5 has been uploaded.",
      type: "Files",
      date: "Yesterday, 09:20 AM",
      isNew: false,
    },
    {
      id: 5,
      title: "New student added",
      message: "A new student has been added to your Grade 5 class.",
      type: "Students",
      date: "2 days ago",
      isNew: false,
    },
  ]);

  const notificationTypes = ["All", "Assignment", "Exam", "Attendance", "Files", "Students"];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchType = selectedType === "All" || item.type === selectedType;
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.message.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase());

      return matchType && matchSearch;
    });
  }, [notifications, selectedType, search]);

  const newCount = notifications.filter((item) => item.isNew).length;
  const totalCount = notifications.length;

  const getTypeIcon = (type) => {
    switch (type) {
      case "Assignment":
        return "assignment";
      case "Exam":
        return "quiz";
      case "Attendance":
        return "fact_check";
      case "Files":
        return "picture_as_pdf";
      case "Students":
        return "groups";
      default:
        return "notifications";
    }
  };

  const getTypeChip = (type) => {
    switch (type) {
      case "Assignment":
        return <Chip label="Assignment" color="primary" size="small" />;
      case "Exam":
        return <Chip label="Exam" color="warning" size="small" />;
      case "Attendance":
        return <Chip label="Attendance" color="success" size="small" />;
      case "Files":
        return <Chip label="Files" color="info" size="small" />;
      case "Students":
        return <Chip label="Students" color="secondary" size="small" />;
      default:
        return <Chip label={type} size="small" />;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Card
          sx={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            mb: 4,
          }}
        >
          <MDBox
            px={4}
            py={4}
            sx={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            }}
          >
            <MDTypography variant="h3" color="white" fontWeight="bold">
              Notifications
            </MDTypography>

            <MDTypography variant="button" color="white" opacity={0.8}>
              Review the latest updates related to your classes, students, and subject content.
            </MDTypography>
          </MDBox>
        </Card>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
            >
              <MDTypography variant="button" color="text">
                Total Notifications
              </MDTypography>
              <MDTypography variant="h3" fontWeight="bold">
                {totalCount}
              </MDTypography>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              }}
            >
              <MDTypography variant="button" color="text">
                New Notifications
              </MDTypography>
              <MDTypography variant="h3" fontWeight="bold">
                {newCount}
              </MDTypography>
            </Card>
          </Grid>
        </Grid>

        <Card
          sx={{
            p: 3,
            borderRadius: "18px",
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            mb: 4,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7}>
              <MDInput
                fullWidth
                label="Search by title, type, or message"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel>Notification Type</InputLabel>
                <Select
                  value={selectedType}
                  label="Notification Type"
                  onChange={(e) => setSelectedType(e.target.value)}
                  sx={{ minHeight: "45px" }}
                >
                  {notificationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <MDBox mt={2}>
            <MDTypography variant="button" color="text">
              Showing {filteredNotifications.length} notification(s)
            </MDTypography>
          </MDBox>
        </Card>

        <Card
          sx={{
            p: 3,
            borderRadius: "18px",
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
          }}
        >
          <MDBox mb={2}>
            <MDTypography variant="h5" fontWeight="bold">
              Latest Notifications
            </MDTypography>
            <MDTypography variant="button" color="text">
              Keep track of everything important in one place.
            </MDTypography>
          </MDBox>

          <Divider />

          <MDBox mt={2}>
            {filteredNotifications.length === 0 ? (
              <MDBox py={5} textAlign="center">
                <MDBox
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    backgroundColor: "#f3f4f6",
                    display: "grid",
                    placeItems: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Icon sx={{ color: "#111827", fontSize: "32px" }}>notifications</Icon>
                </MDBox>

                <MDTypography variant="h5" fontWeight="bold">
                  No notifications found
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Try changing the search text or selected notification type.
                </MDTypography>
              </MDBox>
            ) : (
              <Grid container spacing={2}>
                {filteredNotifications.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Card
                      sx={{
                        p: 2.5,
                        borderRadius: "16px",
                        boxShadow: "none",
                        border: item.isNew ? "1px solid #cbd5e1" : "1px solid #e5e7eb",
                        backgroundColor: item.isNew ? "#f8fafc" : "#ffffff",
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={1.2}>
                          <MDBox
                            sx={{
                              width: 52,
                              height: 52,
                              borderRadius: "14px",
                              display: "grid",
                              placeItems: "center",
                              backgroundColor: "#f3f4f6",
                            }}
                          >
                            <Icon sx={{ color: "#111827" }}>{getTypeIcon(item.type)}</Icon>
                          </MDBox>
                        </Grid>

                        <Grid item xs={12} md={7}>
                          <MDBox display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
                            <MDTypography variant="h6" fontWeight="bold">
                              {item.title}
                            </MDTypography>
                            {item.isNew && <Chip label="New" color="error" size="small" />}
                          </MDBox>

                          <MDTypography variant="button" color="text">
                            {item.message}
                          </MDTypography>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <MDBox display="flex" justifyContent={{ xs: "flex-start", md: "center" }}>
                            {getTypeChip(item.type)}
                          </MDBox>
                        </Grid>

                        <Grid item xs={12} md={1.8}>
                          <MDBox textAlign={{ xs: "left", md: "right" }}>
                            <MDTypography variant="caption" color="text">
                              {item.date}
                            </MDTypography>
                          </MDBox>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </MDBox>

          {filteredNotifications.length > 0 && (
            <MDBox mt={3} display="flex" justifyContent="flex-end">
              <MDButton variant="outlined" color="dark" size="small">
                Mark all as read
              </MDButton>
            </MDBox>
          )}
        </Card>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;